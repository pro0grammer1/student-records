'use client';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useAuth } from '@/components/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { signedIn, setSignedIn, setUser } = useAuth();

  const logOut = async () => {
    try {
      const result = await signOut({
        redirect: false
      });

      if (result?.url) {
        setSignedIn(false);
        setUser(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  }

  return (
    <nav className="flex m-4 dark:bg-white/30 bg-gray-800/30 fixed w-[calc(_100%_-_2rem_)] justify-between items-center p-4 rounded-lg backdrop-blur-md shadow-[0_0_2px_#686464]">
      <div className="flex w-full gap-4 items-center bg-gray-800/30">

        <span>Settings</span>
        {signedIn ?
          <span className='bg-blue-400'><span onClick={() => logOut()}>Log Out</span><span onClick={() => router.push('/admin')}>Admin</span></span> :
          <>
            <span onClick={() => router.push('/login')}>Sign In</span>
          </>
        }

      </div>
    </nav>
  );
}