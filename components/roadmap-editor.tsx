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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface RoadmapNode {
  id: string
  name: string
  completed?: boolean
  timeEstimate?: number // Time in hours
  children?: RoadmapNode[]
}

interface RoadmapEditorProps {
  roadmap: RoadmapNode
  setRoadmap: (roadmap: RoadmapNode) => void
}

function SortableItem({
  id,
  name,
  timeEstimate,
  onDelete,
  onTimeChange,
}: {
  id: string
  name: string
  timeEstimate?: number
  onDelete: () => void
  onTimeChange: (hours: number) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className={`mb-3 ${isDragging ? "z-50" : "z-10"}`}>
      <Card
        className={`border-2 ${isDragging ? "border-violet-500 shadow-lg" : "border-violet-200 dark:border-violet-900/30"} bg-white/90 backdrop-blur-sm dark:bg-slate-900/90`}
      >
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="touch-none cursor-grab rounded-md p-1 hover:bg-violet-100 dark:hover:bg-violet-900/30"
            >
              <GripVertical className="h-5 w-5 text-violet-500" />
            </div>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
              {id}
            </div>
            <span className="font-medium">{name}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 dark:bg-violet-900/30">
              <Clock className="h-4 w-4 text-violet-500" />
              <div className="flex items-center">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 text-violet-700 hover:bg-violet-200 dark:text-violet-300 dark:hover:bg-violet-800/50"
                  onClick={() => onTimeChange(Math.max(0, (timeEstimate || 0) - 0.5))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <Input
                  type="number"
                  value={timeEstimate || 0}
                  onChange={(e) => onTimeChange(Number.parseFloat(e.target.value) || 0)}
                  className="h-7 w-14 border-0 bg-transparent p-0 text-center text-sm font-medium text-violet-700 focus-visible:ring-0 dark:text-violet-300"
                  min="0"
                  step="0.5"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 rounded-full p-0 text-violet-700 hover:bg-violet-200 dark:text-violet-300 dark:hover:bg-violet-800/50"
                  onClick={() => onTimeChange((timeEstimate || 0) + 0.5)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">hrs</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-8 w-8 rounded-full text-red-500 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function RoadmapEditor({ roadmap, setRoadmap }: RoadmapEditorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const [totalTime, setTotalTime] = useState(() => {
    return calculateTotalTime(roadmap)
  })

  function calculateTotalTime(node: RoadmapNode): number {
    let total = node.timeEstimate || 0

    if (node.children) {
      for (const child of node.children) {
        total += calculateTotalTime(child)
      }
    }

    return total
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = roadmap.children!.findIndex((item) => item.id === active.id)
      const newIndex = roadmap.children!.findIndex((item) => item.id === over.id)

      const newChildren = arrayMove(roadmap.children!, oldIndex, newIndex)
      setRoadmap({
        ...roadmap,
        children: newChildren,
      })
    }
  }

  const handleDeleteTopic = (id: string) => {
    const newChildren = roadmap.children!.filter((item) => item.id !== id)
    const updatedRoadmap = {
      ...roadmap,
      children: newChildren,
    }
    setRoadmap(updatedRoadmap)
    setTotalTime(calculateTotalTime(updatedRoadmap))
  }

  const handleTimeChange = (id: string, hours: number) => {
    const updateNodeTime = (node: RoadmapNode): RoadmapNode => {
      if (node.id === id) {
        return { ...node, timeEstimate: hours }
      }

      if (node.children) {
        return {
          ...node,
          children: node.children.map(updateNodeTime),
        }
      }

      return node
    }

    const updatedRoadmap = updateNodeTime(roadmap)
    setRoadmap(updatedRoadmap)
    setTotalTime(calculateTotalTime(updatedRoadmap))
  }

  const handleTotalTimeChange = (hours: number) => {
    setTotalTime(hours)
    // You could distribute this time proportionally among topics if desired
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
              Drag to reorder topics, delete unwanted topics, or set time estimates.
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
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full p-0 text-violet-700 hover:bg-violet-200 dark:text-violet-300 dark:hover:bg-violet-800/50"
                onClick={() => handleTotalTimeChange(Math.max(0, totalTime - 1))}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <Input
                id="total-time"
                type="number"
                value={totalTime}
                onChange={(e) => handleTotalTimeChange(Number.parseInt(e.target.value) || 0)}
                className="h-8 w-16 border-0 bg-transparent p-0 text-center text-sm font-medium text-violet-700 focus-visible:ring-0 dark:text-violet-300"
                min="0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full p-0 text-violet-700 hover:bg-violet-200 dark:text-violet-300 dark:hover:bg-violet-800/50"
                onClick={() => handleTotalTimeChange(totalTime + 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-sm font-medium text-violet-700 dark:text-violet-300">hours</span>
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
                  onDelete={() => handleDeleteTopic(topic.id)}
                  onTimeChange={(hours) => handleTimeChange(topic.id, hours)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  )
}

