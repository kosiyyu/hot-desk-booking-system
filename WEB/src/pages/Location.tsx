import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { isAdmin } from '../utils/auth';
import Calendar from '../components/custom/Calendar';
import { DeleteDeskModal } from '../components/custom/DeleteDeskModel';
import { EditDeskModal } from '../components/custom/EditDeskModal';
import { AddDeskModal } from '../components/custom/AddDeskModal';

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
      setSelectedDeskId(response.data.desks[0]?.deskId);
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
      setMonthCard(response.data);
      setSelectedDeskId(deskId);
    } catch (error) {
      setError('Error fetching availability data');
      console.error('Error fetching availability:', error);
    }
  };

  const handleMonthChange = (newValue: string) => {
    setMonth(newValue);
    console.log(newValue);
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

  const areDesksAvailable = location && location.desks.length > 0;

  const renderDesks = () => {
    return (
      <div className="">
        <div className="text-xl font-semibold mt-4">Desks</div>
        <div className="text-sm text-gray-400">
          <div className="text-sm text-gray-400">
            {location
              ? selectedDeskId
                ? `Desk ${
                    location.desks.findIndex(
                      (desk) => desk.deskId === selectedDeskId,
                    ) + 1
                  } of ${location.desks.length} selected`
                : `${location.desks.length} ${
                    location.desks.length === 1 ? 'desk' : 'desks'
                  } available`
              : 'No location data'}
          </div>
        </div>
        <div
          className={`flex flex-wrap ${
            isAdmin ? 'flex-col' : 'flex-row'
          } items-start justify-center`}
        >
          {location?.desks.map((desk) => (
            <div
              key={desk.deskId}
              className={`${
                isAdmin ? 'flex flex-row items-center justify-center' : ''
              }`}
            >
              <div
                className={`border rounded-lg p-2 ${
                  isAdmin ? '' : 'm-2'
                } cursor-pointer`}
                onClick={() => fetchMonthCard(desk.deskId)}
              >
                <div
                  className={`text-center w-36 ${
                    selectedDeskId === desk.deskId ? 'text-special' : ''
                  }`}
                >
                  <div className="font-bold">{desk.name}</div>
                  <div className="text-xs">ID: {desk.deskId}</div>
                </div>
              </div>
              {isAdmin && (
                <>
                  <DeleteDeskModal
                    deskId={desk.deskId}
                    deskName={desk.name}
                    onSuccess={fetchLocation}
                  />
                  <EditDeskModal
                    deskId={desk.deskId}
                    deskName={desk.name}
                    onSuccess={fetchLocation}
                  />
                </>
              )}
            </div>
          ))}

          {isAdmin && (
            <AddDeskModal
              locationId={location?.locationId as number}
              onSuccess={fetchLocation}
              userId={2} // dummy user id
            />
          )}
        </div>
      </div>
    );
  };

  const renderNoDesksInfo = () => {
    return <div className="text-center mt-4">No desks in this location.</div>;
  };

  const renderCalendarPageLegend = () => {
    return (
      <div className="mt-2 border rounded-lg">
        <div className="flex flex-row items-center border-b py-2 pl-2">
          <div className="bg-red-200 rounded-full w-4 h-4" />
          <div className="ml-2 text-xs">Unavailable</div>
        </div>
        <div className="flex flex-row items-center border-b py-2 pl-2">
          <div className="bg-green-200 rounded-full w-4 h-4" />
          <div className="ml-2 text-xs">Available</div>
        </div>
        <div className="flex flex-row items-center py-2 pl-2">
          <div className="border-2 border-special rounded-full w-4 h-4" />
          <div className="ml-2 text-xs">Reservation</div>
        </div>
      </div>
    );
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
            {renderDesks()}
          </div>

          {selectedDeskId && monthCard.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">
                Availability for{' '}
                {location.desks.find((x) => x.deskId == selectedDeskId)?.name}{' '}
                (ID:{' '}
                {location.desks.find((x) => x.deskId == selectedDeskId)?.deskId}
                ) in{' '}
                <Calendar
                  value={month}
                  onChange={handleMonthChange}
                  className=""
                />
              </h3>
              <div className="grid grid-cols-7 gap-4 mt-2 border rounded-lg p-2">
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
      {areDesksAvailable && renderCalendarPageLegend()}
      {!areDesksAvailable && renderNoDesksInfo()}
    </div>
  );
}
