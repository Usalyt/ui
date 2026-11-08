"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {}

export const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      role="tree"
      className={cn("flex flex-col gap-1 select-none text-sm text-foreground", className)}
      {...props}
    />
  )
);
TreeView.displayName = "TreeView";

export interface TreeItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

type TreeItemContextType = {
  isExpanded: boolean;
  toggle: () => void;
};

const TreeItemContext = React.createContext<TreeItemContextType>({
  isExpanded: false,
  toggle: () => {},
});

export const TreeItem = React.forwardRef<HTMLLIElement, TreeItemProps>(
  ({ defaultExpanded = false, expanded: expandedProp, onExpandedChange, className, children, ...props }, ref) => {
    const [_expanded, setExpanded] = React.useState(defaultExpanded);
    const isExpanded = expandedProp !== undefined ? expandedProp : _expanded;

    const toggle = React.useCallback(() => {
      const next = !isExpanded;
      if (onExpandedChange) {
        onExpandedChange(next);
      } else {
        setExpanded(next);
      }
    }, [isExpanded, onExpandedChange]);

    return (
      <TreeItemContext.Provider value={{ isExpanded, toggle }}>
        <li
          ref={ref}
          role="treeitem"
          aria-expanded={isExpanded}
          className={cn("relative flex flex-col gap-1", className)}
          {...props}
        >
          {children}
        </li>
      </TreeItemContext.Provider>
    );
  }
);
TreeItem.displayName = "TreeItem";

export const TreeItemTrigger = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, onClick, ...props }, ref) => {
  const { isExpanded, toggle } = React.useContext(TreeItemContext);

  return (
    <div
      ref={ref}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/70 cursor-pointer transition-colors",
        className
      )}
      {...props}
    >
      <ChevronRight
        className={cn(
          "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
          isExpanded && "rotate-90"
        )}
      />
      {children}
    </div>
  );
});
TreeItemTrigger.displayName = "TreeItemTrigger";

export const TreeItemContent = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => {
  const { isExpanded } = React.useContext(TreeItemContext);

  if (!isExpanded) return null;

  return (
    <ul
      ref={ref}
      role="group"
      className={cn("flex flex-col gap-1 pl-4 border-l border-border/60 ml-3.5", className)}
      {...props}
    />
  );
});
TreeItemContent.displayName = "TreeItemContent";
