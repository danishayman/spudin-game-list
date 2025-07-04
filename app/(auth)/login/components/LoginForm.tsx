import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth-actions"
import SignInWithGoogleButton from "./SignInWithGoogleButton"

export function LoginForm() {
  return (
    <div>
      <form action="">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password" className="text-slate-200">Password</Label>
              <Link href="#" className="ml-auto inline-block text-sm text-purple-400 hover:text-purple-300 underline">
                Forgot your password?
              </Link>
            </div>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <Button 
            type="submit" 
            formAction={login} 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 transition-colors"
          >
            Sign In
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-800 px-2 text-slate-400">Or continue with</span>
            </div>
          </div>
          <SignInWithGoogleButton/> 
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        <span className="text-slate-400">Don&apos;t have an account?</span>{" "}
        <Link href="/signup" className="text-purple-400 hover:text-purple-300 underline font-medium">
          Sign up
        </Link>
      </div>
    </div>
  )
}
