import React, { useState, useEffect } from "react";

const App = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingId, setEditingId] = useState(null); // For edit mode

  // Load events from localStorage
  useEffect(() => {
  const savedEvents = localStorage.getItem("events");
  if (savedEvents) {
    setEvents(JSON.parse(savedEvents));
  }
}, []);

useEffect(() => {
  localStorage.setItem("events", JSON.stringify(events));
}, [events]);

  const addOrUpdateEvent = () => {
    if (!title || !date) return alert("Title and Date required");

    if (editingId) {
      // Update existing
      const updated = events.map((ev) =>
        ev.id === editingId ? { ...ev, title, date } : ev
      );
      setEvents(updated);
      setEditingId(null);
    } else {
      // Add new
      const newEvent = { id: Date.now(), title, date };
      setEvents([...events, newEvent]);
    }

    setTitle("");
    setDate("");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
    if (editingId === id) {
      // If deleted item was being edited
      setEditingId(null);
      setTitle("");
      setDate("");
    }
  };

  const editEvent = (ev) => {
    setTitle(ev.title);
    setDate(ev.date);
    setEditingId(ev.id);
  };

  // Get all days of current month
  const getDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const filteredEvents = selectedDay
    ? events.filter((ev) => parseInt(ev.date.split("-")[2]) === selectedDay)
    : events;

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h2>📅 Event Scheduler with Calendar + Edit</h2>

      {/* Calendar Days */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", margin: "10px 0" }}>
        {getDays().map((day) => {
          const hasEvent = events.some((ev) => parseInt(ev.date.split("-")[2]) === day);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor:
                  selectedDay === day
                    ? "#007bff"
                    : hasEvent
                    ? "#d1ecf1"
                    : "#f0f0f0",
                color: selectedDay === day ? "white" : "black",
                border: "1px solid #ccc",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <button onClick={() => setSelectedDay(null)} style={{ marginBottom: "10px" }}>
          Show All Events
        </button>
      )}

      {/* Event Form */}
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ display: "block", width: "100%", margin: "10px 0", padding: "8px" }}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: "10px", padding: "8px" }}
      />

      <button onClick={addOrUpdateEvent} style={{ padding: "10px 20px" }}>
        {editingId ? "Update Event" : "Add Event"}
      </button>

      {/* Event List */}
      <h3 style={{ marginTop: "20px" }}>📌 Events:</h3>
      {filteredEvents.length === 0 ? (
        <p>No events for selected day.</p>
      ) : (
        filteredEvents.map((ev) => (
          <div
            key={ev.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <strong>{ev.title}</strong>
            <p>{ev.date}</p>
            <button
              onClick={() => editEvent(ev)}
              style={{ marginRight: "10px", color: "blue" }}
            >
              Edit
            </button>
            <button onClick={() => deleteEvent(ev.id)} style={{ color: "red" }}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
