import { Route, Routes } from 'react-router-dom';

import { MobileShell } from './layout/MobileShell';
import { Cards } from './pages/Cards';
import { Home } from './pages/Home';
import { Profile } from './pages/Profile';
import { Stats } from './pages/Stats';

export function App() {
  return (
    <MobileShell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </MobileShell>
  );
}
