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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    const newDate = new Date(date);
    newDate.setMonth(newMonth);
    setDate(newDate);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    const newDate = new Date(date);
    newDate.setFullYear(newYear);
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

  const renderCalendar = (): React.ReactNode | null => {
    return view === "Week" ? renderWeekView() : renderDayView();
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-4">
        <div className="flex justify-between items-center mb-4">
          {/* Month & Year Selection */}
          <div className="flex gap-2">
            <select value={date.getMonth()} onChange={handleMonthChange} className="border rounded px-2 py-1">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>{new Date(0, i).toLocaleString('en-US', { month: 'long' })}</option>
              ))}
            </select>
            <select value={date.getFullYear()} onChange={handleYearChange} className="border rounded px-2 py-1">
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={date.getFullYear() - 5 + i}>{date.getFullYear() - 5 + i}</option>
              ))}
            </select>
          </div>
          {/* Navigation Arrows */}
          <div className="flex gap-2">
            <button onClick={handlePrev} className="px-4 py-2 border rounded">{"<"}</button>
            <button onClick={handleNext} className="px-4 py-2 border rounded">{">"}</button>
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
