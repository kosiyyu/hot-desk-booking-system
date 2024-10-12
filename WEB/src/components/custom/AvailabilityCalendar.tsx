import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { X } from 'lucide-react';
import api from '../../utils/ api';
import { isAdmin } from '../../utils/auth';

enum AvailabilityStatus {
  Available = 0,
  ReservedByUser = 1,
  ReservedByOther = 2,
  Past = 3,
}

type DailyAvailability = {
  date: string;
  status: AvailabilityStatus;
  reservationId?: number;
};

type UserInfo = {
  username: string;
  email: string;
};

type AvailabilityCalendarProps = {
  month: string;
  monthCard: DailyAvailability[];
  selectedDeskName: string;
  selectedDeskId: number;
  onMonthChange: (newValue: string) => void;
  onDayClick: (day: number, status: AvailabilityStatus) => void;
  onDeleteClick: (
    day: number,
    status: AvailabilityStatus,
    reservationId: number,
  ) => void;
};

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  month,
  monthCard,
  selectedDeskName,
  selectedDeskId,
  onMonthChange,
  onDayClick,
  onDeleteClick,
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [showReservationId, setShowReservationId] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  useEffect(() => {
    let timer: number;
    if (hoveredDay !== null) {
      timer = window.setTimeout(() => {
        setShowReservationId(true);
      }, 1000);
    }
    return () => {
      window.clearTimeout(timer);
      setShowReservationId(false);
      setUserInfo(null);
    };
  }, [hoveredDay]);

  const fetchUserInfo = async (reservationId: number) => {
    try {
      const response = await api.get(`/user/reservation/${reservationId}`);
      if (response.status === 200) {
        setUserInfo(response.data);
      } else {
        console.error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

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
        reservationId: availability?.reservationId,
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
      <div className="font-semibold">
        Availability for {selectedDeskName} (ID: {selectedDeskId}) in{' '}
        <Calendar value={month} onChange={onMonthChange} className="" />
      </div>
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
              )} relative`}
              onClick={() => onDayClick(day.day, day.status)}
              onMouseEnter={() => {
                setHoveredDay(day.day);
                if (day.reservationId) {
                  fetchUserInfo(day.reservationId);
                }
              }}
              onMouseLeave={() => {
                setHoveredDay(null);
                setShowReservationId(false);
                setUserInfo(null);
              }}
            >
              {day.day}
              {day.status === AvailabilityStatus.ReservedByUser &&
                day.reservationId && (
                  <X
                    className="absolute top-1 right-1 cursor-pointer bg-red-400 rounded-sm"
                    size={16}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDeleteClick(day.day, day.status, day.reservationId!);
                    }}
                  />
                )}
              {hoveredDay === day.day &&
                isAdmin() &&
                showReservationId &&
                day.reservationId && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded p-1 z-10">
                    <div>Reservation ID: {day.reservationId}</div>
                    {userInfo && (
                      <>
                        <div>User: {userInfo.username}</div>
                        <div>Email: {userInfo.email}</div>
                      </>
                    )}
                  </div>
                )}
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
