import { formatMoney } from './SummaryCard';
import { formatMonth, monthOf } from '../dateUtils';

function MonthlySummary({ transactions, selectedMonth, onSelectMonth }) {
  const byMonth = {};
  for (const t of transactions) {
    const key = monthOf(t.date);
    byMonth[key] = byMonth[key] || { income: 0, outcome: 0 };
    byMonth[key][t.type] += t.amount;
  }

  // Oldest first to accumulate the running total, then show newest first.
  let running = 0;
  const rows = Object.keys(byMonth)
    .sort()
    .map((month) => {
      const { income, outcome } = byMonth[month];
      const balance = income - outcome;
      running += balance;
      return { month, income, outcome, balance, running };
    })
    .reverse();

  return (
    <section className="card monthly">
      <h2>Monthly Balance</h2>
      {rows.length === 0 ? (
        <p className="empty">No entries yet.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Income</th>
                <th>Outcome</th>
                <th>Balance</th>
                <th>Running total</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.month}
                  className={r.month === selectedMonth ? 'selected' : ''}
                  onClick={() => onSelectMonth(r.month)}
                >
                  <td>{formatMonth(r.month)}</td>
                  <td className="income-text">{formatMoney(r.income)}</td>
                  <td className="outcome-text">{formatMoney(r.outcome)}</td>
                  <td className={r.balance < 0 ? 'outcome-text' : 'balance-text'}>
                    {formatMoney(r.balance)}
                  </td>
                  <td className={r.running < 0 ? 'outcome-text' : ''}>
                    {formatMoney(r.running)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default MonthlySummary;
