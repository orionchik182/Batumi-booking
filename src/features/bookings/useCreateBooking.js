import { useMutation, useQueryClient } from '@tanstack/react-query';

import toast from 'react-hot-toast';
import { createBooking as createBookingApi } from '../../services/apiBookings';

export default function useCreateBooking() {
  const queryClient = useQueryClient();
  const { mutate: createBooking, isPending: isCreating } = useMutation({
    mutationFn: createBookingApi,
    onSuccess: () => {
      toast.success('New booking created successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { isCreating, createBooking };
}
