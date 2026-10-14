import { describe, it, expect } from "vitest";
import { parseGitHubUrl, analyzeRepositoryArtifacts } from "./repoScanner";

describe("repoScanner utility", () => {
  describe("parseGitHubUrl", () => {
    it("parses full https url", () => {
      const res = parseGitHubUrl("https://github.com/vercel/ai-chatbot");
      expect(res).toEqual({ owner: "vercel", repo: "ai-chatbot" });
    });

    it("parses url with trailing slash and git extension", () => {
      const res = parseGitHubUrl("https://github.com/langchain-ai/langchain.git/");
      expect(res).toEqual({ owner: "langchain-ai", repo: "langchain" });
    });

    it("parses shorthand owner/repo", () => {
      const res = parseGitHubUrl("hwchase17/langchain");
      expect(res).toEqual({ owner: "hwchase17", repo: "langchain" });
    });

    it("returns null for invalid inputs", () => {
      expect(parseGitHubUrl("")).toBeNull();
      expect(parseGitHubUrl("justastring")).toBeNull();
      expect(parseGitHubUrl(null)).toBeNull();
    });
  });

  describe("analyzeRepositoryArtifacts", () => {
    it("detects OpenAI SDK from package.json accurately", () => {
      const packageJson = {
        dependencies: {
          openai: "^4.20.0",
          react: "^18.0.0",
        },
      };

      const result = analyzeRepositoryArtifacts({
        packageJson,
        repoMetadata: { stargazers_count: 100 },
      });

      const openAiTool = result.detectedTools.find((t) => t.tool === "OpenAI API");
      expect(openAiTool).toBeDefined();
      expect(openAiTool.category).toBe("API");
      expect(openAiTool.planCost).toBe(50);
      expect(result.prefilledTools.length).toBe(1);
      expect(result.totalMonthlySpend).toBeGreaterThan(0);
      // Does not falsely inject GitHub Copilot
      expect(result.detectedTools.some((t) => t.tool === "GitHub Copilot")).toBe(false);
    });

    it("detects Anthropic and Python requirements", () => {
      const requirementsTxt = `
        anthropic==0.25.0
        fastapi>=0.100.0
      `;

      const result = analyzeRepositoryArtifacts({
        requirementsTxt,
        repoMetadata: { stargazers_count: 50 },
      });

      const anthropicTool = result.detectedTools.find((t) => t.tool === "Anthropic API");
      expect(anthropicTool).toBeDefined();
      expect(anthropicTool.planCost).toBe(40);
    });

    it("detects Open-Source frameworks separately without inflating SaaS seats", () => {
      const requirementsTxt = `
        langchain>=0.1.0
        chromadb==0.4.22
      `;

      const result = analyzeRepositoryArtifacts({
        requirementsTxt,
        repoMetadata: { stargazers_count: 200 },
      });

      // Open source frameworks should be detected
      const langchainFw = result.detectedFrameworks.find((f) => f.name === "LangChain");
      const chromaFw = result.detectedFrameworks.find((f) => f.name === "ChromaDB");
      expect(langchainFw).toBeDefined();
      expect(chromaFw).toBeDefined();

      // But should NOT be billed as $50/mo SaaS subscriptions!
      expect(result.detectedTools.length).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.estimatedSavings).toBe(0);
    });

    it("accurately reports zero AI tools for a standard non-AI repository", () => {
      const packageJson = {
        dependencies: {
          react: "^18.2.0",
          "react-dom": "^18.2.0",
          tailwindcss: "^3.3.0",
        },
      };

      const result = analyzeRepositoryArtifacts({
        packageJson,
        repoMetadata: { stargazers_count: 500 },
      });

      expect(result.detectedTools.length).toBe(0);
      expect(result.detectedFrameworks.length).toBe(0);
      expect(result.prefilledTools.length).toBe(0);
      expect(result.totalMonthlySpend).toBe(0);
      expect(result.estimatedSavings).toBe(0);
      expect(result.optimizationScore).toBe(100);
    });

    it("detects Cursor configuration from .cursorrules", () => {
      const result = analyzeRepositoryArtifacts({
        cursorRules: "// Cursor rules",
        repoMetadata: { stargazers_count: 50 },
      });

      const cursorTool = result.detectedTools.find((t) => t.tool === "Cursor");
      expect(cursorTool).toBeDefined();
      expect(cursorTool.planCost).toBe(20);
    });

    it("detects model deprecation warning and adds migration savings for legacy gpt-4", () => {
      const envExample = "OPENAI_MODEL=gpt-4\nOPENAI_API_KEY=sk-xxxx";

      const result = analyzeRepositoryArtifacts({
        envExample,
        repoMetadata: { stargazers_count: 10 },
      });

      const warning = result.modelWarnings.find((w) => w.model.includes("GPT-4"));
      expect(warning).toBeDefined();
      // Should have detected OpenAI API from env key
      expect(result.detectedTools.some((t) => t.tool === "OpenAI API")).toBe(true);
      // Migration savings should be applied
      expect(result.estimatedSavings).toBeGreaterThan(0);
    });
  });
});
