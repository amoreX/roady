// import { RoadmapNode } from "@/app/context/roadmapContext"
interface RoadmapNode {
    id: string;
    name: string;
    timeEstimate: number;
    completed: boolean;
    children?: RoadmapNode[];
}

export const getAllNodeIds = (node: RoadmapNode): string[] => {
  let ids = [node.id]

  if (node.children) {
    for (const child of node.children) {
      ids = [...ids, ...getAllNodeIds(child)]
    }
  }

  return ids
}

export const updateChildrenCompletion = (node: RoadmapNode, completed: boolean): RoadmapNode => {
  const updatedNode: RoadmapNode = {
    ...node,
    completed,
    timeEstimate: node.timeEstimate,
  }

  if (node.children && node.children.length > 0) {
    updatedNode.children = node.children.map((child) => updateChildrenCompletion(child, completed))
  }

  return updatedNode
}

export const updateParentCompletion = (node: RoadmapNode): RoadmapNode => {
  if (!node.children || node.children.length === 0) {
    return { ...node, timeEstimate: node.timeEstimate }
  }

  const updatedChildren = node.children.map((child) => updateParentCompletion(child))
  const allChildrenCompleted = updatedChildren.every((child) => child.completed)

  return {
    ...node,
    children: updatedChildren,
    completed: allChildrenCompleted,
    timeEstimate: node.timeEstimate,
  }
}

export const calculateProgress = (node: RoadmapNode): { total: number; completed: number } => {
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
