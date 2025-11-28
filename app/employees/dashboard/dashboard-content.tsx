"use client";

import { useState, useEffect } from "react";
import { DashboardTabs, type DashboardTab } from "./dashboard-tabs";
import { NewsManagement, type NewsFormData } from "./news-management";
import { getCurrentUser, isAdmin } from "@/lib/auth-helpers";
import type { NewsItem } from "@/lib/types";
import type { NewsStatus } from "@/lib/types";

interface DashboardContentProps {
  requestsContent: React.ReactNode;
  newsItems: NewsItem[];
  onCreateNews: (data: NewsFormData) => Promise<{ success: boolean; error?: string }>;
  onUpdateNews: (id: number, data: Partial<NewsFormData>) => Promise<{ success: boolean; error?: string }>;
  onDeleteNews: (id: number) => Promise<{ success: boolean; error?: string }>;
  onToggleStatus: (id: number, status: NewsStatus) => Promise<{ success: boolean; error?: string }>;
}

export function DashboardContent({
  requestsContent,
  newsItems,
  onCreateNews,
  onUpdateNews,
  onDeleteNews,
  onToggleStatus,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("requests");
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      const user = await getCurrentUser();
      setIsUserAdmin(isAdmin(user));
      setIsCheckingRole(false);
    };
    checkAdminRole();
  }, []);

  // Show loading while checking role
  if (isCheckingRole) {
    return <>{requestsContent}</>;
  }

  return (
    <div>
      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showNewsTab={isUserAdmin}
      />

      {activeTab === "requests" && requestsContent}

      {activeTab === "news" && isUserAdmin && (
        <NewsManagement
          initialNews={newsItems}
          onCreateNews={onCreateNews}
          onUpdateNews={onUpdateNews}
          onDeleteNews={onDeleteNews}
          onToggleStatus={onToggleStatus}
        />
      )}
    </div>
  );
}

