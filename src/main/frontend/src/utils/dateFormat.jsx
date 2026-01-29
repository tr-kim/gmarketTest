export function formatTranDate(value) {
  if (!value || String(value).length < 14) return '';

  const v = String(value);

  return `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6, 8)} ` +
         `${v.slice(8, 10)}:${v.slice(10, 12)}:${v.slice(12, 14)}`;
}
