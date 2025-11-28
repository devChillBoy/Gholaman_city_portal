"use server";

import { createRequest, type CreateRequestInput } from "@/lib/request-service";
import type { RequestRecord } from "@/lib/request-service";

export async function submitComplaint137(data: {
  title: string;
  description: string;
  category: string;
  latitude?: string;
  longitude?: string;
  phone?: string;
}): Promise<RequestRecord> {
  const input: CreateRequestInput = {
    service_type: "complaint_137",
    title: data.title,
    description: data.description,
    payload: {
      category: data.category,
      ...(data.latitude && { latitude: data.latitude }),
      ...(data.longitude && { longitude: data.longitude }),
    },
    ...(data.phone && { citizen_phone: data.phone }),
  };

  return await createRequest(input);
}

export async function submitBuildingPermit(data: {
  ownerName: string;
  address: string;
  permitType: string;
  description?: string;
  phone: string;
}): Promise<RequestRecord> {
  const input: CreateRequestInput = {
    service_type: "building_permit",
    title: `درخواست پروانه ساختمانی - ${data.permitType}`,
    description: data.description,
    payload: {
      owner_name: data.ownerName,
      address: data.address,
      request_type: data.permitType,
    },
    citizen_name: data.ownerName,
    citizen_phone: data.phone,
  };

  return await createRequest(input);
}

export async function submitPayment(data: {
  fileNumber: string;
  paymentType: string;
  amount: number;
}): Promise<RequestRecord> {
  const input: CreateRequestInput = {
    service_type: "payment",
    title: `پرداخت عوارض - شماره پرونده ${data.fileNumber}`,
    description: "درخواست پرداخت عوارض",
    payload: {
      file_number: data.fileNumber,
      fee_type: data.paymentType,
      amount: data.amount,
    },
  };

  return await createRequest(input);
}

