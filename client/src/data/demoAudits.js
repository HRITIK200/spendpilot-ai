export const DEMO_AUDITS = [
  {
    _id: "demo-engineering-stack",
    isDemo: true,
    company: "ScaleTech Engineering",
    totalMonthlySavings: 640,
    totalAnnualSavings: 7680,
    optimizationScore: 78,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    auditedTools: [
      {
        tool: "ChatGPT",
        plan: "Enterprise",
        seats: 12,
        monthlyCost: 720,
        optimizedPlan: "Team",
        monthlySavings: 360,
        annualSavings: 4320,
        recommendation: "Downgrade 12 developer seats from Enterprise ($60) to Team ($30).",
        reasoning: "Enterprise compliance logs and SAML SSO are not required for this engineering pod.",
        useCase: "coding"
      },
      {
        tool: "Cursor",
        plan: "Business",
        seats: 10,
        monthlyCost: 400,
        optimizedPlan: "Pro",
        monthlySavings: 200,
        annualSavings: 2400,
        recommendation: "Right-size developers to Pro seats ($20/mo).",
        reasoning: "Team usage analysis indicates slow requests cover standard workflows.",
        useCase: "coding"
      },
      {
        tool: "GitHub Copilot",
        plan: "Business",
        seats: 8,
        monthlyCost: 152,
        optimizedPlan: "Business",
        monthlySavings: 80,
        annualSavings: 960,
        recommendation: "Consolidate code generation onto Cursor to eliminate redundant Copilot licenses.",
        reasoning: "Dual-licensing of Cursor and GitHub Copilot creates direct tool overlap.",
        useCase: "coding"
      }
    ]
  },
  {
    _id: "demo-marketing-stack",
    isDemo: true,
    company: "Acme Media & Growth",
    totalMonthlySavings: 340,
    totalAnnualSavings: 4080,
    optimizationScore: 84,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    auditedTools: [
      {
        tool: "Claude",
        plan: "Team",
        seats: 8,
        monthlyCost: 240,
        optimizedPlan: "Pro",
        monthlySavings: 80,
        annualSavings: 960,
        recommendation: "Right-size content writers to Individual Pro accounts.",
        reasoning: "Writing team does not utilize shared Claude Projects workspace namespace.",
        useCase: "writing"
      },
      {
        tool: "ChatGPT",
        plan: "Team",
        seats: 6,
        monthlyCost: 180,
        optimizedPlan: "Plus",
        monthlySavings: 60,
        annualSavings: 720,
        recommendation: "Switch individual researchers to Plus accounts.",
        reasoning: "Shared GPT store namespace unneeded for standalone research.",
        useCase: "research"
      },
      {
        tool: "Midjourney",
        plan: "Mega",
        seats: 2,
        monthlyCost: 240,
        optimizedPlan: "Pro",
        monthlySavings: 120,
        annualSavings: 1440,
        recommendation: "Downgrade from Mega ($120/mo) to Pro ($60/mo).",
        reasoning: "Monthly GPU hours consumption is under 30h per seat.",
        useCase: "design"
      }
    ]
  }
];
