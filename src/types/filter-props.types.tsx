import { OfficeRoom, RoomType } from "./offices.types";

//Rooms List
export interface RoomFiltersProps {
  filters: FiltersState;
  setFilters: (filters: FiltersState) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (isOpen: boolean) => void;
  onApply: () => void;
  onReset: () => void;
  availableFloors: string[];
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  timeSlots: string[];
}

export interface FiltersState {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  searchText: string;
  floor: string;
  priceRange: number[];
  capacity: number;
  type: RoomType | "";
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

export interface TimeSelectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  timeSlots: string[];
}

export interface CapacityFilterProps {
  capacity: number;
  onChange: (value: number) => void;
}

export interface TimeSelectionProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  timeSlots: string[];
}

export interface DateTimeSelectionProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  filters: FiltersState;
  setFilters: (filters: FiltersState) => void;
  timeSlots: string[];
}

export interface PriceRangeFilterProps {
  priceRange: number[];
  onChange: (value: number[]) => void;
}

export interface RoomCardProps {
  room: OfficeRoom;
  onViewDetails: (roomId: string) => void;
}

//Room Details Props
export interface RoomHeaderProps {
  room: OfficeRoom;
  isAuthenticated?: boolean;
  onReportIssue: () => void;
}

export interface RoomDetailsProps {
  room: OfficeRoom;
}

export interface ReservationFormProps {
  selectedDate: Date | undefined;
  selectedTime: string;
  duration: string;
  availableTimeSlots: string[];
  onDateSelect: (date: Date | undefined) => void;
  onTimeSelect: (time: string) => void;
  onDurationChange: (duration: string) => void;
  onContinue: () => void;
  isSlotAvailable: (time: string) => boolean;
  roomStatus: string;
}

export interface CompanyInfoProps {
  company: {
    name: string;
    address: string;
    type: string;
  };
}
