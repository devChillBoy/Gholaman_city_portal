"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function DeleteButton({ 
  id, 
  deleteAction 
}: { 
  id: number;
  deleteAction: (formData: FormData) => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // Confirm BEFORE any action
    if (!confirm("آیا از حذف این خبر اطمینان دارید؟")) {
      return;
    }

    setIsPending(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("id", String(id));
      await deleteAction(formData);
      // Refresh the page after successful deletion
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "خطا در حذف خبر";
      setError(errorMessage);
      // Show error alert to user
      alert(errorMessage);
      setIsPending(false);
    }
  };

  return (
    <Button
      type="button"
      variant="destructive"
      size="sm"
      disabled={isPending}
      onClick={handleClick}
      title={error || undefined}
    >
      <Trash2 className="ml-2 h-4 w-4" />
      {isPending ? "در حال حذف..." : "حذف"}
    </Button>
  );
}
