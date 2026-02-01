"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"
import GoogleSignInButton from "@/components/GoogleSignInButton"

export default function RegisterPage() {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")

    useEffect(() => {
        // Check if user is already logged in. This will prevent a logged in user to see the register page, 
        // and will be redirected back to the homepage
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/")
            }
        }
        checkSession()
    }, [router])

    async function handleRegister(event: React.FormEvent) {
        event.preventDefault()
        setError("") // Clear any previous error

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }
    
        const { error: signUpError } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    full_name: username
                }
            }
        })

        // Handle error
        if (signUpError) {
            setError(signUpError.message)
            return
        }

        router.push("/")
    }

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
            <div className="w-1/2 flex flex-col px-35 py-10">
                <Image
                    src="/easehabit.svg"
                    alt="Easehabit logo"
                    width={200}
                    height={40} 
                />

                <div className="flex-1 flex flex-col justify-center items-center">
                    <div className="flex flex-col gap-7 w-full max-w-sm">
                        <div className="flex flex-col items-center gap-3">
                            <h1 className="text-3xl font-bold">Create an Account</h1>
                            <p className="text-sm text-zinc-600">Join now and start building your habits.</p>
                        </div>
                        <form className="flex flex-col gap-5" onSubmit={handleRegister}>
                            <div className="flex flex-col gap-1">
                                <label>Name</label>
                                <input className="border-2 border-gray-400 rounded-md" type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label>Email</label>
                                <input className="border-2 border-gray-400 rounded-md" type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label>Password</label>
                                <input className="border-2 border-gray-400 rounded-md" type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label>Confirm Password</label>
                                <input className="border-2 border-gray-400 rounded-md" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>

                            {error && <p className="text-red-500 text-sm">{error}</p>}

                            <button
                                type="submit"
                                className="px-4 py-2 bg-[#FF6B6B] rounded-md text-white font-medium hover:bg-[#CC4F4F]"
                            >
                                Register
                            </button>
                        </form>
                        <div className="flex flex-col items-center gap-7">
                            <div className="flex items-center w-full gap-4">
                                <hr className="flex-1 border-gray-300"/>
                                <p className="text-sm text-zinc-600">Or Register With</p>
                                <hr className="flex-1 border-gray-300"/>
                            </div>
                            <div className="flex items-center w-full gap-4">
                                <GoogleSignInButton onError={(message) => setError(message)} />
                            </div>
                            <div className="flex items-center gap-1">
                                <p className="text-sm text-zinc-600">Already Have An Account?</p>
                                <Link href="/login" className="text-sm text-[#FF6B6B]">Sing in.</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-1/2 flex items-center justify-center px-35 py-22">
                <Image
                    src="/office-workplace.svg"
                    alt="Office illustration"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    )
}