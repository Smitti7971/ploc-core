import { router } from './router.js?v=0.1.3';
import { createPlocAvatar } from '../shared/components/PlocAvatar.js?v=0.1.3';
import { initChatLogic } from '../features/chat/ChatWidget.js?v=0.1.3';

// Gerenciamento do Mascote Único (Singleton)
let plocInstance = null;
let isDragging = false;
let startX, startY, initialX, initialY;

const handleDragStart = (e) => {
    const mount = document.getElementById('ploc-singleton-mount');
    if (!mount || !mount.classList.contains('state-internal')) return;
    isDragging = true;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = mount.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    mount.style.transition = 'none';
};

const handleDragMove = (e) => {
    if (!isDragging) return;
    const mount = document.getElementById('ploc-singleton-mount');
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    
    let newX = initialX + dx;
    let newY = initialY + dy;
    
    // Limites da Viewport
    const padding = 10;
    newX = Math.max(padding, Math.min(newX, window.innerWidth - mount.offsetWidth - padding));
    newY = Math.max(padding, Math.min(newY, window.innerHeight - mount.offsetHeight - padding));
    
    mount.style.left = `${newX}px`;
    mount.style.top = `${newY}px`;
    mount.style.bottom = 'auto';
    mount.style.right = 'auto';
    mount.style.transform = 'none';
};

const handleDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    const mount = document.getElementById('ploc-singleton-mount');
    mount.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
};

window.updatePlocUI = (state) => {
    const mount = document.getElementById('ploc-singleton-mount');
    const pageMount = document.querySelector('#ploc-mount');
    
    if (!mount) return;

    if (!plocInstance) {
        plocInstance = createPlocAvatar();
        initChatLogic();

        // Eventos de Arrastar
        plocInstance.addEventListener('mousedown', handleDragStart);
        plocInstance.addEventListener('touchstart', handleDragStart, { passive: false });
        window.addEventListener('mousemove', handleDragMove);
        window.addEventListener('touchmove', handleDragMove, { passive: false });
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
    }

    // Reset de estilos do mount global
    mount.style.cssText = '';
    mount.style.transition = 'none';

    // Determina o estado visual
    let targetState = 'internal';
    const cleanHash = state.replace('#', '');
    
    if (cleanHash === 'landing' || cleanHash === '') {
        targetState = 'landing';
    } else if (cleanHash === 'settings' || cleanHash === 'user-settings') {
        targetState = 'hidden';
    }

    mount.className = `state-${targetState}`;

    // Lógica de Movimentação do Singleton (Mount-Based)
    if (targetState === 'landing' && pageMount) {
        // Na Landing Page, movemos o Ploc para o mount point local da página
        if (plocInstance.parentElement !== pageMount) {
            pageMount.appendChild(plocInstance);
        }
    } else {
        // Em outras páginas (ou modo oculto), ele volta para o container global
        if (plocInstance.parentElement !== mount) {
            mount.appendChild(plocInstance);
        }
    }

    console.log(`[PlocSingleton] Rota: ${cleanHash} -> Estado: ${targetState} -> Mount: ${plocInstance.parentElement.id}`);
};

// O Router agora gerencia o ciclo de vida do Ploc via listeners de load e hashchange
router();
