"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface RoadmapNode {
    id: string;
    name: string;
    timeEstimate: number;
    completed: boolean;
    children?: RoadmapNode[];
}

export interface Roadmap {
    id: string;
    name: string;
    completed:boolean;
    timeEstimate: number;
    children: RoadmapNode[];
}

interface RoadmapContextProps {
    roadmap: Roadmap;
    update: (roadmap?: Roadmap) => void;
    toggleCompletion: (id: string) => void;
    deleteNodeById: (id: string) => void;
    getProgress: () => number;
    updateByNode: (updatedNode: RoadmapNode) => void;
}

const sampleRoadmap: Roadmap = {
    id: "root",
    name: "Data Structures and Algorithms",
    timeEstimate: 40,
    completed:false,
    children: [
        {
            id: "1",
            name: "Arrays & Hashing",
            completed: false,
            timeEstimate: 10,
            children: [
                { id: "1-1", name: "Two Sum", completed: false, timeEstimate: 2 },
                { id: "1-2", name: "Valid Anagram", completed: false, timeEstimate: 3 },
                { id: "1-3", name: "Group Anagrams", completed: false, timeEstimate: 5 },
            ],
        },
        {
            id: "2",
            name: "Two Pointers",
            completed: false,
            timeEstimate: 8,
            children: [
                { id: "2-1", name: "Valid Palindrome", completed: false, timeEstimate: 3 },
                { id: "2-2", name: "3Sum", completed: false, timeEstimate: 5 },
            ],
        },
    ],
};

const RoadmapContext = createContext<RoadmapContextProps | undefined>(undefined);

/**
 * Recursively toggles the completion of a node.
 */
const updateCompletion = (node: RoadmapNode, id: string): RoadmapNode => ({
    ...node,
    completed: node.id === id ? !node.completed : node.completed,
    children: node.children?.map((child) => updateCompletion(child, id)),
});

const deleteNode = (node: RoadmapNode, id: string): RoadmapNode | null => {
    if (node.id === id) return null;
    return {
        ...node,
        children: node.children
            ?.map((child) => deleteNode(child, id))
            .filter((child) => child !== null) as RoadmapNode[],
    };
};

/**
 * Recursively updates a node by matching its ID.
 */
const updateNode = (node: RoadmapNode, updatedNode: RoadmapNode): RoadmapNode => {
    if (node.id === updatedNode.id) {
        return { ...updatedNode };
    }
    return {
        ...node,
        children: node.children?.map((child) => updateNode(child, updatedNode)),
    };
};

/**
 * Recursively calculates the number of completed and total nodes.
 */
const calculateProgress = (nodes: RoadmapNode[]): { completed: number; total: number } => {
    let completed = 0;
    let total = 0;

    nodes.forEach((node) => {
        if (node.completed) completed++;
        total++;

        if (node.children) {
            const childProgress = calculateProgress(node.children);
            completed += childProgress.completed;
            total += childProgress.total;
        }
    });

    return { completed, total };
};

export const RoadmapProvider = ({ children }: { children: ReactNode }) => {
    const [roadmap, setRoadmap] = useState<Roadmap>(sampleRoadmap);

    const update = (roadmap?: Roadmap) => {
        if (roadmap) {
            setRoadmap(roadmap);
        }
    };

    const toggleCompletion = (id: string) => {
        setRoadmap((prev) => ({
            ...prev,
            children: prev.children.map((child) => updateCompletion(child, id)),
        }));
    };

    const deleteNodeById = (id: string) => {
        setRoadmap((prev) => ({
            ...prev,
            children: prev.children
                .map((child) => deleteNode(child, id))
                .filter((child) => child !== null) as RoadmapNode[],
        }));
    };

    const updateByNode = (updatedNode: RoadmapNode) => {
        setRoadmap((prev) => ({
            ...prev,
            children: prev.children.map((child) => updateNode(child, updatedNode)),
        }));
    };

    const getProgress = () => {
        const { completed, total } = calculateProgress(roadmap.children);
        return total > 0 ? (completed / total) * 100 : 0;
    };

    return (
        <RoadmapContext.Provider value={{ roadmap, update, toggleCompletion, deleteNodeById, getProgress, updateByNode }}>
            {children}
        </RoadmapContext.Provider>
    );
};

export const useRoadmapContext = () => {
    const context = useContext(RoadmapContext);
    if (!context) {
        throw new Error("Error using RoadmapContext");
    }
    return context;
};
