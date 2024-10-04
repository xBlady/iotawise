"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useSearchParams } from 'next/navigation'

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Icons } from "@/components/icons"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('from') || '/dashboard'

  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false)

  const handleSignIn = async (provider: string) => {
    setIsLoading(true)
    if (provider === 'google') setIsGoogleLoading(true)
    if (provider === 'github') setIsGithubLoading(true)
    try {
      const result = await signIn(provider, { callbackUrl, redirect: false })
      if (result?.error) {
        console.error("Sign In Error:", result.error)
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Sign In Error:", error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
      setIsGoogleLoading(false)
      setIsGithubLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-2", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => handleSignIn('google')}
        disabled={isGoogleLoading || isLoading}
      >
        {isGoogleLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.google className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Google
      </button>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => handleSignIn('github')}
        disabled={isGithubLoading || isLoading}
      >
        {isGithubLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.github className="mr-2 h-4 w-4" />
        )}{" "}
        Continue with Github
      </button>
    </div>
  )
}
