"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { useRoadmapContext } from "@/app/context/roadmapContext"
import TreeNode from "@/app/routes/tree/comp/TreeNode"
import {
  getAllNodeIds,
  updateChildrenCompletion,
  updateParentCompletion,
  calculateProgress,
} from "@/app/routes/tree/comp/utils"


interface RoadmapNode {
  id: string;
  name: string;
  timeEstimate: number;
  completed: boolean;
  children?: RoadmapNode[];
}


export default function RoadmapTree() {
  const { roadmap, getProgress, update,updateByNode } = useRoadmapContext()
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(roadmap ? [roadmap.id] : []))
  const [animateTree, setAnimateTree] = useState(false)

  useEffect(() => {
    if (!roadmap) return

    setAnimateTree(true)
    const allNodeIds = getAllNodeIds(roadmap)
    setExpandedNodes(new Set(allNodeIds))
    const progressPercentage = getProgress
  }, [roadmap])

  const toggleNode = (id: string) => {   //Expand and contract Lists
    setExpandedNodes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  

  return (
    <div className={cn("p-2 transition-all duration-700", animateTree ? "opacity-100" : "opacity-0")}>
      {roadmap && (
        <TreeNode
          node={roadmap}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      )}
    </div>
  )
}

