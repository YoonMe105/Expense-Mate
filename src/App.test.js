import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

beforeEach(() => localStorage.clear());

function addEntry(type, description, amount, date) {
  fireEvent.change(screen.getByLabelText(`${type} description`), { target: { value: description } });
  fireEvent.change(screen.getByLabelText(`${type} amount`), { target: { value: amount } });
  if (date) {
    fireEvent.change(screen.getByLabelText(`${type} date`), { target: { value: date } });
  }
  fireEvent.click(screen.getAllByText('Add')[type === 'Income' ? 0 : 1]);
}

function balanceCard() {
  return screen.getByText('Balance', { selector: 'h3' }).parentElement;
}

test('adds income and outcome and updates balance', () => {
  render(<App />);

  addEntry('Income', 'Salary', '1000');
  addEntry('Outcome', 'Rent', '400');

  expect(screen.getByText('Salary')).toBeInTheDocument();
  expect(screen.getByText('Rent')).toBeInTheDocument();
  expect(within(balanceCard()).getByText('600.00')).toBeInTheDocument();
});

test('shows balance per month', () => {
  render(<App />);

  addEntry('Income', 'Salary', '1000');
  addEntry('Outcome', 'Old bill', '300', '2020-01-15');

  // The 2020 entry is not in the current month's cards.
  expect(within(balanceCard()).getByText('1,000.00')).toBeInTheDocument();
  expect(screen.queryByText('Old bill')).not.toBeInTheDocument();

  // Monthly table lists both months; clicking one switches to it.
  const jan2020 = new Date(2020, 0, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  fireEvent.click(screen.getByText(jan2020, { selector: 'td' }));

  expect(screen.getByText('Old bill')).toBeInTheDocument();
  expect(within(balanceCard()).getByText('-300.00')).toBeInTheDocument();
});
