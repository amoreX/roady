"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronDown, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useRoadmapContext } from "@/app/context/roadmapContext"
import { useState } from "react"

interface RoadmapNode {
    id: string;
    name: string;
    timeEstimate: number;
    completed: boolean;
    children?: RoadmapNode[];
}

export default function TreeNode({
  node,
  level = 0,
  expandedNodes,
  toggleNode,
  isLastChild = false,
  index = 0,
}: {
  node: RoadmapNode
  level?: number
  expandedNodes: Set<string>
  toggleNode: (id: string) => void
  isLastChild?: boolean
  index?: number
}) {
  const { roadmap, update } = useRoadmapContext()
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set())

  const toggleComplete = (id: string) => {
    const updateCompletion = (node: RoadmapNode, parentCompleted: boolean): RoadmapNode => ({
      ...node,
      completed: node.id === id ? !node.completed : parentCompleted || node.completed,
      children: node.children?.map((child) =>
        updateCompletion(child, node.id === id ? !node.completed : parentCompleted)
      ),
    })

    const updatedRoadmap = {
      ...roadmap,
      children: roadmap.children.map((child) => updateCompletion(child, false)),
    }

    update(updatedRoadmap)

    setCompletedNodeIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)

  const allChildrenCompleted = hasChildren && node.children!.every((child) => child.completed)
  const someChildrenCompleted = hasChildren && node.children!.some((child) => child.completed) && !allChildrenCompleted

  const checkboxState = hasChildren
    ? allChildrenCompleted
      ? true
      : someChildrenCompleted
        ? "indeterminate"
        : false
    : node.completed

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className={cn("flex items-center py-2 hover:bg-accent/50 rounded-md px-1 relative", level > 0 && "ml-6")}>
        {hasChildren ? (
          <button
            onClick={() => toggleNode(node.id)}
            className="mr-1 p-1 rounded-md hover:bg-accent bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div className="flex items-center gap-2 flex-1">
          <Checkbox
            id={node.id}
            checked={checkboxState}
            onCheckedChange={() => toggleComplete(node.id)}
            className="border-violet-400 data-[state=checked]:bg-violet-500 data-[state=checked]:border-violet-500"
          />
          <label
            htmlFor={node.id}
            className={cn(
              "text-sm cursor-pointer font-medium",
              node.completed ? "line-through text-muted-foreground" : "text-foreground",
            )}
          >
            {node.name}
          </label>
        </div>

        <div className="flex items-center gap-2">
          {node.completed && (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
              <Check className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            className={cn("relative ml-3 pl-6")}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-indigo-500" />

            {node.children!.map((child, index) => (
              <div key={child.id} className="relative">
                <div className="absolute left-0 top-3 w-3 h-0.5 bg-gradient-to-r from-violet-400 to-indigo-500" />

                <TreeNode
                  node={child}
                  level={level + 1}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  isLastChild={index === node.children!.length - 1}
                  index={index}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
