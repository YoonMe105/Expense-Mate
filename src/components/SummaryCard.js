function SummaryCard({ title, amount, variant }) {
  return (
    <div className={`card summary-card ${variant}`}>
      <h3>{title}</h3>
      <p className="amount">{formatMoney(amount)}</p>
    </div>
  );
}

export function formatMoney(value) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default SummaryCard;
