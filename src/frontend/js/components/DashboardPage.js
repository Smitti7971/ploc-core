/**
 * Componente: DashboardPage
 * Interface Pós-Login: O painel de controle do usuário
 */
export const renderDashboard = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        width: '100%', minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem'
    });

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header do Dashboard -->
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem;">
                <div>
                    <h1 style="font-size: 1.5rem; margin: 0; font-weight: 800; letter-spacing: 2px;">OLÁ, MESTRE</h1>
                    <p style="color: #64748b; font-size: 0.8rem; margin: 0.5rem 0 0 0;">Seu sócio está pronto para agir.</p>
                </div>
                <div id="go-home" style="width: 45px; height: 45px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); cursor: pointer;">
                    <span class="material-symbols-rounded">home</span>
                </div>
            </header>

            <!-- Cards de Resumo -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 3rem;">
                <div style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.2); padding: 1.5rem; border-radius: 16px;">
                    <span class="material-symbols-rounded" style="color: #38bdf8; margin-bottom: 1rem;">schedule</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: #38bdf8;">ROTINAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">12</p>
                </div>
                <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); padding: 1.5rem; border-radius: 16px;">
                    <span class="material-symbols-rounded" style="color: #64748b; margin-bottom: 1rem;">notifications_active</span>
                    <h3 style="margin: 0; font-size: 0.8rem; color: #64748b;">ALERTAS</h3>
                    <p style="font-size: 1.8rem; font-weight: 800; margin: 0.5rem 0 0 0;">03</p>
                </div>
            </div>

            <!-- Lista de Atividades Recentes -->
            <section>
                <h2 style="font-size: 1rem; margin-bottom: 1.5rem; letter-spacing: 2px;">ATIVIDADES RECENTES</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 10px; height: 10px; background: #22c55e; border-radius: 50%;"></div>
                        <span style="font-size: 0.9rem;">Meta diária de hidratação batida!</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 10px; height: 10px; background: #eab308; border-radius: 50%;"></div>
                        <span style="font-size: 0.9rem;">Lembrete: Ler por 30 minutos às 21h.</span>
                    </div>
                </div>
            </section>

            <!-- Botão Central: Chamar o Ploc -->
            <div id="call-ploc" style="
                position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%);
                width: 65px; height: 65px; background: #38bdf8; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                box-shadow: 0 10px 30px rgba(56, 189, 248, 0.4); cursor: pointer;
            ">
                <span class="material-symbols-rounded" style="color: #0f172a; font-size: 2rem;">bolt</span>
            </div>
        </div>
    `;

    setTimeout(() => {
        const goHome = container.querySelector('#go-home');
        if (goHome) {
            goHome.onclick = () => {
                window.location.hash = '#landing';
            };
        }
    }, 0);

    return container;
};
