import { z } from "zod";

const SUPPORTED_TOOLS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "OpenAI API",
  "Anthropic API",
  "Windsurf"
];

export const leadSchema = z.object({
  email: z.string({
    required_error: "Email is required"
  }).email({
    message: "Invalid email address format"
  }).trim(),
  
  company: z.string().trim().max(100, "Company name must not exceed 100 characters").optional()
});

export const toolItemSchema = z.object({
  tool: z.enum(SUPPORTED_TOOLS, {
    error_map: () => ({ message: "Must be a supported AI Tool" })
  }),
  
  plan: z.string({
    required_error: "Plan selection is required"
  }).min(1, "Plan cannot be empty"),
  
  seats: z.preprocess(
    (val) => Number(val),
    z.number({
      required_error: "Seats count is required"
    })
    .int("Seats must be a whole number")
    .min(1, "Seats must be at least 1")
  ),
  
  useCase: z.string({
    required_error: "Use case is required"
  }).min(1, "Use case cannot be empty"),
  
  monthlyCost: z.preprocess(
    (val) => Number(val),
    z.number({
      required_error: "Monthly cost is required"
    })
    .nonnegative("Monthly cost cannot be negative")
  )
});

export const reportSchema = z.object({
  tools: z.array(toolItemSchema)
    .min(1, "At least one tool configuration is required for audit")
});
