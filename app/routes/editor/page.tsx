"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import RoadmapEditor from "@/components/roadmap-editor"
import { useRoadmapContext } from "@/app/context/roadmapContext"
import Modal from "@/components/ui/modal" // Assuming a Modal component exists
import { AnimatePresence, motion } from "framer-motion"
import {getCustom} from "@/app/utils/customiseRoadmap"
import { toast } from "sonner"
import { FaSpinner } from "react-icons/fa" // Import spinner icon

export default function RoadmapEditorPage() {
  const router = useRouter()
  const {roadmap,update}=useRoadmapContext();
  const [isModalOpen, setModalOpen] = useState(false)
  const [cust,setCust]=useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const handleFinalizeRoadmap = () => {
    router.push("/routes/tree")
  }

  const handleSubmit=()=>{
    const handleRoadmap = async () => {
      try {
        setIsLoading(true); // Set loading to true
        const generatedRoadmap = await getCustom(cust,JSON.stringify(roadmap));
        update(generatedRoadmap);
        setModalOpen(false);
        toast("Your Roadmap is successfully modified.");
        window.location.reload(); // Reload the page
      } catch (err) {
        console.log(err);
        toast("Error loading , Try somethign else!");
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };
    handleRoadmap();
  }
  if (!roadmap) return null;
  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg bg-white/80 p-4 backdrop-blur-sm shadow-sm dark:bg-slate-900/80">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
          {roadmap.name}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/")} className="border-violet-200 dark:border-violet-900/30">
            Reset
          </Button>
          <Button variant="outline" onClick={() => setModalOpen(true)} className="border-violet-200 dark:border-violet-900/30">
            Customize
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
      <AnimatePresence>
      {isModalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="p-6 space-y-4"
            >
              <h3 className="text-lg font-bold">Customize Roadmap</h3>
              <input
                type="text"
                value={cust}
                onChange={(e)=>setCust(e.target.value)}
                placeholder="Enter customization details"
                className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <div className="flex justify-end gap-2 pt-4">
                <Button onClick={() => setModalOpen(false)} className="px-4 py-2">
                  Close
                </Button>
                <Button onClick={() => handleSubmit()} className="px-4 py-2 bg-violet-500 text-white hover:bg-violet-600">
                  {isLoading ? <FaSpinner className="animate-spin" /> : "Submit"} {/* Show spinner when loading */}
                </Button>
              </div>
            </motion.div>
          </Modal>
      )}
      </AnimatePresence>
    </div>
  )
}
