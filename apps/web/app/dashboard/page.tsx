// Bloco de imports: Layout global e Módulo do Dashboard
import { AppShell } from '@/components/layout/AppShell'; // Importa a casca da aplicação (layout)
import DashboardPage from '@/modules/dashboard/components/DashboardPage'; // Importa a página real do dashboard

// Componente principal da rota /dashboard
export default function Dashboard() {
  // Retorna a página do dashboard envelopada no AppShell
  return (
    <AppShell> {/* Aplica o fundo e menu do sistema */}
      <DashboardPage /> {/* Renderiza o módulo do Dashboard */}
    </AppShell>
  ); // Finaliza o retorno
}
