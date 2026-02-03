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

    const size = 250
    const strokeWidth = 15 // thickness of the ring
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius 

    return (
        <div className="mr-80">
            <svg width={size} height={size}>
                {/* Wrap in a group to start the segment from 12 o clock */}
                <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
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
                        const gap = habits.length === 1 ? 0 : 4
                        const segmentLenght = (circumference / totalHabits) - gap
                        const offset = circumference - (index * (circumference / totalHabits))
                        const noOfDoneHabits = habits.filter(h => h.done).length

                        return (
                            <circle
                                key={habit.id}
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                fill="none"
                                stroke={index < noOfDoneHabits ? "#8DB600" : "#a3a3a3"}
                                strokeWidth={strokeWidth}
                                strokeDasharray={`${segmentLenght} ${circumference - segmentLenght}`}
                                strokeDashoffset={offset}
                            />
                        )
                    })}
                 </g>

                 {/* Text inside the circle */}
                 <text
                    x={size / 2}
                    y={size / 2 - 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#52525b"
                    fontSize="24"
                    fontWeight="bold"
                 >
                    {completedHabits}/{totalHabits}
                 </text>
                 <text
                    x={size / 2}
                    y={size / 2 + 15}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#52525b"
                    fontSize="14"
                 >
                    habits done
                 </text>
            </svg>
        </div>
    )
}