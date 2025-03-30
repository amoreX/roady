"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoadmapTree from "@/components/roadmap-tree"
import { useRoadmapContext } from "@/app/context/roadmapContext"

export default function RoadmapTreePage() {
  const router = useRouter()
  const { roadmap, update, getProgress, delLocal } = useRoadmapContext()

  if (!roadmap) return null; // Ensure rendering only if roadmap is not null

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-white/80 p-4 backdrop-blur-sm shadow-sm dark:bg-slate-900/80">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
            {roadmap.name}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-[200px] h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-1000 ease-out"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{`${getProgress()}`}% complete</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { delLocal(); router.push("/") }} className="border-violet-200 dark:border-violet-900/30">
            Reset
          </Button>
        </div>
      </div>
      <RoadmapTree />
    </div>
  )
}
