import { apiClient } from '../api/client.js?v=0.0.9';

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
    
    if (isLanding) {
        ploc.style.cssText = `
            position: relative; margin: 0 auto;
            width: 80px; height: 80px;
            display: flex; align-items: center; justify-content: center;
            transform: scale(1.2); z-index: 100;
        `;
    } else {
        ploc.style.cssText = `
            position: fixed; bottom: 2rem; right: 2rem; cursor: grab;
            width: 80px; height: 80px;
            display: flex; align-items: center; justify-content: center;
            transform: scale(0.7); z-index: 9999; transition: transform 0.1s ease, opacity 0.5s ease;
            touch-action: none; border-radius: 50%;
        `;

        ploc.onpointerdown = (e) => {
            isDragging = true;
            const rect = ploc.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            ploc.style.cursor = 'grabbing';
            ploc.style.transition = 'none'; // Fluidez total no drag
            ploc.setPointerCapture(e.pointerId);
        };

        ploc.onpointermove = (e) => {
            if (!isDragging) return;
            
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            // Limites do Viewport (evita sair da tela)
            const margin = 20;
            const rect = ploc.getBoundingClientRect();
            x = Math.max(margin, Math.min(x, window.innerWidth - rect.width - margin));
            y = Math.max(margin, Math.min(y, window.innerHeight - rect.height - margin));

            ploc.style.left = x + 'px';
            ploc.style.top = y + 'px';
            ploc.style.bottom = 'auto';
            ploc.style.right = 'auto';
        };

        ploc.onpointerup = (e) => {
            isDragging = false;
            ploc.style.cursor = 'grab';
            ploc.style.transition = 'transform 0.3s ease';
            ploc.releasePointerCapture(e.pointerId);
        };
    }

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

    // Campo de Entrada (Input de Chat) - Agora com blindagem total
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
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

    const showInput = () => {
        chatInput.style.display = 'block';
        setTimeout(() => {
            chatInput.style.pointerEvents = 'all';
            chatInput.style.opacity = '1';
            chatInput.style.transform = 'translateY(0)';
            chatInput.focus({ preventScroll: true });
        }, 50);
    };

    chatInput.onkeypress = (e) => {
        if (e.key === 'Enter' && chatInput.value.trim()) {
            const text = chatInput.value.trim();
            chatInput.value = '';
            
            stopAllAudio(); // Corta a fala atual IMEDIATAMENTE (Interrupção por novo input)
            
            let fillerText;
            let fillerAudio;

            if (isPissedOff) {
                fillerText = "Fala logo...";
                const randomPoke = Math.floor(Math.random() * 25) + 1;
                fillerAudio = audioCache[`poke-${randomPoke}.mp3`];
            } else {
                // MODO SENTINELA + ZERO LATÊNCIA REAL
                const fillersMap = {
                    'pensando.mp3': 'Deixa eu analisar isso aqui...',
                    'organizando.mp3': 'Faz sentido. Vamos organizar isso.',
                    'logica.mp3': 'Entendi a lógica. Veja bem...',
                    'processando.mp3': 'Processando seu pedido, Mestre...',
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
                fillerAudio.play().catch(() => {});
            }
            
            eyesElements.forEach(({ eye }) => eye.classList.add('ploc-thinking'));
            
            // Exibe o balão com o filler IMEDIATAMENTE
            speechBubble.textContent = fillerText;
            speechBubble.style.display = 'block';
            speechBubble.style.opacity = '1';
            speechBubble.style.transform = 'translateX(-50%) translateY(0)';

            document.dispatchEvent(new CustomEvent('ploc-message', { 
                detail: { text: text, fillerText: fillerText, isPissedOff: isPissedOff } 
            }));
        }
    };

    // Olhos e Camadas permanecem similares, mas com escala ajustada
    const effectsLayer = document.createElement('div');
    effectsLayer.className = 'ploc-effects';
    ploc.appendChild(effectsLayer);

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
    eyesContainer.style.gap = '14px';

    for (let i = 0; i < 2; i++) {
        const eye = document.createElement('div');
        eye.className = 'ploc-eye';
        eye.style.cssText = `
            width: 14px; height: 22px; background: var(--accent); 
            border-radius: 10px; transition: all 0.3s ease;
            transform-origin: center; position: relative;
        `;
        const pupil = document.createElement('div');
        pupil.className = 'ploc-pupil';
        eye.appendChild(pupil);
        eyesElements.push({ eye, pupil });
        eyesContainer.appendChild(eye);
    }
    ploc.appendChild(eyesContainer);

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
                    greetingAudio.play().catch(() => {});
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
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '4px';
                eye.style.borderRadius = '10px';
                eye.classList.remove('ploc-eye-blink');
            });
            startZzz();
        } else {
            ploc.style.opacity = '1';
            eyesElements.forEach(({ eye }) => {
                eye.style.height = '22px';
                eye.style.borderRadius = '10px';
                eye.classList.add('ploc-eye-blink');
            });
        }
    };

    let clickCount = 0;
    let clickTimer = null;
    let isPissedOff = false;
    let pissedOffTimeout = null;

    ploc.onclick = (e) => {
        if (isDragging) return; 
        e.stopPropagation();
        
        clickCount++;
        clearTimeout(clickTimer);
        
        if (clickCount >= 3) {
            // Cutucou demais: Ativa modo de raiva por 30 segundos
            isPissedOff = true;
            ploc.classList.add('ploc-pissed');
            
            clearTimeout(pissedOffTimeout);
            pissedOffTimeout = setTimeout(() => { 
                isPissedOff = false; 
                clickCount = 0; 
                ploc.classList.remove('ploc-pissed');
            }, 8000); 
            
            stopAllAudio();
            const randomPoke = Math.floor(Math.random() * 25) + 1;
            const pokeAudio = audioCache[`poke-${randomPoke}.mp3`];
            if (pokeAudio) {
                currentFillerAudio = pokeAudio;
                pokeAudio.currentTime = 0;
                pokeAudio.play().catch(()=>{});
                
                // Exibe no balão
                speechBubble.textContent = "Não cutuca!";
                speechBubble.style.display = 'block';
                speechBubble.style.opacity = '1';
                speechBubble.style.transform = 'translateX(-50%) translateY(0)';
                setTimeout(() => {
                    speechBubble.style.opacity = '0';
                    setTimeout(() => { speechBubble.style.display = 'none'; }, 300);
                }, 2000);
            }
            
            if (mode !== 'active') {
                updateMode('active');
                showInput();
            }
            return;
        }

        clickTimer = setTimeout(() => { clickCount = 0; }, 1500); // Janela de clique duplo/triplo

        if (mode !== 'active') {
            updateMode('active');
            speak("Me chamou?", true); // Saudação instantânea via cache
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
    return ploc;
};
