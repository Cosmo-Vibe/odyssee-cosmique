import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Landing from './components/tsx/Landing';
import PathChoice from './components/tsx/PathChoice';
import FirstPath from './components/tsx/FirstPath';

function App() {
  const location = useLocation();

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'black' }}>
      <Routes location={location}>
        <Route path="/" element={<Landing />} />
        <Route path="/path-choice" element={<PathChoice />} />
        <Route path="/first-path" element={<FirstPath />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
