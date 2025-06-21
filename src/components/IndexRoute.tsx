import { Authenticated, Unauthenticated } from "convex/react";
import { Navigate } from "react-router";
import { MemoryForm } from "./MemoryForm";
import { ThankYou } from "./ThankYou";

type IndexRouteProps = {
  onSuccess: (val: boolean) => void;
  isSubmitted: boolean;
};

const IndexRoute = ({ onSuccess, isSubmitted }: IndexRouteProps) => {
  return (
    <>
      <Unauthenticated>
        <Navigate to="/login" replace />
      </Unauthenticated>
      <Authenticated>
        {!isSubmitted ? (
          <MemoryForm onSuccess={() => onSuccess(true)} />
        ) : (
          <ThankYou />
        )}
      </Authenticated>
    </>
  );
};

export default IndexRoute;
