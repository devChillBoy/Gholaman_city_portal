import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRecentRequests, getRequestsByStatus, getRequestStats, type RequestStatus } from "@/lib/request-service";
import { 
  requestStatuses, 
  DASHBOARD_PAGE_SIZE 
} from "@/lib/constants";
import { formatPersianDate, getServiceTypeLabel } from "@/lib/utils";
import { DashboardFilter } from "./dashboard-filter";
import { DashboardClient, LogoutButton } from "./dashboard-client";
import { DashboardContent } from "./dashboard-content";
import { 
  getNewsForDashboard, 
  createNewsAction, 
  updateNewsAction, 
  deleteNewsAction, 
  toggleNewsStatusAction 
} from "./news-actions";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

/**
 * Get badge variant for status
 */
function getStatusBadgeVariant(status: RequestStatus) {
  switch (status) {
    case "pending":
      return "warning" as const;
    case "in-review":
      return "default" as const;
    case "completed":
      return "success" as const;
    case "rejected":
      return "destructive" as const;
    default:
      return "default" as const;
  }
}

export default async function EmployeeDashboardPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const filterStatus = (status as RequestStatus | "all") || "all";
  
  // Fetch stats using efficient COUNT queries (runs in parallel)
  const [stats, newsItems] = await Promise.all([
    getRequestStats(),
    getNewsForDashboard(),
  ]);

  // Fetch filtered requests for table display
  let requests;
  if (filterStatus === "all") {
    requests = await getRecentRequests(DASHBOARD_PAGE_SIZE);
  } else {
    requests = await getRequestsByStatus(filterStatus, DASHBOARD_PAGE_SIZE);
  }

  // Requests content component
  const requestsContent = (
    <>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>همه درخواست‌ها</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stats.all}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>در انتظار بررسی</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stats.pending}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>در حال بررسی</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stats["in-review"]}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>تکمیل شده</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stats.completed}</CardTitle>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>رد شده</CardDescription>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-2xl">{stats.rejected}</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <DashboardFilter currentStatus={filterStatus} />
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>لیست درخواست‌ها</CardTitle>
          <CardDescription>
            {requests.length} درخواست یافت شد
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              درخواستی یافت نشد
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>کد رهگیری</TableHead>
                  <TableHead>نوع خدمت</TableHead>
                  <TableHead>عنوان</TableHead>
                  <TableHead>تاریخ ثبت</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.code}>
                    <TableCell className="font-mono text-sm">
                      {request.code}
                    </TableCell>
                    <TableCell>{getServiceTypeLabel(request.service_type)}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {request.title}
                    </TableCell>
                    <TableCell>{formatPersianDate(request.created_at)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {requestStatuses[request.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/track/${request.code}`}>مشاهده</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </>
  );

  return (
    <DashboardClient>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-2">داشبورد پرسنل</h1>
            <p className="text-gray-600">مدیریت و پیگیری درخواست‌های شهروندی</p>
          </div>
          <LogoutButton />
        </div>

        <DashboardContent
          requestsContent={requestsContent}
          newsItems={newsItems}
          onCreateNews={createNewsAction}
          onUpdateNews={updateNewsAction}
          onDeleteNews={deleteNewsAction}
          onToggleStatus={toggleNewsStatusAction}
        />
      </div>
    </DashboardClient>
  );
}
