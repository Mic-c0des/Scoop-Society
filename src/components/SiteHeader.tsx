import { Link, NavLink } from 'react-router-dom'

type SiteHeaderProps = {
  cartCount?: number
}

function SiteHeader({ cartCount = 0 }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <Link to="/" className="site-header__brand">
        Shop
      </Link>
      <nav aria-label="Main" className="site-header__nav">
        <NavLink to="/" end>
          Shop
        </NavLink>
        <NavLink to="/cart">Cart ({cartCount})</NavLink>
      </nav>
    </header>
  )
}

export default SiteHeader
