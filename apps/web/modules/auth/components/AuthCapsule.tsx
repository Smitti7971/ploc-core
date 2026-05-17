import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AuthModal } from './AuthModal';
import { UserHeader } from '@/components/layout/UserHeader';
import { cn } from '@/lib/utils';

export const AuthCapsule: React.FC = () => {
  const { isAuthenticated, setAuthModalOpen } = useAuthStore();

  const handleEnterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setAuthModalOpen(true);
  };

  return (
    <div className="absolute top-[25px] right-[25px] z-[9999] flex items-center gap-3">
      {isAuthenticated ? (
        <UserHeader />
      ) : (
        <>
          <Link href="/dashboard" onClick={handleEnterClick}>
            <motion.div
              initial={{ opacity: 1 }}
              whileHover={{ 
                scale: 1.05, 
                background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
                boxShadow: '0 0 25px rgba(16, 185, 129, 0.5)'
              }}
              animate={{
                background: [
                  'linear-gradient(90deg, rgba(16, 185, 129, 0.75) 0%, rgba(5, 150, 105, 0.75) 100%)',
                  'linear-gradient(90deg, rgba(5, 150, 105, 0.75) 0%, rgba(16, 185, 129, 0.75) 100%)',
                ]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className={cn(
                "backdrop-blur-xl px-9 py-3 rounded-full border border-emerald-400/35",
                "cursor-pointer shadow-lg shadow-emerald-500/25 flex items-center justify-center transition-all min-h-[48px]"
              )}
            >
              <span className="text-white text-[12px] font-black tracking-[2px] font-display">
                ENTRAR
              </span>
            </motion.div>
          </Link>
          <AuthModal />
        </>
      )}
    </div>
  );
};
