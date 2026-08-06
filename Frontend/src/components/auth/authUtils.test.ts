import { describe, expect, it } from "vitest";
import { roleConfig } from "./authUtils";

describe("auth role configuration", () => {
  it("exposes an admin role so the login screen can route to the admin portal", () => {
    expect(roleConfig.admin).toBeDefined();
    expect(roleConfig.admin.label).toBe("Admin");
  });
});
