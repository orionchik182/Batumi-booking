import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings';
import toast from 'react-hot-toast';


export default function useDeleteBooking() {
  const queryClient = useQueryClient();
  

  const { isPending: isDeletingBooking, mutate: deleteBooking } = useMutation({
    mutationFn: (id) => deleteBookingApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      });
      toast.success('Booking successfully deleted');
      
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return { isDeletingBooking, deleteBooking };
}
