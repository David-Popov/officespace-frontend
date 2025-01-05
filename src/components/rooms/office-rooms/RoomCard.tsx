import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { OfficeRoom, RoomStatus } from "@/types/offices.types";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { RoomCardProps } from "@/types/filter-props.types";

export const RoomCard: React.FC<RoomCardProps> = ({ room, onViewDetails }) => (
  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <img
      src={room.pictureUrl || "/api/placeholder/600/400"}
      alt={room.officeRoomName}
      className="w-full h-48 object-cover"
    />
    <CardHeader>
      <CardTitle>{room.officeRoomName}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-2">{room.address || "No address provided"}</p>
      <p className="text-sm text-muted-foreground mb-2">Floor: {room.floor}</p>
      <p className="text-sm text-muted-foreground mb-4">
        {room.type.replace("_", " ")} - {room.company.name}
      </p>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-bold">${room.pricePerHour}</p>
          <p className="text-sm text-muted-foreground">per hour</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span className="text-sm text-muted-foreground">Capacity: {room.capacity}</span>
        </div>
      </div>
      <div className="mt-2">
        <span
          className={cn("text-sm px-2 py-1 rounded-full", {
            "bg-green-100 text-green-800": room.status === RoomStatus.AVAILABLE,
            "bg-red-100 text-red-800": room.status === RoomStatus.OCCUPIED,
            "bg-yellow-100 text-yellow-800": room.status === RoomStatus.PENDING,
          })}
        >
          {room.status}
        </span>
      </div>
    </CardContent>
    <CardFooter>
      <Button className="w-full" onClick={() => onViewDetails(room.id)}>
        View Details
      </Button>
    </CardFooter>
  </Card>
);
