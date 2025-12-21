"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useAuth } from "@/components/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { signedIn, setSignedIn, setUser } = useAuth();

  const logOut = async () => {
    try {
      const result = await signOut({
        redirect: false,
      });

      if (result?.url) {
        setSignedIn(false);
        setUser(null);
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="flex h-15 w-full dark:bg-white/30 bg-gray-800/30 fixed justify-between items-center rounded-lg backdrop-blur-md shadow-[0_0_2px_#686464]">
      <div className="flex w-full gap-4 items-center p-4">
        <span className="cursor-pointer" onClick={() => router.push("/")}>
          Home
        </span>
        <span className="cursor-pointer">Settings</span>
        {signedIn ? (
          <span className="cursor-pointer flex gap-4">
            <span onClick={() => logOut()}>Log Out</span>
            <span onClick={() => router.push("/admin")}>Admin</span>
          </span>
        ) : (
          <>
            <span
              className="cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Sign In
            </span>
          </>
        )}
      </div>
    </nav>
  );
}
