import { useState } from "react";

export default function Calendar() {
  const [view, setView] = useState<string>("Week");
  const [date, setDate] = useState<Date>(new Date());
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const today = new Date();
    today.setDate(today.getDate() - today.getDay() + 1);
    return today;
  });
  const [tasksByDate, setTasksByDate] = useState<Record<string, string[]>>({});
  const [newTask, setNewTask] = useState<string>("");

  const getDateKey = (dateObj: Date): string => dateObj.toISOString().split("T")[0];

  const handleViewChange = (newView: string): void => {
    if (newView === "Week") {
      const newStart = new Date(date);
      newStart.setDate(date.getDate() - date.getDay() + 1);
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

  const addTask = (): void => {
    if (newTask.trim() === "") return;
    const key: string = getDateKey(date);
    setTasksByDate((prev) => ({
      ...prev,
      [key]: [...(prev[key] || []), newTask.trim()]
    }));
    setNewTask("");
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
                  <li key={i} className="truncate">• {task}</li>
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
              <li key={index} className="p-3 border rounded shadow-sm">
                {task}
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

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button onClick={handlePrev}>{"<"}</button>
            <button onClick={handleNext}>{">"}</button>
          </div>
        </div>
        <div className="flex justify-center gap-4 mb-4">
          {['Week', 'Day'].map((v) => (
            <button
              key={v}
              onClick={() => handleViewChange(v)}
              className={`px-4 py-2 rounded-lg border font-medium ${view === v ? 'bg-black text-white' : 'text-black bg-white'}`}
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