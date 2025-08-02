import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  read: boolean;
  createdAt?: string;
}

interface NotificationsProps {
  notifications: Notification[];
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications: initialNotifications,
}) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Sort notifications: unread first, then by date (newest first)
  const sortedNotifications = [...notifications].sort((a, b) => {
    // First sort by read status (unread first)
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;

    // Then sort by date (newest first)
    if (a.createdAt && b.createdAt) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  // Separate unread and read notifications
  const unreadNotifications = sortedNotifications.filter((n) => !n.read);
  const readNotifications = sortedNotifications.filter((n) => n.read);

  // Determine which notifications to show
  const notificationsToShow = showAll
    ? sortedNotifications
    : sortedNotifications.slice(0, 3);

  const hasMoreNotifications = sortedNotifications.length > 3;

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const response = await fetch("/api/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: notificationId }),
      });

      if (response.ok) {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification._id === notificationId
              ? { ...notification, read: true }
              : notification
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-500" />
            <CardTitle className="text-lg">Notifications</CardTitle>
            {unreadNotifications.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadNotifications.length}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-8 px-3"
          >
            {expanded ? (
              <>
                <EyeOff className="h-4 w-4 mr-1" />
                Hide
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-1" />
                Show
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="pt-0">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400">
                You&apos;ll see updates here when they arrive
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Unread Notifications Section */}
              {unreadNotifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Unread ({unreadNotifications.length})
                  </h4>
                  <div className="space-y-2">
                    {unreadNotifications.map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                      >
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification._id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-200"
                        >
                          Mark as Read
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Read Notifications Section */}
              {readNotifications.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    Read ({readNotifications.length})
                  </h4>
                  <div className="space-y-2">
                    {(showAll
                      ? readNotifications
                      : readNotifications.slice(0, 2)
                    ).map((notification) => (
                      <div
                        key={notification._id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100"
                      >
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(notification.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show More/Less Button */}
              {hasMoreNotifications && (
                <div className="pt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAll(!showAll)}
                    className="w-full text-gray-600 hover:text-gray-800"
                  >
                    {showAll ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show More ({sortedNotifications.length - 3} more)
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default Notifications;
