import Link from "next/link"
import SignInWithTwitchButton from "./SignInWithTwitchButton"

export function LoginForm() {
  return (
    <div>
      <div className="grid gap-4">
        <div className="text-center mb-4">
          <p className="text-slate-300">Sign in with your Twitch account to continue</p>
        </div>
        <SignInWithTwitchButton/>
      </div>
      <div className="mt-8 text-center text-sm">
        <Link href="/" className="text-purple-400 hover:text-purple-300 underline font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
