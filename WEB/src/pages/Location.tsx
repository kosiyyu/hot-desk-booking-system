import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';

type Desk = {
  deskId: number;
  name: string;
  locationId: number;
};

type LocationType = {
  locationId: number;
  name: string;
  address: string;
  desks: Array<Desk>;
};

type DailyAvailability = {
  date: string;
  isAvailable: boolean;
};

export default function Location() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  ); // "yyy-mm"
  const [monthCard, setMonthCard] = useState<DailyAvailability[]>([]);
  const [selectedDeskId, setSelectedDeskId] = useState<number | null>(null);

  const fetchLocation = async () => {
    try {
      const response = await axios.get<LocationType>(
        `http://localhost:5106/api/location/${id}/full`,
      );
      setLocation(response.data);
    } catch (error) {
      setError('Error fetching location data');
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMonthCard = async (deskId: number) => {
    try {
      const response = await axios.get<DailyAvailability[]>(
        `http://localhost:5106/api/desk/${deskId}/availability/array/${month}`,
      );
      console.log(response.data);
      setMonthCard(response.data); // Set availability data
      setSelectedDeskId(deskId); // Track selected desk
    } catch (error) {
      setError('Error fetching availability data');
      console.error('Error fetching availability:', error);
    }
  };

  const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMonth(event.target.value);
    console.log(event.target.value);
  };

  useEffect(() => {
    if (selectedDeskId) {
      fetchMonthCard(selectedDeskId);
    }
  }, [month, selectedDeskId]);

  useEffect(() => {
    fetchLocation();
  }, [id]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">{error}</div>;
  }

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
        isAvailable: availability ? availability.isAvailable : false,
      });
    }

    return [...emptyDays, ...calendarDays];
  };

  return (
    <div className="min-h-screen p-4">
      {location ? (
        <div>
          <div className="flex flex-row">
            <div className="w-1/2">
              <div className="text-2xl font-bold">{location.name}</div>
              <div className="text-xs text-gray-400">{location.address}</div>
              <div className="text-xs text-gray-400">
                ID: {location.locationId}
              </div>
            </div>

            <div className="w-1/2">
              <div className="flex items-center justify-center">
                <input
                  type="month"
                  value={month}
                  onChange={handleMonthChange}
                  className="border border-gray-300 rounded-md p-2 mt-2 h-9"
                />
              </div>
              <div className="flex flex-row flex-wrap items-center justify-center">
                {location.desks.map((desk) => (
                  <div key={desk.deskId} className="p-2">
                    <Button onClick={() => fetchMonthCard(desk.deskId)}>
                      <div
                        className={`w-32 ${
                          selectedDeskId === desk.deskId ? 'text-special' : ''
                        }`}
                      >
                        <div className="font-bold">{desk.name}</div>
                        <div className="text-xs">ID: {desk.deskId}</div>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedDeskId && monthCard.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">
                Availability for{' '}
                {location.desks.find((x) => x.deskId == selectedDeskId)?.name}{' '}
                (ID:{' '}
                {location.desks.find((x) => x.deskId == selectedDeskId)?.deskId}
                ) in {month}:
              </h3>
              <div className="grid grid-cols-7 gap-4 mt-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
                  (dayName) => (
                    <div key={dayName} className="font-bold text-center">
                      {dayName}
                    </div>
                  ),
                )}
                {generateCalendar().map((day, index) =>
                  day ? (
                    <div
                      key={index}
                      className={`p-2 text-center rounded-md ${
                        day.isAvailable ? 'bg-green-200' : 'bg-red-200'
                      }`}
                    >
                      {day.day}
                    </div>
                  ) : (
                    <div key={index} className="p-2" />
                  ),
                )}
              </div>
            </div>
          )}
          {selectedDeskId && monthCard.length === 0 && (
            <div className="mt-4">No availability data available.</div>
          )}
        </div>
      ) : (
        <div>No location data available</div>
      )}
    </div>
  );
}
