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
    </div>
  )
}
