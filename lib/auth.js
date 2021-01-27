import React, { useState, useEffect, useContext, createContext } from 'react';
import Router from 'next/router';
import nookies from 'nookies';

import firebase from '@/lib/firebase';

const authContext = createContext();

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleUser = async rawUser => {
    if (!rawUser) {
      setUser(null);
      nookies.destroy(undefined, 'token');
    } else {
      const token = await rawUser.getIdToken();
      setUser(rawUser);
      nookies.set(undefined, 'token', token);
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
      .onIdTokenChanged(user => handleUser(user));

    return () => unsubscribe();
  }, []);

  return {
    user,
    loading,
    signinWithGoogle,
    signout
  };
}

export const useAuth = () => useContext(authContext);
