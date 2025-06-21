import { Authenticated, Unauthenticated } from "convex/react";
import { Navigate } from "react-router";
import { MemoryForm } from "./MemoryForm";
import { ThankYou } from "./ThankYou";

type IndexRouteProps = {
  setSubmitted: (submitted: boolean) => void;
  isSubmitted: boolean;
};

const IndexRoute = ({
  setSubmitted: onSuccess,
  isSubmitted,
}: IndexRouteProps) => {
  return (
    <>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
      <Authenticated>
        {!isSubmitted ? <MemoryForm onSuccess={onSuccess} /> : <ThankYou />}
      </Authenticated>
    </>
  );
};

export default IndexRoute;
