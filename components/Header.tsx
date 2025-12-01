import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services", label: "خدمات شهروندی" },
  { href: "/news", label: "اخبار" },
  { href: "/track", label: "پیگیری درخواست" },
];

/**
 * Server Component Header with CSS-only mobile menu
 * Uses checkbox hack with peer selectors to avoid client-side JavaScript
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 space-x-reverse">
            <div className="text-xl font-bold text-primary">شهرداری غلامان</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/employees/login">ورود پرسنل شهرداری</Link>
            </Button>
          </nav>

          {/* Mobile Menu Container - CSS Only with peer */}
          <div className="md:hidden relative">
            {/* Hidden checkbox for toggle state - must be first for peer to work */}
            <input
              type="checkbox"
              id="mobile-menu-toggle"
              className="peer absolute opacity-0 w-0 h-0"
            />
            
            {/* Menu toggle label */}
            <label
              htmlFor="mobile-menu-toggle"
              className="block p-2 cursor-pointer"
              aria-label="Toggle menu"
            >
              {/* Hamburger icon - hidden when menu open */}
              <Menu className="h-6 w-6 block peer-checked:hidden" />
              {/* Close icon - shown when menu open */}
              <X className="h-6 w-6 hidden peer-checked:block" />
            </label>

            {/* Mobile Navigation Panel */}
            <nav 
              className="
                fixed left-0 right-0 top-16
                bg-white border-b shadow-lg
                py-4 px-4
                opacity-0 pointer-events-none
                peer-checked:opacity-100 peer-checked:pointer-events-auto
                transition-opacity duration-200
              "
            >
              <div className="flex flex-col gap-4 container mx-auto">
                {navLinks.map((link) => (
                  <label 
                    key={link.href}
                    htmlFor="mobile-menu-toggle"
                    className="contents"
                  >
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-gray-700 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </label>
                ))}
                <label htmlFor="mobile-menu-toggle" className="contents">
                  <Button asChild variant="outline" className="rounded-full w-full">
                    <Link href="/employees/login">ورود پرسنل شهرداری</Link>
                  </Button>
                </label>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
