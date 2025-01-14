import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/UserContext";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Check, CalendarDays } from "lucide-react";
import { ReservationDto, ReservationStatus } from "@/types/reservation.type";

const CalendarPage: React.FC = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (user?.reservations) {
            setReservations(user.reservations);
        }
    }, [user]);

    const getReservationsForDate = (date: Date) => {
        return reservations.filter(
            (res: any) => new Date(res.startDateTime).toDateString() === date.toDateString()
        );
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const isGoogleUser = user?.email?.endsWith('@gmail.com'); // Check if user has a Gmail address

    return (
        <div className="container mx-auto py-6  max-w-6xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Section - Internal Calendar */}
                <div className="md:col-span-1">
                    <Card className="mb-6">
                        <CardContent>
                            <h1 className="flex items-center text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                                <CalendarDays className="text-green-500 mr-2" />
                                Reservations Calendar
                            </h1>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateChange}
                                initialFocus
                                disabled={(date) => {
                                    const today = new Date();
                                    const yesterday = new Date(today);
                                    yesterday.setDate(today.getDate() - 1);
                                    return date < yesterday || date.getDay() === 0 || date.getDay() === 6;
                                }}
                            />
                        </CardContent>
                    </Card>

                    {/* Reservations Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Reservations for {selectedDate?.toLocaleDateString() || "Selected Date"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {selectedDate ? (
                                    getReservationsForDate(selectedDate).length === 0 ? (
                                        <p className="text-center text-muted-foreground">
                                            No reservations found for this date
                                        </p>
                                    ) : (
                                        getReservationsForDate(selectedDate).map((reservation) => (
                                            <div
                                                key={reservation.office_room_uuid}
                                                className={`flex flex-col p-3 border rounded-lg ${
                                                    reservation.status === ReservationStatus.CANCELLED ? "bg-muted" : ""
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center space-x-2">
                                                            <Check className="h-5 w-5 text-blue-500" />
                                                            <p className="text-lg font-medium">{reservation.event?.meetingTitle}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(reservation.startDateTime).toLocaleTimeString()} -{" "}
                                                                {new Date(reservation.endDateTime).toLocaleTimeString()}
                                                            </p>
                                                        </div>
                                                        {reservation.event?.description && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {reservation.event.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <p className="text-center text-muted-foreground">Please select a date</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Section - Google Calendar */}
                <div className="md:col-span-2">
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Google Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isGoogleUser ? (
                                // Display Google Calendar iframe for Gmail users
                                <iframe
                                    src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Your_Timezone"
                                    style={{ border: 0 }}
                                    width="100%"
                                    height="600"
                                ></iframe>
                            ) : (
                                // Message for non-Gmail users
                                <p>This functionality is only available for users logged in with a Gmail account.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
