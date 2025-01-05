import { AlertCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OfficeRoom } from "@/types/offices.types";
import { Button } from "@/components/ui/button";
import { RoomHeaderProps } from "@/types/filter-props.types";

export const RoomHeader: React.FC<RoomHeaderProps> = ({ room, isAuthenticated, onReportIssue }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{room.officeRoomName}</h1>
        <p className="text-muted-foreground flex items-center mt-1">
          <MapPin className="w-4 h-4 mr-1" />
          {room.building}, Floor {room.floor}
        </p>
      </div>
      <div className="flex gap-4 items-center">
        {isAuthenticated && (
          <Button variant="outline" onClick={onReportIssue} className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Report Issue
          </Button>
        )}
        <Badge variant="secondary" className="text-lg px-4 py-1">
          ${room.pricePerHour}/hour
        </Badge>
      </div>
    </div>
    <Separator />
  </div>
);
