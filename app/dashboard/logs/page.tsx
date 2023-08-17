import { Metadata } from "next"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { getCurrentUser } from "@/lib/session"

import { DashboardHeader } from "@/components/pages/dashboard/dashboard-header"
import { Shell } from "@/components/layout/shell"

export const metadata: Metadata = {
  title: "Logs",
  description: "View and modify activity logs.",
}

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/signin")
  }

  const currentDate = new Date()
  const sevenDaysAgo = new Date(currentDate)
  sevenDaysAgo.setDate(currentDate.getDate() - 7)

  const logs = await db.activityLog.findMany({
    select: {
      id: true,
      date: true,
      count: true,
      activity: {
        select: {
          name: true,
        },
      },
    },
    where: {
      date: {
        gte: sevenDaysAgo.toISOString(),
        lte: currentDate.toISOString(),
      },
    },
    orderBy: {
      date: "desc",
    },
  })

  return (
    <Shell>
      <DashboardHeader heading="Logs" text="View and modify activity logs." />
      <div className="grid grid-cols-1 gap-10">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y">
            <tbody className="divide-y">
              {logs.map((log) => (
                <tr key={log.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(log.date).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {log.activity.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">{log.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Shell>
  )
}
