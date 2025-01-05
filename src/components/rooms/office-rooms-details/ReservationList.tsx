import { Badge } from "@/components/ui/badge";
import { ReservationDto, ReservationStatus } from "@/types/reservation.type";
import { cn } from "@/lib/utils";

interface ReservationListProps {
  reservations: ReservationDto[];
}

export const ReservationList: React.FC<ReservationListProps> = ({ reservations }) => (
  <div className="mt-4 space-y-4">
    {reservations.map((reservation, index) => (
      <div key={index} className="border p-4 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{reservation.reservation_title}</h4>
            <p className="text-sm text-muted-foreground">
              {new Date(reservation.start_date_time).toLocaleString()} -{" "}
              {new Date(reservation.end_date_time).toLocaleString()}
            </p>
          </div>
          <Badge
            variant="default"
            className={cn(
              reservation.status === ReservationStatus.CONFIRMED &&
                "bg-green-100 text-green-800 hover:bg-green-100",
              reservation.status === ReservationStatus.PENDING &&
                "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
              reservation.status === ReservationStatus.CANCELLED &&
                "bg-red-100 text-red-800 hover:bg-red-100"
            )}
          >
            {reservation.status}
          </Badge>
        </div>
        {reservation.event && (
          <div className="mt-2 text-sm text-muted-foreground">
            <p>Event: {reservation.event.meetingTitle}</p>
            <p>Department: {reservation.event.department}</p>
            <p>Contact: {reservation.event.contactEmail}</p>
          </div>
        )}
      </div>
    ))}
  </div>
);
