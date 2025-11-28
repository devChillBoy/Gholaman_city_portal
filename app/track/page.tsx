"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TrackPage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      router.push(`/track/${code.trim()}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">پیگیری درخواست</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>جستجوی درخواست</CardTitle>
            <CardDescription>
              برای پیگیری درخواست خود، کد رهگیری را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">کد رهگیری</Label>
                <Input
                  id="code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: REQ-COMPLAINT_137-ABC123"
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full" size="lg">
                جستجو
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

