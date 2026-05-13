/**
 * DockMenu - Menu de Navegação Global (Singleton)
 */
export const createDockMenu = () => {
    const menuItems = [
        { icon: 'category', route: '#dashboard', color: '#60a5fa' },
        { icon: 'calendar-2', route: '#calendar', color: '#c084fc' },
        { icon: 'task-square', route: '#kanban', color: '#4ade80' },
        { icon: 'chart-square', route: '#finance', color: '#fbbf24' },
        { icon: 'heart', route: '#health', color: '#fb7185' },
        { icon: 'magic-star', route: '#routines', color: '#818cf8' },
        { icon: 'user-octagon', route: '#user-settings', color: '#2dd4bf' },
        { icon: 'setting-2', route: '#settings', color: '#94a3b8' }
    ];

    const dock = document.createElement('div');
    dock.id = 'global-dock-menu';
    dock.className = 'ploc-dock-container';
    dock.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 999998;
        pointer-events: none;
    `;

    dock.innerHTML = `
        <div class="ploc-dock-island" style="pointer-events: auto;">
            <div class="ploc-dock-grid">
                ${menuItems.map(item => `
                    <div class="dock-item-wrapper">
                        <div class="menu-btn" data-route="${item.route}" style="color: ${item.color}; border-color: ${item.color}22; background: ${item.color}08;">
                            <i class="icon-${item.icon}"></i>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    // Função para atualizar o estado ativo
    window.updateDockActive = () => {
        const hash = window.location.hash || '#landing';
        dock.querySelectorAll('.menu-btn').forEach(btn => {
            const route = btn.getAttribute('data-route');
            if (route === hash) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    };

    // Listeners de Navegação e Isolamento de Eventos
    dock.addEventListener('mousedown', (e) => e.stopPropagation());
    dock.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });

    dock.querySelectorAll('.menu-btn').forEach(btn => {
        btn.onclick = () => {
            const route = btn.getAttribute('data-route');
            if (route) {
                window.location.hash = route;
                window.updateDockActive();
            }
        };
    });

    window.updateDockActive(); // Chamada inicial
    return dock;
};
