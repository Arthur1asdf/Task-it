import { useState } from "react";

export default function Calendar() {
  const [view, setView] = useState("Week");
  const [date, setDate] = useState(new Date());
  const [yearRangeStart, setYearRangeStart] = useState(new Date().getFullYear());

  const handleViewChange = (newView) => {
    setView(newView);
  };

  const handlePrev = () => {
    const newDate = new Date(date);
    if (view === "Year") setYearRangeStart((prev) => prev - 20);
    else if (view === "Week") newDate.setDate(date.getDate() - 7);
    else if (view === "Day") newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    if (view === "Year") setYearRangeStart((prev) => prev + 20);
    else if (view === "Week") newDate.setDate(date.getDate() + 7);
    else if (view === "Day") newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  const renderYearView = () => {
    const years = Array.from({ length: 20 }, (_, i) => yearRangeStart + i);
    return (
      <div className="grid grid-cols-5 gap-4 p-4">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => {
              setDate(new Date(year, 0, 1));
              setView("Month");
            }}
            className="border rounded-lg p-4 hover:bg-gray-200"
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {months.map((month, index) => (
          <button
            key={month}
            onClick={() => {
              const newDate = new Date(date.getFullYear(), index, 1);
              setDate(newDate);
              setView("Day");
            }}
            className="border rounded-lg p-4 hover:bg-gray-200"
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const renderWeekView = () => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });

    return (
      <div className="grid grid-cols-7 gap-2 h-[60vh]">
        {days.map((day, index) => (
          <div key={index} className="border rounded-lg p-2 flex flex-col">
            <h3 className="font-semibold mb-2 text-center">
              {day.toLocaleDateString("en-US", { weekday: 'long' })}
            </h3>
            <div className="flex-grow"></div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const days = Array.from({ length: lastDay }, (_, i) => i + 1);

    return (
      <div className="grid grid-cols-7 gap-2 h-[60vh] p-4">
        {days.map((day) => (
          <div
            key={day}
            className="border rounded-lg p-4 text-center hover:bg-gray-100 cursor-pointer"
            onClick={() => setDate(new Date(year, month, day))}
          >
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCalendar = () => {
    switch (view) {
      case "Year":
        return renderYearView();
      case "Month":
        return renderMonthView();
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
          <div className="text-xl font-bold">{date.toLocaleDateString("en-US", { year: 'numeric', month: 'long' })}</div>
          <div className="flex gap-2">
            <button onClick={handlePrev}>{"<"}</button>
            <button onClick={handleNext}>{">"}</button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center gap-4 mb-4">
          {['Year', 'Month', 'Week', 'Day'].map((v) => (
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
