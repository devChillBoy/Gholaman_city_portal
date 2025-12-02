"use server";

import { createRequest, type CreateRequestInput } from "@/lib/request-service";
import type { RequestRecord } from "@/lib/request-service";
import {
  complaint137Schema,
  buildingPermitSchema,
  paymentSchema,
  type Complaint137Input,
  type BuildingPermitInput,
  type PaymentInput,
} from "@/lib/validations";
import { serviceLogger } from "@/lib/logger";

// =============================================================================
// Error Messages (User-friendly Persian messages)
// =============================================================================

const ERROR_MESSAGES = {
  VALIDATION_FAILED: "داده‌های ورودی نامعتبر است",
  REQUEST_CREATION_FAILED: "خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.",
  DATABASE_ERROR: "خطا در ارتباط با سرور. لطفاً دقایقی دیگر تلاش کنید.",
} as const;

// =============================================================================
// Service Actions
// =============================================================================

/**
 * Submit a 137 complaint
 * Validates input using Zod schema before creating request
 */
export async function submitComplaint137(
  data: Complaint137Input
): Promise<RequestRecord> {
  serviceLogger.info("Processing complaint 137 submission", {
    category: data.category,
    hasPhone: !!data.phone,
    hasCoordinates: !!(data.latitude && data.longitude),
  });

  // Validate input
  const validation = complaint137Schema.safeParse(data);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    const errorMessage = firstError?.message || ERROR_MESSAGES.VALIDATION_FAILED;

    serviceLogger.warn("Complaint 137 validation failed", {
      field: firstError?.path?.join("."),
      error: errorMessage,
    });

    throw new Error(errorMessage);
  }

  const validData = validation.data;

  const input: CreateRequestInput = {
    service_type: "complaint_137",
    title: validData.title,
    description: validData.description,
    payload: {
      category: validData.category,
      ...(validData.latitude && { latitude: validData.latitude }),
      ...(validData.longitude && { longitude: validData.longitude }),
    },
    ...(validData.phone && { citizen_phone: validData.phone }),
  };

  try {
    const result = await createRequest(input);

    if (!result) {
      serviceLogger.error("Failed to create complaint 137: createRequest returned null", {
        serviceType: "complaint_137",
        input,
      });
      throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
    }

    serviceLogger.info("Complaint 137 created successfully", {
      requestCode: result.code,
    });
    return result;
  } catch (error) {
    serviceLogger.error("Failed to create complaint 137", error, {
      serviceType: "complaint_137",
    });
    throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
  }
}

/**
 * Submit a building permit request
 * Validates input using Zod schema before creating request
 */
export async function submitBuildingPermit(
  data: BuildingPermitInput
): Promise<RequestRecord> {
  serviceLogger.info("Processing building permit submission", {
    permitType: data.permitType,
  });

  // Validate input
  const validation = buildingPermitSchema.safeParse(data);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    const errorMessage = firstError?.message || ERROR_MESSAGES.VALIDATION_FAILED;

    serviceLogger.warn("Building permit validation failed", {
      field: firstError?.path?.join("."),
      error: errorMessage,
    });

    throw new Error(errorMessage);
  }

  const validData = validation.data;

  const input: CreateRequestInput = {
    service_type: "building_permit",
    title: `درخواست پروانه ساختمانی - ${validData.permitType}`,
    description: validData.description,
    payload: {
      owner_name: validData.ownerName,
      address: validData.address,
      request_type: validData.permitType,
    },
    citizen_name: validData.ownerName,
    citizen_phone: validData.phone,
  };

  try {
    const result = await createRequest(input);

    if (!result) {
      serviceLogger.error("Failed to create building permit: createRequest returned null", {
        serviceType: "building_permit",
        input,
      });
      throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
    }

    serviceLogger.info("Building permit created successfully", {
      requestCode: result.code,
    });
    return result;
  } catch (error) {
    serviceLogger.error("Failed to create building permit", error, {
      serviceType: "building_permit",
    });
    throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
  }
}

/**
 * Submit a payment request
 * Validates input using Zod schema before creating request
 */
export async function submitPayment(data: PaymentInput): Promise<RequestRecord> {
  serviceLogger.info("Processing payment submission", {
    paymentType: data.paymentType,
    amount: data.amount,
  });

  // Validate input
  const validation = paymentSchema.safeParse(data);
  if (!validation.success) {
    const firstError = validation.error.issues[0];
    const errorMessage = firstError?.message || ERROR_MESSAGES.VALIDATION_FAILED;

    serviceLogger.warn("Payment validation failed", {
      field: firstError?.path?.join("."),
      error: errorMessage,
    });

    throw new Error(errorMessage);
  }

  const validData = validation.data;

  const input: CreateRequestInput = {
    service_type: "payment",
    title: `پرداخت عوارض - شماره پرونده ${validData.fileNumber}`,
    description: "درخواست پرداخت عوارض",
    payload: {
      file_number: validData.fileNumber,
      fee_type: validData.paymentType,
      amount: validData.amount,
    },
  };

  try {
    const result = await createRequest(input);

    if (!result) {
      serviceLogger.error("Failed to create payment: createRequest returned null", {
        serviceType: "payment",
        input,
      });
      throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
    }

    serviceLogger.info("Payment created successfully", {
      requestCode: result.code,
    });
    return result;
  } catch (error) {
    serviceLogger.error("Failed to create payment", error, {
      serviceType: "payment",
    });
    throw new Error(ERROR_MESSAGES.REQUEST_CREATION_FAILED);
  }
}
