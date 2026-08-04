import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select…",
}: {
  options: readonly string[];
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const toggle = (option: string) =>
    onChange(
      value.includes(option) ? value.filter((v) => v !== option) : [...value, option],
    );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between border-input bg-card font-normal"
        >
          <span className={cn("truncate", value.length === 0 && "text-muted-foreground")}>
            {value.length === 0 ? placeholder : `${value.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-72 w-[--radix-popover-trigger-width] overflow-y-auto p-1">
        {options.map((option) => {
          const active = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent"
            >
              <span
                className={cn(
                  "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input",
                  active && "border-primary bg-primary text-primary-foreground",
                )}
              >
                {active && <Check className="h-3 w-3" />}
              </span>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </PopoverContent>
    </Popover>
  );
}
