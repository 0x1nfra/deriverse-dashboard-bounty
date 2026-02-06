import { create } from "zustand"
import { persist } from "zustand/middleware"

export const MAX_ANNOTATION_LENGTH = 500

interface AnnotationStore {
  annotations: Record<string, string>
  addAnnotation: (tradeId: string, text: string) => void
  removeAnnotation: (tradeId: string) => void
  getAnnotation: (tradeId: string) => string | undefined
  hasAnnotation: (tradeId: string) => boolean
  getAnnotatedCount: () => number
}

export const useAnnotationStore = create<AnnotationStore>()(
  persist(
    (set, get) => ({
      annotations: {},

      addAnnotation: (tradeId: string, text: string) => {
        const trimmedText = text.trim().slice(0, MAX_ANNOTATION_LENGTH)
        if (trimmedText.length === 0) {
          // Remove annotation if empty
          const { [tradeId]: _, ...rest } = get().annotations
          set({ annotations: rest })
        } else {
          set((state) => ({
            annotations: {
              ...state.annotations,
              [tradeId]: trimmedText,
            },
          }))
        }
      },

      removeAnnotation: (tradeId: string) => {
        set((state) => {
          const { [tradeId]: _, ...rest } = state.annotations
          return { annotations: rest }
        })
      },

      getAnnotation: (tradeId: string) => {
        return get().annotations[tradeId]
      },

      hasAnnotation: (tradeId: string) => {
        const annotation = get().annotations[tradeId]
        return annotation !== undefined && annotation.length > 0
      },

      getAnnotatedCount: () => {
        return Object.values(get().annotations).filter((text) => text.length > 0).length
      },
    }),
    {
      name: "deriverse-trade-annotations",
    }
  )
)
