import Link from "next/link";

export function Footer() {
  const usefulLinks = [
    { href: "/services", label: "خدمات شهروندی" },
    { href: "/news", label: "اخبار و رویدادها" },
    { href: "/track", label: "پیگیری درخواست" },
    { href: "/employees/login", label: "ورود پرسنل شهرداری" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">درباره شهرداری غلامان</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              شهرداری غلامان با هدف ارائه خدمات بهتر به شهروندان و بهبود کیفیت زندگی در شهر، 
              در تلاش است تا با استفاده از فناوری‌های نوین، دسترسی به خدمات شهری را تسهیل کند.
            </p>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">لینک‌های مفید</h3>
            <ul className="space-y-2">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">اطلاعات تماس</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <strong>آدرس:</strong> خیابان اصلی، میدان مرکزی، شهرداری غلامان
              </li>
              <li>
                <strong>تلفن:</strong> ۰۲۱-۱۲۳۴۵۶۷۸
              </li>
              <li>
                <strong>ایمیل:</strong> info@gholaman.ir
              </li>
              <li>
                <strong>سامانه ۱۳۷:</strong> ۱۳۷
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} شهرداری غلامان. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

