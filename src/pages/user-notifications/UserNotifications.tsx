import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/contexts/UserContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { UserNotificationDto } from "@/types/users.types";
import { NotificationService } from "@/services/notificationService";

const UserNotifications = () => {
  const { user, reloadUser } = useAuth();
  const notificationService = NotificationService.getInstance();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  console.log("User at notification page: ", user);

  const handleMarkAsRead = async (notificationId: string) => {
    if (!user?.email) return;

    setIsLoading(notificationId);

    try {
      await notificationService.markNotificationAsRead(notificationId);
      await reloadUser(user.email);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setIsLoading(null);
    }
  };

  const formatNotificationDate = (dateString: Date) => {
    return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "TICKET_STATUS_CHANGED":
        return <Check className="h-4 w-4 text-green-500" />;
      case "TICKET_CREATED":
        return <Bell className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  if (!user?.notifications || user.notifications.length === 0) {
    return (
      <div className="container max-w-2xl py-10">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">No notifications to display</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container w-full m-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {user.notifications.map((notification: UserNotificationDto) => (
            <div
              key={notification.id}
              className={`flex items-start justify-between p-4 rounded-lg border ${
                notification.read ? "bg-muted" : "bg-card"
              }`}
            >
              <div className="flex gap-3">
                <div className="mt-1">{getNotificationIcon(notification.notificationType)}</div>
                <div className="space-y-1">
                  <p className="text-sm">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatNotificationDate(notification.notificationDate)}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleMarkAsRead(notification.id)}
                  disabled={isLoading === notification.id}
                >
                  {isLoading === notification.id ? "Marking..." : "Mark as Read"}
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserNotifications;
