import React from "react";
import { Filter, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomType } from "@/types/offices.types";
import { RoomFiltersProps } from "@/types/filter-props.types";
import { DateTimeSelection } from "./DateTimeSelection";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { CapacityFilter } from "./CapacityFilter";

export const RoomFilters: React.FC<RoomFiltersProps> = ({
  filters,
  setFilters,
  isFilterOpen,
  setIsFilterOpen,
  onApply,
  onReset,
  availableFloors,
  selectedDate,
  setSelectedDate,
  timeSlots,
}) => (
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
        <div className="space-y-4">
          <h3 className="font-medium">Search</h3>
          <Input
            placeholder="Search by room name..."
            value={filters.searchText}
            onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
          />
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Floor</h3>
          <Select
            value={filters.floor}
            onValueChange={(value) => setFilters({ ...filters, floor: value })}
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

        <DateTimeSelection
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          filters={filters}
          setFilters={setFilters}
          timeSlots={timeSlots}
        />

        <div className="space-y-4">
          <h3 className="font-medium">Room Type</h3>
          <Select
            value={filters.type}
            onValueChange={(value: RoomType) => setFilters({ ...filters, type: value })}
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

        <PriceRangeFilter
          priceRange={filters.priceRange}
          onChange={(value) => setFilters({ ...filters, priceRange: value })}
        />

        <CapacityFilter
          capacity={filters.capacity}
          onChange={(value) => setFilters({ ...filters, capacity: value })}
        />
      </div>

      <SheetFooter>
        <div className="flex gap-4 w-full">
          <Button variant="outline" onClick={onReset} className="w-full">
            Reset
          </Button>
          <Button onClick={onApply} className="w-full">
            Apply Filters
          </Button>
        </div>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
