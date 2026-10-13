import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiCall } from './api'
import { useAdminStore } from '../stores/adminStore'

export type HomeSection = 'newArrivals' | 'inEvidence'
export type HomeSections = Record<HomeSection, string[]>

export function useHomeSections() {
  return useQuery({
    queryKey: ['home-sections'],
    queryFn: () => apiCall<HomeSections>('/home-sections'),
  })
}

export function useSaveHomeSection() {
  const queryClient = useQueryClient()
  const token = useAdminStore((state) => state.token)

  return useMutation({
    mutationFn: ({ section, ids }: { section: HomeSection; ids: string[] }) =>
      apiCall<HomeSections>(`/home-sections/${section}`, {
        method: 'PUT',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: JSON.stringify({ ids }),
      }),
    onSuccess: (sections) => {
      queryClient.setQueryData(['home-sections'], sections)
    },
  })
}
