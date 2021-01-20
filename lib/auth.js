import { useToast } from '@chakra-ui/react';
import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';

import firebase from '@/lib/firebase';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const formatUser = ({
    uid,
    email,
    displayName,
    photoURL,
    providerData,
    ya
  }) => ({
    uid: uid,
    email: email,
    name: displayName,
    photoUrl: photoURL,
    provider: providerData[0].providerId,
    token: ya
  });

  const handleUser = rawUser => {
    if (rawUser) {
      const user = formatUser(rawUser);
      const { token, ...userWithoutToken } = user;

      setUser(user);
      localStorage.setItem('post-job-auth', JSON.stringify(userWithoutToken));

      return user;
    } else {
      setUser(false);
      localStorage.removeItem('post-job-auth');
      return false;
    }
  };

  const signinWithGoogle = async () => {
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

  const signout = async () => {
    Router.push('/');

    await firebase.auth().signOut();

    handleUser(false);
  };

  useEffect(() => {
    const unsubscribe = firebase
      .auth()
      .onAuthStateChanged(user => handleUser(user));

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGoogle,
    signout
  };
}
