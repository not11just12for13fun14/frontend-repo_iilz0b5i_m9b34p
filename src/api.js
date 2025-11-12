const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

async function http(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export const api = {
  // Classes
  listClasses: () => http('GET', '/classes'),
  createClass: (data) => http('POST', '/classes', data),

  // Notifications
  listNotifications: (class_code) => {
    const q = class_code ? `?class_code=${encodeURIComponent(class_code)}` : ''
    return http('GET', `/notifications${q}`)
  },
  createNotification: (data) => http('POST', '/notifications', data),

  // Payments
  listPayments: (student_id) => {
    const q = student_id ? `?student_id=${encodeURIComponent(student_id)}` : ''
    return http('GET', `/payments${q}`)
  },
  createPayment: (data) => http('POST', '/payments', data),

  // Chat messages
  getMessages: (class_code, limit = 50) => http('GET', `/classes/${encodeURIComponent(class_code)}/messages?limit=${limit}`),
  postMessage: (class_code, data) => http('POST', `/classes/${encodeURIComponent(class_code)}/messages`, data),
}
