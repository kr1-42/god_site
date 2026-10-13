import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Category } from '../types'
import { apiCall } from './api'
import { useAdminStore } from '../stores/adminStore'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiCall<Category[]>('/categories'),
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (input: { name: string; nameIt?: string }) =>
      apiCall<Category>('/categories', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: ({ slug, ...input }: { slug: string; name?: string; nameIt?: string }) =>
      apiCall<Category>(`/categories/${encodeURIComponent(slug)}`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (slug: string) =>
      apiCall<void>(`/categories/${encodeURIComponent(slug)}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })
}
