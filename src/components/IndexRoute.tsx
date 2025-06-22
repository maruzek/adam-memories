import { Authenticated, Unauthenticated } from "convex/react";
import { Navigate } from "react-router";
import { MemoryForm } from "./MemoryForm";
import { ThankYou } from "./ThankYou";
import { useState } from "react";



const IndexRoute = () => {
  const [submitted, setSubmitted] = useState(false);
  return (
    <>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
      <Authenticated>
        {!submitted ? (
          <MemoryForm setSubmitted={setSubmitted} />
        ) : (
          <ThankYou setSubmitted={setSubmitted} />
        )}
      </Authenticated>
    </>
  );
};

export default IndexRoute;
