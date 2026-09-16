import { useQuery } from "@tanstack/react-query";
import { getPublicProfile } from "@/services/profile.service";

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getPublicProfile,
    staleTime: 5 * 60_000,
  });
}
