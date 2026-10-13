/**
 * SpendPilot AI - GitHub Repository AI FinOps & Dependency Scanner
 * Analyzes public GitHub repositories to detect AI SDKs, vector databases,
 * IDE tooling configurations, and model references to project infrastructure costs.
 */

// Popular demo repositories for instant testing
export const DEMO_REPOSITORIES = [
  {
    name: "vercel/ai-chatbot",
    label: "Next.js AI Chatbot",
    description: "OpenAI, Vercel AI SDK, and Anthropic multi-model router",
    url: "https://github.com/vercel/ai-chatbot",
    tag: "Next.js & LLM Router",
  },
  {
    name: "langchain-ai/rag-from-scratch",
    label: "LangChain RAG Pipeline",
    description: "Python LangChain, Pinecone, and vector embeddings",
    url: "https://github.com/langchain-ai/rag-from-scratch",
    tag: "Python RAG Stack",
  },
  {
    name: "shadcn-ui/ui",
    label: "Modern Engineering Stack",
    description: "Cursor & GitHub Copilot developer workspace",
    url: "https://github.com/shadcn-ui/ui",
    tag: "Dev Tooling & Copilot",
  },
];

/**
 * Extracts { owner, repo } from various GitHub URL formats
 */
export function parseGitHubUrl(input) {
  if (!input || typeof input !== "string") return null;
  const cleaned = input.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  
  // Match github.com/owner/repo or just owner/repo
  const match = cleaned.match(/(?:github\.com\/)?([^/\s]+)\/([^/\s#?]+)/i);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/i, ""),
  };
}

/**
 * Known AI libraries, IDE configurations, and their pricing heuristics
 */
const AI_CATALOG = {
  // JavaScript / TypeScript SDKs
  openai: {
    tool: "OpenAI API",
    category: "LLM API",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "coding",
    tip: "OpenAI Node SDK detected. Monitor token streaming to avoid unmetered cost spikes.",
  },
  "@anthropic-ai/sdk": {
    tool: "Anthropic API",
    category: "LLM API",
    defaultPlan: "Starter",
    planCost: 40,
    useCase: "research",
    tip: "Anthropic Claude SDK detected. Use prompt caching to save up to 90% on repeated system prompts.",
  },
  "@google/genai": {
    tool: "Gemini",
    category: "LLM API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Gemini SDK detected. Gemini 1.5 Flash offers near-free tokens for high-throughput calls.",
  },
  "@google/generative-ai": {
    tool: "Gemini",
    category: "LLM API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Gemini SDK detected.",
  },
  ai: {
    tool: "OpenAI API",
    category: "AI Gateway",
    defaultPlan: "Growth",
    planCost: 200,
    useCase: "coding",
    tip: "Vercel AI SDK detected. Multi-provider gateway simplifies provider right-sizing.",
  },
  langchain: {
    tool: "OpenAI API",
    category: "Agent Framework",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "mixed",
    tip: "LangChain detected. Check chain iterations to prevent multi-hop token runaway.",
  },
  "@langchain/core": {
    tool: "OpenAI API",
    category: "Agent Framework",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "mixed",
  },
  llamaindex: {
    tool: "OpenAI API",
    category: "RAG Framework",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "research",
    tip: "LlamaIndex detected. Cache embedding lookups to reduce embedding API costs.",
  },
  "@pinecone-database/pinecone": {
    tool: "OpenAI API",
    category: "Vector Database",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "development",
    tip: "Pinecone Vector DB in use. Check index pod provisioning vs serverless tier.",
  },

  // Python Libraries
  "openai-python": {
    tool: "OpenAI API",
    category: "LLM API",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "coding",
    tip: "OpenAI Python library detected.",
  },
  "anthropic-python": {
    tool: "Anthropic API",
    category: "LLM API",
    defaultPlan: "Starter",
    planCost: 40,
    useCase: "research",
    tip: "Anthropic Python SDK detected.",
  },
  "google-generativeai": {
    tool: "Gemini",
    category: "LLM API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Gemini Python SDK detected.",
  },
  "llama-index": {
    tool: "OpenAI API",
    category: "RAG Framework",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "research",
    tip: "LlamaIndex detected. Vector index queries compound with team scale.",
  },
};

/**
 * Scans dependencies and text contents for AI technology footprints
 */
export function analyzeRepositoryArtifacts({
  packageJson,
  requirementsTxt,
  cursorRules,
  envExample,
  repoMetadata = {},
}) {
  const detectedTools = new Map();
  const insights = [];
  const modelWarnings = [];

  // 1. Analyze package.json
  if (packageJson) {
    const allDeps = {
      ...(packageJson.dependencies || {}),
      ...(packageJson.devDependencies || {}),
    };

    Object.keys(allDeps).forEach((dep) => {
      const lower = dep.toLowerCase();
      if (AI_CATALOG[lower]) {
        const item = AI_CATALOG[lower];
        if (!detectedTools.has(item.tool)) {
          detectedTools.set(item.tool, {
            ...item,
            evidence: `npm package: "${dep}" (${allDeps[dep]})`,
          });
          if (item.tip) insights.push(item.tip);
        }
      }
    });
  }

  // 2. Analyze requirements.txt
  if (requirementsTxt && typeof requirementsTxt === "string") {
    const lines = requirementsTxt.split("\n");
    lines.forEach((line) => {
      const cleanLine = line.trim().toLowerCase().split(/[=><~]/)[0].trim();
      if (!cleanLine) return;

      if (cleanLine === "openai") {
        detectedTools.set("OpenAI API", {
          tool: "OpenAI API",
          category: "LLM API",
          defaultPlan: "Starter",
          planCost: 50,
          useCase: "coding",
          evidence: "Python requirement: 'openai'",
        });
      } else if (cleanLine === "anthropic") {
        detectedTools.set("Anthropic API", {
          tool: "Anthropic API",
          category: "LLM API",
          defaultPlan: "Starter",
          planCost: 40,
          useCase: "research",
          evidence: "Python requirement: 'anthropic'",
        });
      } else if (cleanLine.includes("langchain")) {
        if (!detectedTools.has("OpenAI API")) {
          detectedTools.set("OpenAI API", {
            tool: "OpenAI API",
            category: "Agent Framework",
            defaultPlan: "Starter",
            planCost: 50,
            useCase: "coding",
            evidence: "Python requirement: 'langchain'",
          });
        }
        insights.push("LangChain Python detected. Inspect agent loops for high token churn.");
      } else if (cleanLine.includes("llama-index") || cleanLine.includes("llamaindex")) {
        insights.push("LlamaIndex detected. Optimize vector chunk sizes to lower ingestion cost.");
      } else if (cleanLine.includes("pinecone")) {
        insights.push("Pinecone Vector DB detected. Verify index auto-scaling limits.");
      }
    });
  }

  // 3. Analyze .cursorrules or IDE configurations
  if (cursorRules || (packageJson && JSON.stringify(packageJson).includes("cursor"))) {
    detectedTools.set("Cursor", {
      tool: "Cursor",
      category: "Coding Assistant",
      defaultPlan: "Pro",
      planCost: 20,
      useCase: "coding",
      evidence: ".cursorrules project configuration detected",
    });
    insights.push("Cursor AI configuration found (.cursorrules). Team members benefit from pooled seat licenses.");
  }

  // 4. Scan .env.example or package.json for model hints
  const envText = (envExample || "") + " " + (packageJson ? JSON.stringify(packageJson) : "") + " " + (requirementsTxt || "");
  if (/gpt-4(?![o\-])/i.test(envText)) {
    modelWarnings.push({
      model: "GPT-4 (Legacy)",
      warning: "Legacy GPT-4 detected. Upgrading to GPT-4o provides 66% lower input cost and 12x higher token throughput.",
      severity: "high",
    });
  }
  if (/gpt-3\.5-turbo/i.test(envText)) {
    modelWarnings.push({
      model: "GPT-3.5 Turbo",
      warning: "GPT-3.5 Turbo found. Migrating to GPT-4o-mini offers higher intelligence at $0.15/1M input tokens (~60% cheaper).",
      severity: "medium",
    });
  }
  if (/claude-3-opus/i.test(envText)) {
    modelWarnings.push({
      model: "Claude 3 Opus",
      warning: "Claude 3 Opus detected. Claude 3.5 Sonnet achieves superior benchmark scores at 80% lower pricing ($15 vs $75/1M output tokens).",
      severity: "high",
    });
  }

  // If both Cursor and Copilot are likely in modern dev stacks
  if (!detectedTools.has("Cursor") && !detectedTools.has("GitHub Copilot")) {
    // Default engineering baseline based on stars / size
    detectedTools.set("GitHub Copilot", {
      tool: "GitHub Copilot",
      category: "Coding Assistant",
      defaultPlan: "Business",
      planCost: 19,
      useCase: "coding",
      evidence: "Recommended baseline for active development teams",
    });
  }

  // Contributor estimate (heuristics: based on forks, stars, or baseline)
  const contributorsCount = repoMetadata.contributorsCount || 
    (repoMetadata.stargazers_count > 500 ? 8 : repoMetadata.stargazers_count > 50 ? 4 : 2);

  // Convert detected tools into SpendPilot audit format
  const prefilledTools = Array.from(detectedTools.values()).map((tool, index) => ({
    id: index + 1,
    tool: tool.tool,
    plan: tool.defaultPlan,
    monthlyCost: tool.planCost,
    seats: contributorsCount,
    useCase: tool.useCase || "coding",
    evidence: tool.evidence,
  }));

  const totalMonthlySpend = prefilledTools.reduce((acc, t) => acc + (t.monthlyCost * t.seats), 0);
  // Average projected savings from plan right-sizing and model migration (~25-35%)
  const estimatedSavings = Math.round(totalMonthlySpend * 0.32);

  return {
    detectedTools: Array.from(detectedTools.values()),
    prefilledTools,
    insights,
    modelWarnings,
    estimatedSeats: contributorsCount,
    totalMonthlySpend,
    estimatedSavings,
    annualSavings: estimatedSavings * 12,
  };
}

/**
 * Main function: Scans a GitHub repository URL
 */
export async function scanGitHubRepository(repoUrl) {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub repository URL. Please provide a format like 'owner/repo' or 'https://github.com/owner/repo'.");
  }

  const { owner, repo } = parsed;

  // 1. Fetch Repository Metadata (best effort, graceful fallback if rate-limited)
  let repoMetadata = { owner, repo, stargazers_count: 0, default_branch: "main" };
  try {
    const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });
    if (metaRes.ok) {
      const data = await metaRes.json();
      repoMetadata = {
        owner,
        repo,
        description: data.description,
        stargazers_count: data.stargazers_count || 0,
        forks_count: data.forks_count || 0,
        language: data.language || "JavaScript",
        default_branch: data.default_branch || "main",
        updated_at: data.updated_at,
        html_url: data.html_url,
      };
    }
  } catch (err) {
    // Non-fatal if GitHub API is blocked or offline
    console.warn("GitHub API metadata lookup skipped:", err);
  }

  // 2. Fetch File Manifests via raw.githubusercontent.com (No API rate limits)
  const fetchRawFile = async (path) => {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/${path}`);
      if (res.ok) {
        return await res.text();
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const [packageJsonRaw, requirementsTxt, cursorRules, envExample] = await Promise.all([
    fetchRawFile("package.json"),
    fetchRawFile("requirements.txt"),
    fetchRawFile(".cursorrules"),
    fetchRawFile(".env.example"),
  ]);

  let packageJson = null;
  if (packageJsonRaw) {
    try {
      packageJson = JSON.parse(packageJsonRaw);
    } catch (e) {
      console.warn("Failed to parse package.json JSON:", e);
    }
  }

  // 3. Analyze artifacts
  const analysis = analyzeRepositoryArtifacts({
    packageJson,
    requirementsTxt,
    cursorRules,
    envExample,
    repoMetadata,
  });

  return {
    repository: repoMetadata,
    rawFilesFound: {
      hasPackageJson: !!packageJson,
      hasRequirementsTxt: !!requirementsTxt,
      hasCursorRules: !!cursorRules,
      hasEnvExample: !!envExample,
    },
    ...analysis,
  };
}
