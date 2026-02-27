type AddHabitFormProps = {
    habitName: string
    setHabitName: (name: string) => void
    handleSubmit: (event: React.FormEvent) => void
}

export default function AddHabitForm({
    habitName,
    setHabitName,
    handleSubmit
}: AddHabitFormProps) {
    return (
        <form onSubmit={handleSubmit} className="flex gap-4 mt-6">
            <input 
                className="border-2 border-gray-400 rounded-md px-3 py-2" 
                type="text" 
                placeholder="Enter a new habit..."
                value={habitName} 
                onChange={(e) => setHabitName(e.target.value)}
            />
            <button
                type="submit"
                className="px-4 py-2 bg-[#FF6B6B] rounded-md text-white font-medium hover:bg-[#CC4F4F]"
            >
                Add
            </button>
        </form>
    )
}