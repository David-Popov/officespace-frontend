import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar, Clock, Users } from "lucide-react";
import { ReservationService } from "@/services/reservationService";
import { UserService } from "@/services/userService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle } from "lucide-react";

interface BookingFormData {
  title: string;
  description: string;
  attendees: string;
  email: string;
  department: string;
}

export const EventBookingDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedDate: Date | undefined;
  selectedTime: string;
  duration: string;
  roomName: string;
  roomId: string;
  userId: string;
}> = ({ isOpen, onClose, onSuccess, selectedDate, selectedTime, duration, roomName, roomId, userId }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    title: "",
    description: "",
    attendees: "",
    email: "",
    department: "",
  });

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  console.log("USER ID from event booking:", userId);

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const attendeesEmails = formData.attendees.split(",").map((email) => email.trim());

      const userService = UserService.getInstance();

      const attendeesIdsPromises = attendeesEmails.map(async (email) => {
        const userResponse = await userService.getUserByEmail(email);

        if (!userResponse.data) {
          throw new Error(`User with email ${email} not found.`);
        }

        console.log("UserResponse:", userResponse);
        console.log("attendee Data:", userResponse.data);
        console.log("attendee Id:", userResponse.data.Id);

        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowAlertDialog(true);
        onSuccess();

        return userResponse.data.Id;
      });
      const attendeesIds = await Promise.all(attendeesIdsPromises);
      console.log("Attendees IDs:", attendeesIds);

      const startDateTime = `${format(selectedDate as Date, "yyyy-MM-dd")}T${selectedTime}:00`;
      const endDateTime = `${format(selectedDate as Date, "yyyy-MM-dd")}T${(
        parseInt(selectedTime.split(":")[0]) + parseInt(duration)
      )
        .toString()
        .padStart(2, "0")}:00`;

      const event = {
        id: crypto.randomUUID(),
        meetingTitle: formData.title,
        description: formData.description,
        attendees: attendeesIds,
        contactEmail: formData.email,
        department: formData.department,
        reservationId: crypto.randomUUID(),
      };

      const createReservationData = {
        event: event,
        reservation_title: formData.title,
        user_uuid: userId,
        start_date_time: startDateTime,
        end_date_time: endDateTime,
        durationAsHours: parseInt(duration),
        office_room_uuid: roomId
      };

      const reservationService = ReservationService.getInstance();
      await reservationService.createReservation(createReservationData);

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error creating reservation:", error);
    }
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {roomName}</DialogTitle>
            <DialogDescription>Fill in the details for your meeting reservation</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{selectedDate ? format(selectedDate, "PPP") : "No date selected"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  {selectedTime} ({duration} hour{parseInt(duration) > 1 ? "s" : ""})
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter meeting description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attendees">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>Attendees (email addresses)</span>
                </div>
              </Label>
              <Input
                id="attendees"
                name="attendees"
                value={formData.attendees}
                onChange={handleInputChange}
                placeholder="Enter attendee emails separated by commas"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Contact Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department*</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Enter your department"
                required
              />
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col items-center">
            <CheckCircle className="w-10 h-10 text-green-500" />
            <AlertDialogTitle>Reservation Created Successfully</AlertDialogTitle>
            <AlertDialogDescription>
              Your reservation has been successfully created. <br />
              You will receive an email confirmation shortly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowAlertDialog(false);
                onClose();
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};