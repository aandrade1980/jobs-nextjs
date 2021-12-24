import { createContext, useContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { setCookie, destroyCookie } from 'nookies';

import firebase from '@/lib/firebase';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleUser = async rawUser => {
    if (!rawUser) {
      setUser(null);
      destroyCookie(null, 'token');
    } else {
      const token = await rawUser.getIdToken();
      setUser(rawUser);
      setCookie(null, 'token', token);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const response = await firebase
        .auth()
        .signInWithPopup(new firebase.auth.GoogleAuthProvider());

      handleUser(response.user);
      setLoading(false);
      Router.push('/jobs');
    } catch (error) {
      console.error(`Error sign in with Google ${error.message}`);
      // Todo add toast error message
    }
  };

  const signOut = async () => {
    await firebase.auth().signOut();
    handleUser(false);
    Router.push('/');
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onIdTokenChanged(firebaseUser => handleUser(firebaseUser));

    return () => unsubscribe();
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const { currentUser } = firebase.auth();
      if (currentUser) await currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return {
    user,
    loading,
    signInWithGoogle,
    signOut
  };
}

export const useAuth = () => useContext(authContext);
