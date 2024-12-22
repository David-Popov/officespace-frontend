import React, { useState, useEffect} from "react";
import { useAuth } from "@/contexts/UserContext";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "@/types/jwt.types";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Building,
  DollarSign,
  MapPin,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { EventBookingDialog } from "../../components/events/EventBookingDialog";
import { useParams } from "react-router-dom";
import { emptyOfficeObject, OfficeRoom, RoomStatus, RoomType } from "@/types/offices.types";
import { OfficeService } from "@/services/officeService";
import { ReservationStatus, CreateReservation } from "@/types/reservation.type";
import { cookieService } from "@/lib/cookie";
import { API_CONFIG } from "@/config/api.config";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<OfficeRoom>(emptyOfficeObject);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const service = OfficeService.getInstance();
  const availableSlots: string[] = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const token = cookieService.get(API_CONFIG.AUTH_COOKIE_NAME);
  console.log("Token:", token);
  
const getUserIdFromToken = (token: string): string=> {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log("Decoded JWT:", decoded);
    console.log("Decoded ID:", decoded.id);
    return decoded.id;
  } catch (error) {
    console.error("Error decoding token:", error);
    throw new Error("Failed to decode token");
  }
};

  const userId = token ? getUserIdFromToken(token) : "";

  useEffect(() => {
    if (id == undefined) {
      return;
    }

    service
      .getOfficeById(id)
      .then((data) => {
        setRoom(data);
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const getAvailableTimeSlots = (date: Date | undefined, reservations: CreateReservation[]): string[] => {
    const allSlots = [
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
    ];

    if (!date || !reservations.length) {
      return allSlots;
    }

    return allSlots.filter((slot) => {
      const [hours, minutes] = slot.split(":").map(Number);
      const slotTime = new Date(date);
      slotTime.setHours(hours, minutes, 0, 0);

      return !reservations.some((reservation) => {
        const startTime = new Date(reservation.start_date_time);
        const endTime = new Date(reservation.end_date_time);

        if (
          startTime.getDate() === date.getDate() &&
          startTime.getMonth() === date.getMonth() &&
          startTime.getFullYear() === date.getFullYear()
        ) {
          return slotTime >= startTime && slotTime < endTime;
        }
        return false;
      });
    });
  };

  const isSlotAvailableForDuration = (
    date: Date,
    startTime: string,
    durationHours: number
  ): boolean => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const slotStart = new Date(date);
    slotStart.setHours(hours, minutes, 0, 0);

    const slotEnd = new Date(slotStart);
    slotEnd.setHours(slotStart.getHours() + durationHours);

    return !room.reservations.some((reservation) => {
      const reservationStart = new Date(reservation.start_date_time);
      const reservationEnd = new Date(reservation.end_date_time);

      if (
        reservationStart.getDate() === date.getDate() &&
        reservationStart.getMonth() === date.getMonth() &&
        reservationStart.getFullYear() === date.getFullYear()
      ) {
        return slotStart < reservationEnd && slotEnd > reservationStart;
      }
      return false;
    });
  };

  const handleDurationChange = (newDuration: string) => {
    setDuration(newDuration);
    if (
      selectedTime &&
      !isSlotAvailableForDuration(selectedDate!, selectedTime, parseInt(newDuration))
    ) {
      setSelectedTime("");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{room.office_room_name}</h1>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {room.building}, Floor {room.floor}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            ${room.price_per_hour}/hour
          </Badge>
        </div>
        <Separator />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg overflow-hidden">
              <img
                src={room.picture_url!}
                alt={room.office_room_name}
                className="w-full h-64 object-cover"
              />
            </div>

            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="company">Company Info</TabsTrigger>
                <TabsTrigger value="reservations">Current Reservations</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
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
                    <span>Price: ${room.price_per_hour}/hour</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="default"
                      className={cn(
                        room.status === RoomStatus.AVAILABLE &&
                          "bg-green-100 text-green-800 hover:bg-green-100",
                        room.status === RoomStatus.OCCUPIED &&
                          "bg-red-100 text-red-800 hover:bg-red-100",
                        room.status === RoomStatus.PENDING &&
                          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      )}
                    >
                      {room.status}
                    </Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">{room.company.name}</h3>
                  <p className="text-muted-foreground">{room.company.address}</p>
                  <p className="text-muted-foreground">Type: {room.company.type}</p>
                </div>
              </TabsContent>

              <TabsContent value="reservations" className="space-y-4">
                <div className="mt-4 space-y-4">
                  {room.reservations.map((reservation, index) => (
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Make a Reservation</CardTitle>
            <CardDescription>Select your preferred date and time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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
                    onSelect={setSelectedDate}
                    initialFocus
                    disabled={(date) =>
                      date < new Date() || date.getDay() === 0 || date.getDay() === 6
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Select Time Slot</Label>
              <div className="grid grid-cols-2 gap-2">
                {selectedDate ? (
                  getAvailableTimeSlots(selectedDate, room.reservations).map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      className={cn(
                        "w-full",
                        !selectedDate ||
                          (duration &&
                            parseInt(duration) > 1 &&
                            !isSlotAvailableForDuration(selectedDate, time, parseInt(duration)))
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      )}
                      onClick={() => setSelectedTime(time)}
                      disabled={Boolean(
                        !selectedDate ||
                          (duration &&
                            parseInt(duration) > 1 &&
                            !isSlotAvailableForDuration(selectedDate, time, parseInt(duration)))
                      )}
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      {time}
                    </Button>
                  ))
                ) : (
                  <p className="col-span-2 text-center text-muted-foreground">
                    Please select a date first
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
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
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={!selectedDate || !selectedTime || room.status !== RoomStatus.AVAILABLE}
              onClick={() => setIsBookingDialogOpen(true)}
            >
              Continue to Book
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      <EventBookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        duration={duration}
        roomName={room.office_room_name}
        roomId={room.id}
        userId={userId}
      />
    </div>
  );
};

export default RoomDetailsPage;
