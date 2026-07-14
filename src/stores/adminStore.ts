import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiCall } from '../services/api'

interface AdminStore {
  token: string | null
  isAuthenticated: boolean
  login: (password: string) => Promise<void>
  logout: () => void
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      login: async (password: string) => {
        const { token } = await apiCall<{ token: string }>('/admin/login', {
          method: 'POST',
          body: JSON.stringify({ password }),
        })
        set({ token, isAuthenticated: true })
      },
      logout: () => set({ token: null, isAuthenticated: false }),
    }),
    { name: 'admin-auth' },
  ),
)
