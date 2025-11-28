import * as React from "react";
import { cn } from "../../lib/utils.js";

export interface PageHeaderProps extends React.ComponentProps<"div"> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between", className)}
        {...props}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    );
  },
);
PageHeader.displayName = "PageHeader";

