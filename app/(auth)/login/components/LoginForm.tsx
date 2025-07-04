import Link from "next/link"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export function LoginForm() {
  return (
    <div>
      <div className="grid gap-4">
        <div className="text-center mb-4">
          <p className="text-slate-300">Sign in with your Google account to continue</p>
        </div>
        <SignInWithGoogleButton/>
      </div>
      <div className="mt-8 text-center text-sm">
        <Link href="/" className="text-purple-400 hover:text-purple-300 underline font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  )
}
