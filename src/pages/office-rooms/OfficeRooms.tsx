import React, { useEffect, useState } from "react"; 
import { Calendar as CalendarIcon, Filter, Users, Wifi, Coffee, ParkingCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { OfficeService } from "@/services/officeService";
import { OfficeRoom, RoomType, RoomStatus } from "@/types/offices.types";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Slider } from "@/components/ui/slider";

const RoomListing: React.FC = () => {
  const service = OfficeService.getInstance();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [rooms, setRooms] = useState<OfficeRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<OfficeRoom[]>([]);
  const [filters, setFilters] = useState({
    dateRange: { 
      from: undefined as Date | undefined, 
      to: undefined as Date | undefined,
    },
    searchText: "",
    floor: "",
    priceRange: [0, 1000],
    capacity: 1,
    type: "" as RoomType | "",
    date: undefined as Date | undefined,
    startTime: "09:00",
    endTime: "10:00",
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    service
      .getOffices()
      .then((data) => {
        setRooms(data);
        setFilteredRooms(data);
      })
      .catch((error) => {
        console.error("Error loading rooms:", error);
      });
  };

  const handleViewDetails = (roomId: string) => {
    navigate(`/room-details/${roomId}`);
  };

  const handleFilterApply = async () => {
    setIsFilterOpen(false);

    try {
        const filterRoomsRequest = {
            name: filters.searchText,
            building: "",
            floor: filters.floor,
            type: filters.type,
            capacity: filters.capacity,
            minPrice: filters.priceRange[0], 
            maxPrice: filters.priceRange[1],  
        };

        console.log("Filtered Rooms Request:", filterRoomsRequest);
        const filteredRoomsResponse = await service.filterRooms(filterRoomsRequest);

        const formatToLocalDateTime = (date: Date | undefined, time: string): string | undefined => {
            if (!date || !time) {
                console.error("Date or time is undefined", { date, time });
                return undefined;
            }
            const formattedDate = date.toISOString().split("T")[0]; 
            const formattedDateTime = `${formattedDate}T${time}:00`;
            console.log("Formatted DateTime:", formattedDateTime);
            return formattedDateTime;
        };

        const startDateTime = filters.dateRange.from 
            ? formatToLocalDateTime(filters.dateRange.from, filters.startTime)
            : formatToLocalDateTime(new Date(), filters.startTime);

        const endDateTime = filters.dateRange.to 
            ? formatToLocalDateTime(filters.dateRange.to, filters.endTime)
            : formatToLocalDateTime(new Date(), filters.endTime);

        console.log("Start DateTime:", startDateTime);
        console.log("End DateTime:", endDateTime);

        const queryParams = new URLSearchParams();
        if (startDateTime) queryParams.append("startDateTime", startDateTime);
        if (endDateTime) queryParams.append("endDateTime", endDateTime);

        console.log("Query Params:", queryParams.toString());

        const availableRoomsResponse = await service.findAvailableRooms({
            startDateTime,
            endDateTime,
        });

        setFilteredRooms(filteredRoomsResponse); 

    } catch (error) {
        console.error("Error applying filters:", error);
        setFilteredRooms([]);
    }
};

  const handleResetFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      searchText: "",
      floor: "",
      priceRange: [0, 1000],
      capacity: 1,
      type: "",
      date: undefined, // Reset date
      startTime: "09:00",
      endTime: "10:00",
    });
    setFilteredRooms(rooms);
  };

  const availableFloors = Array.from(new Set(rooms.map((room) => room.floor))).sort();

  const allSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
  ];


  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Rooms</h1>

        <div className="flex flex-wrap gap-4 mb-6">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[300px] sm:w-[540px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Rooms</SheetTitle>
                <SheetDescription>Adjust filters to find your perfect room</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-8">
                {/* Search by name */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Search</h3>
                    <Input
                      placeholder="Search by room name..."
                      value={filters.searchText}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, searchText: e.target.value }))
                    }
                    />
                  </div>

                  {/* Floor Selection */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Floor</h3>
                    <Select
                      value={filters.floor}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, floor: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a floor" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableFloors.map((floor) => (
                          <SelectItem key={floor} value={floor}>
                            Floor {floor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Selection */}
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

                   {/* Time Selection */}
                   <div className="space-y-4">
                    <h3 className="font-medium">Start Time</h3>
                    <Select
                      value={filters.startTime}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, startTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select start time" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <h3 className="font-medium">End Time</h3>
                    <Select
                      value={filters.endTime}
                      onValueChange={(value) => setFilters((prev) => ({ ...prev, endTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select end time" />
                      </SelectTrigger>
                      <SelectContent>
                        {allSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            {slot}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                  <h3 className="font-medium">Room Type</h3>
                    <Select
                    value={filters.type}
                    onValueChange={(value: RoomType) =>
                      setFilters((prev) => ({ ...prev, type: value }))
                    }
                    >
                      <SelectTrigger>
                      <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                      {Object.values(RoomType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                {/* Price Range Filter */}
                  <div className="space-y-4">
                  <h3 className="font-medium">Price Range (per hour)</h3>
                  <div className="px-4">
                    <Slider
                      defaultValue={filters.priceRange}
                      max={1000}
                      step={50}
                      value={filters.priceRange}
                      onValueChange={(value: number[]) =>
                        setFilters((prev) => ({ ...prev, priceRange: value }))
                      }
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                  </div>

                {/* Capacity Filter */}
                  <div className="space-y-4">
                  <h3 className="font-medium">Minimum Capacity</h3>
                  <div className="flex gap-2 items-center">
                    <Users className="h-4 w-4" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          capacity: Math.max(1, prev.capacity - 1),
                        }))
                      }
                    >
                      -
                    </Button>
                    <span className="px-4 py-2">{filters.capacity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          capacity: prev.capacity + 1,
                        }))
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <SheetFooter>
                <div className="flex gap-4 w-full">
                  <Button variant="outline" onClick={handleResetFilters} className="w-full">
                    Reset
                  </Button>
                  <Button onClick={handleFilterApply} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={room.picture_url || "/api/placeholder/600/400"}
                alt={room.office_room_name}
                className="w-full h-48 object-cover"
              />
              <CardHeader>
                <CardTitle>{room.office_room_name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  {room.address || "No address provided"}
                </p>
                <p className="text-sm text-muted-foreground mb-2">Floor: {room.floor}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {room.type.replace("_", " ")} - {room.company.name}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">${room.price_per_hour}</p>
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
                <Button className="w-full" onClick={() => handleViewDetails(room.id)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No rooms match your filters.</p>
            <Button variant="outline" onClick={handleResetFilters} className="mt-4">
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomListing;
