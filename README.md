# شهرداری غلامان - سامانه خدمات الکترونیکی

پورتال شهرداری غلامان با استفاده از Next.js App Router، TypeScript، Tailwind CSS و Supabase ساخته شده است.

## ویژگی‌ها

- ✅ رابط کاربری RTL با پشتیبانی کامل از زبان فارسی
- ✅ طراحی واکنش‌گرا و مناسب برای موبایل
- ✅ سیستم ثبت و پیگیری درخواست‌ها (Supabase)
- ✅ مدیریت اخبار و رویدادها (Supabase)
- ✅ داشبورد پرسنل برای مدیریت درخواست‌ها
- ✅ پنل مدیریت اخبار (فقط برای ادمین‌ها)
- ✅ احراز هویت با Supabase Auth
- ✅ محافظت از روت‌ها با middleware

## تکنولوژی‌ها

- **Next.js 14** (App Router)
- **TypeScript** (Strict Mode)
- **Supabase** (Auth, Database, RLS)
- **Tailwind CSS**
- **shadcn/ui** (کامپوننت‌های UI)
- **Zod** (Validation)
- **Lucide React** (آیکون‌ها)

## نصب و راه‌اندازی

### ۱. نصب وابستگی‌ها

```bash
npm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env.local` در ریشه پروژه ایجاد کنید:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key

NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Admin emails (comma-separated)
NEXT_PUBLIC_ADMIN_EMAILS=admin@gholaman.ir,manager@gholaman.ir
```

### ۳. اجرای Migration های Supabase

فایل‌های SQL در پوشه `supabase/migrations/` را به ترتیب در Supabase SQL Editor اجرا کنید:

1. `001_rls_policies.sql` - سیاست‌های Row Level Security
2. `002_indexes.sql` - ایندکس‌های دیتابیس
3. `003_request_stats_rpc.sql` - تابع RPC برای آمار

### ۴. اجرای پروژه

```bash
npm run dev
```

سپس مرورگر را در آدرس `http://localhost:3000` باز کنید.

## ساختار پروژه

```
├── app/                    # صفحات و روت‌های Next.js
│   ├── page.tsx           # صفحه اصلی
│   ├── services/          # فرم‌های ثبت درخواست
│   ├── track/             # پیگیری درخواست‌ها
│   ├── news/              # نمایش اخبار
│   ├── employees/         # ورود و داشبورد پرسنل
│   └── admin/             # پنل مدیریت (ادمین)
├── components/            # کامپوننت‌های React
│   ├── ui/               # کامپوننت‌های shadcn/ui
│   ├── Header.tsx        # هدر سایت
│   └── Footer.tsx        # فوتر سایت
├── lib/                   # سرویس‌ها و توابع کمکی
│   ├── supabase-server.ts    # کلاینت Supabase (سرور)
│   ├── supabaseBrowserClient.ts  # کلاینت Supabase (مرورگر)
│   ├── auth-roles.ts     # توابع بررسی نقش
│   ├── auth-helpers.ts   # توابع احراز هویت (مرورگر)
│   ├── server-auth.ts    # توابع احراز هویت (سرور)
│   ├── news-service.ts   # سرویس اخبار
│   ├── request-service.ts    # سرویس درخواست‌ها
│   ├── validations.ts    # Zod schemas
│   └── types.ts          # تایپ‌های مشترک
├── supabase/             # Migration های Supabase
│   └── migrations/
├── middleware.ts         # محافظت از روت‌ها
└── package.json
```

## صفحات اصلی

| مسیر | توضیح | دسترسی |
|------|-------|--------|
| `/` | صفحه اصلی | عمومی |
| `/services` | لیست خدمات | عمومی |
| `/services/137` | ثبت شکایت ۱۳۷ | عمومی |
| `/services/building-permit` | درخواست پروانه | عمومی |
| `/services/payments` | پرداخت عوارض | عمومی |
| `/track` | پیگیری درخواست | عمومی |
| `/news` | لیست اخبار | عمومی |
| `/employees/login` | ورود پرسنل | عمومی |
| `/employees/dashboard` | داشبورد پرسنل | کارمند/ادمین |
| `/admin/news` | مدیریت اخبار | فقط ادمین |

## نقش‌های کاربری

- **شهروند**: ثبت درخواست، پیگیری، مشاهده اخبار
- **کارمند**: دسترسی به داشبورد درخواست‌ها
- **ادمین**: مدیریت اخبار + تمام دسترسی‌های کارمند

تعیین نقش ادمین از طریق متغیر `NEXT_PUBLIC_ADMIN_EMAILS` انجام می‌شود.

## امنیت

- ✅ محافظت از روت‌ها با Next.js Middleware
- ✅ احراز هویت سمت سرور با Supabase SSR
- ✅ Row Level Security در Supabase
- ✅ Sanitize کردن HTML با DOMPurify
- ✅ Validation با Zod

## لایسنس

این پروژه برای استفاده در شهرداری غلامان ساخته شده است.
