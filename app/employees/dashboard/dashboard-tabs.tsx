"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardList, Newspaper } from "lucide-react";

export type DashboardTab = "requests" | "news";

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  showNewsTab: boolean;
}

export function DashboardTabs({ activeTab, onTabChange, showNewsTab }: DashboardTabsProps) {
  return (
    <div className="flex gap-2 mb-6">
      <Button
        variant={activeTab === "requests" ? "default" : "outline"}
        onClick={() => onTabChange("requests")}
        className="gap-2"
      >
        <ClipboardList className="h-4 w-4" />
        درخواست‌ها
      </Button>
      {showNewsTab && (
        <Button
          variant={activeTab === "news" ? "default" : "outline"}
          onClick={() => onTabChange("news")}
          className="gap-2"
        >
          <Newspaper className="h-4 w-4" />
          مدیریت اخبار
        </Button>
      )}
    </div>
  );
}

