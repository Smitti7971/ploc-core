export const SettingsPage = {
    render: () => {
        const user = JSON.parse(localStorage.getItem('ploc_user') || '{}');
        
        return `
            <div id="settings-container" style="
                min-height: 100vh; background: #0f172a; color: #fff;
                display: flex; flex-direction: column; align-items: center;
                padding: 2rem; font-family: 'Outfit', sans-serif;
            ">
                <!-- Header -->
                <div style="width: 100%; max-width: 600px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 3rem;">
                    <div id="back-to-ploc" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem; color: #38bdf8; font-weight: 700;">
                        <span class="material-symbols-rounded">arrow_back</span>
                        <span>VOLTAR</span>
                    </div>
                    <span style="font-weight: 900; letter-spacing: 3px; color: rgba(255,255,255,0.3);">SETTINGS</span>
                </div>

                <!-- Perfil Card -->
                <div style="
                    width: 100%; max-width: 600px; background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.05); border-radius: 24px;
                    padding: 2.5rem; display: flex; flex-direction: column; align-items: center;
                    backdrop-filter: blur(20px);
                ">
                    <div style="
                        width: 100px; height: 100px; border-radius: 50%;
                        background: linear-gradient(145deg, #38bdf8, #1d4ed8);
                        display: flex; align-items: center; justify-content: center;
                        margin-bottom: 1.5rem; box-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
                        border: 4px solid #0f172a;
                    ">
                        <span class="material-symbols-rounded" style="font-size: 3.5rem; color: #fff;">person</span>
                    </div>

                    <h2 style="margin: 0; font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px;">${user.name || 'Mestre Ploc'}</h2>
                    <p style="margin: 0.5rem 0 2rem; color: #64748b; font-size: 0.9rem;">${user.email || 'contato@ploc.com'}</p>

                    <div style="width: 100%; height: 1px; background: rgba(255,255,255,0.05); margin-bottom: 2rem;"></div>

                    <!-- Campos (Simulação) -->
                    <div style="width: 100%; display: flex; flex-direction: column; gap: 1.5rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; letter-spacing: 1px;">NOME DE USUÁRIO</label>
                            <input type="text" value="${user.name || ''}" disabled style="
                                background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
                                padding: 1rem; border-radius: 12px; color: #fff; font-family: inherit;
                            ">
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="font-size: 0.7rem; font-weight: 700; color: #38bdf8; letter-spacing: 1px;">E-MAIL</label>
                            <input type="text" value="${user.email || ''}" disabled style="
                                background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
                                padding: 1rem; border-radius: 12px; color: #fff; font-family: inherit;
                            ">
                        </div>
                    </div>

                    <button id="save-settings" style="
                        width: 100%; margin-top: 2.5rem; padding: 1.2rem;
                        background: #38bdf8; border: none; border-radius: 12px;
                        color: #0f172a; font-weight: 800; letter-spacing: 1px;
                        cursor: pointer; transition: transform 0.2s;
                    ">SALVAR ALTERAÇÕES</button>
                </div>
            </div>
        `;
    },
    afterRender: (container) => {
        const backBtn = container.querySelector('#back-to-ploc');
        if (backBtn) {
            backBtn.onclick = () => {
                window.location.hash = '#landing';
            };
        }
    }
};
