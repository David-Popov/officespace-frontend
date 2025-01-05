import { Button } from "@/components/ui/button";
import { CapacityFilterProps } from "@/types/filter-props.types";
import { Users } from "lucide-react";

export const CapacityFilter: React.FC<CapacityFilterProps> = ({ capacity, onChange }) => (
  <div className="space-y-4">
    <h3 className="font-medium">Minimum Capacity</h3>
    <div className="flex gap-2 items-center">
      <Users className="h-4 w-4" />
      <Button variant="outline" size="sm" onClick={() => onChange(Math.max(1, capacity - 1))}>
        -
      </Button>
      <span className="px-4 py-2">{capacity}</span>
      <Button variant="outline" size="sm" onClick={() => onChange(capacity + 1)}>
        +
      </Button>
    </div>
  </div>
);
