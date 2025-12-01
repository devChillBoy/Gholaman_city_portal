import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { User } from "@supabase/supabase-js";

// =============================================================================
// Mock environment variable before importing the module
// =============================================================================

// Store original env
const originalEnv = process.env.NEXT_PUBLIC_ADMIN_EMAILS;

describe("auth-roles", () => {
  beforeEach(() => {
    // Reset modules to pick up new env
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original env
    process.env.NEXT_PUBLIC_ADMIN_EMAILS = originalEnv;
    vi.resetModules();
  });

  // Helper to create mock user
  const createMockUser = (email: string): User =>
    ({
      id: "test-user-id",
      email,
      app_metadata: {},
      user_metadata: {},
      aud: "authenticated",
      created_at: new Date().toISOString(),
    }) as User;

  describe("getUserRole", () => {
    it("should return 'unknown' for null user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const result = getUserRole(null);
      expect(result).toBe("unknown");
    });

    it("should return 'admin' for admin email", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir,boss@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const user = createMockUser("admin@gholaman.ir");
      const result = getUserRole(user);
      expect(result).toBe("admin");
    });

    it("should return 'admin' for admin email (case insensitive)", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const user = createMockUser("ADMIN@GHOLAMAN.IR");
      const result = getUserRole(user);
      expect(result).toBe("admin");
    });

    it("should return 'employee' for non-admin authenticated user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const user = createMockUser("employee@gholaman.ir");
      const result = getUserRole(user);
      expect(result).toBe("employee");
    });

    it("should handle multiple admin emails", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir, boss@gholaman.ir, manager@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const admin1 = createMockUser("admin@gholaman.ir");
      const admin2 = createMockUser("boss@gholaman.ir");
      const admin3 = createMockUser("manager@gholaman.ir");
      const employee = createMockUser("staff@gholaman.ir");

      expect(getUserRole(admin1)).toBe("admin");
      expect(getUserRole(admin2)).toBe("admin");
      expect(getUserRole(admin3)).toBe("admin");
      expect(getUserRole(employee)).toBe("employee");
    });

    it("should handle empty admin list", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "";
      const { getUserRole } = await import("@/lib/auth-roles");

      const user = createMockUser("anyone@gholaman.ir");
      const result = getUserRole(user);
      expect(result).toBe("employee");
    });

    it("should handle user with no email", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { getUserRole } = await import("@/lib/auth-roles");

      const user = { ...createMockUser("test@test.com"), email: undefined } as User;
      const result = getUserRole(user);
      expect(result).toBe("employee");
    });
  });

  describe("isAdmin", () => {
    it("should return true for admin user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdmin } = await import("@/lib/auth-roles");

      const user = createMockUser("admin@gholaman.ir");
      expect(isAdmin(user)).toBe(true);
    });

    it("should return false for employee user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdmin } = await import("@/lib/auth-roles");

      const user = createMockUser("employee@gholaman.ir");
      expect(isAdmin(user)).toBe(false);
    });

    it("should return false for null user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdmin } = await import("@/lib/auth-roles");

      expect(isAdmin(null)).toBe(false);
    });
  });

  describe("isEmployee", () => {
    it("should return true for employee user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isEmployee } = await import("@/lib/auth-roles");

      const user = createMockUser("employee@gholaman.ir");
      expect(isEmployee(user)).toBe(true);
    });

    it("should return true for admin user (admins are also employees)", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isEmployee } = await import("@/lib/auth-roles");

      const user = createMockUser("admin@gholaman.ir");
      expect(isEmployee(user)).toBe(true);
    });

    it("should return false for null user", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isEmployee } = await import("@/lib/auth-roles");

      expect(isEmployee(null)).toBe(false);
    });
  });

  describe("isAdminEmail", () => {
    it("should return true for admin email string", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdminEmail } = await import("@/lib/auth-roles");

      expect(isAdminEmail("admin@gholaman.ir")).toBe(true);
    });

    it("should return false for non-admin email string", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdminEmail } = await import("@/lib/auth-roles");

      expect(isAdminEmail("employee@gholaman.ir")).toBe(false);
    });

    it("should return false for undefined email", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdminEmail } = await import("@/lib/auth-roles");

      expect(isAdminEmail(undefined)).toBe(false);
    });

    it("should handle case insensitivity", async () => {
      process.env.NEXT_PUBLIC_ADMIN_EMAILS = "admin@gholaman.ir";
      const { isAdminEmail } = await import("@/lib/auth-roles");

      expect(isAdminEmail("ADMIN@GHOLAMAN.IR")).toBe(true);
      expect(isAdminEmail("Admin@Gholaman.IR")).toBe(true);
    });
  });
});

