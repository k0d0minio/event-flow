import * as React from "react";
import { cn } from "../../lib/utils.js";
import { PageContainer, type PageContainerProps } from "./page-container.js";
import { PageHeader, type PageHeaderProps } from "./page-header.js";

export interface DashboardLayoutProps extends Omit<PageContainerProps, "children"> {
  children: React.ReactNode;
  header?: PageHeaderProps;
  className?: string;
}

export const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  ({ children, header, className, ...containerProps }, ref) => {
    return (
      <div ref={ref} className={cn("min-h-screen bg-background p-4 sm:p-6 lg:p-8", className)}>
        <PageContainer {...containerProps}>
          {header && <PageHeader {...header} className={cn("mb-8", header.className)} />}
          {children}
        </PageContainer>
      </div>
    );
  },
);
DashboardLayout.displayName = "DashboardLayout";

