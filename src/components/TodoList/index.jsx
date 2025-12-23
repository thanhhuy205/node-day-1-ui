import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchTasks = async () => {
    const res = await fetch(`${API_BASE}/api/tasks`);
    const result = await res.json();
    setTasks(result.data || []);
  };

  useEffect(() => {
    Promise.resolve().then(fetchTasks);
  }, []);

  const handleAdd = async () => {
    const title = input.trim();
    if (!title) return;

    const res = await fetch(`${API_BASE}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const result = await res.json();
    const createdTask = result?.data;

    if (createdTask) {
      setTasks((prev) => [createdTask, ...prev]);
    }

    setInput("");
  };

  const startEdit = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle("");
  };

  const saveEdit = async (task) => {
    const title = editTitle.trim();
    if (!title) return;

    const res = await fetch(`${API_BASE}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        isCompleted: task.isCompleted,
      }),
    });

    const result = await res.json();
    const updatedTask = result?.data;

    if (updatedTask) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
    }

    cancelEdit();
  };

  const toggleTask = async (task) => {
    const res = await fetch(`${API_BASE}/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        isCompleted: !task.isCompleted,
      }),
    });

    const result = await res.json();
    const updatedTask = result?.data;

    if (updatedTask) {
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updatedTask : t)));
    }

    if (editId === task.id) {
      setEditTitle((prev) => prev);
    }
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/api/tasks/${id}`, { method: "DELETE" });

    setTasks((prev) => prev.filter((t) => t.id !== id));

    if (editId === id) cancelEdit();
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Todo App
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Thêm task mới..."
          className="flex-1 p-3 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="bg-white p-4 rounded-lg shadow flex items-center gap-3"
          >
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask(task)}
              className="w-5 h-5"
            />

            {editId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(task)}
                  className="flex-1 p-2 border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => saveEdit(task)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span
                  className={`flex-1 ${
                    task.isCompleted
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </span>
                <button
                  onClick={() => startEdit(task)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Sửa
                </button>
              </>
            )}

            <button
              onClick={() => handleDelete(task.id)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
