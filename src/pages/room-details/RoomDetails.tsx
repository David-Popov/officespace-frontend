import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Monitor,
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

interface RoomDetails {
  name: string;
  capacity: number;
  equipment: string[];
  hourlyRate: number;
  building: string;
  floor: string;
  features: string[];
}

const RoomDetailsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const room: RoomDetails = {
    name: "Executive Conference Room A",
    capacity: 12,
    equipment: ["Projector", "Video Conference System", "Whiteboard", "Smart TV"],
    hourlyRate: 50,
    building: "Main Building",
    floor: "3rd Floor",
    features: ["Windows", "Air Conditioning", "Coffee Machine"],
  };

  const availableSlots: string[] = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleDurationChange = (value: string) => {
    setDuration(value);
  };

  const handleContinueToBook = () => {
    setIsBookingDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{room.name}</h1>
            <p className="text-muted-foreground flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {room.building}, {room.floor}
            </p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            ${room.hourlyRate}/hour
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
                src="https://officebanao.com/wp-content/uploads/2024/03/modern-office-room-with-white-walls.jpg"
                alt="Room preview"
                className="w-full object-cover"
              />
            </div>

            <Tabs defaultValue="features" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="features">Features</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
                <TabsTrigger value="policies">Policies</TabsTrigger>
              </TabsList>
              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span>Capacity: {room.capacity} people</span>
                  </div>
                  {room.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="equipment" className="space-y-4">
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {room.equipment.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-muted-foreground" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="policies">
                <div className="prose mt-4">
                  <ul className="list-disc pl-4">
                    <li>Minimum booking duration: 1 hour</li>
                    <li>Cancellation allowed up to 24 hours before</li>
                    <li>Please leave the room clean and tidy</li>
                  </ul>
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
                    onSelect={handleDateSelect}
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
                {availableSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleTimeSelect(time)}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={duration} onValueChange={handleDurationChange}>
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
              disabled={!selectedDate || !selectedTime}
              onClick={handleContinueToBook}
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
        roomName={room.name}
      />
    </div>
  );
};

export default RoomDetailsPage;
