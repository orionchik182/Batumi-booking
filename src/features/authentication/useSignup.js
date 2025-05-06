import { useMutation } from '@tanstack/react-query';
import { signup as signupApi } from '../../services/apiAuth';
import toast from 'react-hot-toast';

export function useSignup() {
  const { mutate: signup, isPending: isLoading } = useMutation({
    mutationFn: signupApi,
    onSuccess: (user) => {
      console.log(user);
      toast.success(
        "Account successfully created! Please verufy the new account from the user's email address.",
      );
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || 'Failed to create user');
    },
  });

  return { signup, isLoading };
}
