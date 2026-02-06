import { useFilterContext } from "@/components/providers/filter-provider"

export function useFilters() {
  return useFilterContext()
}
