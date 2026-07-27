import { Route, Routes } from 'react-router-dom';

import { AppShell } from './layout/AppShell';
import { Accounts } from './pages/Accounts';
import { Budgets } from './pages/Budgets';
import { Overview } from './pages/Overview';
import { Transactions } from './pages/Transactions';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </AppShell>
  );
}
