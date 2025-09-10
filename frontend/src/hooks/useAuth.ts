'use client';

import React,{ createContext, useContext, useState, useEffect, ReactNode, } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../utils/firebase';
import { api } from '../utils/api';
import { Doctor } from '../types';

interface AuthContextType {
  doctor: Doctor | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const response = await api.post('/auth/verify', { token });
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('doctor', JSON.stringify(response.data.doctor));
          setDoctor(response.data.doctor);
        } catch (error) {
          console.error('Auth verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('doctor');
        }
      } else {
        setDoctor(null);
        localStorage.removeItem('token');
        localStorage.removeItem('doctor');
      }
      setLoading(false);
    });

    // Check existing token on mount
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    }
    setLoading(false);

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      
      const response = await api.post('/auth/verify', { token });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('doctor', JSON.stringify(response.data.doctor));
      setDoctor(response.data.doctor);
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
      localStorage.removeItem('token');
      localStorage.removeItem('doctor');
      setDoctor(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    // @ts-ignore
    React.createElement(
      AuthContext.Provider,
      { value: { doctor, loading, login, logout } },
      children
    )
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}