import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Calendar, Clock, Users } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Event } from "@/types/reservation.type";
import { format } from "date-fns";
import { Button } from "../ui/button";

interface EventBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date | undefined;
  selectedTime: string;
  duration: string;
  roomName: string;
  onSubmit: (eventData: Event) => void;
}

interface BookingFormData {
  title: string;
  description: string;
  attendees: string;
  email: string;
  department: string;
}

export const EventBookingDialog: React.FC<EventBookingDialogProps> = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTime,
  duration,
  roomName,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    title: "",
    description: "",
    attendees: "",
    email: "",
    department: "",
  });

  const [showAlertDialog, setShowAlertDialog] = useState(false);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const eventData: Event = {
      meetingTitle: formData.title,
      description: formData.description,
      attendees: formData.attendees
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email !== ""),
      contactEmail: formData.email,
      department: formData.department,
    };

    onSubmit(eventData);

    setFormData({
      title: "",
      description: "",
      attendees: "",
      email: "",
      department: "",
    });

    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "No date selected";
    return format(new Date(date), "PPP");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {roomName}</DialogTitle>
            <DialogDescription>Fill in the details for your meeting reservation</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(selectedDate)}</span>
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
              <Button variant="outline" onClick={onClose} type="button">
                Cancel
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
