import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api, apiPublic } from '@/lib/api'
import { OilResourceCreate, OilResourceUpdate } from '@/types/oil'
import { QUERY_KEYS } from '@/constants'

export function useOils(cursor?: string, enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEYS.OILS, cursor],
    queryFn: () => api.oils.list(cursor),
    enabled,
  })
}

export function useOilsPublic(cursor?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.OILS, 'public', cursor],
    queryFn: () => apiPublic.oils.list(cursor),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })
}

export function useCreateOil() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: OilResourceCreate) => api.oils.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OILS] })
    },
  })
}

export function useUpdateOil() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: OilResourceUpdate }) =>
      api.oils.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OILS] })
    },
  })
}

export function useDeleteOil() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => api.oils.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OILS] })
    },
  })
}