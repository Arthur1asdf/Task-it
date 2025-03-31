import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../Images/HomeDesktop/home background 2.png";
import calender from "../Images/HomeDesktop/calender.png";
import logout from "../Images/HomeDesktop/logout.png";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  const goToCalender = () => navigate("/calender");

  // State to manage tasks, popup, and editing
  const [tasks, setTasks] = useState(["Task 1", "Task 2", "Task 3"]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Handle saving new or edited tasks
  const handleSave = () => {
    if (newTask.trim()) {
      if (editingIndex !== null) {
        // Edit existing task
        const updatedTasks = [...tasks];
        updatedTasks[editingIndex] = newTask;
        setTasks(updatedTasks);
        setEditingIndex(null);
      } else {
        // Add new task
        setTasks([...tasks, newTask]);
      }
      setNewTask("");
      setShowPopup(false);
    }
  };

  // Open popup for editing a task
  const handleEdit = (index: number) => {
    setNewTask(tasks[index]);
    setEditingIndex(index);
    setShowPopup(true);
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
          height: "440px",
          backgroundColor: "#FDEEC0",
          border: "2px solid #6F5A30",
          padding: "1rem",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginLeft: "125px",
          marginTop: "-50px",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Tasks</h2>
          <div style={{ display: "flex", gap: "1rem", color: "#6F5A30", cursor: "pointer" }}>
            <span>{"<"}</span>
            <span>{">"}</span>
          </div>
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
                padding: "0.25rem",
                borderRadius: "4px",
                transition: "background-color 0.2s",
                position: "relative",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5dca6")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" style={{ width: "1rem", height: "1rem" }} />
                <span>{task}</span>
              </label>
              <span
                style={{
                  fontSize: "0.9rem",
                  color: "#6F5A30",
                  cursor: "pointer",
                  opacity: "0",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                onClick={() => handleEdit(index)}
              >
                Edit
              </span>
            </div>
          ))}
        </div>

        {/* Add Task Button */}
        <div
          style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#6F5A30",
            fontSize: "1.5rem",
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
            style={{
              padding: "8px",
              border: "1px solid #6F5A30",
              borderRadius: "4px",
              marginBottom: "10px",
              width: "100%",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
            <button
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: "#B0A080",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#6F5A30",
                color: "white",
                padding: "8px 12px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {editingIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>
      )}

      {/* Sticky Note - Logout */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "79%",
          width: "15vw",
          maxWidth: "200px",
          minWidth: "90px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={logout}
          alt="Sticky Note"
          onClick={goToLogin}
          style={{
            width: "60%",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>

      {/* Calendar */}
      <div
        style={{
          position: "absolute",
          top: "77%",
          left: "60%",
          width: "20vw",
          maxWidth: "300px",
          minWidth: "120px",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={calender}
          alt="Calendar"
          onClick={goToCalender}
          style={{
            width: "120%",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
