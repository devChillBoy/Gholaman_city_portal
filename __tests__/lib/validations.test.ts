import { describe, it, expect } from "vitest";
import {
  complaint137Schema,
  buildingPermitSchema,
  paymentSchema,
  newsSchema,
  validateData,
} from "@/lib/validations";

// =============================================================================
// Complaint 137 Schema Tests
// =============================================================================

describe("complaint137Schema", () => {
  it("should validate a valid complaint with all required fields", () => {
    const validData = {
      title: "مشکل در جمع‌آوری زباله",
      description: "زباله‌ها در خیابان جمع نشده‌اند و بوی نامطبوع می‌دهند",
      category: "بهداشت",
    };

    const result = complaint137Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate with optional phone number", () => {
    const validData = {
      title: "مشکل در روشنایی",
      description: "چراغ‌های خیابان خاموش هستند و منطقه تاریک است",
      category: "روشنایی",
      phone: "09123456789",
    };

    const result = complaint137Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate with optional coordinates", () => {
    const validData = {
      title: "خرابی پیاده‌رو",
      description: "سنگ‌های پیاده‌رو شکسته و خطرناک هستند",
      category: "عمرانی",
      latitude: "35.6892",
      longitude: "51.3890",
    };

    const result = complaint137Schema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject title shorter than 3 characters", () => {
    const invalidData = {
      title: "اب",
      description: "توضیحات کافی برای شکایت",
      category: "بهداشت",
    };

    const result = complaint137Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("۳ کاراکتر");
    }
  });

  it("should reject description shorter than 10 characters", () => {
    const invalidData = {
      title: "عنوان معتبر",
      description: "کوتاه",
      category: "بهداشت",
    };

    const result = complaint137Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("۱۰ کاراکتر");
    }
  });

  it("should reject invalid phone format", () => {
    const invalidData = {
      title: "عنوان معتبر",
      description: "توضیحات کافی برای شکایت",
      category: "بهداشت",
      phone: "1234567890", // باید با 09 شروع شود
    };

    const result = complaint137Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("۰۹");
    }
  });

  it("should reject empty category", () => {
    const invalidData = {
      title: "عنوان معتبر",
      description: "توضیحات کافی برای شکایت",
      category: "",
    };

    const result = complaint137Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject invalid coordinate format", () => {
    const invalidData = {
      title: "عنوان معتبر",
      description: "توضیحات کافی برای شکایت",
      category: "عمرانی",
      latitude: "invalid",
    };

    const result = complaint137Schema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("جغرافیایی");
    }
  });
});

// =============================================================================
// Building Permit Schema Tests
// =============================================================================

describe("buildingPermitSchema", () => {
  it("should validate a valid building permit request", () => {
    const validData = {
      ownerName: "علی محمدی",
      address: "خیابان اصلی، کوچه ۵، پلاک ۱۲",
      permitType: "ساخت",
      phone: "09123456789",
    };

    const result = buildingPermitSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate with optional description", () => {
    const validData = {
      ownerName: "رضا احمدی",
      address: "بلوار آزادی، نبش کوچه گلها",
      permitType: "تخریب و نوسازی",
      phone: "09987654321",
      description: "درخواست پروانه برای ساختمان ۳ طبقه",
    };

    const result = buildingPermitSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject owner name shorter than 3 characters", () => {
    const invalidData = {
      ownerName: "علی",
      address: "خیابان اصلی، کوچه ۵، پلاک ۱۲",
      permitType: "ساخت",
      phone: "09123456789",
    };

    // نام "علی" دقیقاً ۳ کاراکتر است و باید قبول شود
    const result = buildingPermitSchema.safeParse(invalidData);
    expect(result.success).toBe(true);

    // نام با ۲ کاراکتر باید رد شود
    const invalidData2 = {
      ownerName: "ع",
      address: "خیابان اصلی، کوچه ۵، پلاک ۱۲",
      permitType: "ساخت",
      phone: "09123456789",
    };

    const result2 = buildingPermitSchema.safeParse(invalidData2);
    expect(result2.success).toBe(false);
  });

  it("should reject address shorter than 10 characters", () => {
    const invalidData = {
      ownerName: "علی محمدی",
      address: "کوتاه",
      permitType: "ساخت",
      phone: "09123456789",
    };

    const result = buildingPermitSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("۱۰ کاراکتر");
    }
  });

  it("should reject invalid phone format", () => {
    const invalidData = {
      ownerName: "علی محمدی",
      address: "خیابان اصلی، کوچه ۵، پلاک ۱۲",
      permitType: "ساخت",
      phone: "02112345678", // تلفن ثابت، نه موبایل
    };

    const result = buildingPermitSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// Payment Schema Tests
// =============================================================================

describe("paymentSchema", () => {
  it("should validate a valid payment request", () => {
    const validData = {
      fileNumber: "1234567",
      paymentType: "عوارض ساختمان",
      amount: 5000000,
    };

    const result = paymentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject amount less than 1000", () => {
    const invalidData = {
      fileNumber: "1234567",
      paymentType: "عوارض ساختمان",
      amount: 500,
    };

    const result = paymentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("۱۰۰۰");
    }
  });

  it("should reject empty file number", () => {
    const invalidData = {
      fileNumber: "",
      paymentType: "عوارض ساختمان",
      amount: 5000000,
    };

    const result = paymentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject empty payment type", () => {
    const invalidData = {
      fileNumber: "1234567",
      paymentType: "",
      amount: 5000000,
    };

    const result = paymentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject amount exceeding maximum", () => {
    const invalidData = {
      fileNumber: "1234567",
      paymentType: "عوارض ساختمان",
      amount: 200000000000, // بیش از حد مجاز
    };

    const result = paymentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

// =============================================================================
// News Schema Tests
// =============================================================================

describe("newsSchema", () => {
  it("should validate a valid news item", () => {
    const validData = {
      title: "خبر جدید شهرداری",
      slug: "news-new-municipality",
      status: "draft" as const,
    };

    const result = newsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate with Persian slug", () => {
    const validData = {
      title: "افتتاح پارک جدید",
      slug: "افتتاح-پارک-جدید",
      status: "published" as const,
    };

    const result = newsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should validate with all optional fields", () => {
    const validData = {
      title: "خبر کامل",
      slug: "complete-news",
      excerpt: "خلاصه خبر",
      content: "<p>محتوای کامل خبر</p>",
      image_url: "https://example.com/image.jpg",
      status: "published" as const,
    };

    const result = newsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should reject invalid status", () => {
    const invalidData = {
      title: "خبر جدید",
      slug: "new-news",
      status: "invalid",
    };

    const result = newsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject slug with invalid characters", () => {
    const invalidData = {
      title: "خبر جدید",
      slug: "slug with spaces",
      status: "draft" as const,
    };

    const result = newsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("شناسه لینک");
    }
  });

  it("should reject invalid image URL", () => {
    const invalidData = {
      title: "خبر جدید",
      slug: "new-news",
      image_url: "not-a-valid-url",
      status: "draft" as const,
    };

    const result = newsSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should allow empty image_url", () => {
    const validData = {
      title: "خبر بدون تصویر",
      slug: "news-without-image",
      image_url: "",
      status: "draft" as const,
    };

    const result = newsSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
});

// =============================================================================
// validateData Helper Tests
// =============================================================================

describe("validateData", () => {
  it("should return success with validated data", () => {
    const data = {
      title: "عنوان معتبر",
      description: "توضیحات کافی برای شکایت",
      category: "بهداشت",
    };

    const result = validateData(complaint137Schema, data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe("عنوان معتبر");
    }
  });

  it("should return errors object on validation failure", () => {
    const data = {
      title: "ک",
      description: "کوتاه",
      category: "",
    };

    const result = validateData(complaint137Schema, data);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toBeDefined();
      expect(typeof result.errors).toBe("object");
    }
  });
});

