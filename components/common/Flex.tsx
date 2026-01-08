import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FlexProps {
  children: ReactNode;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
  wrap?: boolean;
  className?: string;
}

const justifyMap = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
} as const;

const alignMap = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
} as const;

const gapMap = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
} as const;

export function Flex({
  children,
  direction = "row",
  justify = "start",
  align = "stretch",
  gap = 0,
  wrap = false,
  className,
}: FlexProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "col" ? "flex-col" : "flex-row",
        justifyMap[justify],
        alignMap[align],
        gapMap[gap],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export default Flex;
