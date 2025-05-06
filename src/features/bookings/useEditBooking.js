import { useMutation, useQueryClient } from '@tanstack/react-query';
import { editBooking as editBookingApi } from '../../services/apiBookings';
import toast from 'react-hot-toast';

export default function useEditBooking() {
  const queryClient = useQueryClient();
  const { mutate: editBooking, isPending: isEditing } = useMutation({
    mutationFn: ({ newBookingData, id }) => editBookingApi(newBookingData, id),
    onSuccess: () => {
      toast.success('Booking edited successfully');
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { isEditing, editBooking };
}
