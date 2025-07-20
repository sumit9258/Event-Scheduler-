import React, { useState, useEffect } from "react";

const App = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const savedEvents = localStorage.getItem("events");
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const addOrUpdateEvent = () => {
    if (!title || !date) {
      alert("Title and Date are required");
      return;
    }
    if (editingId) {
      setEvents(events.map((ev) => (ev.id === editingId ? { ...ev, title, date } : ev)));
      setEditingId(null);
    } else {
      setEvents([...events, { id: Date.now(), title, date }]);
    }
    setTitle("");
    setDate("");
  };

  const deleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
    if (editingId === id) {
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

  const getDays = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const filteredEvents = selectedDay
    ? events.filter((ev) => parseInt(ev.date.split("-")[2]) === selectedDay)
    : events;

  const today = new Date().getDate();

  return (
    <div style={{ maxWidth: "500px", margin: "20px auto", padding: "15px", background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <h2 style={{ fontSize: "20px", color: "#333", marginBottom: "15px" }}>📅 Event Scheduler</h2>

      {/* Calendar Days */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px", marginBottom: "15px" }}>
        {getDays().map((day) => {
          const hasEvent = events.some((ev) => parseInt(ev.date.split("-")[2]) === day);
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "6px",
                border: "none",
                background: selectedDay === day ? "#3b82f6" : day === today ? "#fef3c7" : hasEvent ? "#e0f2fe" : "#f3f4f6",
                color: selectedDay === day ? "#fff" : "#333",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <button
          onClick={() => setSelectedDay(null)}
          style={{ padding: "8px", background: "#6b7280", color: "#fff", border: "none", borderRadius: "6px", marginBottom: "15px" }}
        >
          Show All Events
        </button>
      )}

      {/* Event Form */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ padding: "8px", border: "1px solid #ddd", borderRadius: "6px", fontSize: "14px" }}
        />
        <button
          onClick={addOrUpdateEvent}
          style={{ padding: "8px", background: editingId ? "#10b981" : "#3b82f6", color: "#fff", border: "none", borderRadius: "6px" }}
        >
          {editingId ? "Update" : "Add"}
        </button>
      </div>

      {/* Event List */}
      <h3 style={{ fontSize: "18px", color: "#333", marginBottom: "10px" }}>📌 Events</h3>
      {filteredEvents.length === 0 ? (
        <p style={{ color: "#666", textAlign: "center" }}>No events found.</p>
      ) : (
        filteredEvents.map((ev) => (
          <div
            key={ev.id}
            style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#f9fafb", borderRadius: "6px", marginBottom: "8px" }}
          >
            <div>
              <strong style={{ fontSize: "14px" }}>{ev.title}</strong>
              <p style={{ fontSize: "12px", color: "#666" }}>{ev.date}</p>
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              <button onClick={() => editEvent(ev)} style={{ padding: "5px 10px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: "4px" }}>
                Edit
              </button>
              <button onClick={() => deleteEvent(ev.id)} style={{ padding: "5px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "4px" }}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default App;