/**
 * Sistema de Notificações Premium do Ploc
 */
export const ui = {
    showToast(message, type = 'success', duration = 3000) {
        // Criar container se não existir
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Criar o Toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? '✅' : '❌';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;

        container.appendChild(toast);

        // Remover após a duração
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.4s ease';
            setTimeout(() => toast.remove(), 400);
        }, duration);
    },
    
    setLoading(btnSelector, isLoading, text = 'Processando...') {
        const btn = document.querySelector(btnSelector);
        if (!btn) return;
        
        if (isLoading) {
            btn.dataset.oldText = btn.innerText;
            btn.disabled = true;
            btn.innerText = text;
        } else {
            btn.disabled = false;
            btn.innerText = btn.dataset.oldText || 'Confirmar';
        }
    }
};
