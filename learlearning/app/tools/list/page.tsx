"use client";

import React, { useState, useEffect } from "react";
import { PlusCircle, Edit, Check, X, Star, CheckCircle, ArrowLeft, Trash2, CheckSquare, Calendar, AlignLeft } from "lucide-react";
import Link from "next/link";

// Define proper TypeScript interfaces
interface TodoItem {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  priority: "High" | "Medium" | "Low";
  createdAt: string;
  dueDate?: string;
}

export default function TodoApp() {
  // State with proper typing
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    text: "",
    description: "",
    priority: "Medium" as "High" | "Medium" | "Low",
    dueDate: ""
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  
  // Load To-Dos from localStorage
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem("todos");
      
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      } else {
        // Set default sample tasks
        setTodos([
          {
            id: 1,
            text: "Create a Visual Style Guide",
            description: "Design a comprehensive style guide for the project",
            completed: false,
            priority: "High",
            createdAt: new Date().toISOString(),
            dueDate: "2025-04-15"
          },
          {
            id: 2,
            text: "Testing and User Feedback",
            description: "Conduct user testing sessions and gather feedback",
            completed: false,
            priority: "Medium",
            createdAt: new Date().toISOString(),
            dueDate: "2025-04-20"
          },
          {
            id: 3,
            text: "Meetings with Client",
            description: "Weekly progress update meeting",
            completed: true,
            priority: "High",
            createdAt: new Date().toISOString(),
            dueDate: "2025-04-10"
          }
        ]);
      }
    } catch (e) {
      console.error("Error loading from localStorage:", e);
    }
  }, []);

  // Save To-Dos whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }, [todos]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // To-Do Handlers
  const addTodo = () => {
    if (newTask.text.trim() === "") return;
    
    const todoItem: TodoItem = {
      id: Date.now(),
      text: newTask.text.trim(),
      description: newTask.description.trim() || undefined,
      completed: false,
      priority: newTask.priority,
      createdAt: new Date().toISOString(),
      dueDate: newTask.dueDate || undefined
    };
    
    setTodos(prevTodos => [...prevTodos, todoItem]);
    setNewTask({
      text: "",
      description: "",
      priority: "Medium",
      dueDate: ""
    });
    setIsModalOpen(false);
  };

  const deleteTodo = (id: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
  };

  const deleteAllCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const toggleComplete = (id: number) => {
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (e: React.MouseEvent, id: number, text: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (editText.trim() === "") return;
    
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { ...todo, text: editText.trim() } : todo
      )
    );
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
    setTodos(prevTodos => 
      prevTodos.map(todo => 
        todo.id === id ? { 
          ...todo, 
          priority: todo.priority === "High" ? "Medium" : "High" 
        } : todo
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewTask(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Format date to display
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const today = new Date();
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    // Check if it's tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    }
    
    // Otherwise return formatted date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter todos based on completion status
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  // Get color scheme based on priority
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case "High": return "border-l-4 border-l-red-500";
      case "Medium": return "border-l-4 border-l-yellow-500";
      case "Low": return "border-l-4 border-l-blue-500";
      default: return "border-l-4 border-l-blue-500";
    }
  };

  // Task card component
  const TaskCard = ({ todo }: { todo: TodoItem }) => (
    <div 
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-all mb-3 overflow-hidden ${getPriorityColor(todo.priority)}`} 
      onClick={() => toggleComplete(todo.id)}
    >
      <div className="p-4">
        {editingId === todo.id ? (
          <div className="flex gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded text-black"
              autoFocus
            />
            <button
              type="button"
              onClick={(e) => saveEdit(e, todo.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded"
            >
              <Check size={18} />
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {todo.completed ? (
                  <CheckCircle size={20} className="text-green-500 mr-2" />
                ) : (
                  <button 
                    onClick={(e) => togglePriority(e, todo.id)}
                    className="mr-2"
                  >
                    {todo.priority === "High" ? (
                      <Star size={20} className="text-red-500 fill-red-500" />
                    ) : (
                      <Star size={20} className="text-yellow-500" />
                    )}
                  </button>
                )}
                <h3 className={`text-base font-medium ${todo.completed ? "text-gray-500 line-through" : "text-black"}`}>
                  {todo.text}
                </h3>
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={(e) => startEditing(e, todo.id, todo.text)}
                  className="p-1 rounded hover:bg-gray-100 mr-1"
                >
                  <Edit size={18} className="text-blue-500" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            </div>
            {todo.description && (
              <div className="text-sm text-gray-600 mb-2">{todo.description}</div>
            )}
            {todo.dueDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar size={14} className="mr-1" />
                {formatDate(todo.dueDate)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold">TaskMaster</h1>
          </div>
          <div className="flex items-center">
            <span className="bg-blue-500 text-xs rounded-full px-3 py-1 mr-2">
              {todos.length} Tasks
            </span>
            <span className="bg-green-500 text-xs rounded-full px-3 py-1">
              {completedTodos.length} Complete
            </span>
          </div>
        </div>
      </div>
      
      {/* Add New Task Button */}
      <div className="bg-white shadow-md p-4 mb-4">
        <div className="container mx-auto">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center transition-colors"
          >
            <PlusCircle size={18} className="mr-2" /> Add New Task
          </button>
        </div>
      </div>
      
      {/* Task Columns */}
      <div className={`flex-1 p-4 overflow-auto ${isModalOpen ? 'filter blur-sm pointer-events-none' : ''}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Active Tasks Column */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="font-bold text-lg text-blue-800 flex items-center">
                  <CheckSquare size={20} className="mr-2" />
                  Active Tasks ({activeTodos.length})
                </h2>
              </div>
              <div className="space-y-3">
                {activeTodos.length > 0 ? (
                  activeTodos.map(todo => <TaskCard key={todo.id} todo={todo} />)
                ) : (
                  <p className="text-gray-500 text-center py-4">No active tasks. Add one to get started!</p>
                )}
              </div>
            </div>
            
            {/* Completed Tasks Column */}
            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h2 className="font-bold text-lg text-green-800 flex items-center">
                  <CheckCircle size={20} className="mr-2" />
                  Completed Tasks ({completedTodos.length})
                </h2>
                {completedTodos.length > 0 && (
                  <button 
                    onClick={deleteAllCompleted}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm flex items-center transition-colors"
                  >
                    <Trash2 size={14} className="mr-1" /> Delete All
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {completedTodos.length > 0 ? (
                  completedTodos.map(todo => <TaskCard key={todo.id} todo={todo} />)
                ) : (
                  <p className="text-gray-500 text-center py-4">No completed tasks yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for adding new task */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 text-black">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10">
            <h2 className="text-xl font-bold mb-4 text-blue-800">Add New Task</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="text"
                  name="text"
                  value={newTask.text}
                  onChange={handleInputChange}
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <AlignLeft size={16} className="mr-1" /> Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newTask.description}
                  onChange={handleInputChange}
                  placeholder="Enter task description"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Star size={16} className="mr-1" /> Priority
                  </label>
                  <select
                    id="priority"
                    name="priority"
                    value={newTask.priority}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1" /> Due Date
                  </label>
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={newTask.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6 space-x-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={addTodo}
                disabled={!newTask.text.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  !newTask.text.trim() 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}