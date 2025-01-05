import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ReservationFormProps } from "@/types/filter-props.types";

export const ReservationForm: React.FC<ReservationFormProps> = ({
  selectedDate,
  selectedTime,
  duration,
  availableTimeSlots,
  onDateSelect,
  onTimeSelect,
  onDurationChange,
  onContinue,
  isSlotAvailable,
  roomStatus,
}) => (
  <div className="space-y-6">
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
            onSelect={onDateSelect}
            initialFocus
            disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
          />
        </PopoverContent>
      </Popover>
    </div>
    <div className="space-y-2">
      <Label>Select Time Slot</Label>
      <div className="grid grid-cols-2 gap-2">
        {selectedDate ? (
          availableTimeSlots.map((time) => (
            <Button
              key={time}
              variant={selectedTime === time ? "default" : "outline"}
              className={cn(
                "w-full",
                !isSlotAvailable(time) ? "opacity-50 cursor-not-allowed" : ""
              )}
              onClick={() => onTimeSelect(time)}
              disabled={!isSlotAvailable(time)}
            >
              <Clock className="w-4 h-4 mr-2" />
              {time}
            </Button>
          ))
        ) : (
          <p className="col-span-2 text-center text-muted-foreground">Please select a date first</p>
        )}
      </div>
    </div>
    <div className="space-y-2">
      <Label>Duration</Label>
      <Select value={duration} onValueChange={onDurationChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select duration" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">1 hour</SelectItem>
          <SelectItem value="2">2 hours</SelectItem>
          <SelectItem value="3">3 hours</SelectItem>
          <SelectItem value="4">4 hours</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Button
      className="w-full"
      size="lg"
      disabled={!selectedDate || !selectedTime || roomStatus !== "AVAILABLE"}
      onClick={onContinue}
    >
      Continue to Book
      <ChevronRight className="w-4 h-4 ml-2" />
    </Button>
  </div>
);
