import { Habit } from "@/types/habit"
import { Trash2 } from "lucide-react"

type HabitCardProps = {
    habit: Habit
    editingHabitId: string | null
    editingText: string
    setEditingHabitId: (id: string | null) => void
    setEditingText: (text: string) => void
    toggleHabit: (id: string) => void
    deleteHabit: (id: string) => void
    saveEdit: (id: string) => void
}

export default function HabitCard({
    habit,
    editingHabitId,
    editingText,
    setEditingHabitId,
    setEditingText,
    toggleHabit,
    deleteHabit,
    saveEdit
}: HabitCardProps) {
    return (
        <li className="flex items-center justify-between gap-20 bg-gray-100 rounded-lg px-4 py-3 shadow-sm hover:bg-gray-200 transition-colors" key={habit.id}>
            <div className="flex items-center gap-5 text-lg">
                <span onClick={() => toggleHabit(habit.id)} className={`inline-block w-5 h-5 rounded-full border-2 cursor-pointer transition-colors ${
                            habit.done 
                              ? "border-[#8DB600] bg-[#8DB600] hover:border-[#7A9E00] hover:bg-[#7A9E00]" 
                              : "border-current hover:border-[#8DB600]"}`
                } />
                <div className="w-85 cursor-text" onClick={() => {
                              setEditingHabitId(habit.id)
                              setEditingText(habit.name)
                            }
                }>
                    <input 
                        ref={(el) => {
                            if (editingHabitId === habit.id && el) {
                                el.focus()
                            }
                        }} 
                        onBlur={() => saveEdit(habit.id)} onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                saveEdit(habit.id)
                            }
                        }}
                        className={`${editingHabitId === habit.id ? `${habit.done ? "text-[#8DB600]" : "text-[#c7b0b0]"}` : "hidden"}`} type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)}
                    />
                    <span className={`transition-colors ${habit.done ? "text-[#8DB600] hover:text-[#7A9E00]" : "text-[#c7b0b0] hover:text-[#a89090]"} ${editingHabitId === habit.id ? "hidden" : ""}`}>
                        {habit.name}
                    </span>
                </div>
            </div>
            <Trash2 size={23} onClick={() => deleteHabit(habit.id)} className="cursor-pointer text-[#FAA0A0] hover:text-[#FF6B6B]"/>
        </li>
    )
}