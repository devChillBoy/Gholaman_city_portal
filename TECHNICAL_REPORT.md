# گزارش فنی پروژه پورتال شهرداری غلامان
**تاریخ:** آذر ۱۴۰۴  
**نسخه:** 1.0  
**تهیه‌کننده:** تیم توسعه

---

## خلاصه اجرایی (Executive Summary)

سامانه خدمات الکترونیکی شهرداری غلامان یک پورتال وب‌محور است که با هدف ارائه خدمات الکترونیکی به شهروندان، ثبت و پیگیری درخواست‌ها، و مدیریت اخبار شهرداری توسعه یافته است.

### وضعیت کلی سامانه

| حوزه | وضعیت |
|------|--------|
| **ثبت درخواست‌های شهروندی** | ✅ کاملاً عملیاتی |
| **پیگیری با کد رهگیری** | ✅ کاملاً عملیاتی |
| **مدیریت اخبار** | ✅ کاملاً عملیاتی |
| **احراز هویت کارمندان** | ✅ کاملاً عملیاتی |
| **امنیت و دسترسی‌ها** | ✅ پیاده‌سازی شده |
| **Row Level Security** | ✅ فعال و پیکربندی شده |
| **تست‌ها** | ✅ ۸۵ تست موفق |

### آمادگی برای استقرار Production

سامانه از نظر فنی آماده استقرار است. موارد زیر قبل از استقرار نهایی باید بررسی شوند:
- ✅ RLS پیکربندی شده
- ✅ محافظت از روت‌ها با middleware
- ✅ Validation ورودی‌ها با Zod
- ✅ Sanitization محتوای HTML
- ⚠️ نیاز به ایجاد حساب‌های کاربری در Supabase Auth
- ⚠️ نیاز به اجرای migration ها در دیتابیس production

---

## ۱. معرفی کلی پروژه

### هدف سامانه

پورتال شهرداری غلامان یک سامانه خدمات الکترونیکی است که امکانات زیر را فراهم می‌کند:
- **ثبت شکایت ۱۳۷**: ثبت مشکلات شهری توسط شهروندان
- **درخواست پروانه ساختمانی**: ثبت درخواست برای پروانه‌های ساختمانی
- **پرداخت عوارض**: ثبت درخواست پرداخت انواع عوارض شهری
- **پیگیری درخواست**: پیگیری وضعیت درخواست با کد رهگیری
- **اخبار و اطلاعیه‌ها**: نمایش اخبار شهرداری به شهروندان
- **داشبورد کارکنان**: مشاهده و مدیریت درخواست‌های ثبت شده
- **مدیریت اخبار**: ایجاد، ویرایش و حذف اخبار توسط مدیران

### نقش‌های کاربری

| نقش | توضیحات | دسترسی‌ها |
|-----|---------|-----------|
| **شهروند** | کاربر عمومی | ثبت درخواست، پیگیری، مشاهده اخبار |
| **کارمند** | پرسنل شهرداری | داشبورد درخواست‌ها، مشاهده آمار |
| **ادمین** | مدیر سیستم | تمام دسترسی‌های کارمند + مدیریت اخبار |

### تکنولوژی‌ها و دلایل انتخاب

| تکنولوژی | نسخه | دلیل انتخاب |
|----------|------|-------------|
| **Next.js** | 14.2+ | App Router، Server Components، Server Actions، عملکرد بالا |
| **TypeScript** | 5.4+ | Type Safety، کاهش باگ در زمان توسعه |
| **Supabase** | 2.86+ | Auth + Database + RLS در یک سرویس |
| **Tailwind CSS** | 3.4+ | طراحی سریع و responsive |
| **shadcn/ui** | - | کامپوننت‌های دسترسی‌پذیر و قابل سفارشی‌سازی |
| **Zod** | 4.1+ | Validation قدرتمند با Type inference |
| **Vitest** | 4.0+ | تست‌نویسی سریع و سازگار با Vite |

---

## ۲. معماری و ساختار کد

### معماری Next.js App Router

پروژه از معماری App Router در Next.js 14 استفاده می‌کند که امکانات زیر را فراهم کرده است:

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (Client)                         │
├─────────────────────────────────────────────────────────────┤
│  Client Components     │  Server Actions      │  API        │
│  (auth-helpers.ts)     │  (actions.ts)        │  (Supabase) │
├─────────────────────────────────────────────────────────────┤
│  Server Components (page.tsx, layout.tsx)                   │
├─────────────────────────────────────────────────────────────┤
│  Middleware (middleware.ts) - Route Protection              │
├─────────────────────────────────────────────────────────────┤
│  Services Layer (lib/*.ts)                                  │
├─────────────────────────────────────────────────────────────┤
│                    Supabase (Postgres + Auth)               │
└─────────────────────────────────────────────────────────────┘
```

**Server Components:** برای صفحاتی که نیاز به داده از دیتابیس دارند (بدون ارسال JS به کلاینت)

**Client Components:** برای تعاملات کاربر (فرم‌ها، state management)

**Server Actions:** برای mutation داده‌ها (ایجاد، ویرایش، حذف)

### ساختار پوشه‌ها

```
├── app/                      # صفحات و روت‌های Next.js
│   ├── admin/               # پنل مدیریت (محافظت شده)
│   │   └── news/           # مدیریت اخبار
│   ├── employees/           # بخش کارکنان (محافظت شده)
│   │   ├── dashboard/      # داشبورد + مدیریت اخبار
│   │   └── login/          # صفحه ورود
│   ├── news/               # نمایش اخبار عمومی
│   ├── services/           # فرم‌های ثبت درخواست
│   │   ├── 137/           # شکایت ۱۳۷
│   │   ├── building-permit/
│   │   └── payments/
│   ├── track/              # پیگیری درخواست
│   ├── layout.tsx          # Layout اصلی
│   └── page.tsx            # صفحه اصلی
│
├── components/              # کامپوننت‌های React
│   ├── ui/                 # کامپوننت‌های shadcn/ui
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ...
│
├── lib/                     # سرویس‌ها و توابع کمکی
│   ├── supabase-server.ts  # کلاینت Supabase (سرور)
│   ├── supabaseBrowserClient.ts # کلاینت Supabase (مرورگر)
│   ├── supabase-middleware.ts   # کلاینت برای middleware
│   ├── auth-roles.ts       # توابع تشخیص نقش
│   ├── auth-helpers.ts     # توابع auth مرورگر
│   ├── server-auth.ts      # توابع auth سرور
│   ├── news-service.ts     # سرویس اخبار (عمومی)
│   ├── admin-news-service.ts # سرویس اخبار (مدیریت)
│   ├── request-service.ts  # سرویس درخواست‌ها
│   ├── validations.ts      # Zod Schemas
│   ├── types.ts            # تایپ‌های مشترک
│   ├── utils.ts            # توابع utility
│   ├── logger.ts           # لاگر ساختاریافته
│   └── constants.ts        # ثابت‌ها و enum‌ها
│
├── supabase/
│   └── migrations/         # فایل‌های migration
│       ├── 001_rls_policies.sql
│       ├── 002_indexes.sql
│       ├── 003_request_stats_rpc.sql
│       └── 004_rls_diagnostic.sql
│
├── __tests__/              # تست‌های Vitest
│   └── lib/
│
└── middleware.ts           # محافظت از روت‌ها
```

### لایه‌بندی منطق

| لایه | مسئولیت | فایل‌ها |
|------|---------|---------|
| **UI Layer** | نمایش و تعامل کاربر | `app/**/*.tsx`, `components/**/*.tsx` |
| **Action Layer** | دریافت درخواست و اعتبارسنجی | `app/**/actions.ts`, `news-actions.ts` |
| **Service Layer** | منطق کسب‌وکار | `lib/*-service.ts` |
| **Auth Layer** | احراز هویت و مجوز | `lib/auth-*.ts`, `lib/server-auth.ts` |
| **Data Layer** | ارتباط با دیتابیس | `lib/supabase-*.ts` |
| **Validation** | اعتبارسنجی داده‌ها | `lib/validations.ts` |

---

## ۳. احراز هویت، مجوزها و امنیت

### جریان احراز هویت با Supabase

```
┌──────────────────────────────────────────────────────────────┐
│                    Authentication Flow                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User Login (/employees/login)                            │
│     └─> signInEmployee() → Supabase Auth                     │
│         └─> Session stored in HTTP-only cookies              │
│                                                              │
│  2. Protected Route Access                                   │
│     └─> middleware.ts intercepts request                     │
│         └─> isAuthenticated() checks cookies                 │
│             └─> Allow / Redirect to login                    │
│                                                              │
│  3. Server Component Data Fetch                              │
│     └─> createServerSupabaseClient() reads cookies           │
│         └─> Authenticated Supabase client                    │
│                                                              │
│  4. Admin Operations (Server Actions)                        │
│     └─> requireAdmin() validates session                     │
│         └─> Returns AuthenticatedContext                     │
│             └─> Same client for auth + data operations       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### فایل `middleware.ts`

این فایل مسئول محافظت از روت‌های حساس است:

```typescript
// Routes protected by middleware:
// - /employees/dashboard/* → requires authentication
// - /admin/* → requires admin role
```

**عملکرد:**
1. بررسی مسیر درخواست شده
2. اگر روت محافظت شده است:
   - بررسی وجود session معتبر
   - برای `/admin/*`: بررسی نقش admin
3. در صورت عدم دسترسی: redirect به `/employees/login`

### توابع `requireAdmin()` و `requireEmployee()`

این توابع در `lib/server-auth.ts` برای محافظت از Server Actions استفاده می‌شوند:

```typescript
interface AuthenticatedContext {
  user: User;
  supabase: SupabaseClient;
}

// نکته مهم: همان Supabase client که کاربر را احراز هویت کرده،
// برای عملیات‌های دیتابیس هم استفاده می‌شود
// این باعث می‌شود RLS policies به درستی اعمال شوند
```

### Row Level Security (RLS)

#### جدول `news`

| عملیات | دسترسی `anon` | دسترسی `authenticated` |
|--------|---------------|------------------------|
| **SELECT** | فقط `status='published'` | همه |
| **INSERT** | ❌ | ✅ |
| **UPDATE** | ❌ | ✅ |
| **DELETE** | ❌ | ✅ |

#### جدول `requests`

| عملیات | دسترسی `anon` | دسترسی `authenticated` |
|--------|---------------|------------------------|
| **SELECT** | ✅ (برای پیگیری با کد) | ✅ |
| **INSERT** | ✅ (ثبت توسط شهروندان) | ✅ |
| **UPDATE** | ❌ | ✅ |
| **DELETE** | ❌ | ✅ |

### جلوگیری از XSS

محتوای HTML در اخبار با استفاده از `isomorphic-dompurify` پاکسازی می‌شود:

```typescript
// lib/utils.ts
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return "";
  
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "h1", "h2", ...],
    ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
    ALLOW_DATA_ATTR: false,
  });
}
```

**تگ‌های مجاز:** `p`, `br`, `strong`, `b`, `em`, `i`, `u`, `h1-h6`, `ul`, `ol`, `li`, `a`, `img`, `blockquote`, `pre`, `code`, `table`, `div`, `span`

**حذف شده:**
- تگ‌های `<script>` و `<style>`
- رویدادهای JavaScript مثل `onclick`
- URLهای `javascript:`
- صفات `data-*`

### اعتبارسنجی فرم‌ها با Zod

هر فرم دارای یک Zod Schema در `lib/validations.ts` است:

| Schema | فیلدهای اصلی | اعتبارسنجی‌ها |
|--------|-------------|---------------|
| `complaint137Schema` | title, description, category, phone | حداقل کاراکتر، فرمت تلفن ایران |
| `buildingPermitSchema` | ownerName, address, permitType, phone | حداقل کاراکتر، تلفن الزامی |
| `paymentSchema` | fileNumber, paymentType, amount | محدودیت مبلغ |
| `newsSchema` | title, slug, status | فرمت slug، وضعیت معتبر |

**نمایش خطا به کاربر:**
```typescript
const result = validateData(complaint137Schema, data);
if (!result.success) {
  // result.errors = { fieldName: "پیام خطا به فارسی" }
}
```

### مقایسه قبل/بعد امنیت

| مورد | قبل | بعد |
|------|-----|-----|
| محافظت روت `/admin/*` | ❌ باز | ✅ middleware + admin role |
| محافظت روت `/employees/dashboard` | ⚠️ فقط client-side | ✅ middleware + server-side |
| RLS در Supabase | ❌ غیرفعال | ✅ فعال با policies |
| Sanitization محتوا | ❌ وجود نداشت | ✅ DOMPurify |
| Validation سرور | ⚠️ ناقص | ✅ Zod + type-safe |

---

## ۴. مدل داده و دیتابیس

### جدول `news`

| ستون | نوع | توضیحات |
|------|-----|---------|
| `id` | `serial` | کلید اصلی |
| `slug` | `text` | شناسه URL خبر (unique) |
| `title` | `text` | عنوان خبر |
| `excerpt` | `text` | خلاصه خبر |
| `content` | `text` | محتوای کامل (HTML) |
| `image_url` | `text` | آدرس تصویر شاخص |
| `status` | `text` | `'draft'` یا `'published'` |
| `created_at` | `timestamp` | زمان ایجاد |
| `published_at` | `timestamp` | زمان انتشار |

### جدول `requests`

| ستون | نوع | توضیحات |
|------|-----|---------|
| `id` | `uuid` | کلید اصلی |
| `code` | `text` | کد رهگیری (unique) |
| `service_type` | `text` | نوع خدمت (`complaint_137`, `building_permit`, `payment`) |
| `title` | `text` | عنوان درخواست |
| `description` | `text` | توضیحات |
| `status` | `text` | وضعیت (`pending`, `in-review`, `completed`, `rejected`) |
| `payload` | `jsonb` | اطلاعات اضافی |
| `citizen_name` | `text` | نام شهروند |
| `citizen_phone` | `text` | تلفن شهروند |
| `created_at` | `timestamp` | زمان ثبت |
| `updated_at` | `timestamp` | زمان آخرین بروزرسانی |

### Migration Files

#### `001_rls_policies.sql`
- فعال‌سازی RLS برای جداول `news` و `requests`
- تعریف policies برای SELECT/INSERT/UPDATE/DELETE

#### `002_indexes.sql`
- **News:**
  - `idx_news_slug` → جستجوی سریع بر اساس slug
  - `idx_news_published` → لیست اخبار منتشر شده
  - `idx_news_created_at` → ترتیب بر اساس تاریخ
  
- **Requests:**
  - `idx_requests_code` (UNIQUE) → جستجوی کد رهگیری
  - `idx_requests_status` → فیلتر بر اساس وضعیت
  - `idx_requests_status_created` → داشبورد با فیلتر
  - `idx_requests_service_type` → فیلتر نوع خدمت
  - `idx_requests_created_at` → مرتب‌سازی

#### `003_request_stats_rpc.sql`
تابع `get_request_stats()` برای دریافت آمار در یک کوئری:
```sql
-- خروجی: { all: 100, pending: 30, "in-review": 25, completed: 40, rejected: 5 }
SELECT * FROM get_request_stats();
```

#### `004_rls_diagnostic.sql`
تابع `check_auth_status()` برای debug کردن وضعیت auth در RLS:
```sql
SELECT * FROM check_auth_status();
-- خروجی: current_user_id, current_role, current_claims
```

---

## ۵. ویژگی‌ها و جریان‌های اصلی

### ۵.۱. ثبت شکایت ۱۳۷

**مسیرها:**
- `/services/137` - فرم ثبت شکایت

**فایل‌های مهم:**
- `app/services/137/page.tsx` - Client Component فرم
- `app/services/actions.ts` - Server Action `submitComplaint137()`
- `lib/request-service.ts` - `createRequest()`
- `lib/validations.ts` - `complaint137Schema`

**جریان داده:**
```
User fills form
    ↓
Client-side validation (HTML5 + React state)
    ↓
submitComplaint137() Server Action
    ↓
Zod validation (complaint137Schema)
    ↓
createRequest() → Supabase INSERT
    ↓
Generate tracking code (REQ-137-XXXXX-XXXX)
    ↓
Return success + code
    ↓
UI shows success message + tracking code
```

### ۵.۲. پیگیری درخواست

**مسیرها:**
- `/track` - صفحه جستجو
- `/track/[code]` - جزئیات درخواست

**فایل‌های مهم:**
- `app/track/page.tsx` - فرم جستجوی کد
- `app/track/[code]/page.tsx` - Server Component جزئیات
- `lib/request-service.ts` - `getRequestByCode()`

**جریان داده:**
```
User enters tracking code
    ↓
Navigate to /track/[code]
    ↓
Server Component renders
    ↓
getRequestByCode() → Supabase SELECT
    ↓
Display request details + status timeline
```

### ۵.۳. مدیریت اخبار در داشبورد

**مسیرها:**
- `/employees/dashboard` - داشبورد با تب اخبار (فقط برای admin)
- `/admin/news` - پنل مدیریت اخبار
- `/admin/news/[id]` - فرم ویرایش/ایجاد

**فایل‌های مهم:**
- `app/employees/dashboard/page.tsx` - Server Component اصلی
- `app/employees/dashboard/news-management.tsx` - کامپوننت مدیریت
- `app/employees/dashboard/news-actions.ts` - Server Actions
- `lib/admin-news-service.ts` - CRUD operations

**جریان ایجاد خبر:**
```
Admin fills news form
    ↓
Zod validation (newsSchema)
    ↓
createNewsAction() Server Action
    ↓
requireAdmin() → Check session + role
    ↓
createNews() → Supabase INSERT
    ↓
revalidatePath() → Refresh cache
    ↓
UI shows success + refresh table
```

### ۵.۴. نمایش اخبار عمومی

**مسیرها:**
- `/news` - لیست اخبار منتشر شده
- `/news/[slug]` - جزئیات خبر

**فایل‌های مهم:**
- `app/news/page.tsx` - Server Component لیست
- `app/news/[slug]/page.tsx` - Server Component جزئیات
- `lib/news-service.ts` - `getNewsList()`, `getNewsBySlug()`
- `lib/utils.ts` - `sanitizeHtml()`, `formatNewsDate()`

**جریان داده:**
```
User visits /news
    ↓
Server Component renders
    ↓
getNewsList() → Supabase SELECT WHERE status='published'
    ↓
Format dates to Persian calendar
    ↓
Render news cards

User clicks on news
    ↓
Navigate to /news/[slug]
    ↓
getNewsBySlug() → Supabase SELECT
    ↓
sanitizeHtml() on content
    ↓
Render article with safe HTML
```

### ۵.۵. داشبورد کارکنان

**مسیر:** `/employees/dashboard`

**فایل‌های مهم:**
- `app/employees/dashboard/page.tsx` - Server Component
- `app/employees/dashboard/dashboard-client.tsx` - Auth wrapper
- `app/employees/dashboard/dashboard-content.tsx` - Tab manager
- `lib/request-service.ts` - `getRequestStats()`, `getRequestsByStatus()`

**ویژگی‌ها:**
- نمایش آمار درخواست‌ها (همه، در انتظار، در حال بررسی، تکمیل شده، رد شده)
- فیلتر بر اساس وضعیت
- جدول درخواست‌ها با امکان مشاهده جزئیات
- تب مدیریت اخبار (فقط برای admin)

---

## ۶. کیفیت کد، الگوها و Refactorها

### الگوهای مثبت

#### جداسازی Services در `lib/`
```
lib/
├── news-service.ts         # عملیات اخبار (خواندن عمومی)
├── admin-news-service.ts   # عملیات اخبار (مدیریت)
├── request-service.ts      # عملیات درخواست‌ها
└── ...
```

#### استفاده از Types مرکزی
```typescript
// lib/types.ts
export type NewsStatus = "draft" | "published";
export type RequestStatus = "pending" | "in-review" | "completed" | "rejected";
export type ServiceType = "complaint_137" | "building_permit" | "payment";
export type AppRole = "admin" | "employee" | "unknown";
```

#### شکستن کامپوننت‌های بزرگ
داشبورد اخبار به چندین فایل تفکیک شده:
```
app/employees/dashboard/
├── news-management.tsx    # کامپوننت اصلی
├── news-form.tsx          # فرم ایجاد/ویرایش
├── news-table.tsx         # جدول لیست اخبار
├── news-actions.ts        # Server Actions
├── dashboard-tabs.tsx     # تب‌های داشبورد
└── dashboard-filter.tsx   # فیلتر درخواست‌ها
```

#### Logger ساختاریافته
```typescript
// lib/logger.ts
export const logger = {
  debug(message: string, context?: LogContext): void
  info(message: string, context?: LogContext): void
  warn(message: string, context?: LogContext): void
  error(message: string, error?: unknown, context?: LogContext): void
};

// Child loggers for modules
export const authLogger = logger.child({ module: "auth" });
export const newsLogger = logger.child({ module: "news" });
export const serviceLogger = logger.child({ module: "service" });
```

**ویژگی‌ها:**
- Timestamp در همه لاگ‌ها
- Sanitization داده‌های حساس (password, token, ...)
- سطوح مختلف لاگ بر اساس NODE_ENV

### Refactorهای انجام شده

| قبل | بعد | دلیل |
|-----|-----|------|
| Supabase client بدون SSR | `@supabase/ssr` با cookie handling | Session consistency |
| Mock data برای تست | Supabase با RLS | Production readiness |
| Auth فقط client-side | Auth در middleware + server | Security |
| یک فایل بزرگ برای news | فایل‌های جداگانه | Maintainability |
| Console.log پراکنده | Logger ساختاریافته | Debugging |

### بدهی فنی (Technical Debt)

| مورد | اولویت | توضیحات |
|------|--------|---------|
| پرداخت عوارض Mock | متوسط | مبلغ به صورت random تولید می‌شود |
| Rich Text Editor | پایین | فعلاً textarea ساده برای محتوای HTML |
| آپلود تصویر | پایین | فعلاً فقط URL پذیرفته می‌شود |
| تغییر وضعیت درخواست | بالا | کارمند نمی‌تواند وضعیت را تغییر دهد |

---

## ۷. تست‌ها و تضمین کیفیت

### راه‌اندازی Vitest

**فایل `vitest.config.ts`:**
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
```

**فایل `vitest.setup.ts`:**
- Mock برای `next/navigation`
- Mock برای `next/headers`
- Import `@testing-library/jest-dom`

### ساختار تست‌ها

```
__tests__/
└── lib/
    ├── auth-roles.test.ts      # 17 تست
    ├── validations.test.ts     # 27 تست
    ├── request-service.test.ts # 12 تست
    └── utils.test.ts           # 29 تست
```

### خلاصه پوشش تست

| ماژول | تعداد تست | وضعیت |
|-------|-----------|--------|
| `auth-roles.ts` | 17 | ✅ همه پاس |
| `validations.ts` | 27 | ✅ همه پاس |
| `request-service.ts` | 12 | ✅ همه پاس |
| `utils.ts` | 29 | ✅ همه پاس |
| **مجموع** | **85** | **✅ همه پاس** |

### موارد تست شده

**auth-roles:**
- `getUserRole()` برای admin, employee, unknown
- `isAdmin()` و `isEmployee()` با انواع ورودی
- `isAdminEmail()` با case insensitivity
- رفتار با env خالی

**validations:**
- همه Zod schemas با ورودی‌های valid و invalid
- فرمت تلفن ایرانی
- محدودیت کاراکتر
- `validateData()` helper

**request-service:**
- `generateTrackingCode()` - فرمت، یکتایی، کاراکترهای مجاز

**utils:**
- `cn()` برای merge کلاس‌ها
- `sanitizeHtml()` با انواع حملات XSS
- `formatNewsDate()` و `formatPersianDate()`
- `getServiceTypeLabel()`

### پیشنهادات برای تست‌های آینده

1. **Integration Tests:**
   - تست Server Actions با Supabase mock
   - تست جریان کامل ثبت شکایت

2. **E2E Tests (Playwright/Cypress):**
   - تست جریان login → dashboard → logout
   - تست ثبت شکایت و دریافت کد رهگیری
   - تست مدیریت اخبار

3. **API Tests:**
   - تست RLS policies با کاربران مختلف

---

## ۸. تجربه توسعه‌دهنده (DX)

### تنظیمات Prettier

```json
// .prettierrc (implicit with defaults)
// + prettier-plugin-tailwindcss
```

**نکته:** کلاس‌های Tailwind به صورت خودکار مرتب می‌شوند.

### اسکریپت‌های مهم در `package.json`

| اسکریپت | کاربرد |
|---------|--------|
| `npm run dev` | اجرای development server |
| `npm run build` | Build برای production |
| `npm run start` | اجرای production server |
| `npm run lint` | بررسی ESLint |
| `npm run format` | Format کردن کد با Prettier |
| `npm run format:check` | بررسی format بدون تغییر |
| `npm test` | اجرای تست‌ها (watch mode) |
| `npm run test:run` | اجرای تست‌ها (یک‌بار) |
| `npm run test:coverage` | اجرای تست‌ها با coverage |

### راهنمای راه‌اندازی لوکال

```bash
# 1. Clone و نصب dependencies
git clone <repo-url>
cd gholaman-municipality-portal
npm install

# 2. تنظیم متغیرهای محیطی
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 3. اجرای migrations در Supabase
# Run SQL files in supabase/migrations/ in order

# 4. اجرای development server
npm run dev

# 5. اجرای تست‌ها
npm test
```

### فایل‌های مستند موجود

| فایل | محتوا |
|------|-------|
| `README.md` | معرفی پروژه، راه‌اندازی، ساختار |
| `DEPLOYMENT.md` | راهنمای deploy به Vercel |
| `TROUBLESHOOTING.md` | راهنمای رفع مشکلات |
| `STATUS_REPORT_LATEST.md` | گزارش وضعیت قبلی |

---

## ۹. متغیرهای محیطی و استقرار

### متغیرهای محیطی مورد نیاز

| متغیر | نوع | توضیحات |
|-------|-----|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL پروژه Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Anonymous key برای client |
| `SUPABASE_URL` | Server | URL پروژه (سمت سرور) |
| `SUPABASE_ANON_KEY` | Server | Anon key (سمت سرور) |
| `NEXT_PUBLIC_ADMIN_EMAILS` | Public | لیست ایمیل‌های admin (comma-separated) |

### اتصال به Supabase

سه نوع Supabase client در پروژه وجود دارد:

| کلاینت | فایل | استفاده |
|--------|------|---------|
| Server | `lib/supabase-server.ts` | Server Components, Server Actions |
| Browser | `lib/supabaseBrowserClient.ts` | Client Components |
| Middleware | `lib/supabase-middleware.ts` | Route protection |

همه از `@supabase/ssr` استفاده می‌کنند که cookie-based sessions را پشتیبانی می‌کند.

### نکات استقرار Production

1. **قبل از استقرار:**
   - اجرای همه migration ها در Supabase
   - بررسی فعال بودن RLS
   - تنظیم `NEXT_PUBLIC_ADMIN_EMAILS`
   - ایجاد حساب‌های کاربری admin/employee در Supabase Auth

2. **Vercel Settings:**
   - Framework: Next.js (auto-detected)
   - Node.js Version: 18.x یا بالاتر
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **بعد از استقرار:**
   - تست login با حساب admin
   - تست ایجاد/ویرایش/حذف خبر
   - تست ثبت شکایت و دریافت کد رهگیری
   - بررسی logs در Vercel

---

## ۱۰. وضعیت فعلی و پیشنهادهای آینده

### جدول قبل/بعد

| حوزه | قبل | بعد |
|------|-----|-----|
| **امنیت - Auth** | Client-side فقط | Middleware + Server |
| **امنیت - RLS** | غیرفعال | فعال با policies |
| **امنیت - XSS** | بدون محافظت | DOMPurify |
| **امنیت - Validation** | HTML5 فقط | Zod + Server-side |
| **عملکرد - Stats** | 5 کوئری جداگانه | یک RPC |
| **عملکرد - Indexes** | پیش‌فرض | بهینه برای کوئری‌ها |
| **کیفیت کد - Types** | `any` پراکنده | Types مرکزی |
| **کیفیت کد - Logging** | `console.log` | Logger ساختاریافته |
| **تست‌ها** | ۰ | ۸۵ تست |
| **DX - Formatting** | دستی | Prettier + Tailwind plugin |

### آیا پروژه آماده Production است؟

**بله، با شرایط زیر:**

✅ موارد آماده:
- معماری و ساختار کد
- احراز هویت و مجوزها
- RLS و امنیت دیتابیس
- Validation ورودی‌ها
- تست‌های واحد
- مستندات فنی

⚠️ پیش‌نیازهای باقی‌مانده:
- ایجاد حساب‌های admin/employee در Supabase Auth
- اجرای migrations در دیتابیس production
- تنظیم متغیرهای محیطی در hosting

### پیشنهادات آینده

#### فیچرهای جدید (اولویت بالا)
1. **تغییر وضعیت درخواست توسط کارمند**
   - افزودن dropdown برای تغییر status
   - ثبت تاریخچه تغییرات

2. **اعلان‌ها (Notifications)**
   - ارسال SMS به شهروند هنگام تغییر وضعیت
   - اعلان در داشبورد برای درخواست‌های جدید

#### فیچرهای جدید (اولویت متوسط)
3. **آپلود تصویر برای اخبار**
   - استفاده از Supabase Storage
   - بهینه‌سازی و resize تصاویر

4. **Rich Text Editor**
   - TipTap یا Quill برای ویرایش محتوای HTML

5. **گزارش‌گیری**
   - Export به Excel
   - نمودارهای آماری

#### بهبودهای فنی
6. **Integration Tests**
   - تست جریان‌های کامل با database mock

7. **E2E Tests**
   - Playwright برای تست‌های کاربر نهایی

8. **Observability**
   - اتصال به سرویس لاگینگ خارجی (Sentry, LogRocket)
   - مانیتورینگ performance

9. **CI/CD**
   - GitHub Actions برای اجرای خودکار تست‌ها
   - Preview deployments برای PRها

---

## پیوست‌ها

### A. لیست فایل‌های اصلی

<details>
<summary>کلیک برای مشاهده</summary>

```
app/
├── layout.tsx
├── page.tsx
├── globals.css
├── error.tsx
├── loading.tsx
├── not-found.tsx
├── global-error.tsx
├── admin/
│   ├── admin-client.tsx
│   └── news/
│       ├── page.tsx
│       ├── loading.tsx
│       ├── delete-button.tsx
│       └── [id]/
│           ├── page.tsx
│           └── news-form.tsx
├── employees/
│   ├── login/
│   │   └── page.tsx
│   └── dashboard/
│       ├── page.tsx
│       ├── loading.tsx
│       ├── dashboard-client.tsx
│       ├── dashboard-content.tsx
│       ├── dashboard-tabs.tsx
│       ├── dashboard-filter.tsx
│       ├── news-actions.ts
│       ├── news-management.tsx
│       ├── news-form.tsx
│       └── news-table.tsx
├── news/
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── [slug]/
│       └── page.tsx
├── services/
│   ├── page.tsx
│   ├── actions.ts
│   ├── 137/
│   │   └── page.tsx
│   ├── building-permit/
│   │   └── page.tsx
│   ├── payments/
│   │   └── page.tsx
│   ├── address/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── maintenance/
│   │   └── page.tsx
│   └── permits/
│       └── page.tsx
└── track/
    ├── page.tsx
    └── [code]/
        └── page.tsx

lib/
├── supabase-server.ts
├── supabaseBrowserClient.ts
├── supabase-middleware.ts
├── auth-roles.ts
├── auth-helpers.ts
├── server-auth.ts
├── news-service.ts
├── admin-news-service.ts
├── request-service.ts
├── validations.ts
├── types.ts
├── utils.ts
├── logger.ts
└── constants.ts

supabase/migrations/
├── 001_rls_policies.sql
├── 002_indexes.sql
├── 003_request_stats_rpc.sql
└── 004_rls_diagnostic.sql

__tests__/lib/
├── auth-roles.test.ts
├── validations.test.ts
├── request-service.test.ts
└── utils.test.ts
```

</details>

### B. دستورات مفید

```bash
# Development
npm run dev

# Build & Test
npm run build
npm test

# Format code
npm run format

# Run specific test file
npx vitest run __tests__/lib/validations.test.ts

# Generate TypeScript types from Supabase
npx supabase gen types typescript --project-id <project-id> > lib/database.types.ts
```

---

**پایان گزارش**

*این گزارش بر اساس کد منبع پروژه در تاریخ آذر ۱۴۰۴ تهیه شده است.*

