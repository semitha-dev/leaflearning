"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  PlusCircle,
  Edit,
  Check,
  X,
  Star,
  Trash2,
  CheckSquare,
  Calendar,
  AlignLeft,
  Inbox,
  Search,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

/* ================== Types ================== */
interface TodoItem {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  createdAt: string;
  dueDate?: string;
}

type View = "inbox" | "overdue";

/* ================== Helpers (palette-aligned) ================== */
const PRI_COLOR = {
  High: "text-rose-700 ring-rose-200 bg-rose-50",      // danger/urgent
  Medium: "text-amber-700 ring-amber-200 bg-amber-50",  // primary accent
  Low: "text-stone-700 ring-stone-200 bg-stone-50",     // calm neutral
};

function formatDateHuman(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  const today = new Date();
  const t0 = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const dn = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = (dn - t0) / 86400000;
  if (dayDiff === 0) return "Today";
  if (dayDiff === 1) return "Tomorrow";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function startOfDay(ts = new Date()) {
  return new Date(ts.getFullYear(), ts.getMonth(), ts.getDate());
}
function isOverdue(todo: TodoItem) {
  if (!todo.dueDate || todo.completed) return false;
  const d = startOfDay(new Date(todo.dueDate)).getTime();
  const t0 = startOfDay(new Date()).getTime();
  return d < t0;
}

/* ================== Component ================== */
export default function TodoApp() {
  // State
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  // Quick add (inline)
  const [inlineOpen, setInlineOpen] = useState(false);
  const [inlineTitle, setInlineTitle] = useState("");
  const [inlineDue, setInlineDue] = useState("");
  const [inlinePri, setInlinePri] = useState<"High" | "Medium" | "Low">("Medium");

  // Modal add
  const [newTask, setNewTask] = useState({
    text: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    dueDate: "",
  });

  // Sidebar view & filter state
  const [view, setView] = useState<View>("inbox");
  const [priorityFilter, setPriorityFilter] = useState<"All" | "High" | "Medium" | "Low">("All");

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("todos");
      if (saved) {
        setTodos(JSON.parse(saved));
      } else {
        setTodos([
          {
            id: 1,
            text: "Create a Visual Style Guide",
            description: "Design a comprehensive style guide for the project",
            completed: false,
            priority: "High",
            createdAt: new Date().toISOString(),
            dueDate: new Date().toISOString().slice(0, 10),
          },
          {
            id: 2,
            text: "Testing and User Feedback",
            description: "Conduct user testing sessions and gather feedback",
            completed: false,
            priority: "Medium",
            createdAt: new Date().toISOString(),
            dueDate: "",
          },
          {
            id: 3,
            text: "Meetings with Client",
            description: "Weekly progress update meeting",
            completed: true,
            priority: "Low",
            createdAt: new Date().toISOString(),
            dueDate: "",
          },
        ]);
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [todos]);

  // Close modal via Esc
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setInlineOpen(false);
        setEditingId(null);
      }
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  // Base groups
  const activeTodos = useMemo(() => todos.filter((t) => !t.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter((t) => t.completed), [todos]);
  const overdueCount = activeTodos.filter((t) => isOverdue(t)).length;

  // Derived: apply view + priority filters to ACTIVE list
  const filteredActive = useMemo(() => {
    let list = activeTodos;
    if (view === "overdue") {
      list = list.filter(isOverdue);
    }
    if (priorityFilter !== "All") {
      list = list.filter((t) => t.priority === priorityFilter);
    }
    return list;
  }, [activeTodos, view, priorityFilter]);

  // Derived: optionally filter COMPLETED list by same priority (keeps UI consistent)
  const filteredCompleted = useMemo(() => {
    let list = completedTodos;
    if (priorityFilter !== "All") {
      list = list.filter((t) => t.priority === priorityFilter);
    }
    return list;
  }, [completedTodos, priorityFilter]);

  // Title for current view
  const viewTitle = useMemo(() => (view === "overdue" ? "Overdue" : "Inbox"), [view]);

  /* =============== Handlers =============== */
  const addTodoModal = () => {
    if (!newTask.text.trim()) return;
    const todo: TodoItem = {
      id: Date.now(),
      text: newTask.text.trim(),
      description: newTask.description.trim() || undefined,
      completed: false,
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || undefined,
    };
    setTodos((prev) => [...prev, todo]);
    setNewTask({ text: "", description: "", priority: "Medium", dueDate: "" });
    setIsModalOpen(false);
  };

  const addTodoInline = () => {
    if (!inlineTitle.trim()) return;
    const todo: TodoItem = {
      id: Date.now(),
      text: inlineTitle.trim(),
      description: undefined,
      completed: false,
      priority: inlinePri,
      createdAt: new Date().toISOString(),
      dueDate: inlineDue || undefined,
    };
    setTodos((prev) => [...prev, todo]);
    setInlineTitle("");
    setInlineDue("");
    setInlinePri("Medium");
    setInlineOpen(false);
  };

  const deleteTodo = (id: number) => setTodos((prev) => prev.filter((t) => t.id !== id));

  const deleteAllCompleted = () =>
    setTodos((prev) => prev.filter((t) => !t.completed));

  const toggleComplete = (id: number) =>
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );

  const startEditing = (e: React.MouseEvent, id: number, text: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!editText.trim()) return;
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, text: editText.trim() } : t)));
    setEditingId(null);
    setEditText("");
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
    setEditText("");
  };

  const togglePriority = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              priority: t.priority === "High" ? "Medium" : t.priority === "Medium" ? "Low" : "High",
            }
          : t
      )
    );
  };

  const handleModalInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  /* =============== UI subcomponents (palette updates) =============== */
  const Sidebar = () => (
    <aside className="hidden md:flex md:w-64 flex-col gap-2 p-3 border-r border-amber-200 bg-amber-50/50">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-stone-700 hover:text-stone-900 px-2 py-1 rounded hover:bg-white/70 ring-1 ring-transparent hover:ring-amber-200"
      >
        <ArrowLeft size={18} />
        Back
      </Link>

      <div className="mt-2 space-y-1">
        <button
          onClick={() => setView("inbox")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/70 ring-1 ${
            view === "inbox" ? "bg-white/90 ring-amber-200" : "ring-transparent"
          }`}
          aria-pressed={view === "inbox"}
        >
          <span className="inline-flex items-center gap-2 text-sm text-stone-800">
            <Inbox size={18} className="text-stone-700" />
            Inbox
          </span>
          <span className="text-xs text-stone-600">{activeTodos.length}</span>
        </button>

        <button
          onClick={() => setView("overdue")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/70 ring-1 ${
            view === "overdue" ? "bg-white/90 ring-amber-200" : "ring-transparent"
          }`}
          aria-pressed={view === "overdue"}
        >
          <span className="inline-flex items-center gap-2 text-sm text-stone-800">
            <CheckSquare size={18} className="text-stone-700" />
            Overdue
          </span>
          <span className="text-xs text-stone-600">{overdueCount}</span>
        </button>
      </div>

      <div className="mt-4">
        <div className="text-xs font-semibold text-stone-600 px-3 mb-1">Filters</div>
        <div className="space-y-1">
          <button
            onClick={() => setPriorityFilter("High")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/70 ring-1 ${
              priorityFilter === "High" ? "bg-white/90 ring-amber-200" : "ring-transparent"
            }`}
            aria-pressed={priorityFilter === "High"}
          >
            <span className="text-sm text-stone-800">High Priority</span>
            <span className="h-2 w-2 rounded-full bg-rose-600" />
          </button>
          <button
            onClick={() => setPriorityFilter("Medium")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/70 ring-1 ${
              priorityFilter === "Medium" ? "bg-white/90 ring-amber-200" : "ring-transparent"
            }`}
            aria-pressed={priorityFilter === "Medium"}
          >
            <span className="text-sm text-stone-800">Medium Priority</span>
            <span className="h-2 w-2 rounded-full bg-amber-600" />
          </button>
          <button
            onClick={() => setPriorityFilter("Low")}
            className={`w-full flex items-center justify-between px-3 py-2 rounded hover:bg-white/70 ring-1 ${
              priorityFilter === "Low" ? "bg-white/90 ring-amber-200" : "ring-transparent"
            }`}
            aria-pressed={priorityFilter === "Low"}
          >
            <span className="text-sm text-stone-800">Low Priority</span>
            <span className="h-2 w-2 rounded-full bg-stone-600" />
          </button>
          {priorityFilter !== "All" && (
            <button
              onClick={() => setPriorityFilter("All")}
              className="w-full text-left text-xs text-stone-700 px-3 py-1 rounded hover:bg-white/70 ring-1 ring-transparent hover:ring-amber-200"
            >
              Clear priority filter
            </button>
          )}
        </div>
      </div>
    </aside>
  );

  const TaskRow = ({ todo }: { todo: TodoItem }) => {
    const priClass = PRI_COLOR[todo.priority];

    return (
      <div
        className="group relative flex items-start gap-3 px-2 py-2 rounded-md hover:bg-amber-50/60 transition"
        onClick={() => toggleComplete(todo.id)}
      >
        {/* Checkbox */}
        <button
          className={`mt-1 h-[18px] w-[18px] rounded-full ring-1 ring-amber-200 grid place-items-center
            ${todo.completed ? "bg-emerald-600 ring-emerald-600" : "bg-white"}`}
          title={todo.completed ? "Mark as not done" : "Mark as done"}
          onClick={(e) => {
            e.stopPropagation();
            toggleComplete(todo.id);
          }}
        >
          {todo.completed ? (
            <Check className="h-3.5 w-3.5 text-white" />
          ) : (
            <span className="h-2 w-2 rounded-full bg-white" />
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {editingId === todo.id ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(e as any, todo.id);
                  if (e.key === "Escape") cancelEdit(e as any);
                }}
                className="flex-1 bg-transparent outline-none border-b border-amber-200 focus:border-amber-500 text-stone-900 pb-1"
                autoFocus
              />
              <button
                onClick={(e) => saveEdit(e, todo.id)}
                className="px-2 py-1 rounded bg-emerald-600 text-white text-xs hover:bg-emerald-500"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={cancelEdit}
                className="px-2 py-1 rounded text-stone-700 hover:text-stone-900 text-xs"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <div
                className={`text-[15px] leading-snug ${
                  todo.completed ? "line-through text-stone-400" : "text-stone-900"
                }`}
              >
                {todo.text}
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs">
                {/* Priority chip */}
                <span
                  onClick={(e) => togglePriority(e as any, todo.id)}
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ring-1 ${priClass} cursor-pointer`}
                  title="Cycle priority"
                >
                  <Star className="h-3.5 w-3.5" />
                  {todo.priority}
                </span>

                {/* Due date */}
                {todo.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-stone-700 ring-1 ring-amber-200 ${
                      isOverdue(todo) ? "text-rose-700 bg-rose-50 ring-rose-200" : ""
                    }`}
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDateHuman(todo.dueDate)}
                  </span>
                )}

                {/* Description presence */}
                {todo.description && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-stone-700 ring-1 ring-amber-200">
                    <AlignLeft className="h-3.5 w-3.5" />
                    Notes
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Row actions */}
        {editingId !== todo.id && (
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
            <button
              onClick={(e) => startEditing(e, todo.id, todo.text)}
              className="p-1.5 rounded hover:bg-amber-50 ring-1 ring-transparent hover:ring-amber-200"
              title="Edit"
            >
              <Edit className="h-4 w-4 text-stone-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id);
              }}
              className="p-1.5 rounded hover:bg-rose-50 ring-1 ring-transparent hover:ring-rose-200"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-rose-700" />
            </button>
          </div>
        )}
      </div>
    );
  };

  /* =============== Render =============== */
  return (
    <div className="flex h-screen text-stone-800 bg-[radial-gradient(1200px_600px_at_-10%_-10%,#fde7d9_0%,transparent_60%),radial-gradient(800px_500px_at_110%_-10%,#ffe7ba_0%,transparent_55%),linear-gradient(to_bottom,#fff8f1,#fff5e7)]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col">
        {/* Header (amber primary) */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-amber-200">
          <div className="flex items-center justify-between px-4 md:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-amber-600 text-white text-sm hover:bg-amber-500"
              >
                <PlusCircle size={16} />
                Add task
              </button>
              <div className="text-sm text-stone-600 hidden md:flex items-center gap-2">
                <Search size={16} className="text-stone-400" />
                Quick Find
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-1 rounded bg-amber-50 text-stone-700 ring-1 ring-amber-200">
                {filteredActive.length} Shown
              </span>
              <span className="px-2 py-1 rounded bg-amber-50 text-stone-700 ring-1 ring-amber-200">
                {filteredCompleted.length} Completed
              </span>
            </div>
          </div>
        </header>

        {/* Title row */}
        <div className="px-4 md:px-6 pt-5 pb-3 border-b border-amber-100/80">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">{viewTitle}</h1>
              <span className="text-sm text-stone-600">{filteredActive.length} tasks</span>
            </div>

            {priorityFilter !== "All" && (
              <span className="inline-flex items-center gap-2 text-xs px-2 py-1 rounded bg-amber-50 text-stone-700 ring-1 ring-amber-200">
                Priority: <strong>{priorityFilter}</strong>
                <button
                  onClick={() => setPriorityFilter("All")}
                  className="ml-1 px-1.5 py-0.5 rounded hover:bg-amber-100"
                  title="Clear priority filter"
                >
                  Clear
                </button>
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-3 md:px-6 py-4">
          {/* Active */}
          <section className="max-w-3xl">
            {filteredActive.length === 0 ? (
              <div className="text-sm text-stone-600 py-8 text-center">
                Nothing to show. Try another view or clear filters.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredActive.map((t) => (
                  <TaskRow key={t.id} todo={t} />
                ))}
              </div>
            )}

            {/* Inline quick add (amber primary) */}
            {!inlineOpen ? (
              <button
                onClick={() => setInlineOpen(true)}
                className="mt-3 inline-flex items-center gap-2 text-amber-700 hover:bg-amber-50 px-2 py-1 rounded ring-1 ring-transparent hover:ring-amber-200"
              >
                <PlusCircle size={16} />
                Add task
              </button>
            ) : (
              <div className="mt-3 p-3 rounded-lg border border-amber-200 bg-white/90 max-w-2xl">
                <input
                  className="w-full text-sm px-2 py-2 outline-none border-b border-amber-200 focus:border-amber-500 text-stone-900"
                  placeholder="Task name"
                  value={inlineTitle}
                  onChange={(e) => setInlineTitle(e.target.value)}
                  autoFocus
                />
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <label className="inline-flex items-center gap-1 text-stone-700">
                    <Calendar className="h-3.5 w-3.5" />
                    <input
                      type="date"
                      className="outline-none border rounded px-2 py-1 border-amber-200"
                      value={inlineDue}
                      onChange={(e) => setInlineDue(e.target.value)}
                    />
                  </label>
                  <label className="inline-flex items-center gap-1 text-stone-700">
                    <Star className="h-3.5 w-3.5" />
                    <select
                      className="outline-none border rounded px-2 py-1 border-amber-200"
                      value={inlinePri}
                      onChange={(e) => setInlinePri(e.target.value as "High" | "Medium" | "Low")}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </label>

                  <div className="ml-auto flex items-center gap-2">
                    <button
                      onClick={() => {
                        setInlineOpen(false);
                        setInlineTitle("");
                        setInlineDue("");
                        setInlinePri("Medium");
                      }}
                      className="px-3 py-1 rounded text-stone-700 hover:bg-amber-50 ring-1 ring-transparent hover:ring-amber-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addTodoInline}
                      disabled={!inlineTitle.trim()}
                      className={`px-3 py-1 rounded text-white ${
                        !inlineTitle.trim()
                          ? "bg-amber-300 cursor-not-allowed"
                          : "bg-amber-600 hover:bg-amber-500"
                      }`}
                    >
                      Add task
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Completed */}
          <section className="max-w-3xl mt-8">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-stone-800">
                Completed · {filteredCompleted.length}
              </div>
              {filteredCompleted.length > 0 && (
                <button
                  onClick={deleteAllCompleted}
                  className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded text-rose-700 hover:bg-rose-50 ring-1 ring-transparent hover:ring-rose-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear completed
                </button>
              )}
            </div>
            <div className="space-y-1">
              {filteredCompleted.map((t) => (
                <div key={t.id} className="opacity-80">
                  <TaskRow todo={t} />
                </div>
              ))}
              {filteredCompleted.length === 0 && (
                <div className="text-xs text-stone-500 py-3">Nothing here yet.</div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl p-5 ring-1 ring-amber-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-3">Add task</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-stone-700 mb-1">
                  Task Title <span className="text-rose-700">*</span>
                </label>
                <input
                  name="text"
                  value={newTask.text}
                  onChange={handleModalInput}
                  className="w-full border rounded px-2 py-2 outline-none focus:ring-2 focus:ring-amber-500 border-amber-200"
                  placeholder="e.g. Read chapter 3"
                />
              </div>
              <div>
                <label className="block text-stone-700 mb-1 inline-flex items-center gap-1">
                  <AlignLeft size={16} /> Description
                </label>
                <textarea
                  name="description"
                  value={newTask.description}
                  onChange={handleModalInput}
                  className="w-full border rounded px-2 py-2 outline-none focus:ring-2 focus:ring-amber-500 border-amber-200"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 mb-1 inline-flex items-center gap-1">
                    <Star size={16} /> Priority
                  </label>
                  <select
                    name="priority"
                    value={newTask.priority}
                    onChange={handleModalInput}
                    className="w-full border rounded px-2 py-2 outline-none focus:ring-2 focus:ring-amber-500 border-amber-200"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 mb-1 inline-flex items-center gap-1">
                    <Calendar size={16} /> Due date
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleModalInput}
                    className="w-full border rounded px-2 py-2 outline-none focus:ring-2 focus:ring-amber-500 border-amber-200"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded border text-stone-700 hover:bg-amber-50 border-amber-200"
              >
                Cancel
              </button>
              <button
                onClick={addTodoModal}
                disabled={!newTask.text.trim()}
                className={`px-3 py-1.5 rounded text-white ${
                  !newTask.text.trim()
                    ? "bg-amber-300 cursor-not-allowed"
                    : "bg-amber-600 hover:bg-amber-500"
                }`}
              >
                Add task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
