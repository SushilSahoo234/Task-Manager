"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

type Filter = "all" | "done" | "pending";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) window.location.href = "/login";
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost:5000/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;
    try {
      await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ title }),
      });
      toast.success("Task added");
      setTitle("");
      fetchTasks();
    } catch {
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (id: string) => {
    if (!editTitle.trim()) return;
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ title: editTitle }),
      });
      toast.success("Task updated");
      setEditId(null);
      setEditTitle("");
      fetchTasks();
    } catch {
      toast.error("Failed to update task");
    }
  };

  const toggleTask = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      fetchTasks();
    } catch {
      toast.error("Failed to toggle task");
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      toast.success("Task deleted");
      fetchTasks();
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTask();
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  const filteredTasks = tasks
    .filter((t) => {
      if (filter === "done") return t.completed;
      if (filter === "pending") return !t.completed;
      return true;
    })
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  const bg = dark ? "bg-zinc-950" : "bg-zinc-100";
  const card = dark ? "bg-zinc-900 border-zinc-800" : "bg-white border-zinc-200";
  const input = dark
    ? "bg-zinc-800 border-zinc-700 text-white placeholder-zinc-600 focus:border-emerald-500 focus:ring-emerald-500"
    : "bg-zinc-100 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:ring-emerald-500";
  const taskCard = dark ? "bg-zinc-800 border-zinc-700" : "bg-zinc-50 border-zinc-200";
  const textPrimary = dark ? "text-white" : "text-zinc-900";
  const textMuted = dark ? "text-zinc-500" : "text-zinc-400";
  const textLabel = dark ? "text-zinc-400" : "text-zinc-500";
  const toggleBg = dark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-zinc-200 hover:bg-zinc-300";

  const filterBtn = (value: Filter, label: string) => {
    const active = filter === value;
    return (
      <button
        onClick={() => setFilter(value)}
        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 ${active
            ? "bg-emerald-500 text-white"
            : dark
              ? "text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
              : "text-zinc-500 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200"
          }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={`min-h-screen ${bg} transition-colors duration-300 px-4 py-10`}>
      <div className="w-full max-w-lg mx-auto space-y-6">

        <div className={`${card} border rounded-2xl p-6 shadow-2xl`}>
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <div>
                <h1 className={`text-lg font-bold ${textPrimary} leading-tight`}>Task Dashboard</h1>
                <p className={`text-xs ${textMuted}`}>
                  {completedCount} of {tasks.length} completed
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDark(!dark)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${toggleBg} transition-colors duration-200`}
                title={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? (
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                  </svg>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-2 rounded-xl transition-colors duration-200"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                </svg>
                Logout
              </button>
            </div>
          </div>
          {tasks.length > 0 && (
            <div className="mt-5">
              <div className={`w-full h-1.5 rounded-full ${dark ? "bg-zinc-800" : "bg-zinc-200"}`}>
                <div
                  className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(completedCount / tasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className={`${card} border rounded-2xl p-6 shadow-2xl`}>
          <label className={`text-xs font-medium ${textLabel} uppercase tracking-widest mb-3 block`}>
            New Task
          </label>
          <div className="flex gap-2">
            <input
              className={`flex-1 ${input} border rounded-lg px-4 py-3 text-sm outline-none focus:ring-1 transition-all duration-200`}
              placeholder="What needs to be done?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={addTask}
              className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold px-4 py-3 rounded-lg transition-colors duration-200 flex items-center gap-1.5 flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Add
            </button>
          </div>
        </div>
        <div className={`${card} border rounded-2xl p-4 shadow-2xl space-y-3`}>
          <div className={`flex items-center gap-2 ${dark ? "bg-zinc-800" : "bg-zinc-100"} rounded-lg px-3 py-2.5 border ${dark ? "border-zinc-700" : "border-zinc-200"} focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all duration-200`}>
            <svg className={`w-4 h-4 flex-shrink-0 ${textMuted}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              className={`flex-1 bg-transparent text-sm outline-none ${dark ? "text-white placeholder-zinc-600" : "text-zinc-900 placeholder-zinc-400"}`}
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className={`${textMuted} hover:${textPrimary} transition-colors`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs ${textMuted} mr-1`}>Filter:</span>
            {filterBtn("all", `All (${tasks.length})`)}
            {filterBtn("pending", `Pending (${tasks.length - completedCount})`)}
            {filterBtn("done", `Done (${completedCount})`)}
          </div>
        </div>
        <div className={`${card} border rounded-2xl shadow-2xl overflow-hidden`}>
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6">
              <div className={`w-12 h-12 rounded-2xl ${dark ? "bg-zinc-800" : "bg-zinc-100"} flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                </svg>
              </div>
              <p className={`text-sm font-medium ${textPrimary}`}>
                {search ? "No tasks match your search" : "No tasks yet"}
              </p>
              <p className={`text-xs ${textMuted} mt-1`}>
                {search ? "Try a different keyword" : "Add a task above to get started"}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-transparent p-3 space-y-2">
              {filteredTasks.map((task) => (
                <li key={task.id} className={`${taskCard} border rounded-xl p-4 transition-colors duration-200`}>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${task.completed
                          ? "bg-emerald-500 border-emerald-500"
                          : dark
                            ? "border-zinc-600 hover:border-emerald-500"
                            : "border-zinc-300 hover:border-emerald-500"
                        }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                    </button>
                    {editId === task.id ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && updateTask(task.id)}
                        autoFocus
                        className={`flex-1 ${input} border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 transition-all duration-200`}
                      />
                    ) : (
                      <span className={`flex-1 text-sm ${task.completed ? `line-through ${textMuted}` : textPrimary}`}>
                        {task.title}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {editId === task.id ? (
                        <>
                          <button
                            onClick={() => updateTask(task.id)}
                            className="text-xs font-medium text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1.5 rounded-lg transition-colors duration-200"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => { setEditId(null); setEditTitle(""); }}
                            className={`text-xs font-medium ${dark ? "text-zinc-400 bg-zinc-700 hover:bg-zinc-600" : "text-zinc-500 bg-zinc-200 hover:bg-zinc-300"} px-2.5 py-1.5 rounded-lg transition-colors duration-200`}
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => { setEditId(task.id); setEditTitle(task.title); }}
                          className={`w-7 h-7 flex items-center justify-center rounded-lg ${dark ? "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700" : "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200"} transition-colors duration-200`}
                          title="Edit"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                        </button>
                      )}

                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-zinc-500 hover:text-red-400 ${dark ? "hover:bg-red-500/10" : "hover:bg-red-50"} transition-colors duration-200`}
                        title="Delete"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {tasks.length > 0 && (
          <p className={`text-center text-xs ${textMuted}`}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""} shown
            {" · "}
            {tasks.length - completedCount} remaining
          </p>
        )}

      </div>
    </div>
  );
}