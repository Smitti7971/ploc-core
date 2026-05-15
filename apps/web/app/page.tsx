'use client';

import { useAuthStore } from '@/store/authStore';
import LandingClient from "./LandingClient";
import BlackboardPage from "@/modules/blackboard/components/BlackboardPage";

export default function Home() {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <BlackboardPage />;
  }

  return <LandingClient />;
}
