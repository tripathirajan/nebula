import { Route, Routes } from 'react-router-dom';

import { AppShell } from './layout/AppShell';
import { Billing } from './pages/Billing';
import { Overview } from './pages/Overview';
import { Team } from './pages/Team';
import { Users } from './pages/Users';

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/users" element={<Users />} />
        <Route path="/team" element={<Team />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </AppShell>
  );
}
