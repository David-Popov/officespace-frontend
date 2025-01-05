import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeSelectionProps } from "@/types/filter-props.types";

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  label,
  value,
  onChange,
  timeSlots,
}) => (
  <>
    <h3 className="font-medium">{label}</h3>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {timeSlots.map((slot) => (
          <SelectItem key={slot} value={slot}>
            {slot}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </>
);
