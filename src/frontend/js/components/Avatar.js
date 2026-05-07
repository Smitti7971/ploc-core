/**
 * Componente: Avatar (O Cérebro Visual do Ploc)
 */

export const Avatar = {
    states: {
        SLEEPING: 'sleeping',
        WORKING: 'working',
        LISTENING: 'listening'
    },

    /**
     * Inicializa o Avatar no elemento pai
     * @param {string} containerId - ID do elemento onde o avatar será inserido
     */
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <div class="avatar-container">
                <div id="ploc-circle" class="avatar-circle sleeping"></div>
            </div>
        `;
    },

    /**
     * Altera o estado visual do Ploc
     * @param {string} state - Um dos valores de Avatar.states
     */
    setState(state) {
        const circle = document.getElementById('ploc-circle');
        if (!circle) return;

        // Remove todas as classes de estado
        circle.classList.remove(...Object.values(this.states));
        
        // Adiciona a nova classe
        circle.classList.add(state);
        
        console.log(`🤖 PLOC mudou de estado para: ${state}`);
    }
};
