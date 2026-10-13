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

export function useReorderProducts() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (ids: string[]) =>
      apiCall<Product[]>('/products/order', {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify({ ids }),
      }),
    // Show the new order immediately; roll back if the save fails
    onMutate: async (ids) => {
      await queryClient.cancelQueries({ queryKey: ['products'] })
      const previous = queryClient.getQueryData<Product[]>(['products'])
      if (previous) {
        const byId = new Map(previous.map((product) => [product.id, product]))
        queryClient.setQueryData(['products'], ids.map((id) => byId.get(id)).filter(Boolean))
      }
      return { previous }
    },
    onError: (_error, _ids, context) => {
      if (context?.previous) queryClient.setQueryData(['products'], context.previous)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDuplicateProduct() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (id: string) =>
      apiCall<Product>(`/products/${id}/duplicate`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (id: string) =>
      apiCall<void>(`/products/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUploadImage() {
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: (file: File) =>
      apiCall<{ url: string }>('/uploads', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: file,
      }),
  })
}
