import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { OfficeService } from "@/services/officeService";
import { OfficeRoom, RoomType } from "@/types/offices.types";
import { useNavigate } from "react-router-dom";
import { RoomCard } from "@/components/rooms/office-rooms/RoomCard";
import { RoomFilters } from "@/components/rooms/office-rooms/RoomFilters";

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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Available Rooms</h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <RoomFilters
            filters={filters}
            setFilters={setFilters}
            isFilterOpen={isFilterOpen}
            setIsFilterOpen={setIsFilterOpen}
            onApply={handleFilterApply}
            onReset={handleResetFilters}
            availableFloors={availableFloors}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            timeSlots={allSlots}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} onViewDetails={handleViewDetails} />
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
