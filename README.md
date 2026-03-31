# 🎪 במה לי | BamaLi

> הפלטפורמה המובילה בישראל לתיווך בין מרצים ויזמים לבעלי מקומות

---

## 🛠️ Stack טכנולוגי (הכל חינמי!)

| שכבה | כלי | עלות |
|------|-----|------|
| Frontend | Next.js 14 + Tailwind CSS | ✅ חינם |
| Hosting | Vercel | ✅ חינם |
| Database + Auth | Supabase | ✅ חינם (500MB) |
| Email | Resend | ✅ חינם (3K/חודש) |
| Payments | Stripe | ✅ 0 + 2.9% לעסקה |
| Images | Supabase Storage | ✅ חינם (1GB) |

---

## 🚀 הוראות הפעלה מ-0 עד Online

### שלב 1: Clone והתקנה מקומית

```bash
git clone https://github.com/YOUR_USERNAME/bamali.git
cd bamali
npm install
cp .env.example .env.local
```

### שלב 2: הגדרת Supabase (חינם)

1. לך ל-[supabase.com](https://supabase.com) → צור פרויקט חדש
2. ב-SQL Editor הרץ את `supabase/schema.sql`
3. ב-Project Settings → API, העתק:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. הכנס לקובץ `.env.local`

### שלב 3: הגדרת Stripe (חינם)

1. לך ל-[stripe.com](https://stripe.com) → צור חשבון
2. ב-Developers → API Keys, העתק:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
3. להגדרת Webhook:
   ```bash
   stripe login
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   העתק את `STRIPE_WEBHOOK_SECRET`

### שלב 4: הגדרת Resend (אימייל חינם)

1. לך ל-[resend.com](https://resend.com) → צור חשבון
2. הוסף domain (או השתמש בדומיין הברירת מחדל לבדיקות)
3. צור API Key → הכנס `RESEND_API_KEY`

### שלב 5: הרצה מקומית

```bash
npm run dev
```
פתח [http://localhost:3000](http://localhost:3000) 🎉

---

## 🌐 Deploy ל-Vercel (חינם)

### אפשרות A: דרך GitHub (מומלץ)

1. Push ל-GitHub:
   ```bash
   git init
   git add .
   git commit -m "🎪 Initial BamaLi commit"
   git remote add origin https://github.com/YOUR_USERNAME/bamali.git
   git push -u origin main
   ```

2. לך ל-[vercel.com](https://vercel.com) → Import Project
3. בחר את ה-repo מ-GitHub
4. הוסף Environment Variables (מה שיש ב-.env.local)
5. לחץ Deploy! ✅

### אפשרות B: דרך CLI

```bash
npm install -g vercel
vercel --prod
```

---

## 📁 מבנה הפרויקט

```
bamali/
├── app/                    # Next.js App Router
│   ├── page.tsx           # דף הבית
│   ├── venues/            # רשימת מקומות + חיפוש
│   ├── equipment/         # ציוד ושירותים
│   ├── dashboard/         # דשבורד משתמש
│   ├── auth/              # כניסה + הרשמה
│   └── api/               # Backend API routes
│       ├── venues/        # CRUD מקומות
│       ├── bookings/      # הזמנות + Stripe
│       └── webhooks/      # Stripe webhooks
├── components/
│   ├── layout/            # Navbar, Footer
│   ├── home/              # קומפוננטים לדף הבית
│   ├── venue/             # כרטיס מקום, פילטרים
│   ├── booking/           # מודל הזמנה
│   └── ui/                # Toast, Skeleton וכו'
├── lib/
│   ├── supabase.ts        # Supabase client
│   └── utils.ts           # Helper functions
├── types/
│   └── index.ts           # TypeScript types
└── supabase/
    └── schema.sql         # Database schema + RLS
```

---

## 💡 פיצ'רים שיש

- ✅ חיפוש מקומות עם פילטרים מתקדמים
- ✅ מערכת הזמנות מלאה עם Stripe
- ✅ Auth עם Supabase (email + Google)
- ✅ RTL Hebrew בכל מקום
- ✅ Dashboard למשתמשים
- ✅ Webhook לאישור תשלום
- ✅ Row Level Security בכל הטבלאות
- ✅ Responsive + PWA-ready
- ✅ SEO-optimized (Next.js metadata)

## 🔜 פיצ'רים לשלב 2

- [ ] מנוע AI להתאמה חכמה (Claude API)
- [ ] ניהול מקומות לבעלי מקומות
- [ ] לוח שנה + זמינות
- [ ] מרקטפלייס ציוד עם ספקים
- [ ] Chat בין מארגן לבעל מקום
- [ ] הודעות אימייל (Resend)
- [ ] Admin dashboard
- [ ] Mobile app (React Native)

---

## 📊 עלויות חודשיות (Scale)

| טרה | משתמשים | עלות חודשית |
|-----|---------|-------------|
| Bootstrap | 0-100 | **₪0** |
| Startup | 100-1,000 | **₪0-50** |
| Growth | 1,000-10,000 | **₪200-500** |

---

## 🤝 צוות ויצירת קשר

**BamaLi** — info@bamali.co.il | www.bamali.co.il

---

*נבנה עם ❤️ בישראל*
