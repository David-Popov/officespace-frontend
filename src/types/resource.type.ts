export enum ResourceStatus {
    AVAILABLE = "AVAILABLE",
    UNAVAILABLE = "UNAVAILABLE"
  }
  
  export enum ResourceType {
    CONFERENCE_EQUIPMENT = "CONFERENCE_EQUIPMENT",
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES",
  }
  
  export interface ResourceDto {
    id: string;
    name: string;
    type: ResourceType;
    quantity: number;
    description: string;
    status: ResourceStatus;
    maintenanceNotes?: string;
    lastMaintenanceDate?: string;
  }
  