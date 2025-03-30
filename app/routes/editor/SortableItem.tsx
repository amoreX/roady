"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default function SortableItem({
  id,
  name,
  timeEstimate,
}: {
  id: string
  name: string
  timeEstimate?: number
}) {
  return (
    <div className="mb-3">
      <Card className="border-2 border-violet-200 dark:border-violet-900/30 bg-white/90 backdrop-blur-sm dark:bg-slate-900/90">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {id}
            </div>
            <span className="font-medium">{name}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 dark:bg-violet-900/30">
              <Clock className="h-4 w-4 text-violet-500" />
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                {timeEstimate || 0} hrs
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
