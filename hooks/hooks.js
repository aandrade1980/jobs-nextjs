import { signIn, signOut, useSession } from 'next-auth/react';

export const useAuth = () => {
  const { data: session, status } = useSession();

  return {
    user: session && session.user,
    status,
    signIn,
    signOut
  };
};
