import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { Header } from "@/components/Header";
import { Login } from "@/components/Login";
import { MemoryWall } from "@/components/MemoryWall";
import IndexRoute from "./components/IndexRoute";
import { useAuthActions } from "@convex-dev/auth/react";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();
  const [submitted, setSubmitted] = useState(false);
  console.log("isAuth app", isAuthenticated);

  const onLogout = () => {
    // Handle logout logic here
    signOut();
  };

  // return (
  //   <Router>
  //     <div className="bg-gray-50 min-h-screen p-8">
  //       <div className="container mx-auto">
  //         <Header
  //           isLoading={isLoading}
  //           isAuthenticated={isAuthenticated}
  //           onLogout={() => {}}
  //         />
  //         <Routes>
  //           <Route
  //             path="/"
  //             element={
  //               isAuthenticated ? (
  //                 !submitted ? (
  //                   <MemoryForm onSuccess={() => setSubmitted(true)} />
  //                 ) : (
  //                   <ThankYou />
  //                 )
  //               ) : (
  //                 <Navigate to="/login" replace />
  //               )
  //             }
  //           />
  //           <Route
  //             path="/"
  //             element={
  //               <Unauthenticated>
  //                 <Navigate to="/login" replace />
  //               </Unauthenticated>
  //             }
  //           />
  //           <Route path="/login" element={<Login />} />
  //           <Route path="/memories" element={<ProtectedMemoryWall />} />
  //           <Route path="*" element={<Navigate to="/" replace />} />
  //         </Routes>
  //       </div>
  //     </div>
  //   </Router>
  // );

  return (
    <Router>
      <div className="bg-gray-50 min-h-screen p-8">
        <div className="container mx-auto">
          <Header
            isLoading={isLoading}
            isAuthenticated={isAuthenticated}
            onLogout={onLogout}
          />
          <Routes>
            <Route
              path="/"
              element={
                <IndexRoute onSuccess={setSubmitted} isSubmitted={submitted} />
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
