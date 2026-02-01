"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        // Check if user is already logged in. This will prevent a logged in user to see the login page, 
        // and will be redirected back to the homepage
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/")
            }
        }
        checkSession()
    }, [router])

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault()
        setError("") // Clear any previous error
    
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        // Handle error
        if (loginError) {
            setError(loginError.message)
            return
        }

        router.push("/")
    }

    async function handleGoogleRegister() {
        const {error: singUpGoogleError} = await supabase.auth.signInWithOAuth({
            provider: 'google'
        })

        // Handle error
        if (singUpGoogleError) {
            setError(singUpGoogleError.message)
            return
        }
    }

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
            <div className="w-full flex flex-col px-35 py-10">
                <Image
                    src="/easehabit.svg"
                    alt="Easehabit logo"
                    width={200}
                    height={40} 
                />

                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-7 w-full max-w-sm">
                        <div className="flex flex-col items-center gap-3">
                            <h1 className="text-3xl font-bold">Welcome Back</h1>
                            <p className="text-sm text-zinc-600">Enter your email and password to access your account.</p>
                        </div>
                        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
                            <div className="flex flex-col gap-1">
                                <label>Email</label>
                                <input className="border-2 border-gray-400 rounded-md" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label>Password</label>
                                <input className="border-2 border-gray-400 rounded-md" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#FF6B6B] rounded-md text-white font-medium hover:bg-[#CC4F4F]"
                            >
                                Log In
                            </button>
                        </form>
                        <div className="flex flex-col items-center gap-7">
                            <div className="flex items-center w-full gap-4">
                                <hr className="flex-1 border-gray-300"/>
                                <p className="text-sm text-zinc-600">Or Register With</p>
                                <hr className="flex-1 border-gray-300"/>
                            </div>
                            <div className="flex items-center w-full gap-4">
                                <button onClick={handleGoogleRegister} className="flex flex-1 items-center justify-center px-4 py-2 border gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
                                    <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={15} height={15} loading="lazy"/>
                                    <span>Google</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="text-sm text-zinc-600">Don&apos;t Have An Account?</p>
                                <Link href="/register" className="text-sm text-[#FF6B6B]">Register Now.</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}