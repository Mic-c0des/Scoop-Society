import { useEffect, useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import { getFlavors, money } from './api.js';

// Cart is a map of flavor id -> qty, kept in App so every page can use it.
// Persisted so it survives a refresh or closing the installed app.
function useCart() {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cart')) || {}; } catch { return {}; }
  });
  useEffect(() => {
    try { localStorage.setItem('cart', JSON.stringify(cart)); } catch {}
  }, [cart]);

  const change = (id, delta) =>
    setCart((c) => {
      const qty = Math.max(0, Math.min(20, (c[id] || 0) + delta));
      const next = { ...c };
      qty ? (next[id] = qty) : delete next[id];
      return next;
    });
  const clear = () => setCart({});
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  return { cart, change, clear, count };
}

// Placeholder page: move into src/pages/Menu.jsx next.
function Menu({ cartApi }) {
  const [flavors, setFlavors] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getFlavors().then(setFlavors).catch((e) => setError(e.message));
  }, []);

  if (error) return <p>{error}</p>;
  if (!flavors) return <p>Loading flavors…</p>;
  return (
    <ul>
      {flavors.map((f) => (
        <li key={f.id}>
          <strong>{f.name}</strong> {money(f.price_cents)}
          <p>{f.description}</p>
          <button onClick={() => cartApi.change(f.id, 1)}>Add</button>
        </li>
      ))}
    </ul>
  );
}

export default function App() {
  const cartApi = useCart();

  return (
    <>
      <header>
        <Link to="/"><h1>Scoop Society</h1></Link>
        <Link to="/cart">Cart ({cartApi.count})</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Menu cartApi={cartApi} />} />
          <Route path="/cart" element={<p>Cart page goes here.</p>} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}