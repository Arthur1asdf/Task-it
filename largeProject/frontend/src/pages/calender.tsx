import { useState } from "react";

export default function Calendar() {
  const [view, setView] = useState("Week");
  const [date, setDate] = useState(new Date());
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
  });
  const [tasksByDate, setTasksByDate] = useState({});
  const [newTask, setNewTask] = useState("");

  const getDateKey = (dateObj) => dateObj.toISOString().split("T")[0];

  const handleViewChange = (newView) => {
    if (newView === "Week") {
      const newStart = new Date(date);
      newStart.setDate(date.getDate() - date.getDay() + 1);
      setWeekStart(newStart);
    }
    setView(newView);
  };

  const handlePrev = () => {
    const newDate = new Date(date);
    if (view === "Week") {
      const newStart = new Date(weekStart);
      newStart.setDate(newStart.getDate() - 7);
      setWeekStart(newStart);
      setDate(newStart);
    } else if (view === "Day") newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "Week") {
      const newStart = new Date(weekStart);
      newStart.setDate(newStart.getDate() + 7);
      setWeekStart(newStart);
      setDate(newStart);
    } else if (view === "Day") newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  const addTask = () => {
    if (newTask.trim() === "") return;
    const key = getDateKey(date);
    setTasksByDate((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newTask.trim()]
    }));
    setNewTask("");
  };

  const renderWeekView = () => {
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
                  <li key={i} className="truncate">• {task}</li>
                ))}
              </ul>
              <div className="flex-grow"></div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDayView = () => {
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
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>

        {dayTasks.length === 0 ? (
          <div className="text-center text-gray-500">No tasks yet. Add some!</div>
        ) : (
          <ul className="space-y-2">
            {dayTasks.map((task, index) => (
              <li key={index} className="p-3 border rounded shadow-sm">
                {task}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderCalendar = () => {
    switch (view) {
      case "Week":
        return renderWeekView();
      case "Day":
        return renderDayView();
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2 items-center">
            <select
              value={date.getFullYear()}
              onChange={(e) => setDate(new Date(parseInt(e.target.value), date.getMonth(), date.getDate()))}
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 20 }, (_, i) => 2015 + i).map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
              ))}
            </select>
            <select
              value={date.getMonth()}
              onChange={(e) => setDate(new Date(date.getFullYear(), parseInt(e.target.value), date.getDate()))}
              className="border rounded px-2 py-1"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString("en-US", { month: "long" })}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrev}>{"<"}</button>
            <button onClick={handleNext}>{">"}</button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-4">
          {['Week', 'Day'].map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`px-4 py-2 rounded-lg border font-medium ${
                view === v ? 'bg-black text-white' : 'text-black bg-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Calendar Content */}
        {renderCalendar()}
      </div>
    </div>
  );
}
