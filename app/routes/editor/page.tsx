"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import RoadmapEditor from "@/components/roadmap-editor"
import { useRoadmapContext } from "@/app/context/roadmapContext"
export default function RoadmapEditorPage() {
  const router = useRouter()
  const {roadmap}=useRoadmapContext();
  const handleFinalizeRoadmap = () => {
    router.push("/routes/tree")
  }
  if (!roadmap) return null;
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-white/80 p-4 backdrop-blur-sm shadow-sm dark:bg-slate-900/80">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
          {roadmap.name}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")} className="border-violet-200 dark:border-violet-900/30">
            Reset
          </Button>
          <Button
            onClick={handleFinalizeRoadmap}
            className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:shadow-md hover:shadow-violet-500/25"
          >
            Finalize Roadmap
          </Button>
        </div>
      </div>
      <RoadmapEditor  />
    </div>
  )
}
