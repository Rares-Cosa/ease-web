"use client"

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import { Habit } from "@/types/habit";
import NavBar from "@/components/Navbar";
import HabitProgressChart from "@/components/HabitProgressChart";
import HabitCard from "@/components/HabitCard";
import AddHabitForm from "@/components/AddHabitForm";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Home() {

  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getSession() {
      const session = await supabase.auth.getSession()
      const currentUser = session.data.session?.user
      setUser(currentUser ?? null)

      if (currentUser) {
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

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
      <main className="flex min-h-screen w-full flex-col items-center justify-start gap-20 px-35 py-10 bg-white dark:bg-[#E6E8E6] sm:items-start">
        <NavBar user={user} onSignOut={handleSignOut} />
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-medium leading-10 mb-1 tracking-tight text-black dark:text-black">
              Hello, {user ? user.user_metadata.full_name : "Guest"}!
            </h1>
            <div className="flex items-center justify-between gap-3 text-xl text-black mb-10 font-medium">
              <Calendar size={20} />
              {
                new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                }).replace(/,([^,]*)$/, '$1') // regex to remove the comma between day and year
              }
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
                <p className="max-w-md text-lg leading-8 mb-5 text-zinc-600 dark:black">
                  Here are your habits:
                </p>
                <div className="flex items-center justify-between w-full gap-47">
                  <ul className="flex flex-col gap-3 h-80 overflow-y-scroll pr-6">
                    {habits.map((habit) => (
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
                      />
                    ))}
                  </ul>
                  {user ? <HabitProgressChart habits={habits}/> : null}
                </div>
              </div>
            )}

            <br></br>
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
