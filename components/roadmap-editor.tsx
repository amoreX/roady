"use client"

import { useState } from "react"
import { Trash2, GripVertical, Clock, Plus, Minus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useRoadmapContext } from "@/app/context/roadmapContext"
import SortableItem from "@/app/routes/editor/SortableItem"

interface RoadmapNode {
  id: string
  name: string
  completed?: boolean
  timeEstimate?: number // Time in hours
  children?: RoadmapNode[]
}

export default function RoadmapEditor() {
  const { roadmap } = useRoadmapContext()
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, 
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [totalTime, setTotalTime] = useState(() => {
    return roadmap ? roadmap.timeEstimate : 0
  })

  function calculateTotalTime(node: RoadmapNode | undefined): number {
    if (!node) return 0

    let total = node.timeEstimate || 0

    if (node.children && node.children.length > 0) {
      total += node.children.reduce((sum, child) => sum + calculateTotalTime(child), 0)
    }

    return total
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = roadmap.children!.findIndex((item) => item.id === active.id)
      const newIndex = roadmap.children!.findIndex((item) => item.id === over.id)

      const newChildren = arrayMove(roadmap.children!, oldIndex, newIndex)
      // setRoadmap({
      //   ...roadmap,
      //   children: newChildren,
      // })
    }
  }

  const handleDeleteTopic = (id: string) => {
    const newChildren = roadmap.children!.filter((item) => item.id !== id)
    const updatedRoadmap = {
      ...roadmap,
      children: newChildren,
    }
    // setRoadmap(updatedRoadmap)
    // setTotalTime(calculateTotalTime(updatedRoadmap))
  }

  return (
    <Card className="border-2 border-violet-200 bg-white/80 backdrop-blur-sm dark:border-violet-900/30 dark:bg-slate-900/80 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 to-indigo-500"></div>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent">
              Customize Your Roadmap
            </h3>
            <p className="text-sm text-muted-foreground">
              Drag to reorder topics or delete unwanted topics.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0 rounded-full bg-violet-100 px-4 py-2 dark:bg-violet-900/30">
            <Clock className="h-5 w-5 text-violet-500" />
            <Label
              htmlFor="total-time"
              className="text-sm font-medium text-violet-700 dark:text-violet-300 whitespace-nowrap"
            >
              Total Time:
            </Label>
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
              {totalTime} hours
            </span>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} modifiers={[]}>
          <SortableContext
            items={roadmap.children?.map((item) => item.id) || []}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0">
              {roadmap.children?.map((topic) => (
                <SortableItem
                  key={topic.id}
                  id={topic.id}
                  name={topic.name}
                  timeEstimate={topic.timeEstimate || 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

