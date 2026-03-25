import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { usePokedexStore } from './store/usePokedexStore';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DetailPage from './pages/DetailPage';
import FavoritesPage from './pages/FavoritesPage';
import Dashboard from './pages/Dashboard';
import './App.css';

function Header() {
  const location = useLocation();
  let title = "Pokédex";
  
  if (location.pathname.startsWith('/detail')) {
    title = "Detalle";
  } else if (location.pathname === '/favorites') {
    title = "Favorites";
  } else if (location.pathname === '/dashboard') {
    title = "Admin Panel";
  }

  return (
    <header className="app-header">
      <h1 className="app-header__title">{title}</h1>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
        <Navbar />
      </div>
    </BrowserRouter>
  );
}
