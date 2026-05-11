# TESTS

This document describes the automated tests implemented for SpendPilot AI.

---

# Testing Stack

- Vitest
- GitHub Actions CI

The audit engine was separated into a reusable utility module to enable isolated business-logic testing.

---

# Test File

## client/src/utils/auditEngine.test.js

This file contains automated tests validating the audit recommendation engine.

---

# Implemented Test Cases

## 1. Small Team Plan Downgrade

### Purpose

Validates that Team plans are downgraded for small organizations when collaboration-focused plans are unnecessary.

### Expected Behavior

- Team plan
- Seats <= 2
- Recommends Plus plan
- Calculates savings correctly

---

## 2. Enterprise Right-Sizing

### Purpose

Ensures Enterprise plans are downgraded when seat counts are too small to justify enterprise pricing.

### Expected Behavior

- Enterprise plan
- Seats < 10
- Recommends Business plan
- Generates cost savings

---

## 3. Monthly Savings Calculation

### Purpose

Verifies total monthly savings are aggregated correctly across optimization rules.

### Expected Behavior

- Savings values accumulate correctly
- Final totalMonthlySavings value is accurate

---

## 4. Coding Workflow Recommendation

### Purpose

Checks that coding-focused ChatGPT workflows recommend development-specialized tools.

### Expected Behavior

- ChatGPT + coding workflow
- Recommends Cursor or GitHub Copilot

---

## 5. Annual Savings Calculation

### Purpose

Ensures annual savings are derived correctly from monthly savings calculations.

### Expected Behavior

- annualSavings = monthlySavings * 12

---

# Running Tests Locally

From the client directory:

```bash
npm run test
```

---

# Continuous Integration

GitHub Actions automatically runs:

- dependency installation
- automated tests
- production builds

on every push to the main branch.

Workflow file:

```text
.github/workflows/ci.yml
```

---

# Future Testing Improvements

Potential future additions:

- API integration tests
- frontend component tests
- end-to-end Cypress tests
- performance tests
- accessibility testing