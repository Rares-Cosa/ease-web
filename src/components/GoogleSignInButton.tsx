import Image from "next/image"
import { supabase } from "@/lib/supabase"

type GoogleSignInButtonProps = {
    onError: (message: string) => void
}

export default function GoogleSignInButton({ onError } : GoogleSignInButtonProps) {
    async function handleGoogleRegister() {
            const {error: singUpGoogleError} = await supabase.auth.signInWithOAuth({
                provider: 'google'
            })

            // Handle error
            if (singUpGoogleError) {
                onError(singUpGoogleError.message)
                return
            }
    }

    return (
        <button onClick={handleGoogleRegister} className="flex flex-1 items-center justify-center px-4 py-2 border gap-2 border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:shadow transition duration-150">
            <Image src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google logo" width={15} height={15} loading="lazy"/>
            <span>Google</span>
        </button>
    )
}