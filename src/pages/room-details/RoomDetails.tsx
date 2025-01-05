import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventBookingDialog } from "../../components/events/EventBookingDialog";
import { IssueReportDialog } from "../../components/ticket/IssueReportDialog";
import { useNavigate, useParams } from "react-router-dom";
import { emptyOfficeObject, OfficeRoom, RoomStatus } from "@/types/offices.types";
import { OfficeService } from "@/services/officeService";
import {
  ReservationStatus,
  ReservationDto,
  emptyReservation,
  Event,
  CreateReservationRequest,
} from "@/types/reservation.type";
import { ReservationService } from "@/services/reservationService";
import { PaymentService } from "@/services/paymentService";
import { error } from "console";
import { ConfirmPaymentRequest, PaymentSessionRequest } from "@/types/payment.types";
import { ReservationForm } from "@/components/rooms/office-rooms-details/ReservationForm";
import { ReservationList } from "@/components/rooms/office-rooms-details/ReservationList";
import { CompanyInfo } from "@/components/rooms/office-rooms-details/CompanyInfo";
import { RoomDetails } from "@/components/rooms/office-rooms-details/RoomDetails";
import { RoomHeader } from "@/components/rooms/office-rooms-details/RoomHeader";

const RoomDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<OfficeRoom>(emptyOfficeObject);
  const [reservation, setReservation] = useState<CreateReservationRequest>(emptyReservation);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isIssueReportDialogOpen, setIsIssueReportDialogOpen] = useState(false);
  const service = OfficeService.getInstance();
  const { user, isAuthenticated } = useAuth();
  const reservationService = ReservationService.getInstance();
  const paymentService = PaymentService.getInstance();
  const navigate = useNavigate();

  const loadOfficeData = () => {
    if (id === undefined) {
      return;
    }

    service
      .getOfficeById(id)
      .then((data) => {
        setRoom(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    loadOfficeData();
  }, []);

  const getAvailableTimeSlots = (
    date: Date | undefined,
    reservations: ReservationDto[]
  ): string[] => {
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

  const updateReservationDateTime = (date: Date | undefined, time: string, duration: string) => {
    if (!date || !time) return;

    const [hours, minutes] = time.split(":").map(Number);
    const startDateTime = new Date(date);
    startDateTime.setHours(hours, minutes, 0, 0);

    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(startDateTime.getHours() + parseInt(duration));

    setReservation((prev) => ({
      ...prev,
      start_date_time: startDateTime.toISOString(),
      end_date_time: endDateTime.toISOString(),
      durationAsHours: parseInt(duration),
      office_room_uuid: id || "",
      status: "PENDING" as ReservationStatus,
    }));
  };

  useEffect(() => {
    updateReservationDateTime(selectedDate, selectedTime, duration);
  }, [selectedDate, selectedTime, duration]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
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

  const handleEventFormSubmit = (eventData: Event) => {
    console.log("User on reservation create: ", user);
    setReservation((prev) => ({
      ...prev,
      event: {
        meetingTitle: eventData.meetingTitle,
        description: eventData.description,
        attendees: eventData.attendees,
        contactEmail: eventData.contactEmail,
        department: eventData.department,
        id: eventData.id,
        reservationId: eventData.reservationId,
      },
      reservation_title: eventData.meetingTitle,
      participant_uuids: /*eventData.attendees ||*/ [],
      user_uuid: user ? user.Id : "",
    }));
  };

  const handlePayment = async (paymentRequest: PaymentSessionRequest) => {
    try {
      const paymentRequestWithQuantity = {
        ...paymentRequest,
        quantity: parseInt(duration),
      };
      const session = await paymentService.createSession(paymentRequestWithQuantity);
      localStorage.setItem("stripeSessionId", session.sessionId);
      window.location.replace(session.stripePaymentUrl);
    } catch (error) {
      console.error("Payment initialization failed:", error);
    }
  };

  const handlePaymentSuccess = async (amount: number, currency: string, description: string) => {
    const sessionId = localStorage.getItem("stripeSessionId");
    if (!sessionId) return;

    try {
      const confirmRequest: ConfirmPaymentRequest = {
        sessionId,
        amount,
        currency,
        description,
        quantity: parseInt(duration),
      };

      await paymentService.confirmPayment(confirmRequest);
      localStorage.removeItem("stripeSessionId");
    } catch (error) {
      console.error("Payment confirmation failed:", error);
    }
  };

  useEffect(() => {
    console.log(reservation);
    if (
      reservation.event &&
      reservation.start_date_time &&
      reservation.end_date_time &&
      reservation.user_uuid
    ) {
      let currency = "usd";
      let description = `Event Title: ${reservation.event.meetingTitle} - Room: ${room.officeRoomName} - Duration: ${reservation.durationAsHours} Hours`;
      console.log("Room Price for hour: ", room.pricePerHour);
      console.log("Room: ", room);
      const paymentSessionRequest: PaymentSessionRequest = {
        amount: room.pricePerHour,
        currency: currency,
        description: description,
        quantity: reservation.durationAsHours,
        userId: user?.Id!,
      };

      handlePayment(paymentSessionRequest);
      handlePaymentSuccess(room.pricePerHour, currency, description);

      reservationService
        .makeReservation(reservation)
        .then(() => {
          loadOfficeData();
        })
        .catch((error) => {
          console.log("Error: " + JSON.stringify(error));
        });
    }
  }, [reservation]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <RoomHeader
        room={room}
        isAuthenticated={isAuthenticated}
        onReportIssue={() => setIsIssueReportDialogOpen(true)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg overflow-hidden">
              <img
                src={room.pictureUrl!}
                alt={room.officeRoomName}
                className="w-full h-64 object-cover"
              />
            </div>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="company">Company Info</TabsTrigger>
                <TabsTrigger value="reservations">Current Reservations</TabsTrigger>
              </TabsList>
              <TabsContent value="details">
                <RoomDetails room={room} />
              </TabsContent>
              <TabsContent value="company">
                <CompanyInfo company={room.company} />
              </TabsContent>
              <TabsContent value="reservations">
                <ReservationList reservations={room.reservations} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {isAuthenticated && (
          <Card>
            <CardHeader>
              <CardTitle>Make a Reservation</CardTitle>
              <CardDescription>Select your preferred date and time</CardDescription>
            </CardHeader>
            <CardContent>
              <ReservationForm
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                duration={duration}
                availableTimeSlots={getAvailableTimeSlots(selectedDate, room.reservations)}
                onDateSelect={handleDateSelect}
                onTimeSelect={handleTimeSelect}
                onDurationChange={handleDurationChange}
                onContinue={() => setIsBookingDialogOpen(true)}
                isSlotAvailable={(time) =>
                  isSlotAvailableForDuration(selectedDate!, time, parseInt(duration))
                }
                roomStatus={room.status}
              />
            </CardContent>
          </Card>
        )}
      </div>
      <EventBookingDialog
        isOpen={isBookingDialogOpen}
        onClose={() => setIsBookingDialogOpen(false)}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        duration={duration}
        roomName={room.officeRoomName}
        onSubmit={handleEventFormSubmit}
      />
      <IssueReportDialog
        isOpen={isIssueReportDialogOpen}
        onClose={() => setIsIssueReportDialogOpen(false)}
        roomId={id || ""}
        userId={user?.Id || ""}
      />
    </div>
  );
};

export default RoomDetailsPage;
