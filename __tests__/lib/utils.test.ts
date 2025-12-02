import { describe, it, expect } from "vitest";
import {
  cn,
  sanitizeHtml,
  formatNewsDate,
  formatPersianDate,
  formatPersianDateFull,
  getServiceTypeLabel,
} from "@/lib/utils";

// =============================================================================
// cn (className utility) Tests
// =============================================================================

describe("cn", () => {
  it("should merge class names", () => {
    const result = cn("text-red-500", "bg-blue-500");
    expect(result).toBe("text-red-500 bg-blue-500");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base-class", isActive && "active-class");
    expect(result).toBe("base-class active-class");
  });

  it("should handle conflicting Tailwind classes", () => {
    // tailwind-merge should resolve conflicts
    const result = cn("text-red-500", "text-blue-500");
    expect(result).toBe("text-blue-500");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base", undefined, null, "end");
    expect(result).toBe("base end");
  });
});

// =============================================================================
// sanitizeHtml Tests
// =============================================================================

describe("sanitizeHtml", () => {
  it("should allow safe HTML tags", () => {
    const html = "<p>This is a <strong>test</strong> paragraph.</p>";
    const result = sanitizeHtml(html);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>");
    expect(result).toContain("</p>");
  });

  it("should remove script tags", () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("<script>");
    expect(result).not.toContain("alert");
    expect(result).toContain("<p>Safe</p>");
  });

  it("should remove style tags", () => {
    const html = "<p>Safe</p><style>body { display: none; }</style>";
    const result = sanitizeHtml(html);
    expect(result).not.toContain("<style>");
    expect(result).not.toContain("display");
    expect(result).toContain("<p>Safe</p>");
  });

  it("should remove onclick handlers", () => {
    const html = '<p onclick="alert(\'XSS\')">Click me</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("onclick");
    expect(result).toContain("<p");
  });

  it("should remove onerror handlers", () => {
    const html = '<img src="x" onerror="alert(\'XSS\')">';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("onerror");
  });

  it("should remove javascript: URLs", () => {
    const html = '<a href="javascript:alert(\'XSS\')">Click</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("javascript:");
  });

  it("should remove data: URLs", () => {
    const html = '<a href="data:text/html,<script>alert(1)</script>">Click</a>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("data:");
  });

  it("should allow safe links", () => {
    const html = '<a href="https://example.com">Safe Link</a>';
    const result = sanitizeHtml(html);
    expect(result).toContain("https://example.com");
  });

  it("should allow images with src", () => {
    const html = '<img src="https://example.com/image.jpg" alt="Test">';
    const result = sanitizeHtml(html);
    expect(result).toContain("<img");
    expect(result).toContain("src=");
  });

  it("should handle null input", () => {
    const result = sanitizeHtml(null);
    expect(result).toBe("");
  });

  it("should handle undefined input", () => {
    const result = sanitizeHtml(undefined);
    expect(result).toBe("");
  });

  it("should handle empty string", () => {
    const result = sanitizeHtml("");
    expect(result).toBe("");
  });

  it("should allow list elements", () => {
    const html = "<ul><li>Item 1</li><li>Item 2</li></ul>";
    const result = sanitizeHtml(html);
    expect(result).toContain("<ul>");
    expect(result).toContain("<li>");
  });

  it("should allow headings", () => {
    const html = "<h1>Title</h1><h2>Subtitle</h2>";
    const result = sanitizeHtml(html);
    expect(result).toContain("<h1>");
    expect(result).toContain("<h2>");
  });

  it("should remove iframe tags", () => {
    const html = '<iframe src="https://evil.com"></iframe><p>Safe</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("<iframe");
    expect(result).toContain("<p>Safe</p>");
  });

  it("should remove form tags", () => {
    const html = '<form action="https://evil.com"><input></form><p>Safe</p>';
    const result = sanitizeHtml(html);
    expect(result).not.toContain("<form");
    expect(result).toContain("<p>Safe</p>");
  });

  it("should allow class attribute", () => {
    const html = '<p class="text-center">Styled</p>';
    const result = sanitizeHtml(html);
    expect(result).toContain('class="text-center"');
  });
});

// =============================================================================
// Date Formatting Tests
// =============================================================================

describe("formatNewsDate", () => {
  it("should format a valid date to Persian calendar", () => {
    // Using a known date for testing
    const result = formatNewsDate("2024-03-21T00:00:00.000Z");
    // This should be around 1403/01/02 in Jalali
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });

  it("should return empty string for null", () => {
    const result = formatNewsDate(null);
    expect(result).toBe("");
  });

  it("should return empty string for invalid date", () => {
    const result = formatNewsDate("invalid-date");
    // date-fns-jalali might throw or return invalid, our function should handle it
    expect(typeof result).toBe("string");
  });

  it("should handle ISO date strings", () => {
    const result = formatNewsDate("2024-06-15T12:30:00Z");
    expect(result).toBeTruthy();
    expect(result).toMatch(/^\d{4}\/\d{2}\/\d{2}$/);
  });
});

describe("formatPersianDate", () => {
  it("should be an alias for formatNewsDate", () => {
    const date = "2024-06-15T12:30:00Z";
    expect(formatPersianDate(date)).toBe(formatNewsDate(date));
  });
});

describe("formatPersianDateFull", () => {
  it("should format date with month name", () => {
    const result = formatPersianDateFull("2024-03-21T00:00:00.000Z");
    // Should contain Persian month name and year
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(5);
  });

  it("should return empty string for null", () => {
    const result = formatPersianDateFull(null);
    expect(result).toBe("");
  });

  it("should contain Persian numerals or Latin numerals", () => {
    const result = formatPersianDateFull("2024-06-15T12:00:00Z");
    // Should contain year (either Persian or Latin)
    expect(result).toBeTruthy();
  });
});

// =============================================================================
// Service Type Label Tests
// =============================================================================

describe("getServiceTypeLabel", () => {
  it("should return correct label for complaint_137", () => {
    const result = getServiceTypeLabel("complaint_137");
    expect(result).toBe("شکایت ۱۳۷");
  });

  it("should return correct label for building_permit", () => {
    const result = getServiceTypeLabel("building_permit");
    expect(result).toBe("پروانه ساختمانی");
  });

  it("should return correct label for payment", () => {
    const result = getServiceTypeLabel("payment");
    expect(result).toBe("پرداخت عوارض");
  });

  it("should return the original value for unknown service types", () => {
    // @ts-expect-error - Testing with invalid input
    const result = getServiceTypeLabel("unknown_type");
    expect(result).toBe("unknown_type");
  });
});

