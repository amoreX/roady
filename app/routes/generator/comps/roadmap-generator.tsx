"use client"

import { useState, useEffect,useCallback } from "react"
import { useRouter } from "next/navigation"
import { Search, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useRoadmapContext } from "@/app/context/roadmapContext"
import { getRoad } from "@/app/utils/getRoadmap";
import { Roadmap } from "@/app/context/roadmapContext"
import { toast } from "sonner"

export default function RoadmapGenerator() {
  const { roadmap, update } = useRoadmapContext();
  const router = useRouter()

  const [r, setR] = useState<Roadmap>(); //temporary roadmap storage before updating context
  const [topic, setTopic] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateRoadmap = () => {
    setIsGenerating(true);
    const handleRoadmap = async () => {
      try {
        const generatedRoadmap = await getRoad(topic);
        setR(generatedRoadmap);
        toast("Your Roadmap is successfully loaded.");
      } catch (err) {
        console.log(err);
        toast("Error loading , Try somethign else!");
        setIsGenerating(false);
      }
    };
    handleRoadmap();
  };

  

  useEffect(() => {
    if (r) {
      update(r);
      const timer = setTimeout(() => {
        router.push("/routes/editor");
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [r,update]);

  useEffect(() => {
    console.log(roadmap);
  }, [roadmap]);

  return (
    <div className="mt-8 space-y-8">
      <motion.div initial="hidden" animate="visible" exit="exit"
      //   variants={containerVariants}
      >
        <Card className="mx-auto max-w-2xl overflow-hidden border-2 border-violet-200 bg-white/80 backdrop-blur-sm dark:border-violet-900/30 dark:bg-slate-900/80">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Start Your Learning Journey</h2>
                <p className="text-muted-foreground">Enter a topic to generate a personalized roadmap</p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Enter a topic (e.g., Data Structures and Algorithms)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="border-2 pl-10 pr-4 py-6 text-lg shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-violet-500"
                />
              </div>
              <Button
                onClick={() => handleGenerateRoadmap()}
                disabled={!topic.trim() || isGenerating}
                className="relative w-full overflow-hidden bg-gradient-to-r from-violet-500 to-indigo-500 py-6 text-lg font-medium text-white transition-all hover:shadow-lg hover:shadow-violet-500/25"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Roadmap
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

