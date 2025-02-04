import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/tsx/Landing';
import PathChoice from './components/tsx/PathChoice';
import FirstPath from './components/tsx/FirstPath';
import StarBackground from './components/tsx/StarBackground';

function App() {
  return (
    <>
      <StarBackground />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/path-choice" element={<PathChoice />} />
          <Route path="/first-path" element={<FirstPath />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
