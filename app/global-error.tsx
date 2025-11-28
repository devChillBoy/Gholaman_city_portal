"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body style={{ fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif" }}>
        <div style={{ 
          minHeight: "100vh", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          backgroundColor: "#f9fafb",
          padding: "1rem"
        }}>
          <div style={{ 
            backgroundColor: "white", 
            padding: "2rem", 
            borderRadius: "0.5rem",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            maxWidth: "28rem",
            textAlign: "center"
          }}>
            <div style={{ 
              fontSize: "4rem", 
              marginBottom: "1rem" 
            }}>
              ⚠️
            </div>
            <h1 style={{ 
              fontSize: "1.5rem", 
              fontWeight: "bold", 
              marginBottom: "0.5rem" 
            }}>
              خطای سیستمی
            </h1>
            <p style={{ 
              color: "#6b7280", 
              marginBottom: "1.5rem" 
            }}>
              متأسفانه مشکلی در سیستم رخ داده است.
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: "#1E3A5F",
                color: "white",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.375rem",
                border: "none",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: "500"
              }}
            >
              تلاش مجدد
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

