/**
 * Componente: SettingsPage
 * Interface de Configurações Premium do Ploc
 */
export const renderSettingsPage = () => {
    const container = document.createElement('div');

    Object.assign(container.style, {
        width: '100%', minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '2rem',
        paddingBottom: '100px'
    });

    const settingsGroups = [
        {
            title: 'CONTA',
            items: [
                { icon: 'person', label: 'Perfil do Usuário', detail: 'Nome, E-mail, Avatar' },
                { icon: 'lock', label: 'Segurança', detail: 'Senha e Autenticação' }
            ]
        },
        {
            title: 'APLICATIVO',
            items: [
                { icon: 'notifications', label: 'Notificações', detail: 'Alertas e Lembretes' },
                { icon: 'palette', label: 'Aparência', detail: 'Tema e Cores' },
                { icon: 'language', label: 'Idioma', detail: 'Português (BR)' }
            ]
        },
        {
            title: 'SUPORTE',
            items: [
                { icon: 'help', label: 'Ajuda & FAQ', detail: '' },
                { icon: 'info', label: 'Sobre o Ploc', detail: 'Versão v0.2.2' }
            ]
        }
    ];

    container.innerHTML = `
        <div style="max-width: 600px; margin: 0 auto;">
            <!-- Header -->
            <header style="display: flex; align-items: center; gap: 1.5rem; margin-bottom: 3rem;">
                <div id="settings-back" style="cursor: pointer; opacity: 0.6; transition: 0.3s;">
                    <span class="material-symbols-rounded">arrow_back_ios</span>
                </div>
                <h1 style="font-size: 1.2rem; margin: 0; font-weight: 800; letter-spacing: 4px;">CONFIGURAÇÕES</h1>
            </header>

            <!-- Lista de Configurações -->
            <div style="display: flex; flex-direction: column; gap: 2.5rem;">
                ${settingsGroups.map(group => `
                    <section>
                        <h2 style="font-size: 0.7rem; color: #38bdf8; letter-spacing: 2px; font-weight: 800; margin-bottom: 1rem;">${group.title}</h2>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            ${group.items.map(item => `
                                <div class="setting-item" style="
                                    background: rgba(255,255,255,0.02); padding: 1.2rem; border-radius: 16px;
                                    display: flex; align-items: center; gap: 1.2rem; cursor: pointer;
                                    border: 1px solid rgba(255,255,255,0.05); transition: all 0.3s ease;
                                ">
                                    <span class="material-symbols-rounded" style="color: #64748b;">${item.icon}</span>
                                    <div style="flex: 1;">
                                        <p style="margin: 0; font-size: 0.9rem; font-weight: 600;">${item.label}</p>
                                        ${item.detail ? `<p style="margin: 0.2rem 0 0 0; font-size: 0.7rem; color: #64748b;">${item.detail}</p>` : ''}
                                    </div>
                                    <span class="material-symbols-rounded" style="font-size: 1.2rem; opacity: 0.3;">chevron_right</span>
                                </div>
                            `).join('')}
                        </div>
                    </section>
                `).join('')}
            </div>

            <!-- Botão Sair -->
            <button id="btn-logout" style="
                width: 100%; margin-top: 4rem; padding: 1.2rem; border-radius: 16px;
                background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
                color: #ef4444; font-weight: 700; letter-spacing: 2px; cursor: pointer;
                transition: all 0.3s ease;
            ">SAIR DA CONTA</button>
        </div>

        <style>
            .setting-item:hover {
                background: rgba(255,255,255,0.05);
                border-color: rgba(56, 189, 248, 0.3);
                transform: translateX(5px);
            }
            #btn-logout:hover {
                background: #ef4444;
                color: #fff;
            }
        </style>
    `;

    setTimeout(() => {
        const btnBack = container.querySelector('#settings-back');
        if (btnBack) {
            btnBack.onclick = () => {
                window.location.hash = '#landing';
            };
        }
    }, 0);

    return container;
};
