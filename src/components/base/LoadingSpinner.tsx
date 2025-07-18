import React from "react";
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  );
}

export default LoadingSpinner;
