/**
 * Componente: PlocAvatar
 * O mascote interativo do sistema com estados de humor e inteligência visual.
 */
export const createPlocAvatar = (containerId) => {
    let mode = 'sleeping'; // sleeping, working, active
    let eyesElements = [];
    
    const ploc = document.createElement('div');
    ploc.id = 'ploc-avatar-container';
    Object.assign(ploc.style, {
        position: 'relative',
        width: '120px',
        height: '120px',
        background: 'linear-gradient(145deg, #f1f5f9, #cbd5e1)',
        borderRadius: '50%',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.8)',
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid rgba(255,255,255,0.3)',
        zIndex: '10'
    });

    // Elemento para as letras Zzz e a pasta
    const effectsLayer = document.createElement('div');
    effectsLayer.id = 'ploc-effects';
    Object.assign(effectsLayer.style, {
        position: 'absolute',
        top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: '11'
    });
    ploc.appendChild(effectsLayer);

    // Olhos
    const eyesContainer = document.createElement('div');
    Object.assign(eyesContainer.style, {
        display: 'flex',
        gap: '14px',
        transition: 'all 0.3s ease'
    });

    for (let i = 0; i < 2; i++) {
        const eye = document.createElement('div');
        eye.className = 'ploc-eye';
        Object.assign(eye.style, {
            width: '8px',
            height: '20px',
            background: '#1e293b',
            borderRadius: '10px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        });
        
        const pupil = document.createElement('div');
        pupil.className = 'ploc-pupil';
        Object.assign(pupil.style, {
            width: '4px',
            height: '4px',
            background: '#38bdf8',
            borderRadius: '50%',
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        eye.appendChild(pupil);
        eyesElements.push({ eye, pupil });
        eyesContainer.appendChild(eye);
    }
    ploc.appendChild(eyesContainer);

    // Lógica de Voz
    const speak = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel(); // Para falas anteriores
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 1.1;
        utterance.pitch = 1.2;
        window.speechSynthesis.speak(utterance);
    };

    // Gerador de Partículas Zzz
    let zInterval;
    const startZzz = () => {
        zInterval = setInterval(() => {
            const z = document.createElement('span');
            z.innerText = 'Z';
            z.style.position = 'absolute';
            z.style.right = '-10px';
            z.style.top = '20px';
            z.style.color = 'rgba(56, 189, 248, 0.6)';
            z.style.fontSize = Math.random() * 10 + 10 + 'px';
            z.style.fontWeight = 'bold';
            z.style.animation = `plocZMove 3s linear forwards`;
            effectsLayer.appendChild(z);
            setTimeout(() => z.remove(), 3000);
        }, 1000);
    };

    // Estilos de Animação
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes plocZMove {
            0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translate(40px, -60px) scale(1.5) rotate(20deg); opacity: 0; }
        }
        @keyframes plocWorkMove {
            0%, 100% { transform: translateX(-10px); }
            50% { transform: translateX(10px); }
        }
        @keyframes plocBreath {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        .ploc-working-folder {
            position: absolute;
            left: -30px;
            top: 40px;
            font-size: 24px;
            animation: plocWorkMove 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);

    // Função para mudar de modo
    const updateMode = (newMode) => {
        mode = newMode;
        clearInterval(zInterval);
        effectsLayer.innerHTML = '';
        ploc.style.animation = '';
        
        eyesElements.forEach(({ eye, pupil }) => {
            eye.style.height = '20px';
            eye.style.width = '8px';
            pupil.style.opacity = '0';
        });

        if (mode === 'sleeping') {
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '4px';
                eye.style.borderRadius = '2px';
            });
            ploc.style.animation = 'plocBreath 4s ease-in-out infinite';
            startZzz();
        } 
        else if (mode === 'working') {
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '12px';
            });
            const folder = document.createElement('span');
            folder.className = 'ploc-working-folder material-symbols-rounded';
            folder.innerText = 'folder_open';
            folder.style.color = '#38bdf8';
            effectsLayer.appendChild(folder);
            ploc.style.animation = 'plocWorkMove 3s ease-in-out infinite';
            speak("Vou começar a trabalhar aqui, se quiser falar comigo me cucuta");
        } 
        else if (mode === 'active') {
            eyesElements.forEach(({ eye, pupil }) => {
                eye.style.height = '20px';
                eye.style.width = '20px';
                eye.style.borderRadius = '50%';
                eye.style.background = '#fff';
                eye.style.border = '2px solid #1e293b';
                pupil.style.opacity = '1';
                pupil.style.width = '8px';
                pupil.style.height = '8px';
                pupil.style.background = '#000';
            });
            speak("Bom dia, me chamou?");
        }
    };

    // Lógica de Seguir o Mouse
    document.addEventListener('mousemove', (e) => {
        if (mode !== 'active') return;
        
        const rect = ploc.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        eyesElements.forEach(({ pupil }) => {
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
            const dist = 4;
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            pupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    });

    // Clique para Ciclo de Modos
    ploc.onclick = (e) => {
        e.stopPropagation();
        if (mode === 'sleeping') updateMode('working');
        else if (mode === 'working') updateMode('active');
        else updateMode('sleeping');
    };

    // Inicializa
    updateMode('sleeping');

    return ploc;
};
