"use client"

import { useState } from "react"
import Image from "next/image"

export default function RegisterPage() {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-[#E6E8E6]">
            <div className="w-1/2 flex flex-col px-35 py-22">
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
                            <p className="text-sm text-zinc-600">Join now and start buiding your habits.</p>
                        </div>

                        <form className="flex flex-col gap-5">
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
                        </form>
                    </div>
                </div>
            </div>

            <div className="w-1/2 flex items-center justify-center px-35">
                <Image
                    src="/office-workplace.svg"
                    alt="Office ilustration"
                    width={500}
                    height={500}
                />
            </div>
        </div>
    )
}