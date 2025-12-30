"use client"

import { useEffect, useState } from "react";
import { useId } from "react";
import { Trash2 } from "lucide-react"
import NavBar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"

export default function Home() {
  type Habit = {
    id: string;
    name: string;
    done: boolean;
    user_id: string;
    created_at?: string;
  }

  const [habits, setHabits] = useState<Habit[]>([])
  const [habitName, setHabitName] = useState("")
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    async function getSession() {
      const session = await supabase.auth.getSession()
      const currentUser = session.data.session?.user
      setUser(currentUser ?? null)

      if (currentUser) {
        const { data, error } = await supabase
          .from('habits')
          .select("*")
          .eq('user_id', currentUser.id)

        setHabits(data || [])
      }
    }
    getSession()
  }, [])

  function handleGetStarted() {
    supabase.auth.signInWithOAuth({
      provider: 'google'
    })
  }
  
  function handleSignOut() {
    supabase.auth.signOut()
    setUser(null)
    setHabits([])
  }
 
  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (habitName.trim() != "") {
      const { data, error } = await supabase
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

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
      <main className="flex min-h-screen w-full max-w-5xl flex-col items-center justify-start gap-26 py-22 px-16 bg-white dark:bg-[#E6E8E6] sm:items-start">
        <NavBar user={user} onGetStarted={handleGetStarted} onSignOut={handleSignOut} />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-medium leading-10 mb-4 tracking-tight text-black dark:text-black">
            Hello, Rares
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:black">
            Here are your habits:
          </p>
          <ul className="flex flex-col gap-2">
            {habits.map((habit) => (
              <li className="flex items-center justify-between gap-10" key={habit.id}>
                <div className="flex items-center gap-3">
                  <span onClick={() => toggleHabit(habit.id)} className={`inline-block w-4 h-4 rounded-full border-2 ${habit.done ? "border-[#8DB600] bg-[#8DB600]" : "border-current"}`} />
                  <div onClick={() => {
                      setEditingHabitId(habit.id)
                      setEditingText(habit.name)
                    }
                  }>
                    <input onKeyDown={(e) => {
                      if (e.key === "Enter") {
                          saveEdit(habit.id)
                        }
                      }}
                    className={`${editingHabitId === habit.id ? "" : "hidden"}`} type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)}/>
                    <span className={`${habit.done ? "text-[#8DB600]" : "text-current"} ${editingHabitId === habit.id ? "hidden" : ""}`}>
                      {habit.name} is {habit.done ? "done" : "undone"}
                    </span>
                  </div>
                </div>
                <Trash2 size={20} color="#FAA0A0" onClick={() => deleteHabit(habit.id)}/>
              </li>
            ))}
          </ul>

          <br></br>

          <p className="text-zinc-600">
            You can add a new habit here:
          </p>
          <form onSubmit={handleSubmit}>
            <input className="border-2 border-gray-400 rounded-md" type="text" value={habitName} onChange={(e) => setHabitName(e.target.value)}/>
            <input type="submit" value="Add" className="ml-2"/>
          </form>
        </div>
      </main>
    </div>
  );
}
