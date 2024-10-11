import React from 'react';
import Calendar from './Calendar';

enum AvailabilityStatus {
  Available = 0,
  ReservedByUser = 1,
  ReservedByOther = 2,
  Past = 3,
}

type DailyAvailability = {
  date: string;
  status: AvailabilityStatus;
};

type AvailabilityCalendarProps = {
  month: string;
  monthCard: DailyAvailability[];
  selectedDeskName: string;
  selectedDeskId: number;
  onMonthChange: (newValue: string) => void;
  onDayClick: (day: number, status: AvailabilityStatus) => void;
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  month,
  monthCard,
  selectedDeskName,
  selectedDeskId,
  onMonthChange,
  onDayClick,
}) => {
  const generateCalendar = () => {
    const currentDate = new Date(month);
    const year = currentDate.getFullYear();
    const monthIndex = currentDate.getMonth();

    const firstDay = new Date(year, monthIndex, 1).getDay();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    const calendarDays = [];
    const emptyDays = Array(firstDay).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${year}-${String(monthIndex + 1).padStart(
        2,
        '0',
      )}-${String(day).padStart(2, '0')}`;
      const availability = monthCard.find((av) => av.date === dayStr);
      calendarDays.push({
        day,
        status: availability ? availability.status : AvailabilityStatus.Past,
      });
    }

    return [...emptyDays, ...calendarDays];
  };

  const getStatusColor = (status: AvailabilityStatus) => {
    switch (status) {
      case AvailabilityStatus.Available:
        return 'bg-green-200 cursor-pointer';
      case AvailabilityStatus.ReservedByUser:
        return 'bg-blue-200';
      case AvailabilityStatus.ReservedByOther:
        return 'bg-yellow-200';
      case AvailabilityStatus.Past:
        return 'bg-gray-200';
      default:
        return 'bg-red-200';
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold">
        Availability for {selectedDeskName} (ID: {selectedDeskId}) in{' '}
        <Calendar value={month} onChange={onMonthChange} className="" />
      </h3>
      <div className="grid grid-cols-7 gap-4 mt-2 border rounded-lg p-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
          <div key={dayName} className="font-bold text-center">
            {dayName}
          </div>
        ))}
        {generateCalendar().map((day, index) =>
          day ? (
            <div
              key={index}
              className={`p-2 text-center rounded-md ${getStatusColor(
                day.status,
              )}`}
              onClick={() => onDayClick(day.day, day.status)}
            >
              {day.day}
            </div>
          ) : (
            <div key={index} className="p-2" />
          ),
        )}
      </div>
    </div>
  );
};

export default AvailabilityCalendar;
