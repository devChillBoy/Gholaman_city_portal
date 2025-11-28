"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RequestStatus } from "@/lib/request-service";
import { Filter } from "lucide-react";

interface DashboardFilterProps {
  currentStatus: RequestStatus | "all";
}

const filterOptions: Array<{ value: RequestStatus | "all"; label: string }> = [
  { value: "all", label: "همه" },
  { value: "pending", label: "در انتظار بررسی" },
  { value: "in-review", label: "در حال بررسی" },
  { value: "completed", label: "تکمیل شده" },
  { value: "rejected", label: "رد شده" },
];

export function DashboardFilter({ currentStatus }: DashboardFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <Filter className="h-5 w-5 text-gray-500" />
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">فیلتر بر اساس وضعیت:</span>
        <div className="flex items-center gap-2">
          {filterOptions.map((option) => {
            const href =
              option.value === "all"
                ? "/employees/dashboard"
                : `/employees/dashboard?status=${option.value}`;
            const isActive = currentStatus === option.value;

            return (
              <Button
                key={option.value}
                asChild
                variant={isActive ? "default" : "outline"}
                size="sm"
              >
                <Link href={href}>{option.label}</Link>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

