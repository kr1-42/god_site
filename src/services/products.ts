import { useQuery } from '@tanstack/react-query'
import { Product } from '../types'
import { apiCall } from './api'

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
