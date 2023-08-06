"use client"

import * as React from "react"
import { signIn } from "next-auth/react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { AiFillGoogleCircle } from "react-icons/ai"
import { ImSpinner4 } from "react-icons/im"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <button
        type="button"
        className={cn(buttonVariants({ variant: "outline" }))}
        onClick={() => {
          setIsLoading(true)
          signIn("google")
        }}
        disabled={isLoading || isLoading}
      >
        {isLoading ? (
          <ImSpinner4 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <AiFillGoogleCircle className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </button>
    </div>
  )
}
