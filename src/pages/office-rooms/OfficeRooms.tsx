import React, { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Filter, Users, Wifi, Coffee, ParkingCircle } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
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
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  imageUrl: string;
  amenities: string[];
  city: string;
  from: Date | undefined;
  to: Date | undefined;
}

const RoomListing: React.FC = () => {
  const initialRooms: Room[] = [
    {
      id: "1",
      name: "Deluxe Ocean View",
      description: "Spacious room with breathtaking ocean views and modern amenities",
      price: 299,
      capacity: 2,
      imageUrl: "https://picsum.photos/seed/picsum/600/400",
      amenities: ["wifi", "parking", "coffee"],
      city: "Miami",
      from: new Date("2024-01-01"),
      to: new Date("2025-01-01"),
    },
    {
      id: "2",
      name: "Mountain Suite",
      description: "Luxurious suite with panoramic mountain views",
      price: 399,
      capacity: 4,
      imageUrl: "https://picsum.photos/seed/picsum/600/400",
      amenities: ["wifi", "parking"],
      city: "Los Angeles",
      from: new Date("2023-01-01"),
      to: new Date("2023-05-01"),
    },
    {
      id: "3",
      name: "Garden Villa",
      description: "Private villa surrounded by lush tropical gardens",
      price: 599,
      capacity: 6,
      imageUrl: "https://picsum.photos/seed/picsum/600/400",
      amenities: ["wifi", "parking", "coffee"],
      city: "San Francisco",
      from: new Date("2026-01-01"),
      to: new Date("2027-01-01"),
    },
  ];

  const amenitiesOptions = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: ParkingCircle },
    { id: "coffee", label: "Coffee Maker", icon: Coffee },
  ];

  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const cities = ["New York", "Los Angeles", "Chicago", "Miami", "San Francisco"];
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(initialRooms);
  const [filters, setFilters] = useState({
    dateRange: {
      from: undefined as Date | undefined,
      to: undefined as Date | undefined,
    },
    searchText: "",
    city: "",
    priceRange: [0, 1000],
    capacity: 1,
    amenities: [] as string[],
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const navigate = useNavigate();

  // Sample room data

  const handleViewDetails = (roomId: string) => {
    console.log(roomId);
    // navigate(`/rooms/${roomId}`);
  };

  const handleFilterApply = () => {
    setIsFilterOpen(false);

    var applyFilteredRooms = initialRooms.filter((room) => {
      const isMatchingName = filters.searchText
        ? room.name.toLowerCase().includes(filters.searchText.toLowerCase())
        : true;
      const isMatchingCity = filters.city
        ? room.city.toLowerCase().includes(filters.city.toLowerCase())
        : true;
      const isMatchingAmenities =
        filters.amenities.length > 0
          ? room.amenities.every((amentity) => room.amenities.includes(amentity))
          : true;
      // const matchesDates =
      //   !filters.dateRange.from || !filters.dateRange.to
      //     ? true
      //     : isRoomAvailable(room, filters.dateRange.from, filters.dateRange.to); //TODO FINISH IT LATER WHEN HAVE BACKEND DATA

      return isMatchingAmenities && isMatchingName && isMatchingCity;
    });
    console.log("Applying filters:", filters);
    setFilteredRooms(applyFilteredRooms);
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      dateRange: { from: undefined, to: undefined },
      searchText: "",
      city: "",
      priceRange: [0, 1000],
      capacity: 1,
      amenities: [],
    });
    setFilteredRooms(rooms);
  };

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
                {/* Dates */}
                <div className="space-y-4">
                  <h3 className="font-medium">Dates</h3>
                  <div className="flex flex-col gap-4">
                    <div className="space-y-2">
                      <Label>Check-in</Label>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.from}
                        onSelect={(date) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, from: date },
                          }))
                        }
                        disabled={(date) =>
                          date < new Date() ||
                          (filters.dateRange.to ? date > filters.dateRange.to : false)
                        }
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Check-out</Label>
                      <Calendar
                        mode="single"
                        selected={filters.dateRange.to}
                        onSelect={(date) =>
                          setFilters((prev) => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, to: date },
                          }))
                        }
                        disabled={(date) =>
                          date < new Date() ||
                          (filters.dateRange.from ? date < filters.dateRange.from : false)
                        }
                        className="rounded-md border"
                      />
                    </div>
                  </div>
                </div>

                {/* Search by name */}
                <div className="space-y-4">
                  <h3 className="font-medium">Search</h3>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search by room name..."
                      value={filters.searchText}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          searchText: e.target.value,
                        }))
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                {/* City Selection */}
                <div className="space-y-4">
                  <h3 className="font-medium">City</h3>
                  <Select
                    value={filters.city}
                    onValueChange={(value: any) =>
                      setFilters((prev) => ({
                        ...prev,
                        city: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a city" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-4">
                  <h3 className="font-medium">Price Range</h3>
                  <div className="px-4">
                    <Slider
                      defaultValue={filters.priceRange}
                      max={1000}
                      step={50}
                      value={filters.priceRange}
                      onValueChange={(value: any) =>
                        setFilters((prev) => ({ ...prev, priceRange: value as number[] }))
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
                  <h3 className="font-medium">Capacity</h3>
                  <div className="flex gap-2">
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

                {/* Amenities Filter */}
                <div className="space-y-4">
                  <h3 className="font-medium">Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {amenitiesOptions.map((amenity) => {
                      const Icon = amenity.icon;
                      return (
                        <div key={amenity.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity.id}
                            checked={filters.amenities.includes(amenity.id)}
                            onCheckedChange={() => handleAmenityToggle(amenity.id)}
                          />
                          <label
                            htmlFor={amenity.id}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {amenity.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <SheetFooter>
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setFilters({
                        dateRange: { from: undefined, to: undefined },
                        searchText: "",
                        city: "",
                        priceRange: [0, 1000],
                        capacity: 1,
                        amenities: [],
                      })
                    }
                    className="w-full"
                  >
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
              <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle>{room.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">{room.description}</p>
                <p className="text-sm text-muted-foreground mb-4">{room.city}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold">${room.price}</p>
                    <p className="text-sm text-muted-foreground">per night</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">Up to {room.capacity}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {room.amenities.map((amenityId) => {
                    const amenity = amenitiesOptions.find((a) => a.id === amenityId);
                    if (amenity) {
                      const Icon = amenity.icon;
                      return <Icon key={amenityId} className="h-4 w-4 text-muted-foreground" />;
                    }
                    return null;
                  })}
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
