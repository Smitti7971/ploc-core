import { apiClient } from '../api/client.js?v=0.1.3';

/**
 * Componente: PlocAvatar
 * O mascote interativo do sistema com estados de humor e inteligência visual.
 */
export const createPlocAvatar = (config = {}) => {
    let mode = 'sleeping'; // sleeping, active
    let isDragging = false;
    let offsetX, offsetY;
    let eyesElements = [];
    const isLanding = config.isLanding || false;

    const ploc = document.createElement('div');
    ploc.id = 'ploc-core';
    ploc.className = 'ploc-core';
    ploc.style.cssText = `
        position: relative; display: flex; align-items: center; justify-content: center;
        cursor: pointer; touch-action: none; opacity: 0.4;
    `;

    // Camada de Corpo (Slime) - Aqui fica o overflow:hidden
    const plocBody = document.createElement('div');
    plocBody.className = 'ploc-body';
    plocBody.style.cssText = `
        position: absolute; top: 0; left: 0; width: 100%; height: 100%;
        overflow: hidden; border-radius: 50% 50% 50% 50% / 70% 70% 40% 40%;
        background: radial-gradient(circle at 35% 35%, rgba(56, 189, 248, 0.75) 0%, rgba(14, 165, 233, 0.85) 60%, rgba(3, 105, 161, 0.95) 100%);
        border: 1px solid rgba(255, 255, 255, 0.2);
        z-index: 1;
    `;
    ploc.appendChild(plocBody);

    const effectsLayer = document.createElement('div');
    effectsLayer.className = 'ploc-effects';
    effectsLayer.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 100;';
    ploc.appendChild(effectsLayer);

    // Elemento para Balão de Fala
    const speechBubble = document.createElement('div');
    speechBubble.className = 'ploc-bubble';
    speechBubble.style.cssText = `
        position: absolute; bottom: 120%; left: 50%; 
        transform: translateX(-50%) translateY(10px); opacity: 0;
        background: rgba(15, 23, 42, 0.9); border: 1px solid var(--accent);
        padding: 0.8rem 1.5rem; border-radius: 20px; font-size: 0.8rem; font-weight: 700;
        white-space: pre-wrap; text-align: center; max-width: 250px; width: max-content;
        backdrop-filter: blur(10px); color: #fff; display: none;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 10000; pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    ploc.appendChild(speechBubble);

    // Campo de Entrada (Input de Chat)
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.id = 'ploc-chat-input';
    chatInput.name = 'ploc-chat-input';
    chatInput.className = 'ploc-chat-input';
    chatInput.placeholder = 'Diga algo...';
    chatInput.autocomplete = 'off';
    chatInput.spellcheck = false;
    chatInput.style.cssText = `
            position: absolute; top: 120%; left: calc(50% - 90px); 
            transform: translateY(-10px); opacity: 0; pointer-events: none;
            background: rgba(255,255,255,0.05); border: 1px solid var(--accent);
            padding: 0.8rem 1rem; border-radius: 15px; color: #fff; font-size: 0.8rem;
            outline: none; backdrop-filter: blur(20px); width: 180px;
            text-align: center; font-weight: 600; box-shadow: 0 10px 20px rgba(0,0,0,0.3);
            transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            z-index: 10001; display: none;
        `;
    ploc.appendChild(chatInput);

    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const text = chatInput.value.trim();
            chatInput.value = '';

            stopAllAudio();

            let fillerText;
            let fillerAudio;

            if (isPissedOff) {
                fillerText = "Fala logo...";
                const randomPoke = Math.floor(Math.random() * 25) + 1;
                fillerAudio = audioCache[`poke-${randomPoke}.mp3`];
            } else {
                const userName = (() => {
                    try {
                        const u = JSON.parse(localStorage.getItem('ploc_user') || '{}');
                        return u.username || u.name?.split(' ')[0] || 'amigo';
                    } catch (e) { return 'amigo'; }
                })();

                const fillersMap = {
                    'pensando.mp3': `Deixa eu analisar isso aqui, ${userName}...`,
                    'organizando.mp3': 'Faz sentido. Vamos organizar isso.',
                    'logica.mp3': 'Entendi a lógica. Veja bem...',
                    'processando.mp3': `Processando seu pedido, ${userName}...`,
                    'calculando.mp3': 'Ok, estou calculando as variáveis...'
                };
                const fillerFilesMap = Object.keys(fillersMap);
                const randomFillerName = fillerFilesMap[Math.floor(Math.random() * fillerFilesMap.length)];
                fillerText = fillersMap[randomFillerName];
                fillerAudio = audioCache[randomFillerName];
            }

            if (fillerAudio) {
                currentFillerAudio = fillerAudio;
                fillerAudio.currentTime = 0;
                fillerAudio.play().catch(() => { });
            }

            eyesElements.forEach(({ eye }) => eye.classList.add('ploc-thinking'));

            speechBubble.textContent = fillerText;
            speechBubble.style.display = 'block';
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateX(-50%) translateY(0)';

            document.dispatchEvent(new CustomEvent('ploc-message', {
                detail: { text: text, fillerText: fillerText, isPissedOff: isPissedOff }
            }));
        }
    };

    // Label de Acessibilidade
    const label = document.createElement('label');
    label.setAttribute('for', 'ploc-chat-input');
    label.innerText = 'Conversar com o Ploc';
    label.style.display = 'none';
    ploc.appendChild(label);

    const showInput = () => {
        if (!chatInput) return;
        chatInput.style.display = 'block';
        setTimeout(() => {
            chatInput.style.pointerEvents = 'all';
            chatInput.style.opacity = '1';
            chatInput.style.transform = 'translateY(0)';
            chatInput.focus({ preventScroll: true });
        }, 50);
    };

    // Injeção de Estilo Global para Animações
    const plocStyles = document.createElement('style');
    plocStyles.innerHTML = `
        @keyframes plocZMove {
            0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
            50% { opacity: 0.8; }
            100% { transform: translate(30px, -120px) scale(2); opacity: 0; }
        }
        @keyframes plocBlink {
            0%, 90%, 100% { transform: scaleY(1); }
            95% { transform: scaleY(0.1); }
        }
        @keyframes plocPulse {
            0% { box-shadow: 0 0 0px var(--accent); filter: brightness(1); }
            50% { box-shadow: 0 0 15px var(--accent); filter: brightness(1.5); }
            100% { box-shadow: 0 0 0px var(--accent); filter: brightness(1); }
        }
        .ploc-eye-blink { animation: plocBlink 4s infinite; }
        .ploc-thinking { animation: plocPulse 1s infinite; }
    `;
    document.head.appendChild(plocStyles);

    const eyesContainer = document.createElement('div');
    eyesContainer.className = 'flex-center';
    eyesContainer.style.gap = '10%'; // Gap proporcional ao tamanho do Ploc
    eyesContainer.style.width = '100%';
    eyesContainer.style.height = '100%';

    for (let i = 0; i < 2; i++) {
        const eye = document.createElement('div');
        eye.className = 'ploc-eye';
        eye.style.cssText = `
            width: 12%; height: 18%; background: #1b234aff;
            border-radius: 80% / 20%; transition: all 0.3s ease;
            transform-origin: center; position: relative;
        `;
        const pupil = document.createElement('div');
        pupil.className = 'ploc-pupil';
        pupil.style.cssText = `
            width: 30%; height: 30%; background: #000; 
            border-radius: 50%; position: absolute; top: 50%; left: 50%;
            transform: translate(-50%, -50%); opacity: 0;
        `;
        eye.appendChild(pupil);
        eyesElements.push({ eye, pupil });
        eyesContainer.appendChild(eye);
    }
    plocBody.appendChild(eyesContainer);

    // Língua para o estado Sleeping (Blep)
    const tongue = document.createElement('div');
    tongue.className = 'ploc-tongue';
    plocBody.appendChild(tongue);

    // Boca para modo sono
    const mouth = document.createElement('div');
    mouth.className = 'ploc-mouth';
    plocBody.appendChild(mouth);

    // --- SISTEMA DE ÁUDIO DE ELITE (Preload & Queue) ---
    const audioCache = {};
    const fillerFiles = ['pensando.mp3', 'organizando.mp3', 'logica.mp3', 'processando.mp3', 'calculando.mp3', 'me-chamou.mp3', 'acordou.mp3', 'sucesso.mp3', 'roi.mp3'];

    // Pré-carrega todos os áudios fixos para latência zero real
    fillerFiles.forEach(file => {
        const url = `${apiClient.baseURL.replace('/api', '')}/audio/fillers/${file}`;
        audioCache[file] = new Audio(url);
        audioCache[file].load(); // Força o download imediato
    });

    // Pré-carrega os 25 áudios de Pokes (Cutucadas de Raiva)
    for (let i = 1; i <= 25; i++) {
        const file = `poke-${i}.mp3`;
        const url = `${apiClient.baseURL.replace('/api', '')}/audio/pokes/${file}`;
        audioCache[file] = new Audio(url);
        audioCache[file].load();
    }

    // --- SISTEMA DE INTERRUPÇÃO (Freio de Mão Global) ---
    let currentMainAudio = null;
    let currentFillerAudio = null;

    const stopAllAudio = () => {
        if (currentMainAudio) {
            currentMainAudio.pause();
            currentMainAudio.currentTime = 0;
            currentMainAudio = null;
        }
        if (currentFillerAudio) {
            currentFillerAudio.pause();
            currentFillerAudio.currentTime = 0;
            currentFillerAudio = null;
        }
        if (window.typingInterval) clearInterval(window.typingInterval);
        if (window.speechTimeout) clearTimeout(window.speechTimeout);
        speechBubble.textContent = '';
        speechBubble.style.opacity = '0';
        speechBubble.style.display = 'none';
        eyesElements.forEach(({ eye }) => eye.classList.remove('ploc-thinking'));
    };

    // Lógica de Voz e Balão Dinâmico com Efeito Typing Sincronizado
    const speak = (text, isGreeting = false, skipFiller = false) => {
        if (isGreeting) stopAllAudio(); // Interrompe se o usuário clicar nele para acordar

        const startTyping = (delay = 2000, overrideText = null) => {
            const finalText = overrideText || text;
            setTimeout(() => {
                speechBubble.style.display = 'block';
                setTimeout(() => {
                    speechBubble.style.opacity = '1';
                    speechBubble.style.transform = 'translateX(-50%) translateY(0)';
                }, 10);

                let i = 0;
                window.typingInterval = setInterval(() => {
                    if (i < finalText.length) {
                        speechBubble.textContent += finalText.charAt(i);
                        i++;
                    } else {
                        clearInterval(window.typingInterval);
                    }
                }, 50);

                const duration = (finalText.length * 50) + 2500;
                window.speechTimeout = setTimeout(() => {
                    speechBubble.style.opacity = '0';
                    speechBubble.style.transform = 'translateX(-50%) translateY(10px)';
                    setTimeout(() => { speechBubble.style.display = 'none'; }, 300);
                }, duration);
            }, delay);
        };

        const playPremiumVoice = async () => {
            let fillerPromise = Promise.resolve();

            // MODO LATÊNCIA ZERO: Se a resposta chegou RÁPIDO DEMAIS, aguarde o filler inicial terminar de falar!
            if (skipFiller && currentFillerAudio && !currentFillerAudio.paused) {
                fillerPromise = new Promise(resolve => {
                    currentFillerAudio.addEventListener('ended', resolve, { once: true });
                    currentFillerAudio.addEventListener('pause', resolve, { once: true }); // Prevenção de loop
                });
            }

            if (isGreeting) {
                // Sistema de Saudações com Atitude (Randomizado)
                const greetings = [
                    { file: 'me-chamou.mp3', text: 'Me chamou?' },
                    { file: 'acordou.mp3', text: 'Espero que seja pra arrumar sua vida!' },
                    { file: 'sucesso.mp3', text: 'Tava sonhando com seu sucesso. Vamos?' },
                    { file: 'roi.mp3', text: 'Dormir não dá ROI. O que manda?' }
                ];
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                const greetingAudio = audioCache[randomGreeting.file];

                if (greetingAudio) {
                    currentFillerAudio = greetingAudio;
                    greetingAudio.currentTime = 0;
                    greetingAudio.play().catch(() => { });
                }

                startTyping(0, randomGreeting.text);
                return;
            }

            if (!isGreeting && !skipFiller) {
                // Fallback (não deve ser chamado por causa do skipFiller, mas mantido por segurança)
                const fillers = ['pensando.mp3', 'organizando.mp3', 'logica.mp3', 'processando.mp3', 'calculando.mp3'];
                const randomFillerName = fillers[Math.floor(Math.random() * fillers.length)];
                const fillerAudio = audioCache[randomFillerName];

                if (fillerAudio) {
                    currentFillerAudio = fillerAudio;
                    fillerAudio.currentTime = 0;
                    fillerPromise = new Promise(resolve => {
                        fillerAudio.onended = resolve;
                        fillerAudio.play().catch(resolve);
                    });
                }
                eyesElements.forEach(({ eye }) => eye.classList.add('ploc-thinking'));
            }

            try {
                const token = localStorage.getItem('ploc_token');
                const audioUrl = `${apiClient.baseURL}/ai/tts?text=${encodeURIComponent(text)}&token=${token}`;
                const mainAudio = new Audio(audioUrl);
                currentMainAudio = mainAudio;

                // Espera o Filler terminar ANTES de começar a falar a resposta real
                await fillerPromise;

                mainAudio.onplay = () => {
                    startTyping(500); // Texto começa quase junto com a voz real após o filler
                };

                mainAudio.onended = () => {
                    eyesElements.forEach(({ eye }) => eye.classList.remove('ploc-thinking'));
                };

                mainAudio.play();
            } catch (error) {
                console.warn('❌ Erro na voz premium:', error);
                eyesElements.forEach(({ eye }) => eye.classList.remove('ploc-thinking'));
                startTyping(0);
            }
        };

        playPremiumVoice();
    };

    // Gerador de Partículas Zzz (Frequência Aumentada e Tamanho Maior)
    let zInterval;
    const startZzz = () => {
        zInterval = setInterval(() => {
            const z = document.createElement('span');
            z.innerText = 'Z';
            z.style.cssText = `
                position: absolute; right: 5px; top: 5px;
                color: rgba(56, 189, 248, 0.6); font-weight: 800;
                font-size: ${Math.random() * 15 + 15}px;
                animation: plocZMove 3s ease-out forwards;
                pointer-events: none;
            `;
            effectsLayer.appendChild(z);
            setTimeout(() => z.remove(), 3000);
        }, 600);
    };

    // Atualização de Modo
    const updateMode = (newMode) => {
        mode = newMode;
        clearInterval(zInterval);
        effectsLayer.innerHTML = '';

        if (mode === 'sleeping') {
            ploc.style.opacity = '0.4';
            ploc.style.filter = 'brightness(0.5)';
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '4%'; // Proporcional
                eye.style.borderRadius = '10px';
                eye.classList.remove('ploc-eye-blink');
            });
            startZzz();
        } else {
            ploc.style.opacity = '0.8';
            ploc.style.filter = 'brightness(1)';
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '22%';
                eye.style.borderRadius = '50% / 30%';
                eye.classList.add('ploc-eye-blink');
            });
        }
    };
    let isPissedOff = false;

    // --- SISTEMA DE MINIJOGO: RAIVA ACUMULATIVA ---
    let angerLevel = parseInt(localStorage.getItem('ploc_anger_level') || '1');
    let angerClicks = parseInt(localStorage.getItem('ploc_anger_clicks') || '0');

    // Fórmula de dificuldade: Nível 1 = 15 cliques | Nível 10 = 15.000 cliques
    const getClicksNeeded = (lvl) => Math.floor(Math.pow(lvl, 3) * 15);
    let clicksNeeded = getClicksNeeded(angerLevel);

    const updateStressingVisuals = () => {
        const progress = angerClicks / clicksNeeded;
        if (progress > 0.5) { // Aumentado de 0.1 para 0.5 (Mais paciência)
            ploc.classList.add('ploc-stressing');
            // Aumenta a velocidade da vibração (de 0.2s para 0.02s)
            const speed = 0.2 - (progress * 0.18);
            ploc.style.setProperty('--stress-speed', `${speed}s`);

            // Vai ficando vermelho (do azul #38bdf8 para o vermelho #ef4444)
            const red = Math.floor(56 + (progress * 183));
            const green = Math.floor(189 - (progress * 121));
            const blue = Math.floor(248 - (progress * 180));

            ploc.style.setProperty('--stress-color-1', `rgba(${red}, ${green}, ${blue}, 0.85)`);
            ploc.style.setProperty('--stress-color-2', `rgba(${red - 20}, ${green - 20}, ${blue - 20}, 0.95)`);
            ploc.style.setProperty('--stress-color-3', `rgba(${red - 40}, ${green - 40}, ${blue - 40}, 1)`);
            ploc.style.setProperty('--stress-border', `rgba(255, 255, 255, ${0.4 + progress * 0.6})`);
        } else {
            ploc.classList.remove('ploc-stressing');
            ploc.style.cssText = `display: flex; align-items: center; justify-content: center; cursor: pointer; touch-action: none;`;
        }
    };

    const explodePloc = () => {
        isPissedOff = true;
        ploc.classList.add('ploc-pissed');
        ploc.classList.remove('ploc-stressing');

        // Sobe de nível (máximo 10) e reseta cliques
        if (angerLevel < 10) angerLevel++;
        angerClicks = 0;
        localStorage.setItem('ploc_anger_level', angerLevel.toString());
        localStorage.setItem('ploc_anger_clicks', '0');
        clicksNeeded = getClicksNeeded(angerLevel);

        stopAllAudio();
        const randomPoke = Math.floor(Math.random() * 25) + 1;
        const pokeAudio = audioCache[`poke-${randomPoke}.mp3`];
        if (pokeAudio) {
            currentFillerAudio = pokeAudio;
            pokeAudio.currentTime = 0;
            pokeAudio.play().catch(() => { });

            speechBubble.textContent = "AGORA VOCÊ ME IRRITOU!";
            speechBubble.style.display = 'block';
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateX(-50%) translateY(0) scale(1.2)';

            setTimeout(() => {
                isPissedOff = false;
                ploc.classList.remove('ploc-pissed');
                speechBubble.style.opacity = '0';
                updateStressingVisuals();
                setTimeout(() => { speechBubble.style.display = 'none'; }, 300);
            }, 5000);
        }
    };

    ploc.onclick = (e) => {
        if (isDragging) return;
        e.stopPropagation();

        // Incrementa cliques do minijogo
        angerClicks++;
        localStorage.setItem('ploc_anger_clicks', angerClicks.toString());

        if (angerClicks >= clicksNeeded) {
            explodePloc();
            return;
        }

        updateStressingVisuals();

        if (mode !== 'active') {
            updateMode('happy');
            setTimeout(() => {
                if (mode === 'happy') updateMode('active');
            }, 800);
            showInput();
        }
    };

    // Lógica para clicar fora: Volta a dormir e esconde o chat
    document.addEventListener('click', (e) => {
        if (!ploc.contains(e.target)) {
            stopAllAudio(); // Corta o áudio quando clica fora e dorme
            updateMode('sleeping');
            if (chatInput) {
                chatInput.style.opacity = '0';
                chatInput.style.pointerEvents = 'none';
                chatInput.style.transform = 'translateY(-10px)';
                setTimeout(() => { chatInput.style.display = 'none'; }, 300);
            }
            if (speechBubble) {
                speechBubble.style.opacity = '0';
                speechBubble.style.transform = 'translateX(-50%) translateY(10px)';
                setTimeout(() => { speechBubble.style.display = 'none'; }, 300);
            }
        }
    });

    window.plocControls = { speak, updateMode, showInput };
    updateMode('sleeping');
    updateStressingVisuals(); // Inicializa o visual baseado no progresso salvo
    return ploc;
};
