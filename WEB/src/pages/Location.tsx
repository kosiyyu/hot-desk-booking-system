import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { isAdmin, getUserId } from '../utils/auth';
import AddReservationModal from '../components/custom/AddReservationModal';
import DeleteReservationModal from '../components/custom/DeleteReservationModal';

import DeskList from '../components/custom/DeskList';
import AvailabilityCalendar from '../components/custom/AvailabilityCalendar';
import CalendarLegend from '../components/custom/CalendarLegend';
import LocationInfo from '../components/custom/LocationInfo';

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

export default function Location() {
  const { id } = useParams<{ id: string }>();
  const [location, setLocation] = useState<LocationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  );
  const [monthCard, setMonthCard] = useState<DailyAvailability[]>([]);
  const [selectedDeskId, setSelectedDeskId] = useState<number | null>(null);
  const [selectedReservationDate, setSelectedReservationDate] = useState<
    string | null
  >(null);
  const [deleteModalData, setDeleteModalData] = useState<{
    deskId: number;
    reservationId: number;
    reservationDate: string;
  } | null>(null);

  const userId = getUserId() as number;

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
      const response = await axios.get<
        { date: string; status: number; reservationId?: number }[]
      >(
        `http://localhost:5106/api/desk/${deskId}/availability/array/${month}/${userId}`,
      );
      const mappedData: DailyAvailability[] = response.data.map((item) => ({
        date: item.date,
        status: item.status as AvailabilityStatus,
        reservationId: item.reservationId,
      }));
      setMonthCard(mappedData);
      setSelectedDeskId(deskId);
    } catch (error) {
      setError('Error fetching availability data');
      console.error('Error fetching availability:', error);
    }
  };

  const handleMonthChange = (newValue: string) => {
    setMonth(newValue);
  };

  const handleDayClick = (day: number, status: AvailabilityStatus) => {
    if (status === AvailabilityStatus.Available && selectedDeskId) {
      const selectedDate = `${month}-${String(day).padStart(2, '0')}`;
      setSelectedReservationDate(selectedDate);
    }
  };

  const handleDeleteClick = (
    day: number,
    status: AvailabilityStatus,
    reservationId: number,
  ) => {
    if (
      (status === AvailabilityStatus.ReservedByUser ||
        status === AvailabilityStatus.ReservedByOther) &&
      selectedDeskId
    ) {
      const selectedDate = `${month}-${String(day).padStart(2, '0')}`;
      setDeleteModalData({
        deskId: selectedDeskId,
        reservationId: reservationId,
        reservationDate: selectedDate,
      });
    }
  };

  const handleReservationSuccess = () => {
    setSelectedReservationDate(null);
    if (selectedDeskId) {
      fetchMonthCard(selectedDeskId);
    }
  };

  const handleReservationClose = () => {
    setSelectedReservationDate(null);
  };

  const handleDeleteSuccess = () => {
    setDeleteModalData(null);
    if (selectedDeskId) {
      fetchMonthCard(selectedDeskId);
    }
  };

  const handleDeleteClose = () => {
    setDeleteModalData(null);
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

  return (
    <div className="min-h-screen p-4">
      {location ? (
        <div>
          <div className="flex flex-row">
            <LocationInfo
              name={location.name}
              address={location.address}
              locationId={location.locationId}
            />
            <DeskList
              desks={location.desks}
              selectedDeskId={selectedDeskId}
              isAdmin={isAdmin()}
              onDeskSelect={fetchMonthCard}
              onLocationRefresh={fetchLocation}
            />
          </div>

          {selectedDeskId && monthCard.length > 0 && (
            <AvailabilityCalendar
              month={month}
              monthCard={monthCard}
              selectedDeskName={
                location?.desks.find((x) => x.deskId === selectedDeskId)
                  ?.name || ''
              }
              selectedDeskId={selectedDeskId}
              onMonthChange={handleMonthChange}
              onDayClick={handleDayClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
          {selectedDeskId && monthCard.length === 0 && (
            <div className="mt-4">No availability data available.</div>
          )}
        </div>
      ) : (
        <div>No location data available</div>
      )}
      {location && location.desks.length > 0 && <CalendarLegend />}
      {location && location.desks.length === 0 && (
        <div className="text-center mt-4">No desks in this location.</div>
      )}

      {selectedReservationDate && selectedDeskId && (
        <AddReservationModal
          userId={userId}
          deskId={selectedDeskId}
          reservationDate={selectedReservationDate}
          onSuccess={handleReservationSuccess}
          onClose={handleReservationClose}
        />
      )}

      {deleteModalData && (
        <DeleteReservationModal
          userId={userId}
          deskId={deleteModalData.deskId}
          reservationId={deleteModalData.reservationId}
          reservationDate={deleteModalData.reservationDate}
          onSuccess={handleDeleteSuccess}
          onClose={handleDeleteClose}
        />
      )}
    </div>
  );
}
