import React, { useState, useEffect } from 'react';
import './TodoPage.css';

const TodoPage = () => {
  const [showInputs, setShowInputs] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState(() => localStorage.getItem('filter') || 'all');
  const [editIndex, setEditIndex] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks, isInitialized]);

  useEffect(() => {
    localStorage.setItem('filter', filter);
  }, [filter]);

  const saveToHistory = () => {
    setHistory((prev) => [...prev, tasks]);
    setRedoStack([]);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const prevState = history[history.length - 1];
      setRedoStack((prev) => [tasks, ...prev]);
      setTasks(prevState);
      setHistory((prev) => prev.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setHistory((prev) => [...prev, tasks]);
      setTasks(nextState);
      setRedoStack((prev) => prev.slice(1));
    }
  };

  const handleAddTask = () => {
    setShowInputs(true);
    setEditIndex(null);
  };

  const handleSaveTask = () => {
    if (title.trim()) {
      const newTask = { title, description, completed: false };
      let updatedTasks;
      if (editIndex !== null) {
        updatedTasks = [...tasks];
        updatedTasks[editIndex] = { ...updatedTasks[editIndex], ...newTask };
      } else {
        updatedTasks = [...tasks, newTask];
      }
      setHistory((prev) => [...prev, tasks]);
      setRedoStack([]);
      setTasks(updatedTasks);
      setTitle('');
      setDescription('');
      setEditIndex(null);
      setShowInputs(false);
    }
  };

  const handleCancelTask = () => {
    setTitle('');
    setDescription('');
    setEditIndex(null);
    setShowInputs(false);
  };

  const handleDelete = (index) => {
    saveToHistory();
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setTitle(tasks[index].title);
    setDescription(tasks[index].description);
    setShowInputs(true);
  };

  const handleCheckboxChange = (index) => {
    saveToHistory();
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('taskIndex', index);
  };

  const handleDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('taskIndex');
    if (dragIndex === null || dragIndex === undefined) return;
    saveToHistory();
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(dropIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'active') return !task.completed;
    return true;
  });

  console.log("vishwa", filteredTasks);


  return (
    <div className="todo-container">
      <h1 className="todo-heading">Todo List App</h1>



      <div className="todo-popup">
        <h2 className="todo-subheading">Title and Description</h2>
        <input
          type="text"
          placeholder="Enter task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <input
          type="text"
          placeholder="Enter task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSaveTask();
            }
          }}
        />
        <div className="todo-button-group">
          <button onClick={handleSaveTask} className="todo-button">
            {editIndex !== null ? 'Update Task' : 'Save Task'}
          </button>
          <button onClick={handleCancelTask} className="todo-button cancel">
            Cancel
          </button>
        </div>
      </div>


      {filteredTasks?.length > 0 && <div className="todo-filter-buttons">
        <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>All</button>
        <button onClick={() => setFilter('active')} className={`filter-btn ${filter === 'active' ? 'active' : ''}`}>Active</button>
        <button onClick={() => setFilter('completed')} className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}>Completed</button>
      </div>}

      <div className="todo-task-list">
        {filteredTasks.map((task, index) => (
          <div
            key={index}
            className={`todo-task-item ${task.completed ? 'completed' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <div className="todo-task-content">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleCheckboxChange(index)}
              />
              <div>
                <strong>{task.title}</strong>
                <p>{task.description}</p>
              </div>
            </div>
            <div>
              <button className="todo-delete-button" onClick={() => handleEdit(index)}>
                ✏️
              </button>
              <button className="todo-delete-button" onClick={() => handleDelete(index)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {tasks.length > 0 && (
        <div className="todo-undo-redo-bar">
          <button onClick={handleUndo} className="todo-button">Undo</button>
          <button onClick={handleRedo} className="todo-button">Redo</button>
        </div>
      )}
    </div>
  );
};

export default TodoPage;
