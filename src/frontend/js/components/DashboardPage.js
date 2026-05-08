/**
 * Componente: DashboardPage (Base em Branco)
 */
export const renderDashboard = () => {
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff'
    });

    container.innerHTML = `
        <!-- Base Limpa para o Arquiteto -->
        <main id="dashboard-content" style="flex: 1;">
        </main>
    `;

    return container;
};
