'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import HomeGameInterface from "./components/game-interface-home";
import { useAuth } from "./utils/AuthContext";
import Loading from './components/ui/loading';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null; // Avoid flicker before redirect
  }

  return <HomeGameInterface />;
}
