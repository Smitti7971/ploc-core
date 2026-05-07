/**
 * Componente: ModalManager
 * Responsável por criar e gerenciar janelas flutuantes com Blur.
 */

export const Modal = {
    /**
     * Abre um modal com o conteúdo fornecido
     * @param {string} htmlContent - O HTML que vai dentro do modal
     * @param {boolean} showCloseButton - Se deve mostrar o 'X' para fechar
     */
    open(htmlContent, showCloseButton = true) {
        // 1. Remove modal anterior se existir
        this.close();

        // 2. Cria a estrutura do Overlay
        const overlay = document.createElement('div');
        overlay.id = 'ploc-modal';
        overlay.className = 'modal-overlay';

        // 3. Cria o conteúdo
        overlay.innerHTML = `
            <div class="modal-content">
                ${showCloseButton ? '<button class="modal-close" id="modalClose">&times;</button>' : ''}
                <div id="modalBody">
                    ${htmlContent}
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // 4. Ativa as animações (pequeno delay para o navegador processar)
        setTimeout(() => overlay.classList.add('active'), 10);

        // 5. Configura o fechamento
        if (showCloseButton) {
            document.getElementById('modalClose').addEventListener('click', () => this.close());
        }

        // Fecha ao clicar fora do conteúdo
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) this.close();
        });
    },

    /**
     * Fecha o modal ativo
     */
    close() {
        const overlay = document.getElementById('ploc-modal');
        if (overlay) {
            overlay.classList.remove('active');
            // Espera a animação de saída terminar para remover do DOM
            setTimeout(() => overlay.remove(), 300);
        }
    }
};
