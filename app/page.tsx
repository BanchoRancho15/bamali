import { Suspense } from 'react'
import { HeroSection } from '@/components/home/HeroSection'
import { SearchBar } from '@/components/home/SearchBar'
import { HowItWorks } from '@/components/home/HowItWorks'
import { FeaturedVenues } from '@/components/home/FeaturedVenues'
import { EquipmentPreview } from '@/components/home/EquipmentPreview'
import { Stats } from '@/components/home/Stats'
import { CTASection } from '@/components/home/CTASection'
import { createServerSupabaseClient } from '@/lib/supabase'

export default async function HomePage() {
  const supabase = await createServerSupabaseClient()

  // Fetch featured venues
  const { data: venues } = await supabase
    .from('venues')
    .select('*, owner:profiles(full_name, avatar_url, is_verified)')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('rating', { ascending: false })
    .limit(6)

  return (
    <>
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar />
      </div>
      <Stats />
      <HowItWorks />
      <FeaturedVenues venues={venues ?? []} />
      <EquipmentPreview />
      <CTASection />
    </>
  )
}
