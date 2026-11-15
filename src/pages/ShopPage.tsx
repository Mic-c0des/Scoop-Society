import { useEffect, useState } from 'react'

type Flavor = {
  id: string
  name: string
  description: string | null
  priceCents: number
  imageUrl: string | null
}

function ShopPage() {
  const [flavors, setFlavors] = useState<Flavor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function loadFlavors() {
      try {
        const response = await fetch('/api/flavors', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Unable to load flavors.')
        }

        const availableFlavors: Flavor[] = await response.json()
        setFlavors(availableFlavors)
      } catch {
        if (!controller.signal.aborted) {
          setError('Unable to load flavors. Please try again later.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }

    void loadFlavors()

    return () => controller.abort()
  }, [])

  return (
    <section aria-labelledby="shop-heading">
      <h1 id="shop-heading">Shop</h1>
      {isLoading && <p role="status">Loading flavors...</p>}
      {error && <p role="alert">{error}</p>}
      {!isLoading && !error && flavors.length === 0 && (
        <p>No flavors are currently available.</p>
      )}
      {!isLoading && !error && flavors.length > 0 && (
        <ul className="product-grid">
          {flavors.map((flavor) => (
            <li key={flavor.id} className="product-card">
              {flavor.imageUrl ? (
                <img
                  className="product-card__image"
                  src={flavor.imageUrl}
                  alt={flavor.name}
                />
              ) : (
                <div className="product-card__image" aria-hidden="true" />
              )}
              <h2>{flavor.name}</h2>
              {flavor.description && <p>{flavor.description}</p>}
              <p>${(flavor.priceCents / 100).toFixed(2)}</p>
              <button type="button">Add to cart</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default ShopPage
