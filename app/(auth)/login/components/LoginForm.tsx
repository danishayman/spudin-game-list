import SignInWithTwitchButton from "./SignInWithTwitchButton"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export function LoginForm() {
  return (
    <div>
      <div className="grid gap-4">
        <div className="text-center mb-4">
          <p className="text-slate-300">Sign in with your preferred account to continue</p>
        </div>
        <SignInWithGoogleButton/>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-600" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-800 px-2 text-slate-400">Or</span>
          </div>
        </div>
        <SignInWithTwitchButton/>
      </div>
    </div>
  )
}
