"use client"

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react"
import NavBar from "@/components/Navbar";
import { supabase } from "@/lib/supabase"
import { User } from "@supabase/supabase-js"
import HabitProgressChart from "@/components/HabitProgressChart";

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
  const [isLoading, setIsLoading] = useState(true)

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
    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin fill-gray-600 dark:fill-quaternary" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
      <main className="flex min-h-screen w-full flex-col items-center justify-start gap-26 px-35 py-10 bg-white dark:bg-[#E6E8E6] sm:items-start">
        <NavBar user={user} onSignOut={handleSignOut} />
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-medium leading-10 mb-10 tracking-tight text-black dark:text-black">
              Hello, {user ? user.user_metadata.full_name : "Guest"}!
            </h1>
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
                    You have no habits yet. Please press &apos;Get Started&apos; and start adding a new habit below!
                  </p>
                </div>
              )
            ) : (
              <div>
                <p className="max-w-md text-lg leading-8 text-zinc-600 dark:black">
                  Here are your habits:
                </p>
                <ul className="flex flex-col gap-3 mt-5">
                  {habits.map((habit) => (
                    <li className="flex items-center justify-between gap-20" key={habit.id}>
                      <div className="flex items-center gap-3">
                        <span onClick={() => toggleHabit(habit.id)} className={`inline-block w-4 h-4 rounded-full border-2 ${habit.done ? "border-[#8DB600] bg-[#8DB600]" : "border-current"}`} />
                        <div className="w-85" onClick={() => {
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
                            className={`${editingHabitId === habit.id ? "" : "hidden"}`} type="text" value={editingText} onChange={(e) => setEditingText(e.target.value)}
                          />
                          <span className={`${habit.done ? "text-[#8DB600]" : "text-current"} ${editingHabitId === habit.id ? "hidden" : ""}`}>
                            {habit.name}
                          </span>
                        </div>
                      </div>
                      <Trash2 size={20} color="#FAA0A0" onClick={() => deleteHabit(habit.id)}/>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <br></br>
            {user ? (
              <div className="flex flex-col gap-5">
                <p className="text-zinc-600">
                  You can add a new habit here:
                </p>
                <form onSubmit={handleSubmit}>
                  <input className="border-2 border-gray-400 rounded-md" type="text" value={habitName} onChange={(e) => setHabitName(e.target.value)}/>
                  <input type="submit" value="Add" className="ml-6"/>
                </form>
              </div>
            ) : null}
          </div>
          {user ? <HabitProgressChart habits={habits}/> : null}
        </div>
      </main>
    </div>
  );
}
