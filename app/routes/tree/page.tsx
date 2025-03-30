"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import RoadmapTree from "@/components/roadmap-tree"

export default function RoadmapTreePage({ roadmap, progress, updateProgress }: any) {
  const router = useRouter()

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
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium">{progress}% complete</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/routes/roadmapeditor")} className="border-violet-200 dark:border-violet-900/30">
            Customize
          </Button>
          <Button variant="outline" onClick={() => router.push("/")} className="border-violet-200 dark:border-violet-900/30">
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tree" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 p-1 rounded-lg">
          <TabsTrigger
            value="tree"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            Tree View
          </TabsTrigger>
          <TabsTrigger
            value="progress"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white"
          >
            Progress
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tree" className="mt-4">
          <RoadmapTree roadmap={roadmap} updateRoadmap={() => {}} updateProgress={updateProgress} />
        </TabsContent>
        <TabsContent value="progress" className="mt-4">
          {/* Progress content */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
