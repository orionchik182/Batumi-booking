import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../services/apiSettings";


export default function useSettings() {
    const {isPending, data: settings, error} = useQuery({
        queryKey: ['settings'],
        queryFn: getSettings,
    });
  return { isPending, settings, error };
}
