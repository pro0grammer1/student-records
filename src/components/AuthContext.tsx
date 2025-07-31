'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { StudentInterface } from '@/db/studentInfo';

interface IUser {
  _id: string;
  email: string;
  name?: string;
}

interface AuthContextType {
  signedIn: boolean;
  userInfo: IUser | null;
  students: StudentInterface[];
  loading: boolean;
  studentsError: string;
  setSignedIn: (value: boolean) => void;
  setUser: (user: IUser | null) => void;
  checkSession: () => Promise<void>;
  refreshSession: () => Promise<void>;
  loadStudents: () => Promise<void>;
  addStudent: (student: StudentInterface) => void;
  removeStudent: (roll_no: number, classvar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [signedIn, setSignedIn] = useState(false);
  const [userInfo, setUser] = useState<IUser | null>(null);
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsError, setStudentsError] = useState('');

  const checkSession = async () => {
    if (signedIn) return;

    try {
      const res = await fetch('/api/auth-session');
      if (res.ok) {
        const data: IUser = await res.json();
        setSignedIn(true);
        setUser(data);
      } else {
        setSignedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSignedIn(false);
      setUser(null);
    }
  };

  const refreshSession = async () => {
    try {
      const res = await fetch('/api/auth-session');
      if (res.ok) {
        const data: IUser = await res.json();
        setSignedIn(true);
        setUser(data);
      } else {
        setSignedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Session refresh failed:', error);
      setSignedIn(false);
      setUser(null);
    }
  };

  const loadStudents = async () => {
    try {
      setLoading(true);
      setStudentsError('');
      
      const response = await fetch('/api/student-info');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStudents(data.students);
      } else {
        setStudentsError('Failed to load students');
      }
    } catch (err) {
      setStudentsError('Error fetching students');
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  const addStudent = (newStudent: StudentInterface) => {
    setStudents(prev => [...prev, newStudent]);
  };

  const removeStudent = (roll_no: number, classvar: string) => {
    setStudents(prev => prev.filter(
      student => !(student.roll_no === roll_no && student.class === classvar)
    ));
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'studentAdded' || e.key === 'studentDeleted') {
        loadStudents();
        localStorage.removeItem(e.key);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <AuthContext.Provider value={{ 
      signedIn, 
      userInfo, 
      students,
      loading,
      studentsError,
      setSignedIn, 
      setUser, 
      checkSession, 
      refreshSession,
      loadStudents,
      addStudent,
      removeStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}