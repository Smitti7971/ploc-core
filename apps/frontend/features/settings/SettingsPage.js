export const SettingsPage = {
    render: async () => {
        const container = document.createElement('div');
        container.id = 'system-settings-page-root';
        container.style.cssText = `
            min-height: 100vh; background: #070a13; color: #fff;
            display: flex; flex-direction: column; align-items: center;
            padding: 1.5rem; font-family: 'Inter', sans-serif;
            animation: fadeIn 0.4s ease;
        `;

        // Recupera usuário para checar permissão dev
        let user = {};
        try {
            const storedUser = localStorage.getItem('ploc_user');
            if (storedUser) user = JSON.parse(storedUser);
        } catch (e) {}

        container.innerHTML = `
            <div style="width: 100%; max-width: 500px;">
                <!-- Header -->
                <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem;">
                    <div id="btn-back-system" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                        <span class="material-symbols-rounded">arrow_back</span>
                    </div>
                    <h1 style="font-size: 0.8rem; font-weight: 900; letter-spacing: 3px; margin: 0; color: #475569;">SISTEMA</h1>
                    <div style="width: 40px;"></div>
                </header>

                <!-- System Options -->
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    ${createSystemItem('TEMA', 'LUXURY DARK', 'palette')}
                    ${createSystemItem('NOTIFICAÇÕES', 'ATIVADAS', 'notifications')}
                    ${createSystemItem('IDIOMA', 'PORTUGUÊS (BR)', 'language')}
                    ${createSystemItem('VOZ DO PLOC', 'ATIVADA', 'mic')}
                    ${createSystemItem('SINCRONIZAÇÃO', 'AUTOMÁTICA', 'sync')}
                    ${user?.email === 'smitti.j@gmail.com' ? createSystemItem('PLOC FORGE', 'MÉTRICAS DE DEV', 'terminal', 'btn-go-forge', true) : ''}
                </div>

                <div style="margin-top: 4rem; text-align: center;">
                    <p style="color: #1e293b; font-size: 0.6rem; font-weight: 900; letter-spacing: 2px;">PLOC OS v0.1.3</p>
                </div>
            </div>

            <style>
                .system-item {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 16px;
                    padding: 1.2rem;
                    display: flex;
                    align-items: center;
                    gap: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                .system-item:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(56, 189, 248, 0.2);
                    transform: translateX(5px);
                }
                .system-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(56, 189, 248, 0.1);
                    color: #38bdf8;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
            </style>
        `;

        setTimeout(() => {
            const btnBack = container.querySelector('#btn-back-system');
            btnBack.onclick = () => window.location.hash = '#landing';

            const btnForge = container.querySelector('#btn-go-forge');
            if (btnForge) {
                btnForge.onclick = () => window.location.hash = '#dev-insights';
            }
        }, 0);

        return container;
    }
};

function createSystemItem(label, value, icon, id = '', hideChevron = false) {
    return `
        <div class="system-item" ${id ? `id="${id}"` : ''}>
            <div class="system-icon">
                <span class="material-symbols-rounded">${icon}</span>
            </div>
            <div style="flex: 1;">
                <div style="font-size: 0.55rem; font-weight: 900; color: #475569; letter-spacing: 1.5px; margin-bottom: 2px;">${label}</div>
                <div style="font-size: 0.9rem; font-weight: 700; color: #fff;">${value}</div>
            </div>
            ${hideChevron ? '' : '<span class="material-symbols-rounded" style="color: #1e293b; font-size: 1.2rem;">chevron_right</span>'}
        </div>
    `;
}
