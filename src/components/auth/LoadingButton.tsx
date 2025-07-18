import type React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  defaultText: string;
  className?: string;
  disabled?: boolean;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  defaultText,
  className = "w-full",
  disabled = false,
}) => (
  <Button type="submit" className={className} disabled={isLoading || disabled}>
    {isLoading ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}
      </>
    ) : (
      defaultText
    )}
  </Button>
);
