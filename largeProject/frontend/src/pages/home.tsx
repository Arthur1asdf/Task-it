import React, { useState } from "react";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import background from "../Images/HomeDesktop/HomeDesktopBackground.png";
import calender from "../Images/HomeDesktop/calender.png";
import logout from "../Images/HomeDesktop/logout.png";
import board from "../Images/HomeDesktop/board.png";
//import streak from "../Images/HomeDesktop/HomeDesktopStreak.png";

interface Task {
  _id: string;
  name: string;
  taskDates: string[];
  userId: string;
  isCompleted: boolean;
  createdAt?: string;
}

interface DecodedToken {
  id: string;
}


const Home: React.FC = () => {

  const navigate = useNavigate();
  const goToLogin = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  const goToCalender = () => navigate("/calender");

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hoveredTask, setHoveredTask] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userId, setUserId] = useState<string | null>(null);
  const [streak, setStreak] = useState<number>(0); 
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const fullDayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  // Decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
      console.log("Decoded userId:", decoded.id);
  
      // Fetch tasks and streak right after setting userId
      fetchTasks();
      fetchStreak(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  
  
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

  const fetchTasks = async () => {    
    if (!userId) {
      console.error("Cannot fetch tasks userId is null or undefined");
      return;
    }      
    
    try {
      const response = await fetch(`http://task-it.works/api/taskRoute/get-tasks?userId=${userId}&taskDate=${currentDate.toISOString().split("T")[0]}`);
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {  
    fetchTasks();
  }, [userId, currentDate]); // Re-fetch tasks when date changes

  //Get streaks
  const fetchStreak = async (userId: string | null) => {
    try {
      const response = await fetch(`http://task-it.works/api/taskRoute/streaks?userId=${userId}`);

      if (!response.ok) {
        const text = await response.text();
        console.error("Fetch failed, response was:", text);
        return;
      }
  
      const data = await response.json();
      console.log("Streak data:", data);
      // after server is updated, change data.streak to data
      setStreak(data.streak);
    } catch (error) {
      console.error("Error fetching streak:", error);
    }
  };

  // Save or update task
  const handleSave = async () => {
    if (!userId) {
      console.error("No user ID cannot save task.");
      return;
    }

    if (newTask.trim()) {
      let datesToSave: string[] = [];

      if (selectedDays.length > 0) {
        const current = new Date(currentDate); // use the currently viewed date
        const startOfWeek = new Date(current);
        startOfWeek.setDate(current.getDate() - current.getDay());

        for (let i = 0; i < 7; i++) {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + i);
          const dayName = fullDayNames[date.getDay()];

          if (selectedDays.includes(dayName)) {
            datesToSave.push(date.toISOString().split("T")[0]);
          }
        }
      } else {
        // If no specific weekdays selected just use the currently selected date
        datesToSave = [currentDate.toISOString().split("T")[0]];
      }

      if (editingIndex !== null) {
        const taskId = tasks[editingIndex]._id;
        await editTask(taskId, newTask); 
      } else {
        const response = await fetch("http://task-it.works/api/taskRoute/add-task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            taskName: newTask,
            taskDates: datesToSave,
          }),
        });

        if (response.ok) {
          const createdTask = await response.json();
          setTasks((prevTasks) => [...prevTasks, createdTask]);
        } else {
          console.error("Failed to save task");
        }
      }

      // Reset state and close the popup
      fetchTasks();
      setNewTask("");
      setSelectedDays([]);
      setShowPopup(false);
    }
  };
  
     
  const editTask = async (taskId: string, newTaskName: string) => {
    if (!userId) {
      console.error("No user ID cannot edit task.");
      return;
    }
  
    if (!taskId || !newTaskName.trim()) {
      console.error("Task ID or new task name is missing.");
      return;
    }
  
    try {
      const response = await fetch("http://task-it.works/api/taskRoute/edit-task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          taskId: taskId,
          taskName: newTaskName,
        }),
      });
  
      if (response.ok) {
        const updatedTask = await response.json();
        console.log("Task updated successfully:", updatedTask.task);
  
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, name: newTaskName } : task
          )
        );
      } else {
        const errorData = await response.json();
        console.error("Failed to update task:", errorData.message);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };
  
  const deleteTask = async (taskId: string) => {
    if (!userId) {
      console.error("No user ID. Cannot delete task.");
      return;
    }
  
    try {
      const response = await fetch("http://task-it.works/api/taskRoute/delete-task", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          taskId: taskId,
        }),
      });
  
      if (response.ok) {
        console.log("Task deleted successfully");
        setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        setShowPopup(false);
        setEditingIndex(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to delete task:", errorData.message);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  
  
  // Delete a task
  const handleDelete = () => {
    setShowPopup(false);             // Close the edit popup
    setShowDeleteConfirm(true);     // Open the confirmation popup
  };
  
  
  

  const handleToggleComplete = async (taskId: string, currentStatus: boolean, userId: string | null) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  
    try {
      const response = await fetch("http://task-it.works/api/taskRoute/complete-task", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          taskId,
          userId,
          isCompleted: !currentStatus,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log(data.message);
        console.log("Response from /complete-task:", data);

        if (data.streak !== undefined) {
          setStreak(data.streak);
        }

        fetchStreak(userId);
  
      } else {
        console.error("Failed to update task:", data.message);
      }
    } catch (error) {
      console.error("Error sending request:", error);
    }
  };


  const handleSearch = async () => {
    if (!userId) return;
  
    if (searchQuery.trim() === "") {
      // If query is empty, refetch all tasks
      fetchTasks();
      return;
    }
  
    try {
      const response = await fetch(`http://task-it.works/api/taskRoute/search-tasks?userId=${userId}&query=${searchQuery}&date=${currentDate.toISOString().split("T")[0]}`);
  
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks);
      } else {
        console.error("Search failed");
      }
    } catch (error) {
      console.error("Error searching tasks:", error);
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
    {/* Board */}
    <div
      style={{
        position: "absolute",
        top: "0%",
        left: "22%",
        width: "58%",
        height: "90%",
        backgroundImage: `url(${board})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        zIndex: 1,
      }}
    >
  
    {/* Task Box */}
    <div
      style={{
        width: "40%",
        height: "80%",
        backgroundColor: "#FDEEC0",
        border: "2px solid #6F5A30",
        padding: "1rem",
        borderRadius: "8px",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        left: "10%",
        top: "10%",
        zIndex: 2,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontSize: "2.10rem", fontWeight: "bold" }}>Tasks</h2>
        <div style={{ display: "flex", gap: "1rem", color: "#6F5A30", cursor: "pointer" }}>
          <span onClick={handlePreviousDay}>{"<"}</span>
          <span onClick={handleNextDay}>{">"}</span>
        </div>
      </div>
  
      {/* Current Date */}
      <div
        style={{
          fontSize: "0.8rem",
          fontWeight: "bold",
          color: "#6F5A30",
          textAlign: "left",
          marginLeft: "0.2rem",
        }}
      >
        {formatDate(currentDate)}
      </div>
  
      {/* Search */}
      <div style={{ marginBottom: "5px", display: "flex", gap: "5px" }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch();
          }}
          placeholder="Search tasks..."
          style={{
            flex: 1,
            padding: "5px",
            border: "1px solid #6F5A30",
            width: "100px",
            borderRadius: "4px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: "#6F5A30",
            color: "white",
            border: "none",
            width: "70px",
            padding: "5px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>
  
      {/* Task List */}
      <div style={{ flexGrow: 1, overflowY: "auto" }}>
        {tasks.map((task, index) => (
          <div
            key={task._id}
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
              <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() => handleToggleComplete(task._id, task.isCompleted, userId)}
                style={{ width: "1rem", height: "1rem" }}
              />
              <span style={{ textDecoration: task.isCompleted ? "line-through" : "none" }}>
                {task.name}
              </span>
            </label>
  
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
                  setNewTask(task.name);
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
          left: "13%",
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

    {showDeleteConfirm && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        > 
          <div
            style={{
              backgroundColor: "#fff7e6",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "2px solid #6F5A30",
              width: "300px",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "1rem" }}>Are you sure you want to delete this task?</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => {
                  if (editingIndex !== null) {
                    const taskIdToDelete = tasks[editingIndex]._id;
                    deleteTask(taskIdToDelete);
                    setShowDeleteConfirm(false);
                  }
                }}
                style={{
                  backgroundColor: "#B91C1C",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  backgroundColor: "#6F5A30",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
  
    {/* Calendar Container */}
    <div
      style={{
        position: "absolute",
        top: "88%",
        left: "75%",
        width: "20vw",
        zIndex: 2,
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
  
    {/* Logout */}
    <div
      style={{
        position: "absolute",
        top: "6%",
        left: "80%",
        zIndex: 2,
        transform: "translateX(40%)",
      }}
    >
      <img
        src={logout}
        alt="Logout"
        onClick={goToLogin}
        style={{
          width: "50%",
          height: "auto",
          cursor: "pointer",
        }}
      />
    </div>
  
    {/* Streak Counter */}
    <div
  style={{
    position: "absolute",
    top: "30%",
    right: "25%",
    width: "15%", 
    height: "18%", 
    backgroundColor: "#EFDAAE",
    display: "flex",
    border: "2px solid #6F5A30",
    justifyContent: "center",
    alignItems: "center",
    color: "#6F5A30",
    fontWeight: "bold",
    fontSize: "1.1rem",
    zIndex: 2,
  }}
>
  {/* Inner text box */}
  <div
    style={{
      padding: "5px 10px",
      borderRadius: "8px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      color: "#6F5A30",
      fontWeight: "bold",
      fontSize: "1rem",
      textAlign: "center",
    }}
  >
    <div>🔥 Streak</div>
    <div>{streak} day{streak === 1 ? "" : "s"}</div>
  </div>
</div>

  
    {/* Popup */}
    {showPopup && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: "#fff7e6",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "2px solid #6F5A30",
            width: "300px",
          }}
        >
          <h3>{editingIndex !== null ? "Edit Task" : "New Task"}</h3>
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "1rem",
              border: "1px solid #6F5A30",
              borderRadius: "4px",
            }}
          />
          <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {daysOfWeek.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleDayToggle(i)}
                style={{
                  backgroundColor: selectedDays.includes(fullDayNames[i]) ? "#f5dca6" : "#fff",
                  border: "1px solid #6F5A30",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {letter}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: "#6F5A30",
                color: "white",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            {editingIndex !== null && (
              <button
                onClick={handleDelete}
                style={{
                  backgroundColor: "#B91C1C",
                  color: "white",
                  padding: "0.5rem 1rem",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
            <button
              onClick={() => {
                setShowPopup(false);
                setEditingIndex(null);
              }}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                border: "1px solid #6F5A30",
                backgroundColor: "#fff",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div> 
  </div> 
  );
};

export default Home;
