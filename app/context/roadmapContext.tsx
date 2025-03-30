"use client"

import { createContext,useContext,useState,ReactNode } from "react"

interface RoadmapNode {
    id: string;
    name: string;
    timeEstimate:number;
    completed:Boolean;
    children?: RoadmapNode[];
}

export interface Roadmap{
    id: string;
    name:string;
    timeEstimate:number;
    children:RoadmapNode[];
}

interface RoadmapContextProps{
    roadmap:Roadmap;
    update:(roadmap?:Roadmap)=>void;
    toggleCompletion:(id:string)=>void;
    deleteNodeById:(id:string)=>void;
}

const sampleRoadmap = {
    id: "root",
    name: "Data Structures and Algorithms",
    timeEstimate: 40,
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
      {
        id: "3",
        name: "Sliding Window",
        completed: false,
        timeEstimate: 12,
        children: [
          { id: "3-1", name: "Best Time to Buy & Sell Stock", completed: false, timeEstimate: 4 },
          { id: "3-2", name: "Longest Substring Without Repeating Characters", completed: false, timeEstimate: 8 },
        ],
      },
      {
        id: "4",
        name: "Stack",
        completed: false,
        timeEstimate: 10,
        children: [
          { id: "4-1", name: "Valid Parentheses", completed: false, timeEstimate: 4 },
          { id: "4-2", name: "Min Stack", completed: false, timeEstimate: 6 },
        ],
      },
    ],
  }

const RoadmapContext=createContext<RoadmapContextProps |undefined>(undefined);

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

export const RoadmapProvider=({children}:{children:ReactNode})=>{
    const [roadmap,setRoadmap]=useState<Roadmap>(sampleRoadmap);
    
    const update=(roadmap?:Roadmap)=>{
        if(roadmap){
            setRoadmap(roadmap);
        }
    }

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
    
    return (
        <RoadmapContext.Provider value={{ roadmap, update, toggleCompletion, deleteNodeById }}>
          {children}
        </RoadmapContext.Provider>
    );
};

export const useRoadmapContext = () => {
	const context = useContext(RoadmapContext);
	if (!context) {
	  throw new Error("error using RoadmapContext");
	}
	return context;
};