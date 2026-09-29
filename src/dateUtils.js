const pad = (n) => String(n).padStart(2, '0');

// All dates are stored as local 'YYYY-MM-DD' strings; months as 'YYYY-MM'.
export function toIsoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function todayIso() {
  return toIsoDate(new Date());
}

export function monthOf(isoDate) {
  return isoDate.slice(0, 7);
}

export function currentMonth() {
  return monthOf(todayIso());
}

export function shiftMonth(month, delta) {
  const [y, m] = month.split('-').map(Number);
  return toIsoDate(new Date(y, m - 1 + delta, 1)).slice(0, 7);
}

export function formatMonth(month) {
  const [y, m] = month.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: 'long',
    year: 'numeric',
  });
}

export function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString();
}

export function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
