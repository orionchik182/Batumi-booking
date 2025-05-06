import { useNavigate } from 'react-router-dom';
import BookingTable from '../features/bookings/BookingTable';
import useBookingsByCabinId from '../features/cabins/useBookingsByCabinId';
import Spinner from '../ui/Spinner';
import Table from '../ui/Table';

export default function Cabin() {
  const { bookings, isLoading } = useBookingsByCabinId();
  const navigate = useNavigate();

  if (isLoading) return <Spinner />;

  return (
    <div>
      <BookingTable bookings={bookings} isPending={isLoading} />

      <div className="mt-6 flex justify-end gap-2">
        <button className="btn bg-emerald-500" onClick={() => navigate(-1)}>
          Back
        </button>

        <button className="btn">Add new booking</button>
      </div>
    </div>
  );
}
