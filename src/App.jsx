import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import ResetPage    from './pages/ResetPage';
import CallbackPage from './pages/CallbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<LoginPage />} />
        <Route path="/reset"    element={<ResetPage />} />
        <Route path="/callback" element={<CallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}
