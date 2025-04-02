import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../Images/HomeDesktop/home background 2.png";
import calender from "../Images/HomeDesktop/calender.png";
import logout from "../Images/HomeDesktop/logout.png";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const goToLogin = () => navigate("/login");
  const goToCalender = () => navigate("/calender");
  

  // Task list state
  const [tasks, setTasks] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Current day state
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get formatted current date (MM/DD/YYYY)
  const formatDate = (date: Date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Toggle day selection
  const handleDayToggle = (dayIndex: number) => {
    const day = fullDayNames[dayIndex];
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

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
      setSelectedDays([]);
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

  // Switch to next day
  const handleNextDay = () => {
    setCurrentDate((prevDate) => {
      const nextDay = new Date(prevDate);
      nextDay.setDate(prevDate.getDate() + 1);
      return nextDay;
    });
  };

  // Switch to previous day
  const handlePreviousDay = () => {
    setCurrentDate((prevDate) => {
      const prevDay = new Date(prevDate);
      prevDay.setDate(prevDate.getDate() - 1);
      return prevDay;
    });
  };

  const handleStickyNoteClick = () => {
    navigate("/logout"); // Navigate to logout when clicking the sticky note
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <h2 style={{ fontSize: "2.10rem", fontWeight: "bold" }}>Tasks</h2>
          <div style={{ display: "flex", gap: "1rem", color: "#6F5A30", cursor: "pointer" }}>
            <span onClick={handlePreviousDay}>{"<"}</span>
            <span onClick={handleNextDay}>{">"}</span>
          </div>
        </div>

        {/* Current Date */}
        <div style={{ fontSize: "0.8rem", fontWeight: "bold", color: "#6F5A30", textAlign: "left", marginLeft: "0.2rem" }}>
          {formatDate(currentDate)}
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
                position: "relative",
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
                  style={{
                    fontSize: "0.9rem",
                    color: "#6F5A30",
                    cursor: "pointer",
                    transition: "opacity 0.2s",
                    opacity: 1,
                  }}
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
            setSelectedDays([]);
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

          {/* Weekday Selection */}
          <p style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "5px" }}>Occurs every:</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginBottom: "10px" }}>
            {daysOfWeek.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDayToggle(index)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: "1px solid #6F5A30",
                  backgroundColor: selectedDays.includes(fullDayNames[index]) ? "#FDEEC0" : "white",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {day}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
            {editingIndex !== null && <button onClick={handleDelete}>Delete</button>}
            <button onClick={handleSave}>{editingIndex !== null ? "Update" : "Save"}</button>
          </div>
        </div>
      )}
            {/* Calendar Container - Similar styling to the logout button */}
            <div
        style={{
          position: "absolute",
          top: "80%",
          left: "65%",
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

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "80%",
          transform: "translateX(-50%)",
        }}
      >
        <img
          src={logout}
          alt="Logout"
          onClick={handleStickyNoteClick} // Navigate to /logout on click
          style={{
            width: "75%",
            height: "auto",
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
};

export default Home;
