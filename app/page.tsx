"use client"
import { motion } from "framer-motion";
import RoadmapGenerator from "@/app/routes/generator/comps/roadmap-generator";

export default function Home() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex justify-center bg-gradient-to-br from-violet-50 via-background to-blue-50 dark:from-slate-950 dark:via-background dark:to-slate-900"
    >
      <div className="absolute inset-0 bg-grid-slate-200/50 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] dark:bg-grid-slate-800/20"></div>
      <div className="container relative py-8 md:py-12">
        <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 p-1 shadow-lg">
            <div className="rounded-full bg-white p-2 dark:bg-slate-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-violet-500"
              >
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            </div>
          </div>
          <h1 className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-3xl font-extrabold leading-tight tracking-tighter text-transparent md:text-5xl lg:text-6xl">
            Roadmap Generator
          </h1>
          <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Create customized learning paths for any topic with our interactive tool
          </p>
        </div>
        <RoadmapGenerator />
      </div>
    </motion.main>
  );
}

