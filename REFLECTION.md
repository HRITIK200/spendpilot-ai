# REFLECTION

## 1. The hardest bug I hit this week, and how I debugged it

The hardest issue I encountered during this project was the deployment and routing setup between Vercel, React Router, and the backend API hosted on Render.

Initially, the application worked correctly in local development, but after deployment, refreshing pages like `/audit` or `/report/:id` caused 404 errors on Vercel. At first I assumed the issue was related to React Router itself, but after investigating network behavior and deployment structure, I realized the problem was caused by missing SPA rewrite configuration in Vercel.

I tested multiple configurations for `vercel.json`, experimented with different rewrite destinations, and verified folder structure issues related to deploying the client folder separately from the root repository. Eventually, I resolved the issue by properly configuring Vercel rewrites and ensuring the frontend root directory was correctly set.

Another difficult issue was CORS configuration between the deployed frontend and backend. The backend initially rejected requests from the new Vercel deployment domain. I debugged this by inspecting browser console errors, verifying request headers, and updating the backend CORS configuration to allow the deployed frontend domain.

This process taught me a lot about production deployment workflows and how frontend/backend infrastructure behaves differently in production environments compared to localhost development.

---

## 2. A decision I reversed mid-week, and what made me reverse it

One important decision I reversed was keeping all audit logic directly inside the frontend components.

Initially, I implemented recommendation logic directly inside React pages because it was faster for prototyping. However, as the project grew, the logic became difficult to maintain, test, and reuse. I realized this structure would make automated testing and future scalability much harder.

I eventually refactored the logic into a dedicated `auditEngine.js` utility file. This improved separation of concerns significantly. It also made it much easier to write automated tests for the audit engine independently from the UI.

This decision improved the architecture of the project and made the codebase more maintainable and scalable.

---

## 3. What I would build in week 2 if I had it

If I had an additional week, I would focus heavily on making the product feel more production-ready and commercially viable.

The first improvement would be a much more advanced recommendation engine using real AI-assisted reasoning combined with pricing benchmarks and usage analytics. I would also add PDF export support so teams could download professional audit reports and share them internally.

Another major improvement would be authentication and organization dashboards. Instead of anonymous reports, companies could track historical audits over time and monitor optimization opportunities continuously.

I would also add stronger lead-generation features for Credex, such as consultation booking flows, CRM integrations, and email nurture automation.

From a technical perspective, I would improve caching, add rate limiting, and implement more sophisticated analytics instrumentation to better understand user behavior and conversion funnels.

---

## 4. How I used AI tools during development

I used ChatGPT extensively throughout the project for debugging assistance, deployment troubleshooting, architecture guidance, and improving frontend UX decisions.

AI tools were particularly helpful for:
- diagnosing deployment issues,
- understanding CORS behavior,
- improving responsive layouts,
- structuring backend APIs,
- generating documentation structure,
- and refining engineering explanations.

However, I intentionally did not rely on AI for the core business logic reasoning. The audit engine itself uses deterministic rule-based heuristics because pricing optimization requires predictable and explainable outputs. I believed deterministic logic was more appropriate than AI-generated calculations for this use case.

One example where AI was wrong occurred during Vercel deployment troubleshooting. An early rewrite configuration suggestion caused 403 errors instead of solving the React Router refresh issue. I identified the mistake by comparing deployment behavior and verifying how Vite projects should handle SPA rewrites. That experience reinforced the importance of validating AI-generated suggestions rather than blindly trusting them.

Overall, AI significantly accelerated development, but I treated it as a collaborative assistant rather than an autonomous code generator.

---

## 5. Self-rating

### Discipline — 8/10

I worked consistently across multiple days, maintained deployment progress, and iteratively improved both engineering and product quality.

### Code Quality — 7/10

The architecture is reasonably modular and maintainable, though there are still opportunities for stronger abstraction and cleaner validation systems.

### Design Sense — 8/10

I focused heavily on responsive layouts, dashboard polish, and making the product visually feel like a real SaaS platform rather than a tutorial project.

### Problem-Solving — 8/10

I successfully resolved several real deployment and integration issues involving MongoDB, Vercel routing, and CORS debugging.

### Entrepreneurial Thinking — 7/10

I tried to approach the assignment as a real lead-generation SaaS product rather than only a coding exercise, especially in the shareability and audit recommendation design.