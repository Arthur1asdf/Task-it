import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
}

export default function Calendar() {
  const navigate = useNavigate();
  const goToHome = () => navigate("/home");
  const [userId, setUserId] = useState<string | null>(null);
  const [view, setView] = useState<string>("Week");
  const [date, setDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay());
    return today;
  });  
  const [tasksByDate, setTasksByDate] = useState<Record<string, { name: string; isCompleted: boolean }[]>>({});
  const [newTask, setNewTask] = useState<string>("");

  const getDateKey = (dateObj: Date): string => dateObj.toISOString().split("T")[0];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const decoded: DecodedToken = jwtDecode(token);
      setUserId(decoded.id);
      console.log("Decoded userId:", decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);
  

  const fetchTasks = async () => {
    if (!userId || !weekStart) {
      console.error("Cannot fetch tasks: userId or weekStart is missing");
      return;
    }
  
    const updatedTasksByDate: Record<string, { name: string; isCompleted: boolean }[]> = {};

  
    const fetchForDay = async (dayOffset: number) => {
      const currentDate = new Date(weekStart);
      currentDate.setDate(weekStart.getDate() + dayOffset);
      const key = getDateKey(currentDate);
  
      try {
        const response = await fetch(`http://146.190.218.123:5000/api/taskRoute/get-tasks?userId=${userId}&taskDate=${key}`);
        if (response.ok) {
          const data = await response.json();
          console.log("Data for", key, ":", data); // Add this line
          updatedTasksByDate[key] = data.tasks.map((task: any) => ({
            name: task.name,
            isCompleted: task.isCompleted
          }));        

        }        
        else {
          console.error(`Failed to fetch tasks for ${key}`);
        }
      } catch (error) {
        console.error(`Error fetching tasks for ${key}:`, error);
      }
    };
  
    // Fetch tasks for each day of the week (Sunday to Saturday)
    await Promise.all(Array.from({ length: 7 }, (_, i) => fetchForDay(i)));
  
    setTasksByDate(updatedTasksByDate);
  };
  

  useEffect(() => {
    if (userId && weekStart) {
      fetchTasks();
    }
  }, [userId, weekStart]);
  
  
  

  const handleViewChange = (newView: string): void => {
    if (newView === "Week") {
      const newStart = new Date(date);
      newStart.setDate(date.getDate() - date.getDay()); // Start on Sunday
      setWeekStart(newStart);
    }    
    setView(newView);
  };

  const handlePrev = (): void => {
    const newDate = new Date(date);
    if (view === "Week") {
      const newStart = new Date(weekStart);
      newStart.setDate(newStart.getDate() - 7);
      setWeekStart(newStart);
      setDate(newStart);
    } else if (view === "Day") newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNext = (): void => {
    const newDate = new Date(date);
    if (view === "Week") {
      const newStart = new Date(weekStart);
      newStart.setDate(newStart.getDate() + 7);
      setWeekStart(newStart);
      setDate(newStart);
    } else if (view === "Day") newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const addTask = async () => {
    if (!newTask.trim() || !userId) return;
  
    const key: string = getDateKey(date); // selected date
    const taskToAdd = newTask.trim();
  
    try {
      const response = await fetch("http://146.190.218.123:5000/api/taskRoute/add-task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          taskName: taskToAdd,
          taskDates: [key], // sending the selected date as an array
        }),
      });
  
      if (!response.ok) {
        console.error("Failed to save task");
        return;
      }
  
      // Update local state
      setTasksByDate((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), { name: taskToAdd, isCompleted: false }],
      }));
  
      setNewTask("");
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };
  

  const renderWeekView = (): React.ReactNode => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-7 gap-2 h-[60vh]">
        {days.map((day, index) => {
          const key = getDateKey(day);
          return (
            <div
              key={index}
              className="border rounded-lg p-2 flex flex-col cursor-pointer hover:bg-gray-100"
              onClick={() => {
                setDate(day);
                setView("Day");
              }}
            >
              <h3 className="font-semibold mb-2 text-center">
                {day.toLocaleDateString("en-US", { weekday: 'long', day: 'numeric' })}
              </h3>
              <ul className="text-sm text-gray-700 space-y-1 overflow-auto">
                {(tasksByDate[key] || []).map((task, i) => (
                  <li
                    key={i}
                    className={`truncate ${task.isCompleted ? 'line-through text-gray-400' : ''}`}
                  >
                    • {task.name}
                  </li>
                ))}
              </ul>

            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = (): React.ReactNode => {
    const key = getDateKey(date);
    const dayTasks = tasksByDate[key] || [];

    return (
      <div className="h-[60vh] p-4 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <div className="mb-4 flex gap-2 justify-center">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task"
            className="border rounded px-3 py-2 w-1/2"
          />
          <button onClick={addTask} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Add
          </button>
        </div>
        {dayTasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks yet. Add some!</div>
        ) : (
          <ul className="space-y-2">
            {dayTasks.map((task, index) => (
              <li
                key={index}
                className={`p-3 border rounded shadow-sm ${task.isCompleted ? 'line-through text-gray-400' : ''}`}
              >
                {task.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderCalendar = (): React.ReactNode | null => {
    return view === "Week" ? renderWeekView() : renderDayView();
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(date);
    newDate.setMonth(newMonth);
    setDate(newDate);
    setWeekStart(new Date(newDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(date);
    newDate.setFullYear(newYear);
    setDate(newDate);
    setWeekStart(new Date(newYear, date.getMonth(), 1));
  };

  const renderMonthYearDropdowns = () => {
    const months = [
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ];

    const years = Array.from({ length: 10 }, (_, i) => date.getFullYear() - 5 + i); // 10 years range centered on the current year

    return (
      <div className="flex gap-4 items-center">
        <select value={date.getMonth()} onChange={handleMonthChange} className="border rounded px-3 py-2">
          {months.map((month, index) => (
            <option key={index} value={index}>{month}</option>
          ))}
        </select>
        <select value={date.getFullYear()} onChange={handleYearChange} className="border rounded px-3 py-2">
          {years.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
        <button
          onClick={goToHome}
          className="bg-gray-500 text-white px-4 py-2 cursor-pointer rounded hover:bg-gray-600"
        >
          Back
        </button>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          {renderMonthYearDropdowns()}
          <div className="flex gap-2">
            <button 
            className="cursor-pointer"
            onClick={handlePrev}>{"<"}</button>
            <button 
            className="cursor-pointer"
            onClick={handleNext}>{">"}</button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          {['Week', 'Day'].map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`px-4 py-2 rounded-lg cursor-pointer border font-medium ${view === v ? 'bg-black text-white' : 'text-black bg-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
        {renderCalendar()}
      </div>
    </div>
  );
}
