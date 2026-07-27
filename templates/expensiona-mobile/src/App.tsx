import { Route, Routes } from 'react-router-dom';

import { MobileShell } from './layout/MobileShell';
import { Budget } from './pages/Budget';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Transactions } from './pages/Transactions';

export function App() {
  return (
    <MobileShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MobileShell>
  );
}
