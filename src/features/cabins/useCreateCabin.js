import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCabin } from "../../services/apiCabins";
import toast from "react-hot-toast";


export default function useCreateCabin() {
    const queryClient = useQueryClient();
    const { mutate: createCabin, isPending: isCreating } = useMutation({
      mutationFn: createEditCabin,
      onSuccess: () => {
        toast.success('New cabin created successfully');
        queryClient.invalidateQueries({ queryKey: ['cabins'] });
        
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { isCreating, createCabin };
}
