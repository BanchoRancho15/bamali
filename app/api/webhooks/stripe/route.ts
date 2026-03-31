import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-04-10' })

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.CheckoutSession
      const bookingId = session.metadata?.booking_id

      if (bookingId) {
        await supabase
          .from('bookings')
          .update({
            status: 'confirmed',
            payment_status: 'paid',
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq('id', bookingId)

        // Update equipment items to confirmed
        await supabase
          .from('booking_equipment')
          .update({ status: 'confirmed' })
          .eq('booking_id', bookingId)

        // Block date in availability
        const { data: booking } = await supabase
          .from('bookings')
          .select('venue_id, event_date')
          .eq('id', bookingId)
          .single()

        if (booking) {
          await supabase.from('venue_availability').upsert({
            venue_id: booking.venue_id,
            date: booking.event_date,
            is_available: false,
          })
        }

        // TODO: Send confirmation email via Resend
        console.log(`✅ Booking ${bookingId} confirmed`)
      }
      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.CheckoutSession
      const bookingId = session.metadata?.booking_id
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ status: 'cancelled' })
          .eq('id', bookingId)
          .eq('status', 'pending')
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }
