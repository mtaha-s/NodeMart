import React, { useState } from "react";
import "./App.css";
import Dashboard from "./pages/Dashboard.jsx"; // use default import

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Dashboard />
    </div>
  );
}

export default App; // default export
