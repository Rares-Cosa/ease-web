import { categoryColors, Habit, HabitCategory } from "@/types/habit"
import { Trash2, ChevronLeft, Briefcase, Dumbbell, Heart, Users, ChevronDown } from "lucide-react"

type HabitCardProps = {
    habit: Habit
    editingHabitId: string | null
    editingText: string
    setEditingHabitId: (id: string | null) => void
    setEditingText: (text: string) => void
    toggleHabit: (id: string) => void
    deleteHabit: (id: string) => void
    saveEdit: (id: string) => void
    categoryChangeHabitId: string | null
    setCategoryChangeHabitId: (id: string | null) => void
    updateHabitCategory: (id: string, category: HabitCategory) => void
}

// Define categories with corresponding icons
const categories: { name: HabitCategory, label: string, icon: React.ReactNode }[] = [
    { name: 'work', label: 'Work', icon: <Briefcase size={16} /> },
    { name: 'sports', label: 'Sports', icon: <Dumbbell size={16} /> },
    { name: 'lifestyle', label: 'Lifestyle', icon: <Heart size={16} /> },
    { name: 'social', label: 'Social', icon: <Users size={16} /> },
]

export default function HabitCard({
    habit,
    editingHabitId,
    editingText,
    setEditingHabitId,
    setEditingText,
    toggleHabit,
    deleteHabit,
    saveEdit,
    categoryChangeHabitId,
    setCategoryChangeHabitId, 
    updateHabitCategory
}: HabitCardProps) {

    const isDropDownOpen = categoryChangeHabitId === habit.id

    // Get background color based of category
    const bgColor = habit.category ? categoryColors[habit.category].bg : categoryColors.default.bg
    const hoverColor = habit.category ? categoryColors[habit.category].hover : categoryColors.default.hover


    return (
        <div className="flex flex-col items-end gap-1">
            <li className={`flex items-center justify-between gap-10 ${bgColor} ${hoverColor} rounded-lg px-4 py-3 shadow-sm transition-colors w-full`} key={habit.id}>
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

                {/* Chevron Toggle */}
                <div 
                    onClick={() => setCategoryChangeHabitId(isDropDownOpen ? null : habit.id)}
                    className="cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
                >
                    {isDropDownOpen ? <ChevronDown size={25} /> : <ChevronLeft size={25}/>}
                </div>

                <Trash2 size={23} onClick={() => deleteHabit(habit.id)} className="cursor-pointer text-[#FAA0A0] hover:text-[#FF6B6B]"/>
            </li>

            {/* Category Dropdown */}
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDropDownOpen ? 'max-h-48 opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>
                <div className="mr-8 p-2 bg-white rounded-lg shadow-md border border-gray-200">
                    {categories.map((cat) => (
                    <div
                        key={cat.name}
                        onClick={() => updateHabitCategory(habit.id, cat.name)}
                        className={`flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors ${
                            habit.category === cat.name
                                ? categoryColors[cat.name!].bg
                                : categoryColors[cat.name!].hover
                        }`}
                    >
                        {cat.icon}
                        <span className="text-sm font-medium">{cat.label}</span>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}