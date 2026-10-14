/**
 * SpendPilot AI - Audit History & Version Comparison Utility
 * Manages local persistence of audit snapshots and computes diffs between audit runs.
 */

const STORAGE_KEY = "spendpilot_audit_history";
const inMemoryStore = new Map();

function getStorage() {
  if (typeof window !== "undefined" && window.localStorage) {
    return {
      getItem: (key) => window.localStorage.getItem(key),
      setItem: (key, val) => window.localStorage.setItem(key, val),
      removeItem: (key) => window.localStorage.removeItem(key),
    };
  }
  return {
    getItem: (key) => inMemoryStore.get(key) || null,
    setItem: (key, val) => inMemoryStore.set(key, String(val)),
    removeItem: (key) => inMemoryStore.delete(key),
  };
}

export function getAuditHistory() {
  try {
    const storage = getStorage();
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

export function saveAuditToHistory(auditSnapshot) {
  try {
    if (!auditSnapshot) return;
    const history = getAuditHistory();

    const entry = {
      id: auditSnapshot.id || `audit-${Date.now()}`,
      timestamp: Date.now(),
      dateFormatted: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      companyName: auditSnapshot.companyName || "My Organization",
      repoName: auditSnapshot.repoName || null,
      totalMonthlySpend: Number(auditSnapshot.totalMonthlySpend) || 0,
      totalAnnualSpend: Number(auditSnapshot.totalAnnualSpend) || 0,
      totalMonthlySavings: Number(auditSnapshot.totalMonthlySavings) || 0,
      totalAnnualSavings: Number(auditSnapshot.totalAnnualSavings) || 0,
      optimizationScore: Number(auditSnapshot.optimizationScore) || 80,
      ghostSeatsTotal: Number(auditSnapshot.ghostSeatsTotal) || 0,
      ghostSeatsWasteMonthly: Number(auditSnapshot.ghostSeatsWasteMonthly) || 0,
      toolsCount: Array.isArray(auditSnapshot.tools) ? auditSnapshot.tools.length : 0,
      tools: auditSnapshot.tools || [],
      modelWarnings: auditSnapshot.modelWarnings || [],
    };

    // Keep max 15 audits, prepend newest
    const updated = [entry, ...history.filter((h) => h.id !== entry.id)].slice(0, 15);
    const storage = getStorage();
    storage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return entry;
  } catch (e) {
    return null;
  }
}

export function clearAuditHistory() {
  try {
    const storage = getStorage();
    storage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Computes a detailed diff between two audits
 */
export function computeAuditDiff(auditOld, auditNew) {
  if (!auditOld || !auditNew) return null;

  const spendDelta = (Number(auditNew.totalMonthlySpend) || 0) - (Number(auditOld.totalMonthlySpend) || 0);
  const savingsDelta = (Number(auditNew.totalMonthlySavings) || 0) - (Number(auditOld.totalMonthlySavings) || 0);
  const scoreDelta = (Number(auditNew.optimizationScore) || 0) - (Number(auditOld.optimizationScore) || 0);
  const ghostSeatsDelta = (Number(auditNew.ghostSeatsTotal) || 0) - (Number(auditOld.ghostSeatsTotal) || 0);

  const oldToolNames = new Set((auditOld.tools || []).map((t) => t.tool));
  const newToolNames = new Set((auditNew.tools || []).map((t) => t.tool));

  const addedTools = (auditNew.tools || []).filter((t) => !oldToolNames.has(t.tool));
  const removedTools = (auditOld.tools || []).filter((t) => !newToolNames.has(t.tool));
  const retainedTools = (auditNew.tools || []).filter((t) => oldToolNames.has(t.tool));

  return {
    spendDelta,
    spendReduced: spendDelta < 0,
    savingsDelta,
    scoreDelta,
    ghostSeatsDelta,
    addedTools,
    removedTools,
    retainedTools,
  };
}
