/**
 * DevInsightsPage - O "Ploc Forge" 🔨🔥
 * Painel exclusivo para o desenvolvedor smitti.j@gmail.com
 */
const DevInsightsPage = {
    render: async () => {
        const plocUserRaw = localStorage.getItem('ploc_user');
        const user = plocUserRaw ? JSON.parse(plocUserRaw) : null;

        // Segurança: Apenas smitti.j@gmail.com
        if (!user || user.email !== 'smitti.j@gmail.com') {
            return `
                <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #020617; color: #fff; font-family: 'Inter', sans-serif;">
                    <div style="text-align: center;">
                        <h1 style="font-size: 5rem; margin: 0; opacity: 0.1;">403</h1>
                        <p style="color: #94a3b8; letter-spacing: 2px;">ACESSO RESTRITO AOS CRIADORES</p>
                        <a href="#landing" style="color: #38bdf8; text-decoration: none; font-size: 0.8rem; margin-top: 20px; display: block;">VOLTAR AO INÍCIO</a>
                    </div>
                </div>
            `;
        }

        // Cálculos de Tempo
        const startDate = new Date('2026-05-02');
        const today = new Date();
        const diffTime = Math.abs(today - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Dados do Projeto
        const stats = {
            restarts: 4, // 0.0.1, 0.0.7 (SPA), 0.0.9 (Modular), 0.1.4 (Modern)
            days: diffDays,
            features: [
                { folder: 'auth', name: 'Sistema de Acesso (JWT)', date: '05/05/2026' },
                { folder: 'dashboard', name: 'Painel Bento Grid', date: '13/05/2026' },
                { folder: 'plants', name: 'Motor Botânico (CRUD/Agenda)', date: '11/05/2026' },
                { folder: 'chat', name: 'IA Gemini Integration', date: '08/05/2026' },
                { folder: 'sticky-notes', name: 'Mural 250vw Panorâmico', date: '13/05/2026' },
                { folder: 'routines', name: 'Gestão de Hábitos', date: '10/05/2026' },
                { folder: 'tasks', name: 'Kanban Evolutivo', date: '09/05/2026' }
            ]
        };

        const html = `
            <div id="dev-insights-container" style="min-height: 100vh; background: #020617; color: #f8fafc; font-family: 'Inter', sans-serif; padding: 1.5rem; max-width: 100vw; overflow-x: hidden;">
                <!-- Header Principal -->
                <header style="margin-bottom: 2.5rem; padding-top: 1rem;">
                    <h1 style="font-size: 1.3rem; font-weight: 900; letter-spacing: 2px; margin: 0; color: #fff; text-transform: uppercase;">
                        HISTÓRICO DE <span style="color: #38bdf8;">DESENVOLVIMENTO</span>
                    </h1>
                    <div style="width: 60px; height: 4px; background: #38bdf8; margin-top: 10px; border-radius: 2px;"></div>
                </header>

                <!-- Sub-Header de Métricas (3 Molduras Individuais Lado a Lado) -->
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.8rem; margin-bottom: 3rem;">
                    
                    <!-- Área 1: Ciclo de Vida -->
                    <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(56, 189, 248, 0.2); border-radius: 12px; padding: 1rem 0.5rem; text-align: center;">
                        <div style="font-size: 0.5rem; color: #64748b; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Dias de Vida</div>
                        <div style="font-size: 1.2rem; font-weight: 900; color: #fff;">${stats.days} </div>
                    </div>

                    <!-- Área 2: Iterações -->
                    <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(244, 63, 94, 0.2); border-radius: 12px; padding: 1rem 0.5rem; text-align: center;">
                        <div style="font-size: 0.5rem; color: #64748b; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Tentativas</div>
                        <div style="font-size: 1.2rem; font-weight: 900; color: #fff;">${stats.restarts}</div>
                    </div>

                    <!-- Área 3: Deployment -->
                    <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(34, 197, 94, 0.2); border-radius: 12px; padding: 1rem 0.5rem; text-align: center;">
                        <div style="font-size: 0.5rem; color: #64748b; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 5px;">Status</div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: #22c55e; margin-top: 4px;">
                            ${window.location.hostname === 'localhost' ? 'DEV' : 'LIVE'}
                        </div>
                    </div>

                </div>

                <!-- Linha do Tempo do Desenvolvimento (COLAPSÁVEL) -->
                <section style="margin-bottom: 1.5rem;">
                    <h2 id="trigger-timeline" style="font-size: 0.9rem; font-weight: 800; letter-spacing: 1px; color: #94a3b8; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 12px; transition: all 0.3s;">
                        <span style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 15px; height: 1px; background: #38bdf8;"></span>
                            LINHA DO TEMPO
                        </span>
                        <span class="material-symbols-rounded" style="font-size: 1.2rem; transition: transform 0.3s;" id="arrow-timeline">expand_more</span>
                    </h2>
                    
                    <div id="content-timeline" style="display: none; position: relative; padding-left: 1.5rem; border-left: 1px dashed rgba(56, 189, 248, 0.3); margin: 1rem 0 2rem 10px; animation: slideDown 0.3s ease-out;">
                        ${[
                { date: '02/05/2026', title: '🚀 GÊNESE DO PROJETO', desc: 'Início do desenvolvimento do Ploc Core e definição da identidade visual.' },
                { date: '05/05/2026', title: '🔐 ARQUITETURA DE ACESSO', desc: 'Implementação do sistema de autenticação JWT.' },
                { date: '08/05/2026', title: '🧠 CONSCIÊNCIA DO PLOC', desc: 'Integração com Gemini API e processamento de voz.' },
                { date: '10/05/2026', title: '🏗️ REFORMULAÇÃO SPA', desc: 'Migração para arquitetura Single Page Application.' },
                { date: '12/05/2026', title: '🐳 CONTAINERIZAÇÃO', desc: 'Dockerização completa e automação via Coolify.' },
                { date: '13/05/2026', title: '🔨 THE FORGE (v0.1.4)', desc: 'Lançamento do painel de métricas e suporte mobile.' }
            ].reverse().map((m, i) => `
                            <div style="position: relative; margin-bottom: 1.5rem;">
                                <div style="position: absolute; left: -1.85rem; top: 5px; width: 8px; height: 8px; border-radius: 50%; background: ${i === 0 ? '#38bdf8' : '#1e293b'}; border: 2px solid #38bdf8;"></div>
                                <div style="font-size: 0.6rem; color: #38bdf8; font-weight: 900; font-family: 'JetBrains Mono', monospace; margin-bottom: 2px;">${m.date}</div>
                                <div style="font-size: 0.85rem; font-weight: 800; color: #fff; margin-bottom: 2px;">${m.title}</div>
                                <div style="font-size: 0.7rem; color: #64748b; line-height: 1.4;">${m.desc}</div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Lista de Funcionalidades (COLAPSÁVEL COM SCROLL) -->
                <section style="margin-bottom: 3rem;">
                    <h2 id="trigger-features" style="font-size: 0.9rem; font-weight: 800; letter-spacing: 1px; color: #94a3b8; margin-bottom: 1rem; display: flex; align-items: center; justify-content: space-between; cursor: pointer; background: rgba(255,255,255,0.03); padding: 0.8rem 1rem; border-radius: 12px; transition: all 0.3s;">
                        <span style="display: flex; align-items: center; gap: 10px;">
                            <span style="width: 15px; height: 1px; background: #38bdf8;"></span>
                            MAPA DE MÓDULOS
                        </span>
                        <span class="material-symbols-rounded" style="font-size: 1.2rem; transition: transform 0.3s;" id="arrow-features">expand_more</span>
                    </h2>

                    <div id="content-features" style="display: none; background: rgba(15, 23, 42, 0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; overflow-x: auto; -webkit-overflow-scrolling: touch; animation: slideDown 0.3s ease-out;">
                        <table style="width: 100%; min-width: 400px; border-collapse: collapse; font-size: 0.75rem;">
                            <thead>
                                <tr style="background: rgba(255,255,255,0.02); text-align: left; color: #64748b; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px;">
                                    <th style="padding: 1rem;">Funcionalidade</th>
                                    <th style="padding: 1rem;">Pasta Origem</th>
                                    <th style="padding: 1rem;">Data</th>
                                    <th style="padding: 1rem;">Status</th>
                                </tr>
                            </thead>
                            <tbody style="color: #e2e8f0;">
                                ${stats.features.map(f => `
                                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
                                        <td style="padding: 1rem; font-weight: 700;">${f.name}</td>
                                        <td style="padding: 1rem;"><code style="background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; color: #38bdf8;">/features/${f.folder}</code></td>
                                        <td style="padding: 1rem; color: #94a3b8;">${f.date}</td>
                                        <td style="padding: 1rem;"><span style="color: #22c55e; font-size: 0.7rem;">● Ativo</span></td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer style="margin-top: 4rem; text-align: center; color: #334155; font-size: 0.7rem; letter-spacing: 2px;">
                    CONSTRUÍDO COM 🍮 POR ANTIGRAVITY & SMITTI
                </footer>

                <style>
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    h2:hover { background: rgba(255,255,255,0.08) !important; color: #fff !important; }
                </style>
            </div>
        `;

        // Ativa a lógica de clique após o router injetar o HTML
        setTimeout(() => {
            const setupAccordion = (triggerId, contentId, arrowId) => {
                const trigger = document.getElementById(triggerId);
                const content = document.getElementById(contentId);
                const arrow = document.getElementById(arrowId);

                if (trigger && content && arrow) {
                    trigger.onclick = (e) => {
                        e.stopPropagation();
                        const isHidden = content.style.display === 'none' || content.style.display === '';
                        content.style.display = isHidden ? 'block' : 'none';
                        arrow.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
                    };
                }
            };

            setupAccordion('trigger-timeline', 'content-timeline', 'arrow-timeline');
            setupAccordion('trigger-features', 'content-features', 'arrow-features');
        }, 100);

        return html;
    }
};

export default DevInsightsPage;
