import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCabin as deleteCabinApi } from "../../services/apiCabins";
import toast from "react-hot-toast";


export default function useDeleteCabin() {
  
    const queryClient = useQueryClient();

    const { isPending: isDeleting, mutate: deleteCabin } = useMutation({
      mutationFn: (id) => deleteCabinApi(id),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['cabins'],
        });
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  return { isDeleting, deleteCabin };
}
