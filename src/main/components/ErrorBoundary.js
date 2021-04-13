import * as Sentry from "@sentry/react";
import { MdError } from "react-icons/md";

import isDev from "~/utils/isDev";

const ErrorMessage = () => (
  <div className="flex items-center justify-center flex-grow align-center">
    <div className="flex flex-row items-center p-8 bg-white border rounded-lg space-x-4">
      <MdError className="w-8 h-8 text-red-500" />
      <div className="flex flex-col space-y-1">
        <h1 className="text-xl bold">Oops, something went wrong</h1>
        <p>{"It's probably not serious, but I'll fix it soon."}</p>
      </div>
    </div>
  </div>
);

const ErrorBoundary = (props) => {
  if (isDev()) return props.children;

  return (
    <Sentry.ErrorBoundary fallback={ErrorMessage}>
      {props.children}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
