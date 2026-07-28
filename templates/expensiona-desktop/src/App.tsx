import { Route, Routes } from 'react-router-dom';

import { AppShell } from './layout/AppShell';
import { AccountDetail } from './pages/AccountDetail';
import { Accounts } from './pages/Accounts';
import { Budgets } from './pages/Budgets';
import { Calendar } from './pages/Calendar';
import { Categories } from './pages/Categories';
import { Overview } from './pages/Overview';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Transactions } from './pages/Transactions';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AppShell>
  );
}
