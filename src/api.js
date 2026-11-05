// Thin wrapper around fetch for our /api routes.
async function request(path, options) {
  const res = await fetch(path, options);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
  return data;
}

export const getFlavors = () => request('/api/flavors');

// items: [{ id, qty }]
export const createOrder = ({ name, email, items }) =>
  request('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, items }),
  });

export const money = (cents) => '$' + (cents / 100).toFixed(2);