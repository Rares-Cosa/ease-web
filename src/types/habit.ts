export type HabitCategory = 'work' | 'sports' | 'lifestyle' | 'social' | null

export type Habit = {
    id: string
    name: string
    done: boolean
    user_id: string
    created_at?: string
    category?: HabitCategory
}

// Predifine some color for each category

export const categoryColors: Record<string, { bg: string, hover: string }> = {
    work: { bg: 'bg-violet-100', hover: 'hover:bg-violet-200' },
    sports: { bg: 'bg-yellow-100', hover: 'hover:bg-yellow-200' },
    lifestyle: { bg: 'bg-blue-100', hover: 'hover:bg-blue-200' },
    social: { bg: 'bg-orange-100', hover: 'hover:bg-orange-200' },
    default: { bg: 'bg-gray-100', hover: 'hover:bg-gray-200' }
}