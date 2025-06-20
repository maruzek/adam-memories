import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { Header } from "@/components/Header";
import { MemoryForm } from "@/components/MemoryForm";
import { ThankYou } from "@/components/ThankYou";
import { Login } from "@/components/Login";
import { MemoryWall } from "@/components/MemoryWall";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const [submitted, setSubmitted] = useState(false);

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="container mx-auto">
          <Header
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onLogout={() => {}}
          />
          <Routes>
            <Route
              path="/"
              element={
                !submitted ? (
                  <MemoryForm onSuccess={() => setSubmitted(true)} />
                ) : (
                  <ThankYou />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/memories" element={<ProtectedMemoryWall />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function ProtectedMemoryWall() {
  // Simple password protection for demonstration
  // const [access, setAccess] = useState(false);
  // const [input, setInput] = useState("");
  // const PASSWORD = import.meta.env.VITE_MEMORIES_PASSWORD || "beeaccess";

  // if (!access) {
  //   return (
  //     <div className="flex flex-col items-center justify-center mt-12">
  //       <h2 className="text-xl font-bold mb-4">Admin Access Required</h2>
  //       <input
  //         type="password"
  //         placeholder="Enter access password"
  //         className="border rounded px-3 py-2 mb-2"
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //       />
  //       <button
  //         className="bee-btn px-4 py-2"
  //         onClick={() => setAccess(input === PASSWORD)}
  //       >
  //         Access Memories
  //       </button>
  //       {input && input !== PASSWORD && (
  //         <p className="text-red-500 mt-2">Incorrect password</p>
  //       )}
  //     </div>
  //   );
  // }
  return <MemoryWall />;
}

export default App;
