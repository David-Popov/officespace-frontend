import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Calendar, X, Users, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

interface EventDto {
  id: string;
  meetingTitle: string;
  description?: string;
  attendees?: string[];
  contactEmail: string;
  department: string;
  reservationId: string;
}

interface ReservationDto {
  reservation_title: string;
  user_uuid: string;
  start_date_time: string;
  end_date_time: string;
  durationAsHours: number;
  status: ReservationStatus;
  office_room_uuid: string;
  event?: EventDto;
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [openModal, setOpenModal] = React.useState(false);
  const [selectedReservation, setSelectedReservation] = React.useState<string | null>(null);

  // Example reservations data - replace with actual API call
  const [reservations, setReservations] = React.useState<ReservationDto[]>([
    {
      reservation_title: "Team Meeting",
      user_uuid: "user-123",
      start_date_time: "2024-12-04T10:00:00",
      end_date_time: "2024-12-04T11:00:00",
      durationAsHours: 1,
      status: ReservationStatus.CONFIRMED,
      office_room_uuid: "room-123",
      event: {
        id: "event-123",
        meetingTitle: "Weekly Team Sync",
        description: "Regular team sync meeting",
        contactEmail: "team@example.com",
        department: "Engineering",
        reservationId: "res-123",
      },
    },
  ]);

  const handleRemoveReservation = async (reservationId: string) => {
    setSelectedReservation(reservationId);
    setOpenModal(true);
  };

  const confirmRemove = async () => {
    if (selectedReservation) {
      try {
        // Add API call to remove reservation here
        // await removeReservation(selectedReservation);
        setReservations((prevReservations) =>
          prevReservations.filter(
            (reservation) => reservation.office_room_uuid !== selectedReservation
          )
        );
      } catch (error) {
        console.error("Failed to remove reservation:", error);
      }
    }
    setOpenModal(false);
    setSelectedReservation(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* User Information Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium">{user?.username}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reservations Card */}
      <Card>
        <CardHeader>
          <CardTitle>My Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reservations.length === 0 ? (
              <p className="text-center text-muted-foreground">No reservations found</p>
            ) : (
              reservations.map((reservation) => (
                <div
                  key={reservation.office_room_uuid}
                  className={`flex flex-col p-4 border rounded-lg ${
                    reservation.status === ReservationStatus.CANCELLED ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <p className="font-medium">{reservation.reservation_title}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {new Date(reservation.start_date_time).toLocaleDateString()} |{" "}
                          {new Date(reservation.start_date_time).toLocaleTimeString()} -{" "}
                          {new Date(reservation.end_date_time).toLocaleTimeString()}
                        </p>
                      </div>
                      {reservation.event && (
                        <div className="space-y-1">
                          <p className="text-sm font-medium">{reservation.event.meetingTitle}</p>
                          {reservation.event.description && (
                            <p className="text-sm text-muted-foreground">
                              {reservation.event.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">
                              {reservation.event.department} | {reservation.event.contactEmail}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {reservation.status !== ReservationStatus.CANCELLED && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveReservation(reservation.office_room_uuid)}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Modal */}
      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this reservation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenModal(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UserProfile;
