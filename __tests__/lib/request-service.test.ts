import { describe, it, expect, vi } from "vitest";
import { generateTrackingCode } from "@/lib/request-service";
import type { ServiceType } from "@/lib/types";

// =============================================================================
// generateTrackingCode Tests
// =============================================================================

describe("generateTrackingCode", () => {
  it("should generate code with REQ- prefix", () => {
    const code = generateTrackingCode("complaint_137");
    expect(code.startsWith("REQ-")).toBe(true);
  });

  it("should include 137 short code for complaint_137", () => {
    const code = generateTrackingCode("complaint_137");
    expect(code).toContain("137");
    expect(code.startsWith("REQ-137-")).toBe(true);
  });

  it("should include BLD short code for building_permit", () => {
    const code = generateTrackingCode("building_permit");
    expect(code).toContain("BLD");
    expect(code.startsWith("REQ-BLD-")).toBe(true);
  });

  it("should include PAY short code for payment", () => {
    const code = generateTrackingCode("payment");
    expect(code).toContain("PAY");
    expect(code.startsWith("REQ-PAY-")).toBe(true);
  });

  it("should have expected format: REQ-{SHORT}-{TIMESTAMP}-{RANDOM}", () => {
    const code = generateTrackingCode("complaint_137");
    const parts = code.split("-");
    
    expect(parts.length).toBe(4);
    expect(parts[0]).toBe("REQ");
    expect(parts[1]).toBe("137");
    // Timestamp is base36 encoded
    expect(parts[2].length).toBeGreaterThan(0);
    // Random suffix is 4 characters
    expect(parts[3].length).toBe(4);
  });

  it("should generate unique codes", () => {
    const codes = new Set<string>();
    const iterations = 100;

    for (let i = 0; i < iterations; i++) {
      codes.add(generateTrackingCode("complaint_137"));
    }

    // All codes should be unique
    expect(codes.size).toBe(iterations);
  });

  it("should only use allowed characters in random suffix", () => {
    // Run multiple times to increase confidence
    for (let i = 0; i < 50; i++) {
      const code = generateTrackingCode("complaint_137");
      const randomSuffix = code.split("-")[3];
      
      // Should only contain uppercase letters and digits (excluding confusing chars)
      expect(randomSuffix).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]{4}$/);
    }
  });

  it("should be all uppercase", () => {
    const code = generateTrackingCode("building_permit");
    expect(code).toBe(code.toUpperCase());
  });

  it("should be a reasonable length", () => {
    const code = generateTrackingCode("payment");
    // REQ-XXX-TIMESTAMP-XXXX should be around 20-25 characters
    expect(code.length).toBeGreaterThan(15);
    expect(code.length).toBeLessThan(30);
  });

  it("should handle rapid successive calls", () => {
    // Generate codes in quick succession
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(generateTrackingCode("complaint_137"));
    }

    // All should be unique even when called rapidly
    const uniqueCodes = new Set(codes);
    expect(uniqueCodes.size).toBe(10);
  });
});

// =============================================================================
// Tracking Code Format Validation Tests
// =============================================================================

describe("tracking code format validation", () => {
  it("should have random suffix without confusing characters", () => {
    const code = generateTrackingCode("complaint_137");
    
    // Only the random suffix (last part) should not contain confusing characters
    // Timestamp part (base36) can contain any alphanumeric character
    const randomSuffix = code.split("-")[3];
    expect(randomSuffix).not.toMatch(/[0OIL1]/);
  });

  it("should be consistent format across service types", () => {
    const types: ServiceType[] = ["complaint_137", "building_permit", "payment"];
    
    for (const type of types) {
      const code = generateTrackingCode(type);
      const parts = code.split("-");
      
      expect(parts.length).toBe(4);
      expect(parts[0]).toBe("REQ");
      expect(["137", "BLD", "PAY"]).toContain(parts[1]);
    }
  });
});

