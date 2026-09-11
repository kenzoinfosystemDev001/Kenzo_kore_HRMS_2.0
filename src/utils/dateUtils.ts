/**
 * Standardized Date Utility Functions for Kenzo Kore HRMS
 * Ensures consistent YYYY-MM-DD format across client and server
 */

export function getTodayDateString(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function normalizeDateString(dateVal?: string | Date | null): string {
  if (!dateVal) return getTodayDateString();
  if (typeof dateVal === 'string') {
    const match = dateVal.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  if (dateVal instanceof Date) {
    return getTodayDateString(dateVal);
  }
  return String(dateVal).split('T')[0] || getTodayDateString();
}
