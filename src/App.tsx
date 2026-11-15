import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SiteHeader from './components/SiteHeader.tsx'
import ShopPage from './pages/ShopPage.tsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <SiteHeader cartCount={0} />
      <main className="page">
        <Routes>
          <Route path="/" element={<ShopPage />} />
          <Route path="/cart" element={<p>Your cart is empty.</p>} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
