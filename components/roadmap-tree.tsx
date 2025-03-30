"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronDown, Check, Clock } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface RoadmapNode {
  id: string
  name: string
  completed?: boolean
  timeEstimate?: number
  children?: RoadmapNode[]
}

interface RoadmapTreeProps {
  roadmap: RoadmapNode
  updateRoadmap: (roadmap: RoadmapNode) => void
  updateProgress: (progress: number) => void
}

function TreeNode({
  node,
  level = 0,
  onToggleComplete,
  expandedNodes,
  toggleNode,
  isLastChild = false,
  index = 0,
}: {
  node: RoadmapNode
  level?: number
  onToggleComplete: (id: string, completed: boolean) => void
  expandedNodes: Set<string>
  toggleNode: (id: string) => void
  isLastChild?: boolean
  index?: number
}) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)

  // Determine if all children are completed
  const allChildrenCompleted = hasChildren && node.children!.every((child) => child.completed)

  // Determine if some children are completed
  const someChildrenCompleted = hasChildren && node.children!.some((child) => child.completed) && !allChildrenCompleted

  // Checkbox state should reflect children's state
  const checkboxState = hasChildren
    ? allChildrenCompleted
      ? true
      : someChildrenCompleted
        ? "indeterminate"
        : false
    : node.completed

  return (
    <motion.div
      className="select-none relative"
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
            onCheckedChange={(checked) => {
              onToggleComplete(node.id, checked === true || checked === "indeterminate")
            }}
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
          {node.timeEstimate && (
            <div className="flex items-center text-xs rounded-full bg-violet-100 px-2 py-0.5 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              <Clock className="h-3 w-3 mr-1" />
              {node.timeEstimate}h
            </div>
          )}
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
            {/* Visual tree branch line with gradient */}
            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-indigo-500" />

            {node.children!.map((child, index) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector line with gradient */}
                <div className="absolute left-0 top-3 w-3 h-0.5 bg-gradient-to-r from-violet-400 to-indigo-500" />

                <TreeNode
                  node={child}
                  level={level + 1}
                  onToggleComplete={onToggleComplete}
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

export default function RoadmapTree({ roadmap, updateRoadmap, updateProgress }: RoadmapTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([roadmap.id]))
  const [animateTree, setAnimateTree] = useState(false)

  useEffect(() => {
    // Trigger animation when component mounts
    setAnimateTree(true)

    // Expand all nodes initially for the animation effect
    const allNodeIds = getAllNodeIds(roadmap)
    setExpandedNodes(new Set(allNodeIds))

    // Calculate initial progress
    const progress = calculateProgress(roadmap)
    const progressPercentage = Math.round((progress.completed / progress.total) * 100)
    updateProgress(progressPercentage)
  }, [roadmap])

  const getAllNodeIds = (node: RoadmapNode): string[] => {
    let ids = [node.id]

    if (node.children) {
      for (const child of node.children) {
        ids = [...ids, ...getAllNodeIds(child)]
      }
    }

    return ids
  }

  const toggleNode = (id: string) => {
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

  // Update all children's completion status
  const updateChildrenCompletion = (node: RoadmapNode, completed: boolean): RoadmapNode => {
    const updatedNode = { ...node, completed }

    if (node.children && node.children.length > 0) {
      updatedNode.children = node.children.map((child) => updateChildrenCompletion(child, completed))
    }

    return updatedNode
  }

  // Update parent completion status based on children
  const updateParentCompletion = (node: RoadmapNode): RoadmapNode => {
    if (!node.children || node.children.length === 0) {
      return node
    }

    const updatedChildren = node.children.map((child) => updateParentCompletion(child))
    const allChildrenCompleted = updatedChildren.every((child) => child.completed)

    return {
      ...node,
      children: updatedChildren,
      completed: allChildrenCompleted,
    }
  }

  const toggleComplete = (id: string, completed: boolean) => {
    // First, find and update the node and its children
    const updateNodeAndChildren = (node: RoadmapNode): RoadmapNode => {
      if (node.id === id) {
        return updateChildrenCompletion(node, completed)
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeAndChildren),
        }
      }

      return node
    }

    // Apply the initial update
    let updatedRoadmap = updateNodeAndChildren(roadmap)

    // Then update all parent nodes based on their children's status
    updatedRoadmap = updateParentCompletion(updatedRoadmap)

    // Update the roadmap
    updateRoadmap(updatedRoadmap)

    // Calculate and update progress
    const progress = calculateProgress(updatedRoadmap)
    const progressPercentage = Math.round((progress.completed / progress.total) * 100)
    updateProgress(progressPercentage)
  }

  const calculateProgress = (node: RoadmapNode): { total: number; completed: number } => {
    let total = 0
    let completed = 0

    if (!node.children || node.children.length === 0) {
      return { total: 1, completed: node.completed ? 1 : 0 }
    }

    for (const child of node.children) {
      const childProgress = calculateProgress(child)
      total += childProgress.total
      completed += childProgress.completed
    }

    return { total, completed }
  }

  return (
    <div className={cn("p-2 transition-all duration-700", animateTree ? "opacity-100" : "opacity-0")}>
      <TreeNode
        node={roadmap}
        onToggleComplete={toggleComplete}
        expandedNodes={expandedNodes}
        toggleNode={toggleNode}
      />
    </div>
  )
}

