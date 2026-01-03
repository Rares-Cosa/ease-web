type HabitProgressChartProps = {
    habits: {
        id: string;
        name: string;
        done: boolean;
    }[]
}

export default function HabitProgressChart({ habits }: HabitProgressChartProps) {
    const totalHabits = habits.length
    const completedHabits = habits.filter((h) => h.done).length

    const size = 150
    const strokeWidth = 15 // thickness of the ring
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius 

    return (
        <div>
            <svg width={size} height={size}>
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e5e5"
                    strokeWidth={strokeWidth}
                 />

                 {/* Habit segments */}
                 {habits.map((habit, index) => {
                    const gap = 4
                    const segmentLenght = (circumference / totalHabits) - 4
                    const offset = circumference - (index * (circumference / totalHabits))

                    return (
                        <circle
                            key={habit.id}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={habit.done ? "#8DB600" : "#e5e5e5"}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${segmentLenght} ${circumference - segmentLenght}`}
                            strokeDashoffset={offset}
                        />
                    )
                 })}
            </svg>
            <p>{completedHabits}/{totalHabits}</p>
            <p>habits are done</p>
        </div>
    )
}