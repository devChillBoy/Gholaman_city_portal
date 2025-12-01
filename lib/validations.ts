import { z } from "zod";

// =============================================================================
// Common Validation Patterns
// =============================================================================

/**
 * Iranian mobile phone number pattern (09xxxxxxxxx)
 */
const iranianPhoneRegex = /^09\d{9}$/;

/**
 * Simple coordinate validation (latitude/longitude)
 */
const coordinateRegex = /^-?\d+(\.\d+)?$/;

// =============================================================================
// Service Form Schemas
// =============================================================================

/**
 * Complaint 137 form validation schema
 */
export const complaint137Schema = z.object({
  title: z
    .string()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(200, "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد"),
  description: z
    .string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .max(2000, "توضیحات نباید بیشتر از ۲۰۰۰ کاراکتر باشد"),
  category: z
    .string()
    .min(1, "لطفاً دسته‌بندی را انتخاب کنید"),
  latitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || coordinateRegex.test(val),
      "فرمت عرض جغرافیایی نامعتبر است"
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (val) => !val || coordinateRegex.test(val),
      "فرمت طول جغرافیایی نامعتبر است"
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || iranianPhoneRegex.test(val),
      "شماره تلفن باید با فرمت ۰۹xxxxxxxxx باشد"
    ),
});

export type Complaint137Input = z.infer<typeof complaint137Schema>;

/**
 * Building permit form validation schema
 */
export const buildingPermitSchema = z.object({
  ownerName: z
    .string()
    .min(3, "نام مالک باید حداقل ۳ کاراکتر باشد")
    .max(100, "نام مالک نباید بیشتر از ۱۰۰ کاراکتر باشد"),
  address: z
    .string()
    .min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد")
    .max(500, "آدرس نباید بیشتر از ۵۰۰ کاراکتر باشد"),
  permitType: z
    .string()
    .min(1, "لطفاً نوع درخواست را انتخاب کنید"),
  description: z
    .string()
    .max(1000, "توضیحات نباید بیشتر از ۱۰۰۰ کاراکتر باشد")
    .optional(),
  phone: z
    .string()
    .regex(iranianPhoneRegex, "شماره تلفن باید با فرمت ۰۹xxxxxxxxx باشد"),
});

export type BuildingPermitInput = z.infer<typeof buildingPermitSchema>;

/**
 * Payment form validation schema
 */
export const paymentSchema = z.object({
  fileNumber: z
    .string()
    .min(1, "شماره پرونده الزامی است")
    .max(50, "شماره پرونده نباید بیشتر از ۵۰ کاراکتر باشد"),
  paymentType: z
    .string()
    .min(1, "لطفاً نوع عوارض را انتخاب کنید"),
  amount: z
    .number()
    .min(1000, "مبلغ باید حداقل ۱۰۰۰ تومان باشد")
    .max(100000000000, "مبلغ بیش از حد مجاز است"),
});

export type PaymentInput = z.infer<typeof paymentSchema>;

// =============================================================================
// News Schema
// =============================================================================

/**
 * News form validation schema
 */
export const newsSchema = z.object({
  title: z
    .string()
    .min(3, "عنوان باید حداقل ۳ کاراکتر باشد")
    .max(200, "عنوان نباید بیشتر از ۲۰۰ کاراکتر باشد"),
  slug: z
    .string()
    .min(3, "شناسه لینک باید حداقل ۳ کاراکتر باشد")
    .max(200, "شناسه لینک نباید بیشتر از ۲۰۰ کاراکتر باشد")
    .regex(/^[a-z0-9\u0600-\u06FF-]+$/, "شناسه لینک فقط می‌تواند شامل حروف، اعداد و خط تیره باشد"),
  excerpt: z
    .string()
    .max(500, "خلاصه نباید بیشتر از ۵۰۰ کاراکتر باشد")
    .optional(),
  content: z
    .string()
    .max(50000, "محتوا نباید بیشتر از ۵۰۰۰۰ کاراکتر باشد")
    .optional(),
  image_url: z
    .string()
    .url("آدرس تصویر نامعتبر است")
    .optional()
    .or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export type NewsInput = z.infer<typeof newsSchema>;

// =============================================================================
// Validation Helper
// =============================================================================

/**
 * Validate data against a schema and return structured result
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string> } {
  const result = schema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  // Convert Zod errors to a simple key-value object
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".");
    errors[key] = issue.message;
  }
  
  return { success: false, errors };
}

