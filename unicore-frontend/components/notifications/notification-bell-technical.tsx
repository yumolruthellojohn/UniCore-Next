"use client"

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import axios from 'axios'
import { ip_address } from '@/app/ipconfig'
import { useRouter } from 'next/navigation'

interface Notification {
  notif_id: number
  notif_type: string
  notif_content: string
  notif_date: string
  notif_read: boolean
  notif_related_id: number
}

export function NotificationBellTechnical({ userId }: { userId: number }) {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://${ip_address}:8081/notifications/${userId}`)
      setNotifications(response.data)
      setUnreadCount(response.data.filter((n: Notification) => !n.notif_read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    }
  }

  const markAsRead = async () => {
    try {
      await axios.put(`http://${ip_address}:8081/notifications/mark-read/${userId}`)
      setUnreadCount(0)
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notifications as read:', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead();
    setIsOpen(false); // Close the dropdown after clicking
    
    // Navigate based on notification type
    switch (notification.notif_type) {
      case 'reserve_item_update':
        router.push(`/technical/requests/view-reserve-item?id=${notification.notif_related_id}`)
        break
      case 'reserve_facility_update':
        router.push(`/technical/requests/view-reserve-facility?id=${notification.notif_related_id}`)
        break
      case 'service_item_update':
        router.push(`/technical/requests/view-service-item?id=${notification.notif_related_id}`)
        break
      case 'service_facility_update':
        router.push(`/technical/requests/view-service-facility?id=${notification.notif_related_id}`)
        break
      case 'reserve_item_update_conflict':
        router.push(`/technical/requests/view-reserve-item-bench?id=${notification.notif_related_id}`)
        break
      case 'reserve_facility_update_conflict':
        router.push(`/technical/requests/view-reserve-facility-bench?id=${notification.notif_related_id}`)
        break
      case 'service_item_update_conflict':
        router.push(`/technical/requests/view-service-item-bench?id=${notification.notif_related_id}`)
        break
      case 'service_facility_update_conflict':
        router.push(`/technical/requests/view-service-facility-bench?id=${notification.notif_related_id}`)
        break
      case 'new_job_request':
        router.push(`/technical/requests/job-requests/view-for-approval?id=${notification.notif_related_id}`)
        break
      // Add more cases as needed
      default:
        console.log('No navigation defined for this notification type')
    }
  }

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 30000) // Poll every 30 seconds
    return () => clearInterval(interval)
  }, [userId])

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 z-50">
        <div className="max-h-96 overflow-auto flex flex-col gap-2 p-4">
          {notifications.length > 0 ? (
            notifications.map((notif) => (
              <div
                key={notif.notif_id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${
                  notif.notif_read ? 'bg-gray-50' : 'bg-blue-50'
                }`}
                onClick={() => {
                  if (!notif.notif_read) { // Only handle click if notification is unread
                    handleNotificationClick(notif);
                  }
                }}
              >
                <p className="text-sm">{notif.notif_content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notif.notif_date).toLocaleString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No notifications</p>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}