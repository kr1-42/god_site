// API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

// Helper for making API calls
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.error || `API error: ${response.statusText}`)
  }

  return response.json()
}
