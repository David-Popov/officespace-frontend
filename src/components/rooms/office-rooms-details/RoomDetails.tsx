import { Users, Building, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OfficeRoom, RoomStatus } from "@/types/offices.types";
import { RoomDetailsProps } from "@/types/filter-props.types";

export const RoomDetails: React.FC<RoomDetailsProps> = ({ room }) => (
  <div className="grid grid-cols-2 gap-4 mt-4">
    <div className="flex items-center gap-2">
      <Users className="w-5 h-5 text-muted-foreground" />
      <span>Capacity: {room.capacity} people</span>
    </div>
    <div className="flex items-center gap-2">
      <Building className="w-5 h-5 text-muted-foreground" />
      <span>Type: {room.type.replace("_", " ")}</span>
    </div>
    <div className="flex items-center gap-2">
      <DollarSign className="w-5 h-5 text-muted-foreground" />
      <span>Price: ${room.pricePerHour}/hour</span>
    </div>
    <div className="flex items-center gap-2">
      <Badge
        variant="default"
        className={cn(
          room.status === RoomStatus.AVAILABLE && "bg-green-100 text-green-800 hover:bg-green-100",
          room.status === RoomStatus.OCCUPIED && "bg-red-100 text-red-800 hover:bg-red-100",
          room.status === RoomStatus.PENDING && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
        )}
      >
        {room.status}
      </Badge>
    </div>
  </div>
);
