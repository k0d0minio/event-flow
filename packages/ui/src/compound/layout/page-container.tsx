import * as React from "react";
import { cn } from "../../lib/utils.js";

export interface PageContainerProps extends React.ComponentProps<"div"> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "7xl" | "full";
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, maxWidth = "7xl", children, ...props }, ref) => {
    const maxWidthClasses = {
      sm: "max-w-sm",
      md: "max-w-md",
      lg: "max-w-lg",
      xl: "max-w-xl",
      "2xl": "max-w-2xl",
      "7xl": "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn("mx-auto px-4 sm:px-6 lg:px-8", maxWidthClasses[maxWidth], className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);
PageContainer.displayName = "PageContainer";

