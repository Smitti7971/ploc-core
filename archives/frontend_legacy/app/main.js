import { router } from './router.js?v=0.1.3';
import { createPlocAvatar } from '../shared/components/PlocAvatar.js?v=0.1.3';
import { createDockMenu } from '../shared/components/DockMenu.js?v=0.1.3';
import { initChatLogic } from '../features/chat/ChatWidget.js?v=0.1.3';

// Gerenciamento do Mascote Único (Singleton)
let plocInstance = null;
let dockInstance = null;
let isDragging = false;
let startX, startY, initialX, initialY;
let targetX = 0, targetY = 0;
let currentX = 0, currentY = 0;
let animationFrameId = null;
const LERP_FACTOR = 0.15;

const updatePosition = () => {
    if (!isDragging && Math.abs(targetX - currentX) < 0.1 && Math.abs(targetY - currentY) < 0.1) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
        return;
    }

    const mount = document.getElementById('ploc-singleton-mount');
    if (!mount) return;

    const dx = targetX - currentX;
    const dy = targetY - currentY;

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        currentX += dx * LERP_FACTOR;
        currentY += dy * LERP_FACTOR;
    } else {
        currentX = targetX;
        currentY = targetY;
    }

    mount.style.left = `${currentX}px`;
    mount.style.top = `${currentY}px`;
    mount.style.bottom = 'auto';
    mount.style.right = 'auto';
    mount.style.transform = 'none';

    animationFrameId = requestAnimationFrame(updatePosition);
};

const handleDragStart = (e) => {
    const mount = document.getElementById('ploc-singleton-mount');
    if (!mount) return;
    
    // Impede que o clique/toque "vaze" para o menu ou scroll do fundo
    e.stopPropagation();
    
    isDragging = true;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    
    startX = touch.clientX;
    startY = touch.clientY;
    
    const rect = mount.getBoundingClientRect();
    initialX = rect.left;
    initialY = rect.top;
    
    currentX = initialX;
    currentY = initialY;
    targetX = initialX;
    targetY = initialY;

    mount.style.transition = 'none';
    mount.style.zIndex = '2000000'; // Sobe para o topo absoluto durante o arraste
    
    if (plocInstance) {
        plocInstance.style.animation = 'none';
        plocInstance.style.transition = 'all 0.3s ease-out';
    }
    if (!animationFrameId) animationFrameId = requestAnimationFrame(updatePosition);
};

let lastX, lastY;

const handleDragMove = (e) => {
    if (!isDragging) return;
    const mount = document.getElementById('ploc-singleton-mount');
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    
    let tx = initialX + dx;
    let ty = initialY + dy;
    
    const padding = 10;
    targetX = Math.max(padding, Math.min(tx, window.innerWidth - mount.offsetWidth - padding));
    targetY = Math.max(padding, Math.min(ty, window.innerHeight - mount.offsetHeight - padding));

    if (plocInstance) {
        plocInstance.style.animation = 'none';
        plocInstance.style.transition = 'none';
    }
};

const handleDragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    
    const mount = document.getElementById('ploc-singleton-mount');
    if (mount) mount.style.zIndex = '999999'; // Acima do menu (999998)

    if (plocInstance) {
        setTimeout(() => {
            if (!isDragging) {
                plocInstance.style.animation = 'plocFloating 3s ease-in-out infinite';
            }
        }, 500);
    }
};

window.updatePlocUI = (state) => {
    const mount = document.getElementById('ploc-singleton-mount');
    
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
        mount.appendChild(plocInstance);
    }

    if (!dockInstance) {
        dockInstance = createDockMenu();
        document.body.appendChild(dockInstance);
    }

    // Reset de estilos do mount global para cada troca de rota
    mount.style.left = '';
    mount.style.top = '';
    mount.style.right = '';
    mount.style.bottom = '';
    mount.style.transform = '';

    // Determina o estado visual
    let targetState = 'internal';
    const cleanHash = state.replace('#', '');
    
    if (cleanHash === 'landing' || cleanHash === '') {
        targetState = 'landing';
    } else if (cleanHash === 'settings' || cleanHash === 'user-settings') {
        targetState = 'hidden';
    }

    mount.className = `state-${targetState}`;

    // Sincroniza o menu de status e o dock com a visibilidade
    const statusMenu = document.querySelector('.ploc-status-container');
    if (statusMenu) statusMenu.style.display = targetState === 'hidden' ? 'none' : 'flex';
    if (dockInstance) dockInstance.style.display = targetState === 'hidden' ? 'none' : 'block';

    // Sincroniza o brilho do menu ativo
    if (window.updateDockActive) window.updateDockActive();
};

// O Router agora gerencia o ciclo de vida do Ploc via listeners de load e hashchange
router();
