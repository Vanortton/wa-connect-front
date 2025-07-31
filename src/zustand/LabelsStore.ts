import type { Label } from '@/types/LabelsTypes'
import { create } from 'zustand'

type LabelsStore = {
    labels: Record<string, Label>
    setLabels: (labels: Record<string, Label>) => void
    setLabel: (labelId: number, labelData: Label) => void
    getLabel: (labelId: string) => void
    removeLabel: (labelId: string) => void
}

export const useLabelsStore = create<LabelsStore>((set, get) => ({
    labels: {},
    setLabels: (labels) => set({ labels }),
    setLabel: (labelId, labelData) => {
        set((state) => ({
            labels: {
                ...state.labels,
                [labelId]: {
                    ...state.labels[labelId],
                    ...labelData,
                    id: labelId,
                },
            },
        }))
    },
    getLabel: (labelId) => get().labels[labelId],
    removeLabel: (labelId) => {
        set((state) => {
            const newLabels = { ...state.labels }
            delete newLabels[labelId]
            return { labels: newLabels }
        })
    },
}))
