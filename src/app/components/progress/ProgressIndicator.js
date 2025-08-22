// File: components/ProgressIndicator.jsx

import React from "react";
import { CircleCheck } from "lucide-react";

const ProgressIndicator = ({ step }) => {
  const steps = [
    { text: "Checking image authenticity...", isActive: step >= 1, isComplete: step > 1 },
    { text: "Embedding security watermark...", isActive: step >= 2, isComplete: step > 2 },
    { text: "Creating product...", isActive: step >= 3, isComplete: step > 3 },
  ];

  const getStatusIcon = (isActive, isComplete) => {
    if (isComplete) {
      return <CircleCheck className="w-4 h-4 me-2 text-green-500 shrink-0" />;
    }
    if (isActive) {
      return (
        <div role="status">
          <svg
            className="w-4 h-4 me-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
          >
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9868 97.2253 33.5617C96.5882 31.1367 94.1712 29.6673 91.7461 30.3044C79.8662 33.433 63.8643 32.5592 50 32.5592C36.1357 32.5592 20.1338 33.433 8.2539 30.3044C5.82888 29.6673 3.4118 31.1367 2.7747 33.5617C2.1376 35.9868 3.607 38.4038 6.0324 39.0409C17.9123 42.17 33.9142 43.0438 50 43.0438C66.0857 43.0438 82.0877 42.17 93.9676 39.0409Z" fill="currentColor" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      );
    }
    return (
      <svg className="w-4 h-4 me-2 text-gray-200 dark:text-gray-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
      </svg>
    );
  };

  return (
    <ul className="max-w-md space-y-2 text-gray-500 list-inside dark:text-gray-400">
      {steps.map((s, index) => (
        <li key={index} className="flex items-center">
          {getStatusIcon(s.isActive, s.isComplete)}
          {s.text}
        </li>
      ))}
    </ul>
  );
};

export default ProgressIndicator;