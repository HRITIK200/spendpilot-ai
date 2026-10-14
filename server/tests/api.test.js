import { describe, it } from "node:test";
import assert from "node:assert";
import { reportSchema, leadSchema } from "../middleware/schemas.js";

describe("Server Schemas and Validation", () => {
  describe("reportSchema", () => {
    it("validates a standard audit payload", () => {
      const validPayload = {
        tools: [
          {
            tool: "Cursor",
            plan: "Pro",
            seats: 5,
            useCase: "coding",
            monthlyCost: 20,
          },
          {
            tool: "OpenAI API",
            plan: "Starter",
            seats: 1,
            useCase: "development",
            monthlyCost: 50,
          },
        ],
      };

      const result = reportSchema.safeParse(validPayload);
      assert.strictEqual(result.success, true);
    });

    it("rejects payload missing tools array", () => {
      const invalidPayload = {
        company: "Acme Tech",
      };

      const result = reportSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
    });

    it("rejects an unsupported tool name", () => {
      const invalidPayload = {
        tools: [
          {
            tool: "UnsupportedToolXYZ",
            plan: "Pro",
            seats: 2,
            useCase: "coding",
            monthlyCost: 20,
          },
        ],
      };

      const result = reportSchema.safeParse(invalidPayload);
      assert.strictEqual(result.success, false);
    });
  });

  describe("leadSchema", () => {
    it("validates a proper lead email address", () => {
      const leadPayload = {
        email: "alex@engineering.com",
        company: "Acme",
      };

      const result = leadSchema.safeParse(leadPayload);
      assert.strictEqual(result.success, true);
    });

    it("rejects an invalid email address", () => {
      const invalidLead = {
        email: "notanemail",
        company: "Acme",
      };

      const result = leadSchema.safeParse(invalidLead);
      assert.strictEqual(result.success, false);
    });
  });
});
