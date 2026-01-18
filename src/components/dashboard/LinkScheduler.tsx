import { useState } from "react";
import { format } from "date-fns";
import { Calendar, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface LinkSchedulerProps {
  scheduledStart: string | null;
  scheduledEnd: string | null;
  onUpdate: (start: string | null, end: string | null) => void;
}

export function LinkScheduler({ scheduledStart, scheduledEnd, onUpdate }: LinkSchedulerProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    scheduledStart ? new Date(scheduledStart) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    scheduledEnd ? new Date(scheduledEnd) : undefined
  );
  const [showScheduler, setShowScheduler] = useState(!!scheduledStart || !!scheduledEnd);

  const handleStartChange = (date: Date | undefined) => {
    setStartDate(date);
    onUpdate(date?.toISOString() || null, endDate?.toISOString() || null);
  };

  const handleEndChange = (date: Date | undefined) => {
    setEndDate(date);
    onUpdate(startDate?.toISOString() || null, date?.toISOString() || null);
  };

  const clearSchedule = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setShowScheduler(false);
    onUpdate(null, null);
  };

  if (!showScheduler) {
    return (
      <button
        onClick={() => setShowScheduler(true)}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <Clock className="w-3 h-3" />
        Schedule
      </button>
    );
  }

  const isScheduled = startDate || endDate;
  const now = new Date();
  const isActive = (!startDate || startDate <= now) && (!endDate || endDate > now);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <Clock className="w-3 h-3 text-muted-foreground" />
      
      {/* Start Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={`px-2 py-1 rounded border border-input hover:bg-secondary transition-colors ${
            startDate ? 'bg-secondary' : ''
          }`}>
            {startDate ? format(startDate, "MMM d, yyyy") : "Start date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={startDate}
            onSelect={handleStartChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <span className="text-muted-foreground">to</span>

      {/* End Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button className={`px-2 py-1 rounded border border-input hover:bg-secondary transition-colors ${
            endDate ? 'bg-secondary' : ''
          }`}>
            {endDate ? format(endDate, "MMM d, yyyy") : "End date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={endDate}
            onSelect={handleEndChange}
            disabled={(date) => startDate ? date < startDate : false}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {isScheduled && (
        <>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
            isActive 
              ? 'bg-green-500/20 text-green-600' 
              : 'bg-yellow-500/20 text-yellow-600'
          }`}>
            {isActive ? 'Active' : 'Scheduled'}
          </span>
          <button
            onClick={clearSchedule}
            className="p-1 hover:bg-secondary rounded"
            title="Clear schedule"
          >
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </>
      )}
    </div>
  );
}
