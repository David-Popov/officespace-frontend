import { AxiosResponse } from "axios";
import { api } from "../lib/axios";
import { API_CONFIG } from "../config/api.config";

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }

    return NotificationService.instance;
  }
  public async markNotificationAsRead(id: string): Promise<string> {
   try {
      if (id == undefined || id === "") {
        throw new Error("Notification Id can not be null");
      }
      
       console.log(API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_READ + id)
       
      const response: AxiosResponse<string> = await api.patch(
        API_CONFIG.ENDPOINTS.NOTIFICATIONS.MARK_AS_READ + id
      );

      if (response.status !== 200) {
        throw new Error(`Error updating notification - ${id} status to read.`);
      }

      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to mark notification as read');
    }
  }
}
