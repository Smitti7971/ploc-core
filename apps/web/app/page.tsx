'use client';

import { useAuthStore } from '@/store/authStore';
import LandingClient from "./LandingClient";
import Blackboard from "@/modules/auth/components/Blackboard";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Blackboard />;
  }

  return <LandingClient />;
}
