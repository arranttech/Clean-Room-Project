
import React, { createContext, useContext, useState, ReactNode } from "react";
import ErrorScreen from "./ErrorScreen";

type ErrorContextType = {
  error: string;
  setError: (msg: string) => void;
};

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

type ErrorProviderProps = {
  children: ReactNode;
};

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string>("");

  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {error ? (
        <ErrorScreen message={error} onRetry={() => setError("")} />
      ) : (
        children
      )}
    </ErrorContext.Provider>
  );
};

// Custom hook to use the error context
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
