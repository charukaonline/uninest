import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Select, notification, TimePicker } from "antd";
import { RiCalendarScheduleFill } from "react-icons/ri";
import { useAuthStore } from "@/store/authStore";
import dayjs from "dayjs";
import axios from "axios";

const { Option } = Select;

export function ScheduleDialog({
  propertyId,
  landlordId,
  propertyName,
  trigger,
  className,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuthStore();

  const handleOpenChange = (open) => {
    if (!isAuthenticated) {
      notification.info({
        message: "Authentication Required",
        description: "Please sign in to schedule a visit.",
      });
      return;
    }
    setIsOpen(open);
  };

  const handleSubmit = async () => {
    if (!date) {
      notification.warning({ message: "Please select a date" });
      return;
    }

    if (!time) {
      notification.warning({ message: "Please select a time" });
      return;
    }

    setIsSubmitting(true);

    try {
      // Format date and time
      const dateTime =
        dayjs(date).format("YYYY-MM-DD") + " " + dayjs(time).format("HH:mm:ss");

      // This is a placeholder - implement the actual endpoint in your backend
      await axios.post("/api/schedule-visit", {
        propertyId,
        landlordId,
        userId: user._id,
        dateTime,
        note,
      });

      notification.success({
        message: "Visit Scheduled",
        description: `Your visit for ${propertyName} has been scheduled successfully.`,
      });

      setIsOpen(false);
      setDate(null);
      setTime(null);
      setNote("");
    } catch (error) {
      notification.error({
        message: "Failed to schedule visit",
        description: error.response?.data?.message || "An error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDate = (current) => {
    // Can't select days before today
    return current && current < dayjs().startOf("day");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button
            className={`flex items-center justify-center gap-2 ${className}`}
          >
            <RiCalendarScheduleFill />
            Schedule a Visit
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule a Visit to {propertyName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Date
            </label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
              disabled={disabledDate}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Select Time
            </label>
            <TimePicker
              use12Hours
              format="h:mm a"
              className="w-full"
              onChange={setTime}
              value={time}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Notes
            </label>
            <Input.TextArea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requirements or questions?"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primaryBgColor hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Scheduling..." : "Schedule Visit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ScheduleDialog;
