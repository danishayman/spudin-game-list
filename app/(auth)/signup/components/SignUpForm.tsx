import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  return (
    <div>
      <form action="">
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first-name" className="text-slate-200">First name</Label>
              <Input
                name="first-name"
                id="first-name"
                placeholder="Max"
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last-name" className="text-slate-200">Last name</Label>
              <Input
                name="last-name"
                id="last-name"
                placeholder="Robinson"
                required
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username" className="text-slate-200">Username</Label>
            <Input
              name="username"
              id="username"
              placeholder="maxrobinson"
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input
              name="email"
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-slate-200">Password</Label>
            <Input 
              name="password" 
              id="password" 
              type="password" 
              className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 transition-colors"
          >
            Create Account
          </Button>
        </div>
      </form>
      <div className="mt-4 text-center text-sm">
        <span className="text-slate-400">Already have an account?</span>{" "}
        <Link href="/login" className="text-purple-400 hover:text-purple-300 underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}
