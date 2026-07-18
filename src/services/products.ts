import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Product } from '../types'
import { apiCall } from './api'
import { useAdminStore } from '../stores/adminStore'

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => apiCall<Product[]>('/products'),
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => apiCall<Product>(`/products/${id}`),
    enabled: !!id,
  })
}

export type NewProductInput = Omit<Product, 'id'>

export function useCreateProduct() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (input: NewProductInput) =>
      apiCall<Product>('/products', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export type UpdateProductInput = Partial<Omit<Product, 'id'>>

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: ({ id, ...input }: UpdateProductInput & { id: string }) =>
      apiCall<Product>(`/products/${id}`, {
        method: 'PATCH',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
