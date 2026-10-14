/**
 * SpendPilot AI - GitHub Repository AI FinOps & Dependency Scanner
 * Analyzes public GitHub repositories to detect AI SDKs, vector databases,
 * IDE tooling configurations, and model references to project infrastructure costs.
 */

import { generateAudit } from "./auditEngine";

// Popular demo repositories for instant testing
export const DEMO_REPOSITORIES = [
  {
    name: "vercel/ai-chatbot",
    label: "Next.js AI Chatbot",
    description: "Vercel AI SDK, Next.js, and multi-model AI routing",
    url: "https://github.com/vercel/ai-chatbot",
    tag: "Next.js & LLM Router",
  },
  {
    name: "langchain-ai/rag-from-scratch",
    label: "LangChain RAG Pipeline",
    description: "Python LangChain, ChromaDB, and OpenAI embeddings",
    url: "https://github.com/langchain-ai/rag-from-scratch",
    tag: "Python RAG Stack",
  },
  {
    name: "shadcn-ui/ui",
    label: "Standard Web App (Zero AI)",
    description: "Frontend UI library with 0 AI dependencies (tests clean non-AI repos)",
    url: "https://github.com/shadcn-ui/ui",
    tag: "Non-AI Control Repo",
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
 * Commercial billable AI tools mapped to SpendPilot's certified toolData catalog
 */
const BILLABLE_AI_TOOLS = {
  // OpenAI API
  "openai": {
    tool: "OpenAI API",
    category: "API",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "development",
    tip: "OpenAI SDK detected. Implement response streaming and prompt caching to reduce token spikes.",
  },
  "openai-python": {
    tool: "OpenAI API",
    category: "API",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "development",
    tip: "OpenAI Python library detected. Check batching configurations for batch embeddings.",
  },
  "tiktoken": {
    tool: "OpenAI API",
    category: "API",
    defaultPlan: "Starter",
    planCost: 50,
    useCase: "development",
    tip: "TikToken tokenizer detected (OpenAI token metering).",
  },

  // Anthropic Claude API
  "@anthropic-ai/sdk": {
    tool: "Anthropic API",
    category: "API",
    defaultPlan: "Starter",
    planCost: 40,
    useCase: "development",
    tip: "Anthropic Claude SDK detected. Use prompt caching to save up to 90% on repeated system prompts.",
  },
  "anthropic": {
    tool: "Anthropic API",
    category: "API",
    defaultPlan: "Starter",
    planCost: 40,
    useCase: "development",
    tip: "Anthropic Python library detected. Leverage Claude 3.5 Sonnet for optimal cost-performance.",
  },

  // Google Gemini API
  "@google/genai": {
    tool: "Gemini",
    category: "API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Gemini SDK detected. Gemini 1.5 Flash offers near-free tokens for high-throughput calls.",
  },
  "@google/generative-ai": {
    tool: "Gemini",
    category: "API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Generative AI SDK detected.",
  },
  "google-generativeai": {
    tool: "Gemini",
    category: "API",
    defaultPlan: "API",
    planCost: 50,
    useCase: "development",
    tip: "Google Gemini Python SDK detected.",
  },

  // Developer Coding Assistants
  "cursor": {
    tool: "Cursor",
    category: "Coding Assistant",
    defaultPlan: "Pro",
    planCost: 20,
    useCase: "coding",
    tip: "Cursor AI editor configuration detected. Team pooled seats prevent idle license waste.",
  },
  "github-copilot": {
    tool: "GitHub Copilot",
    category: "Coding Assistant",
    defaultPlan: "Business",
    planCost: 19,
    useCase: "coding",
    tip: "GitHub Copilot detected. Monitor active monthly seats vs dormant seats.",
  },
  "windsurf": {
    tool: "Windsurf",
    category: "Coding Assistant",
    defaultPlan: "Pro",
    planCost: 15,
    useCase: "coding",
    tip: "Windsurf (Codeium) detected. Ensure team license right-sizing.",
  },
};

/**
 * Open-source AI frameworks, vector databases, and runtimes
 * Tracked as Architecture & Stack elements, NOT billed as false SaaS seats.
 */
const FRAMEWORKS_AND_INFRA = [
  {
    id: "langchain",
    name: "LangChain",
    category: "LLM Orchestration Framework",
    license: "Open-Source (Free)",
    patterns: [/^@?langchain/i, /^langchain-/i, /langchain_core/i, /langchain_community/i],
    tip: "LangChain detected. Check chain iterations and agent loops to prevent multi-hop token runaway.",
  },
  {
    id: "llamaindex",
    name: "LlamaIndex",
    category: "RAG & Data Indexing",
    license: "Open-Source (Free)",
    patterns: [/^llamaindex/i, /^llama-index/i, /llama_index/i],
    tip: "LlamaIndex detected. Cache embedding lookups to lower repeated vector ingestion costs.",
  },
  {
    id: "vercel-ai-sdk",
    name: "Vercel AI SDK",
    category: "AI Streaming Gateway",
    license: "Open-Source (Free)",
    patterns: [/^ai$/i, /^@ai-sdk\//i],
    tip: "Vercel AI SDK detected. Multi-provider router enables instant provider switching.",
  },
  {
    id: "pinecone",
    name: "Pinecone",
    category: "Managed Vector Database",
    license: "Cloud Usage-Based",
    patterns: [/pinecone/i],
    tip: "Pinecone Vector DB detected. Compare index pod provisioning against serverless pricing.",
  },
  {
    id: "chromadb",
    name: "ChromaDB",
    category: "Vector Database (Embedded)",
    license: "Open-Source (Self-Hosted)",
    patterns: [/chromadb/i, /^@chroma-core/i],
    tip: "ChromaDB detected. Self-hosted/embedded vector store runs with zero monthly SaaS seat charges.",
  },
  {
    id: "qdrant",
    name: "Qdrant",
    category: "Vector Search Engine",
    license: "Open-Source / Cloud",
    patterns: [/qdrant/i],
    tip: "Qdrant vector engine detected.",
  },
  {
    id: "weaviate",
    name: "Weaviate",
    category: "Vector Database",
    license: "Open-Source / Cloud",
    patterns: [/weaviate/i],
    tip: "Weaviate vector database detected.",
  },
  {
    id: "huggingface",
    name: "Hugging Face / Transformers",
    category: "Model Hub & Inference",
    license: "Open-Source",
    patterns: [/transformers/i, /@huggingface\/inference/i],
    tip: "Hugging Face detected. Evaluate local model quantization against paid hosted API endpoints.",
  },
  {
    id: "ollama",
    name: "Ollama",
    category: "Local LLM Runtime",
    license: "Self-Hosted (Free)",
    patterns: [/ollama/i],
    tip: "Ollama detected. Zero API token cost by utilizing workstation GPU resources.",
  },
  {
    id: "groq",
    name: "Groq LPU",
    category: "Inference Acceleration",
    license: "Cloud Usage-Based",
    patterns: [/groq/i],
    tip: "Groq inference engine detected. Fast token-per-second throughput at competitive token costs.",
  },
];

/**
 * Scans dependencies and text contents for AI technology footprints
 */
export function analyzeRepositoryArtifacts({
  packageJsons = [],
  requirementsTxts = [],
  pyprojectTomls = [],
  ideConfigs = {},
  envExamples = [],
  notebooks = [],
  readmeText = "",
  repoMetadata = {},
  // Legacy single file params for backward compatibility
  packageJson = null,
  requirementsTxt = null,
  cursorRules = null,
  envExample = null,
}) {
  const detectedTools = new Map();
  const detectedFrameworks = new Map();
  const insights = [];
  const modelWarnings = [];

  // Normalize inputs
  const allPackageJsons = [...packageJsons];
  if (packageJson && !allPackageJsons.includes(packageJson)) {
    allPackageJsons.push(packageJson);
  }

  const allReqTexts = [...requirementsTxts];
  if (requirementsTxt && typeof requirementsTxt === "string") {
    allReqTexts.push(requirementsTxt);
  }

  const allEnvs = [...envExamples];
  if (envExample && typeof envExample === "string") {
    allEnvs.push(envExample);
  }

  // 1. Analyze package.json files
  allPackageJsons.forEach((pkg, pkgIdx) => {
    if (!pkg) return;
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
    };

    Object.keys(allDeps).forEach((dep) => {
      const lower = dep.toLowerCase();
      const version = allDeps[dep];

      // Check Billable Tools
      if (BILLABLE_AI_TOOLS[lower]) {
        const item = BILLABLE_AI_TOOLS[lower];
        if (!detectedTools.has(item.tool)) {
          detectedTools.set(item.tool, {
            ...item,
            evidence: `npm package: "${dep}" (${version})`,
          });
          if (item.tip) insights.push(item.tip);
        }
      }

      // Check Open-Source Frameworks & Vector DBs
      FRAMEWORKS_AND_INFRA.forEach((fw) => {
        if (fw.patterns.some((pattern) => pattern.test(lower))) {
          if (!detectedFrameworks.has(fw.id)) {
            detectedFrameworks.set(fw.id, {
              id: fw.id,
              name: fw.name,
              category: fw.category,
              license: fw.license,
              evidence: `npm package: "${dep}" (${version})`,
            });
            if (fw.tip && !insights.includes(fw.tip)) {
              insights.push(fw.tip);
            }
          }
        }
      });
    });
  });

  // 2. Analyze Python requirements and pyproject.toml
  const parsePythonDepLine = (line) => {
    const cleanLine = line.trim().toLowerCase().split(/[=><~#;]/)[0].trim();
    if (!cleanLine) return;

    if (cleanLine === "openai") {
      if (!detectedTools.has("OpenAI API")) {
        detectedTools.set("OpenAI API", {
          tool: "OpenAI API",
          category: "API",
          defaultPlan: "Starter",
          planCost: 50,
          useCase: "development",
          evidence: "Python requirement: 'openai'",
        });
        insights.push("OpenAI Python SDK detected. Monitor token streaming to avoid unmetered cost spikes.");
      }
    } else if (cleanLine === "anthropic") {
      if (!detectedTools.has("Anthropic API")) {
        detectedTools.set("Anthropic API", {
          tool: "Anthropic API",
          category: "API",
          defaultPlan: "Starter",
          planCost: 40,
          useCase: "development",
          evidence: "Python requirement: 'anthropic'",
        });
        insights.push("Anthropic Python SDK detected.");
      }
    } else if (cleanLine === "google-generativeai" || cleanLine === "google-ai-generativelanguage") {
      if (!detectedTools.has("Gemini")) {
        detectedTools.set("Gemini", {
          tool: "Gemini",
          category: "API",
          defaultPlan: "API",
          planCost: 50,
          useCase: "development",
          evidence: `Python requirement: '${cleanLine}'`,
        });
      }
    }

    // Match Frameworks in Python
    FRAMEWORKS_AND_INFRA.forEach((fw) => {
      if (fw.patterns.some((p) => p.test(cleanLine))) {
        if (!detectedFrameworks.has(fw.id)) {
          detectedFrameworks.set(fw.id, {
            id: fw.id,
            name: fw.name,
            category: fw.category,
            license: fw.license,
            evidence: `Python requirement: '${cleanLine}'`,
          });
          if (fw.tip && !insights.includes(fw.tip)) {
            insights.push(fw.tip);
          }
        }
      }
    });
  };

  allReqTexts.forEach((reqText) => {
    if (typeof reqText === "string") {
      reqText.split("\n").forEach(parsePythonDepLine);
    }
  });

  pyprojectTomls.forEach((tomlText) => {
    if (typeof tomlText === "string") {
      tomlText.split("\n").forEach(parsePythonDepLine);
    }
  });

  // 3. Analyze Notebooks for %pip install or imports
  notebooks.forEach((nb) => {
    const text = typeof nb === "string" ? nb : JSON.stringify(nb);
    if (/openai/i.test(text) && !detectedTools.has("OpenAI API")) {
      detectedTools.set("OpenAI API", {
        tool: "OpenAI API",
        category: "API",
        defaultPlan: "Starter",
        planCost: 50,
        useCase: "development",
        evidence: "Jupyter Notebook code references 'openai'",
      });
    }
    if (/anthropic/i.test(text) && !detectedTools.has("Anthropic API")) {
      detectedTools.set("Anthropic API", {
        tool: "Anthropic API",
        category: "API",
        defaultPlan: "Starter",
        planCost: 40,
        useCase: "development",
        evidence: "Jupyter Notebook code references 'anthropic'",
      });
    }
    FRAMEWORKS_AND_INFRA.forEach((fw) => {
      if (!detectedFrameworks.has(fw.id) && fw.patterns.some((p) => p.test(text))) {
        detectedFrameworks.set(fw.id, {
          id: fw.id,
          name: fw.name,
          category: fw.category,
          license: fw.license,
          evidence: `Jupyter Notebook references '${fw.name}'`,
        });
      }
    });
  });

  // 4. Analyze IDE Configurations (Cursor, Copilot, Windsurf)
  const hasCursor =
    cursorRules ||
    ideConfigs.hasCursorRules ||
    ideConfigs.hasCursorDir ||
    (ideConfigs.vscodeExtensions && /cursor/i.test(ideConfigs.vscodeExtensions));

  if (hasCursor) {
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

  const hasCopilot =
    ideConfigs.hasCopilotInstructions ||
    (ideConfigs.vscodeExtensions && /github\.copilot/i.test(ideConfigs.vscodeExtensions));

  if (hasCopilot) {
    detectedTools.set("GitHub Copilot", {
      tool: "GitHub Copilot",
      category: "Coding Assistant",
      defaultPlan: "Business",
      planCost: 19,
      useCase: "coding",
      evidence: ".github/copilot-instructions.md or VS Code extension detected",
    });
    insights.push("GitHub Copilot configuration found. Monitor active dev seats vs dormant seats.");
  }

  const hasWindsurf =
    ideConfigs.hasWindsurfRules ||
    (ideConfigs.vscodeExtensions && /codeium/i.test(ideConfigs.vscodeExtensions));

  if (hasWindsurf) {
    detectedTools.set("Windsurf", {
      tool: "Windsurf",
      category: "Coding Assistant",
      defaultPlan: "Pro",
      planCost: 15,
      useCase: "coding",
      evidence: ".windsurfrules project configuration detected",
    });
  }

  // 5. Scan Env Examples & Configs for API keys and Model References
  const combinedEnvText = [
    ...allEnvs,
    allPackageJsons.map((p) => JSON.stringify(p)).join(" "),
    allReqTexts.join(" "),
    pyprojectTomls.join(" "),
  ].join("\n");

  // Detect API providers from env keys if not already detected from package
  if (/OPENAI_API_KEY/i.test(combinedEnvText) && !detectedTools.has("OpenAI API")) {
    detectedTools.set("OpenAI API", {
      tool: "OpenAI API",
      category: "API",
      defaultPlan: "Starter",
      planCost: 50,
      useCase: "development",
      evidence: "Environment configuration: 'OPENAI_API_KEY'",
    });
  }

  if (/(?:ANTHROPIC_API_KEY|CLAUDE_API_KEY)/i.test(combinedEnvText) && !detectedTools.has("Anthropic API")) {
    detectedTools.set("Anthropic API", {
      tool: "Anthropic API",
      category: "API",
      defaultPlan: "Starter",
      planCost: 40,
      useCase: "development",
      evidence: "Environment configuration: 'ANTHROPIC_API_KEY'",
    });
  }

  if (/(?:GEMINI_API_KEY|GOOGLE_API_KEY)/i.test(combinedEnvText) && !detectedTools.has("Gemini")) {
    detectedTools.set("Gemini", {
      tool: "Gemini",
      category: "API",
      defaultPlan: "API",
      planCost: 50,
      useCase: "development",
      evidence: "Environment configuration: 'GEMINI_API_KEY'",
    });
  }

  // 6. Scan for Model Version Inefficiencies / Migration Opportunities
  if (/gpt-4(?![o\-])/i.test(combinedEnvText)) {
    modelWarnings.push({
      model: "GPT-4 (Legacy)",
      warning: "Legacy GPT-4 detected. Upgrading to GPT-4o provides 66% lower input cost and 12x higher token throughput.",
      severity: "high",
    });
  }
  if (/gpt-3\.5-turbo/i.test(combinedEnvText)) {
    modelWarnings.push({
      model: "GPT-3.5 Turbo",
      warning: "GPT-3.5 Turbo found. Migrating to GPT-4o-mini offers higher intelligence at $0.15/1M input tokens (~60% cheaper).",
      severity: "medium",
    });
  }
  if (/claude-3-opus/i.test(combinedEnvText)) {
    modelWarnings.push({
      model: "Claude 3 Opus",
      warning: "Claude 3 Opus detected. Claude 3.5 Sonnet achieves superior benchmark scores at 80% lower pricing ($15 vs $75/1M output tokens).",
      severity: "high",
    });
  }
  if (/text-davinci|text-embedding-ada-002/i.test(combinedEnvText)) {
    modelWarnings.push({
      model: "Legacy Ada / DaVinci Embeddings",
      warning: "Ada-002 embeddings detected. text-embedding-3-small lowers vector ingestion billing by 5x with improved retrieval accuracy.",
      severity: "medium",
    });
  }

  // 7. Fallback to README analysis if no manifests were found
  if (detectedTools.size === 0 && detectedFrameworks.size === 0 && readmeText) {
    if (/langchain/i.test(readmeText)) {
      detectedFrameworks.set("langchain", {
        id: "langchain",
        name: "LangChain",
        category: "LLM Orchestration Framework",
        license: "Open-Source (Free)",
        evidence: "Repository documentation (README.md) details LangChain architecture",
      });
      insights.push("LangChain architecture documented in repository.");
    }
    if (/llamaindex|llama-index/i.test(readmeText)) {
      detectedFrameworks.set("llamaindex", {
        id: "llamaindex",
        name: "LlamaIndex",
        category: "RAG & Data Indexing",
        license: "Open-Source (Free)",
        evidence: "Repository documentation (README.md) details LlamaIndex architecture",
      });
    }
    if (/chromadb|chroma/i.test(readmeText)) {
      detectedFrameworks.set("chromadb", {
        id: "chromadb",
        name: "ChromaDB",
        category: "Vector Database (Embedded)",
        license: "Open-Source (Self-Hosted)",
        evidence: "Repository documentation references ChromaDB vector storage",
      });
    }
  }

  // Contributor headcount heuristic based on repository community scale
  const stars = Number(repoMetadata.stargazers_count) || 0;
  const contributorsCount =
    repoMetadata.contributorsCount ||
    (stars > 1000 ? 8 : stars > 100 ? 5 : stars > 10 ? 3 : 2);

  // Convert detected commercial tools into SpendPilot audit format
  const prefilledTools = Array.from(detectedTools.values()).map((tool, index) => ({
    id: index + 1,
    tool: tool.tool,
    plan: tool.defaultPlan,
    monthlyCost: tool.planCost,
    seats: contributorsCount,
    useCase: tool.useCase || "development",
    evidence: tool.evidence,
  }));

  // Accurate FinOps calculation:
  // If zero billable tools are detected, spend and savings are honestly $0.
  let totalMonthlySpend = 0;
  let estimatedSavings = 0;
  let optimizationScore = 100;

  if (prefilledTools.length > 0) {
    totalMonthlySpend = prefilledTools.reduce((acc, t) => acc + (t.monthlyCost * t.seats), 0);
    const auditResult = generateAudit(prefilledTools);
    estimatedSavings = auditResult.totalMonthlySavings;
    optimizationScore = auditResult.optimizationScore;

    // Add model migration savings if legacy models are present
    if (modelWarnings.length > 0) {
      const apiTools = prefilledTools.filter((t) => t.category === "API" || t.tool.includes("API"));
      if (apiTools.length > 0) {
        const apiSpend = apiTools.reduce((sum, t) => sum + (t.monthlyCost * t.seats), 0);
        const migrationSavings = Math.round(apiSpend * 0.35);
        estimatedSavings += migrationSavings;
      }
    }
  }

  return {
    detectedTools: Array.from(detectedTools.values()),
    detectedFrameworks: Array.from(detectedFrameworks.values()),
    prefilledTools,
    insights,
    modelWarnings,
    estimatedSeats: contributorsCount,
    totalMonthlySpend,
    estimatedSavings,
    annualSavings: estimatedSavings * 12,
    optimizationScore,
  };
}

/**
 * Main function: Scans a GitHub repository URL
 */
export async function scanGitHubRepository(repoUrl) {
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    throw new Error(
      "Invalid GitHub repository URL. Please provide a format like 'owner/repo' or 'https://github.com/owner/repo'."
    );
  }

  const { owner, repo } = parsed;
  const standardHeaders = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SpendPilot-AI-Scanner",
  };

  // 1. Fetch Repository Metadata
  let repoMetadata = { owner, repo, stargazers_count: 0, default_branch: "main" };
  try {
    const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: standardHeaders,
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
    console.warn("GitHub API metadata lookup skipped:", err);
  }

  const branch = repoMetadata.default_branch || "main";

  // 2. Fetch File Manifests via Git Tree or direct raw fetching
  const fetchRawFile = async (path) => {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`);
      if (res.ok && res.status === 200) {
        return await res.text();
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  let treeFiles = [];
  try {
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
      { headers: standardHeaders }
    );
    if (treeRes.ok) {
      const treeData = await treeRes.json();
      if (Array.isArray(treeData.tree)) {
        treeFiles = treeData.tree.map((t) => t.path);
      }
    }
  } catch (err) {
    console.warn("GitHub Tree API lookup skipped:", err);
  }

  // Discover candidate files from tree or standard fallbacks
  const packagePaths = treeFiles.filter((p) => p === "package.json" || p.endsWith("/package.json")).slice(0, 3);
  if (packagePaths.length === 0) packagePaths.push("package.json");

  const reqPaths = treeFiles.filter((p) => p === "requirements.txt" || p.endsWith("/requirements.txt")).slice(0, 3);
  if (reqPaths.length === 0) reqPaths.push("requirements.txt");

  const tomlPaths = treeFiles.filter((p) => p === "pyproject.toml" || p.endsWith("/pyproject.toml")).slice(0, 2);
  if (tomlPaths.length === 0) tomlPaths.push("pyproject.toml");

  const envPaths = treeFiles
    .filter((p) => p === ".env.example" || p === ".env.local.example" || p.endsWith("/.env.example"))
    .slice(0, 2);
  if (envPaths.length === 0) envPaths.push(".env.example");

  const notebookPaths = treeFiles.filter((p) => p.endsWith(".ipynb")).slice(0, 2);

  // IDE configuration footprints
  const hasCursorRules = treeFiles.includes(".cursorrules");
  const hasCursorDir = treeFiles.some((p) => p.startsWith(".cursor/"));
  const hasCopilotInstructions = treeFiles.some((p) => p.includes("copilot-instructions.md"));
  const hasWindsurfRules = treeFiles.includes(".windsurfrules");

  // Fetch file contents in parallel
  const [
    packageTexts,
    reqTexts,
    tomlTexts,
    envTexts,
    notebookTexts,
    cursorRulesRaw,
    vscodeExtRaw,
    readmeRaw,
  ] = await Promise.all([
    Promise.all(packagePaths.map((p) => fetchRawFile(p))),
    Promise.all(reqPaths.map((p) => fetchRawFile(p))),
    Promise.all(tomlPaths.map((p) => fetchRawFile(p))),
    Promise.all(envPaths.map((p) => fetchRawFile(p))),
    Promise.all(notebookPaths.map((p) => fetchRawFile(p))),
    hasCursorRules ? fetchRawFile(".cursorrules") : Promise.resolve(null),
    treeFiles.includes(".vscode/extensions.json") ? fetchRawFile(".vscode/extensions.json") : Promise.resolve(null),
    fetchRawFile("README.md"),
  ]);

  const packageJsons = packageTexts
    .filter(Boolean)
    .map((text) => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  const requirementsTxts = reqTexts.filter(Boolean);
  const pyprojectTomls = tomlTexts.filter(Boolean);
  const envExamples = envTexts.filter(Boolean);
  const notebooks = notebookTexts.filter(Boolean);

  // 3. Analyze artifacts
  const analysis = analyzeRepositoryArtifacts({
    packageJsons,
    requirementsTxts,
    pyprojectTomls,
    envExamples,
    notebooks,
    readmeText: readmeRaw || "",
    ideConfigs: {
      hasCursorRules: hasCursorRules || !!cursorRulesRaw,
      hasCursorDir,
      hasCopilotInstructions,
      hasWindsurfRules,
      vscodeExtensions: vscodeExtRaw || "",
    },
    repoMetadata,
  });

  return {
    repository: repoMetadata,
    rawFilesFound: {
      packageJsonCount: packageJsons.length,
      requirementsCount: requirementsTxts.length,
      pyprojectCount: pyprojectTomls.length,
      hasCursorRules: hasCursorRules || !!cursorRulesRaw,
      hasCopilotInstructions,
      hasEnvExample: envExamples.length > 0,
      hasReadme: !!readmeRaw,
    },
    ...analysis,
  };
}
