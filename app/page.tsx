"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ProjectList from "./components/ProjectList";

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/workspace");
    }
  }, [isLoaded, isSignedIn, router]);

  // Show nothing while checking auth or if signed in (will redirect)
  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30">
      {/* Subtle dot pattern background */}
      <div 
        className="fixed inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      <Navbar />
      <Hero />
    </div>
  );
}
