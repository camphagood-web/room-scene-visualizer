import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import Generator from './pages/Generator';
import Gallery from './pages/Gallery';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Generator />} />
          <Route path="/gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
