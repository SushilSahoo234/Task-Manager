"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
          Task Manager
        </h1>
        <p className="text-zinc-500 text-sm mb-8">
          Manage your tasks efficiently. Login or register to get started.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg px-4 py-3 transition-colors duration-200"
          >
            Sign in
          </button>
          <button
            onClick={() => router.push("/register")}
            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold rounded-lg px-4 py-3 transition-colors duration-200"
          >
            Create an account
          </button>
        </div>
        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-zinc-800" />
          <span className="text-xs text-zinc-600">features</span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {["Add & Delete", "Search & Filter", "Toggle tasks", "and much more..."].map((f) => (
            <span
              key={f}
              className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700 px-3 py-1 rounded-full"
            >
              {f}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
}