type HabitProgressBarProps = {
    habits: {
        id: string;
        name: string;
        done: boolean;
    }[]
}

export default function HabitProgressBar({ habits }: HabitProgressBarProps) {
    const totalHabits = habits.length
    const completedHabits = habits.filter((h) => h.done).length

    return (
        <div className="flex flex-col items-center w-full gap-2">
            <div className="flex w-full gap-1 mt-2 mb-2">
                {Array.from({ length: totalHabits }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-3 flex-1 rounded-full transition-colors duration-300 ${index < completedHabits ? 'bg-[#8DB600]' : 'bg-gray-200'}`}
                    />
                ))}
            </div>
            <p className="text-sm text-gray-500">
                {completedHabits}/{totalHabits} habits done
            </p>
        </div>
    )
}
