import { useEffect, useState } from 'react';
import './App.css';
import SummaryCard from './components/SummaryCard';
import TransactionPanel from './components/TransactionPanel';
import MonthlySummary from './components/MonthlySummary';
import {
  currentMonth,
  formatMonth,
  isIsoDate,
  monthOf,
  shiftMonth,
  toIsoDate,
  todayIso,
} from './dateUtils';

const STORAGE_KEY = 'money-tracker-transactions';

function loadTransactions() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // Older entries stored a locale date string; the id is the creation timestamp.
    return saved.map((t) =>
      isIsoDate(t.date) ? t : { ...t, date: toIsoDate(new Date(Math.floor(t.id))) }
    );
  } catch {
    return [];
  }
}

function App() {
  const [transactions, setTransactions] = useState(loadTransactions);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch {
      // storage unavailable; keep data in memory only
    }
  }, [transactions]);

  const monthTransactions = transactions
    .filter((t) => monthOf(t.date) === selectedMonth)
    .sort((a, b) => b.date.localeCompare(a.date));
  const incomes = monthTransactions.filter((t) => t.type === 'income');
  const outcomes = monthTransactions.filter((t) => t.type === 'outcome');

  const totalIncome = incomes.reduce((sum, t) => sum + t.amount, 0);
  const totalOutcome = outcomes.reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalOutcome;

  // New entries default to today, or the 1st when viewing another month.
  const defaultDate =
    selectedMonth === currentMonth() ? todayIso() : `${selectedMonth}-01`;

  const addTransaction = (type) => (entry) => {
    setTransactions((prev) => [
      { id: Date.now() + Math.random(), type, ...entry },
      ...prev,
    ]);
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="App">
      <h1>Expense Mate</h1>

      <div className="month-nav">
        <button
          aria-label="Previous month"
          onClick={() => setSelectedMonth((m) => shiftMonth(m, -1))}
        >
          ◀
        </button>
        <span className="month-label">{formatMonth(selectedMonth)}</span>
        <button
          aria-label="Next month"
          onClick={() => setSelectedMonth((m) => shiftMonth(m, 1))}
        >
          ▶
        </button>
        {selectedMonth !== currentMonth() && (
          <button className="today-btn" onClick={() => setSelectedMonth(currentMonth())}>
            This month
          </button>
        )}
      </div>

      <div className="summary">
        <SummaryCard title="Income" amount={totalIncome} variant="income" />
        <SummaryCard title="Outcome" amount={totalOutcome} variant="outcome" />
        <SummaryCard
          title="Balance"
          amount={balance}
          variant={balance < 0 ? 'balance negative' : 'balance'}
        />
      </div>

      <div className="panels">
        <TransactionPanel
          key={`income-${selectedMonth}`}
          title="Income"
          variant="income"
          items={incomes}
          defaultDate={defaultDate}
          onAdd={addTransaction('income')}
          onDelete={deleteTransaction}
        />
        <TransactionPanel
          key={`outcome-${selectedMonth}`}
          title="Outcome"
          variant="outcome"
          items={outcomes}
          defaultDate={defaultDate}
          onAdd={addTransaction('outcome')}
          onDelete={deleteTransaction}
        />
      </div>

      <MonthlySummary
        transactions={transactions}
        selectedMonth={selectedMonth}
        onSelectMonth={setSelectedMonth}
      />
    </div>
  );
}

export default App;
