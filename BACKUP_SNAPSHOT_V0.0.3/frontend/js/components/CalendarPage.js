/**
 * Componente: CalendarPage
 * Interface de Calendário Premium do Ploc
 */
export const renderCalendarPage = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        width: '100%', minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        paddingBottom: '100px' // Espaço para o menu
    });

    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
    const now = new Date();
    const currentMonth = now.toLocaleString('default', { month: 'long' }).toUpperCase();
    const currentYear = now.getFullYear();

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header do Calendário -->
            <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div id="calendar-back" style="cursor: pointer; opacity: 0.6; transition: 0.3s;" onmouseover="this.style.opacity=1" onmouseout="this.style.opacity=0.6">
                    <span class="material-symbols-rounded">arrow_back_ios</span>
                </div>
                <div style="text-align: center;">
                    <h1 style="font-size: 1.2rem; margin: 0; font-weight: 800; letter-spacing: 4px; color: #38bdf8;">${currentMonth}</h1>
                    <p style="color: #64748b; font-size: 0.8rem; margin: 0;">${currentYear}</p>
                </div>
                <div style="width: 24px;"></div> <!-- Spacer -->
            </header>

            <!-- Grade do Calendário -->
            <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 1.5rem; backdrop-filter: blur(10px);">
                <!-- Dias da Semana -->
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; margin-bottom: 1rem;">
                    ${days.map(day => `<span style="font-size: 0.7rem; color: #64748b; font-weight: 600; letter-spacing: 1px;">${day}</span>`).join('')}
                </div>

                <!-- Dias do Mês (Exemplo estático) -->
                <div style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; text-align: center;">
                    ${Array.from({ length: 31 }, (_, i) => {
                        const day = i + 1;
                        const isToday = day === now.getDate();
                        return `
                            <div style="
                                aspect-ratio: 1; display: flex; align-items: center; justify-content: center;
                                border-radius: 12px; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease;
                                ${isToday ? 'background: #38bdf8; color: #0f172a; font-weight: 800; box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);' : 'hover:background: rgba(255,255,255,0.05);'}
                            ">
                                ${day}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <!-- Eventos do Dia -->
            <section style="margin-top: 3rem;">
                <h2 style="font-size: 0.8rem; letter-spacing: 2px; color: #64748b; margin-bottom: 1.5rem;">AGENDA DE HOJE</h2>
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="background: linear-gradient(90deg, rgba(56, 189, 248, 0.1), transparent); border-left: 3px solid #38bdf8; padding: 1.2rem; border-radius: 0 12px 12px 0;">
                        <span style="font-size: 0.7rem; color: #38bdf8; font-weight: 700;">09:00 - 10:00</span>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; font-weight: 600;">Reunião com o Ploc</p>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); border-left: 3px solid rgba(255,255,255,0.1); padding: 1.2rem; border-radius: 0 12px 12px 0;">
                        <span style="font-size: 0.7rem; color: #64748b; font-weight: 700;">14:30 - 15:00</span>
                        <p style="margin: 0.3rem 0 0 0; font-size: 0.9rem; font-weight: 600; opacity: 0.6;">Meditação Diária</p>
                    </div>
                </div>
            </section>
        </div>
    `;

    setTimeout(() => {
        const btnBack = container.querySelector('#calendar-back');
        if (btnBack) {
            btnBack.onclick = () => {
                window.location.hash = '#landing';
            };
        }
    }, 0);

    return container;
};
