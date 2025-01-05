import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateTimeSelectionProps, FiltersState } from "@/types/filter-props.types";
import { CalendarIcon } from "lucide-react";
import { TimeSelection } from "./TimeSelection";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
  selectedDate,
  setSelectedDate,
  filters,
  setFilters,
  timeSlots,
}) => (
  <>
    <div className="space-y-2">
      <Label>Select Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            initialFocus
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
          />
        </PopoverContent>
      </Popover>
    </div>

    <div className="space-y-4">
      <TimeSelection
        label="Start Time"
        value={filters.startTime}
        onChange={(value) => setFilters({ ...filters, startTime: value })}
        timeSlots={timeSlots}
      />
      <TimeSelection
        label="End Time"
        value={filters.endTime}
        onChange={(value) => setFilters({ ...filters, endTime: value })}
        timeSlots={timeSlots}
      />
    </div>
  </>
);
