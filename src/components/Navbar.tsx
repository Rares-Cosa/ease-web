import Image from "next/image"
import { CircleUserRound } from "lucide-react"
import { User } from "@supabase/supabase-js";
import Link from 'next/link'

type NavBarProps = {
    user: User | null;
    onSignOut: () => void;
}

export default function NavBar({ user, onSignOut } : NavBarProps) {

    return (
        <nav className="flex items-center justify-between w-full">
            <Image
            src="/easehabit.svg"
            alt="Easehabit logo"
            width={200}
            height={40}
            priority
            />

            <div className="flex gap-4">
                {user ? (
                    <div className="flex items-center justify-between gap-10">
                        <div className="relative group">
                            <CircleUserRound size={35} />
                            <span className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 bg-gray-600 text-white px-2 py-1 rounded text-sm whitespace-nowrap mt-2">
                                {user.user_metadata.full_name}
                            </span>
                        </div>
                        <button onClick={onSignOut} className="px-4 py-2 bg-[#FF6B6B] rounded-md text-[15px] text-white font-medium hover:bg-[#CC4F4F] cursor-pointer">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between gap-3">
                        <Link 
                            href="/register"
                            className="px-4 py-2 bg-[#FF6B6B] rounded-md text-[15px] text-white font-medium hover:bg-[#CC4F4F] cursor-pointer">
                                Register
                        </Link>

                        <button className="px-4 py-2 border-2 border-[#FF6B6B] rounded-md text-[15px] text-[#FF6B6B] font-medium hover:bg-[#FF6B6B] hover:text-white cursor-pointer">
                            Login
                        </button>
                    </div>

                )}
            </div>
        </nav>
    )
}