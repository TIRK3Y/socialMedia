import React, { useState, useEffect } from "react";
import "./TaskManager.css";
import Navigation from './component/Navigation.jsx';

// SVG icons
const PlusIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const EditIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const DoneIcon = () => (
  <svg
    className="icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const categories = ["Work", "Personal", "Urgent", "Others"];

export default function TaskManager() {
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openNewTaskModal = () => {
    setCurrentTask({
      title: "",
      description: "",
      category: "Work",
      completed: false,
      setupDate: "",
    });
    setModalOpen(true);
  };

  const openEditTaskModal = (task, index) => {
    setCurrentTask({ ...task, index });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentTask(null);
  };

  const saveTask = (task) => {
    if (task.index !== undefined) {
      const updatedTasks = [...tasks];
      updatedTasks[task.index] = { ...task };
      delete updatedTasks[task.index].index;
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, task]);
    }
    closeModal();
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const filteredTasks =
    filter === "All"
      ? tasks
      : tasks.filter((task) => task.category === filter);

  return (
    <>
      <Navigation />
      <div className="app-container">
        <aside className="sidebar">
          <h2 className="sidebar-title">Task Categories</h2>
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              className={`sidebar-button ${filter === cat ? "active" : ""}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </aside>

        <main className="main-content">
          <header className="header">
            <h1 className="header-title">Task Manager</h1>
            <button
              className="add-button"
              onClick={openNewTaskModal}
              aria-label="Add new task"
              title="Add New Task"
            >
              <PlusIcon />
            </button>
          </header>

          <section className="tasks-grid">
            {filteredTasks.length === 0 && (
              <p className="no-tasks-msg">No tasks available.</p>
            )}
            {filteredTasks.map((task, index) => (
              <article
                key={index}
                className={`task-card ${task.completed ? "completed" : ""}`}
              >
                <div className="task-info">
                  <h3 className="task-title">{task.title}</h3>
                  <p className="task-description">
                    {task.description || "No description"}
                  </p>
                  <p className="task-meta">
                    <strong>Category:</strong> {task.category}
                  </p>
                  <p className="task-meta">
                    <strong>Setup Date:</strong> {task.setupDate || "-"}
                  </p>
                </div>

                <div className="task-actions">
                  <button
                    className="icon-button"
                    title="Mark complete/incomplete"
                    onClick={() => toggleComplete(index)}
                    aria-label="Toggle complete"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    className="icon-button"
                    title="Edit task"
                    onClick={() => openEditTaskModal(task, index)}
                    aria-label="Edit task"
                  >
                    <EditIcon />
                  </button>
                  <button
                    className="icon-button"
                    title="Delete task"
                    onClick={() => deleteTask(index)}
                    aria-label="Delete task"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>

      {modalOpen && (
        <Modal
          task={currentTask}
          onSave={saveTask}
          onClose={closeModal}
          categories={categories}
        />
      )}
    </>
  );
}

function Modal({ task, onSave, onClose, categories }) {
  const [title, setTitle] = useState(task.title || "");
  const [description, setDescription] = useState(task.description || "");
  const [category, setCategory] = useState(task.category || "Work");
  const [completed, setCompleted] = useState(task.completed || false);
  const [setupDate, setSetupDate] = useState(task.setupDate || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title is required");
      return;
    }
    onSave({ ...task, title, description, category, completed, setupDate });
  };

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
      >
        <h2 id="modal-title" className="modal-title">
          {task.index !== undefined ? "Edit Task" : "New Task"}
        </h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <label className="modal-label">
            Title*:
            <input
              type="text"
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </label>

          <label className="modal-label">
            Setup Date:
            <input
              type="date"
              className="modal-input"
              value={setupDate}
              onChange={(e) => setSetupDate(e.target.value)}
            />
          </label>

          <label className="modal-label">
            Description:
            <textarea
              className="modal-input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>

          <label className="modal-label">
            Category:
            <select
              className="modal-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="modal-label checkbox-label">
            <input
              type="checkbox"
              checked={completed}
              onChange={() => setCompleted(!completed)}
            />
            Completed
          </label>

          <div className="modal-actions">
            <button type="submit" className="modal-button save-button">
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="modal-button cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
