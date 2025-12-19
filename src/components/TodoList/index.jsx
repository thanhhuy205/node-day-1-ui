import { useEffect, useState } from "react";
import styles from "./TodoList.module.css";

const API_BASE = import.meta.env.VITE_API_URL;

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
    <div className={styles.container}>
      <h2>Todo App</h2>

      <div className={styles.inputGroup}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Thêm task mới..."
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <ul className={styles.list}>
        {tasks.map((task) => (
          <li key={task.id} className={styles.item}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() => toggleTask(task)}
            />

            {editId === task.id ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(task)}
                />
                <button onClick={() => saveEdit(task)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <>
                <span className={task.isCompleted ? styles.done : ""}>
                  {task.title}
                </span>
                <button onClick={() => startEdit(task)}>Sửa</button>
              </>
            )}

            <button
              className={styles.btnDelete}
              onClick={() => handleDelete(task.id)}
            >
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
