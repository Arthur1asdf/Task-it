import React, { useState } from "react";
import background from "../Images/HomeDesktop/home background 2.png";

const Home: React.FC = () => {
  // Task list state
  const [tasks, setTasks] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);

  // Save new or edited task
  const handleSave = () => {
    if (newTask.trim()) {
      if (editingIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = newTask;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setNewTask("");
      setShowPopup(false);
    }
  };

  // Delete a task
  const handleDelete = () => {
    if (editingIndex !== null) {
      setTasks(tasks.filter((_, index) => index !== editingIndex));
      setEditingIndex(null);
      setShowPopup(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        position: "relative",
        paddingLeft: "50px",
      }}
    >
      {/* Task Box */}
      <div
        style={{
          width: "16rem",
          height: "470px",
          backgroundColor: "#FDEEC0",
          border: "2px solid #6F5A30",
          padding: "1rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginLeft: "415px",
          marginTop: "-60px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "2.10rem", fontWeight: "bold" }}>Tasks</h2>
        </div>

        {/* Task List */}
        <div style={{ flexGrow: 1, overflowY: "auto" }}>
          {tasks.map((task, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0.5rem",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                fontSize: "1.5rem",
                backgroundColor: hoveredTask === index ? "#f5dca6" : "transparent",
              }}
              onMouseEnter={() => setHoveredTask(index)}
              onMouseLeave={() => setHoveredTask(null)}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" style={{ width: "1rem", height: "1rem" }} />
                <span>{task}</span>
              </label>

              {/* Edit button appears when task is hovered */}
              {hoveredTask === index && (
                <span
                  style={{ fontSize: "0.9rem", color: "#6F5A30", cursor: "pointer" }}
                  onClick={() => {
                    setNewTask(task);
                    setEditingIndex(index);
                    setShowPopup(true);
                  }}
                >
                  Edit
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "15%",
            transform: "translateX(-50%)",
            color: "#6F5A30",
            fontSize: "2.5rem",
            cursor: "pointer",
          }}
          onClick={() => {
            setNewTask("");
            setEditingIndex(null);
            setShowPopup(true);
          }}
        >
          +
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#FFF8DC",
            padding: "20px",
            borderRadius: "8px",
            width: "350px",
            border: "2px solid #6F5A30",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            type="text"
            placeholder="Enter task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{ padding: "8px", border: "1px solid #6F5A30", borderRadius: "4px", marginBottom: "10px", width: "100%" }}
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            {editingIndex !== null && <button onClick={handleDelete}>Delete</button>}
            <button onClick={handleSave}>{editingIndex !== null ? "Update" : "Save"}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
