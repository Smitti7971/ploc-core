'use client'; // Define o componente como Client Component no Next.js

// Bloco de imports: Gerenciador de estado e componentes de página
import { useAuthStore } from '@/store/authStore'; // Importa a store global de autenticação Zustand
import LandingClient from "./LandingClient"; // Importa a página para usuários deslogados
import BlackboardPage from "@/modules/blackboard/components/BlackboardPage"; // Importa a página de quadro negro (usuários logados)

// Componente principal da Rota Raiz (/)
export default function Home() {
  // Resgata o status de autenticação da store global
  const { isAuthenticated } = useAuthStore(); // Extrai boolean isAuthenticated do Zustand
  
  // Condicional que verifica se o usuário tem sessão ativa
  if (isAuthenticated) {
    // Retorna a página interna principal se estiver logado
    return <BlackboardPage />; {/* Renderiza o quadro negro */}
  }

  // Caso o usuário não esteja logado, exibe a landing page interativa
  return <LandingClient />; {/* Renderiza a landing client */}
}
