import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateBooking } from '../../services/apiBookings';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: checkin, isLoading: isCheckingIn } = useMutation({
    mutationFn: ({ bookingId, updates }) => {
      console.log("Booking ID:", bookingId, typeof bookingId);
      console.log("Updates to apply:", updates);

      return updateBooking(bookingId, {
        status: "checked-in",
        isPaid: true,
        ...updates,
      });
    },

    onSuccess: (data) => {
      toast.success(`Booking #${data.id} successfully checked in`);
      queryClient.invalidateQueries({ active: true });
      navigate("/");
    },

    onError: () => toast.error("There was an error while checking in"),
  });

  return { checkin, isCheckingIn };
}