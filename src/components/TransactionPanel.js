import { useState } from 'react';
import { formatMoney } from './SummaryCard';
import { formatDate } from '../dateUtils';

function TransactionPanel({ title, variant, items, defaultDate, onAdd, onDelete }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(defaultDate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!description.trim() || isNaN(value) || value <= 0 || !date) return;
    onAdd({ description: description.trim(), amount: value, date });
    setDescription('');
    setAmount('');
  };

  return (
    <section className={`card panel ${variant}`}>
      <h2>{title}</h2>

      <form className="entry-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Description"
          aria-label={`${title} description`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          aria-label={`${title} amount`}
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          aria-label={`${title} date`}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>

      {items.length === 0 ? (
        <p className="empty">No {title.toLowerCase()} this month.</p>
      ) : (
        <ul className="entry-list">
          {items.map((item) => (
            <li key={item.id}>
              <div>
                <span className="entry-desc">{item.description}</span>
                <span className="entry-date">{formatDate(item.date)}</span>
              </div>
              <div className="entry-right">
                <span className="entry-amount">{formatMoney(item.amount)}</span>
                <button
                  className="delete-btn"
                  aria-label={`Delete ${item.description}`}
                  onClick={() => onDelete(item.id)}
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TransactionPanel;
