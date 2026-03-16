"use client"

import { useEffect, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { Habit, HabitCategory } from "@/types/habit";
import NavBar from "@/components/Navbar";
import HabitProgressBar from "@/components/HabitProgressBar";
import HabitCard from "@/components/HabitCard";
import AddHabitForm from "@/components/AddHabitForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {

  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [categoryChangeHabitId, setCategoryChangeHabitId] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<Date>(new Date())

  // Helper function to format date as "YYYY-MM-DD"
  function formatDate(date: Date): string {
    return date.toISOString().split("T")[0]
  }

  // Helper function to check if selected day is today
  function isToday(date: Date): boolean {
    const today = new Date()
    return formatDate(date) === formatDate(today)
  }

  async function handleDayChange(currentUser: User) {
    const today = formatDate(new Date())
    const storageKey = `lastActiveDate_${currentUser.id}` // Per user-key
    const lastActiveDate = localStorage.getItem(storageKey)

    // First time user or same day - No snapshot needed
    if (!lastActiveDate || lastActiveDate === today) {
      localStorage.setItem(storageKey, today)
      return
    }

    // User was active on a different day - create a snapshot
    console.log(`Last active: ${lastActiveDate}, Today: ${today}`)

    // Get current habits to snapshot
    const { data: currentHabits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', currentUser.id)

    // If no habits exists, just save the last active day
    if (!currentHabits || currentHabits.length === 0) {
      localStorage.setItem(storageKey, today)
      return
    }

    // Create snapshot for the last active day, with the actual done states
    const lastDaySnapshot = currentHabits.map((habit) => ({
      user_id: currentUser.id,
      date: lastActiveDate,
      habit_name: habit.name,
      habit_category: habit.category || null,
      done: habit.done
    }))

    await supabase.from('habits_history').insert(lastDaySnapshot)

    // Create emtpy snapshots for missed days (all done: false)
    const lastDate = new Date(lastActiveDate)

    // Move to the day after last active
    lastDate.setDate(lastDate.getDate() + 1)

    while (formatDate(lastDate) < today) {
      const missedDaySnapshot = currentHabits.map((habit) => ({
        user_id: currentUser.id,
        date: formatDate(lastDate),
        habit_name: habit.name,
        habit_category: habit.category || null,
        done: false  // Not active = not done
      }))

      await supabase.from('habits_history').insert(missedDaySnapshot)
      lastDate.setDate(lastDate.getDate() + 1)
    }

    // Reset all habits to undone for the new day
    await supabase
        .from('habits')
        .update({ done: false })
        .eq('user_id', currentUser.id)

    // Update last active date
    localStorage.setItem(storageKey, today)
  }

  async function fetchHabitsForDay(date: Date, userId: string) {
    if (isToday(date)) {
      // Is Today so fetch habits from habits table
      const { data } = await supabase
        .from('habits')
        .select("*")
        .eq('user_id', userId)

      return data || []
    } else {
      // It s a past date so fetch habits from habits_history
      const { data } = await supabase
        .from('habits_history')
        .select('*')
        .eq('user_id', userId)
        .eq('date', formatDate(date))

      // Map the result to match the Habit type structure since habits_history has a different type
      return (data || []).map((h) => ({
        id: h.id,
        name: h.habit_name,
        done: h.done,
        category: h.habit_category,
        user_id: h.user_id,
        created_at: h.created_at
      }))
    }
  }

  useEffect(() => {
    async function getSession() {
      const session = await supabase.auth.getSession()
      const currentUser = session.data.session?.user
      setUser(currentUser ?? null)

      if (currentUser) {
        // Check if it s a new day, and handle snapshots
        await handleDayChange(currentUser)

        // Then fetch habits (they may have been reset)
        const { data } = await supabase
          .from('habits')
          .select("*")
          .eq('user_id', currentUser.id)

        setHabits(data || [])
      }
      setIsLoading(false) // Deactivate the loading state after the user and habits are retrieved
    }
    getSession()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setUser(null)
    setHabits([])
  }
 
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (habitName.trim() != "") {
      const { data } = await supabase
        .from('habits')
        .insert({ name: habitName, done: false, user_id: user?.id })
        .select()
      
      if (data && data[0])
        setHabits([...habits, data[0]])
    }

    setHabitName("")
  }

  async function toggleHabit(id: string) {
    const currentHabit = habits.find((h) => h.id === id)

    if (!currentHabit) return

    const { error } = await supabase
      .from('habits')
      .update({ done: !currentHabit.done })
      .eq('id', id)

    if (!error) {
      setHabits(habits.map((h) => {
        if (h.id === id) {
          return { ...h, done: !h.done }
        }
        return h
      }))
    }
  }

  async function deleteHabit(id: string) {
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)

    if (!error) {
      const newList = habits.filter((item) => item.id != id)
      setHabits(newList)
    }
  }

  async function saveEdit(id: string) {
    if (editingText.trim() === "") { // Handle case when the input is empty, therefore the empty habit name will not be saved
      setEditingHabitId(null)
      return
    }

    const { error } = await supabase
      .from('habits')
      .update({ name: editingText })
      .eq('id', id)

    if (!error) {
      setHabits(habits.map((h) => {
        if (h.id === id) {
          return { ...h, name: editingText }
        }
        return h
      }))
    }

    setEditingHabitId(null)
  }

  async function updateHabitCategory(id: string, category: HabitCategory) {
    const currentHabit = habits.find((h) => h.id === id)

    if (!currentHabit) return

    const { error } = await supabase
      .from('habits')
      .update({ category: category })
      .eq('id', id)

    if (!error) {
      setHabits(habits.map((h) => {
        if (h.id === id){
          return { ...h, category: category}
        }
        return h
      }))
    }

    setCategoryChangeHabitId(null) // Close dropdown after selecting the category
  }

  async function navigateToPastDay() {
    const newDate = new Date(selectedDay)
    newDate.setDate(newDate.getDate() - 1)
    setSelectedDay(newDate)

    if (user) {
      const habitsForDay = await fetchHabitsForDay(newDate, user.id)
      setHabits(habitsForDay)
    }
  }

  async function navigateToNextDay() {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const currentSelected = new Date(selectedDay)
    currentSelected.setHours(0, 0, 0, 0)

    if (currentSelected >= today) return

    const newDate = new Date(selectedDay)
    newDate.setDate(newDate.getDate() + 1)
    setSelectedDay(newDate)

    if (user) {
      const habitsForDay = await fetchHabitsForDay(newDate, user.id)
      setHabits(habitsForDay)
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
      <main className="flex min-h-screen w-full flex-col items-center justify-start gap-10 px-35 py-10 bg-white dark:bg-[#E6E8E6]">
        <NavBar user={user} onSignOut={handleSignOut} />
        <div className="flex items-center justify-center w-full">
          <div className="flex flex-col items-center text-center gap-3">
            <h1 className="max-w-xs text-3xl font-medium leading-10 mb-1 tracking-tight text-black dark:text-black">
              Hello, {user ? user.user_metadata.full_name : "Guest"}!
            </h1>
            <div className="flex items-center justify-center gap-3 text-xl text-black mb-7 font-medium">
              <ChevronLeft 
                size={24} 
                onClick={navigateToPastDay} 
                className="cursor-pointer hover:text-gray-600 transition-colors shrink-0"
                strokeWidth={2.5}
              />
              <div className="flex items-center justify-center gap-2 w-72">
                <Calendar size={20} />
                <span>
                  {
                    selectedDay.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }).replace(/,([^,]*)$/, '$1') // regex to remove the comma between day and year
                  }
                </span>
              </div>
              <ChevronRight 
                size={24} 
                onClick={navigateToNextDay}
                className="cursor-pointer hover:text-gray-600 transition-colors shrink-0"
                strokeWidth={2.5}
              />
            </div>
            {habits.length === 0 ? (
              user ? (
                <div>
                  <p className="max-w-md text-md leading-8 text-zinc-600 mt-10">
                    You have no habits yet. Start adding a new habit below!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="max-w-md text-md leading-8 text-zinc-600 mt-10">
                    You have no habits yet. Please press &apos;Register&apos; or &apos;Login&apos;, and start adding a new habit!
                  </p>
                </div>
              )
            ) : (
              <div>
                <p className="text-lg leading-8 mb-5 text-zinc-600 dark:black">
                  Here are your habits:
                </p>
                <div className="flex flex-col items-center w-full max-w-xl">
                  {user ? <HabitProgressBar habits={habits}/> : null}
                  <ul className="flex flex-col gap-4 h-80 overflow-y-auto mt-4 w-[500px]" style={{ overflowAnchor: 'none' }}>
                    <AnimatePresence>
                      {[...habits].sort((a, b) => Number(b.done) - Number(a.done)).map((habit) => (
                        <motion.div
                          key={habit.id}
                          layout
                          initial={{ opacity: 0, y: -20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <HabitCard
                            key={habit.id}
                            habit={habit}
                            editingHabitId={editingHabitId}
                            editingText={editingText}
                            setEditingHabitId={setEditingHabitId}
                            setEditingText={setEditingText}
                            toggleHabit={toggleHabit}
                            deleteHabit={deleteHabit}
                            saveEdit={saveEdit}
                            categoryChangeHabitId={categoryChangeHabitId}
                            setCategoryChangeHabitId={setCategoryChangeHabitId}
                            updateHabitCategory={updateHabitCategory}
                          />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              </div>
            )}

            {user ? (
              <AddHabitForm 
                habitName={habitName}
                setHabitName={setHabitName}
                handleSubmit={handleSubmit}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
