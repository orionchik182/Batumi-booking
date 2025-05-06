import { useParams } from 'react-router-dom';
import { getBookingsByCabinId } from '../../services/apiBookings';
import { useQuery } from '@tanstack/react-query';

export default function useBookingsByCabinId(optionalCabinId) {
  const params = useParams();
  const cabinId = optionalCabinId ?? params.cabinId;

  const {
    data: bookings,
    isPending: isLoading,
    error,
  } = useQuery({
    queryKey: ['bookings', cabinId],
    queryFn: () => getBookingsByCabinId(cabinId),
    enabled: !!cabinId,
  });

  return { bookings, isLoading, error };
}
