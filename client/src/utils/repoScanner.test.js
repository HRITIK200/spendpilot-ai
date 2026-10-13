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
    it("detects OpenAI SDK from package.json", () => {
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
      expect(result.prefilledTools.length).toBeGreaterThan(0);
      expect(result.totalMonthlySpend).toBeGreaterThan(0);
      expect(result.estimatedSavings).toBeGreaterThan(0);
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
    });

    it("detects model deprecation warning for gpt-4 in env example", () => {
      const envExample = "OPENAI_MODEL=gpt-4\nOPENAI_API_KEY=sk-xxxx";

      const result = analyzeRepositoryArtifacts({
        envExample,
        repoMetadata: { stargazers_count: 10 },
      });

      const warning = result.modelWarnings.find((w) => w.model.includes("GPT-4"));
      expect(warning).toBeDefined();
    });
  });
});
