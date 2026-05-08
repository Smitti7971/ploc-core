/**
 * Componente: Landing Page
 */
export const renderLanding = () => {
    const container = document.createElement('div');
    Object.assign(container.style, {
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        animation: 'fadeIn 0.5s ease-out'
    });

    // Header
    const header = document.createElement('header');
    Object.assign(header.style, {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 5%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #f1f5f9',
        position: 'sticky',
        top: '0',
        zIndex: '10'
    });
    
    header.innerHTML = `
        <div style="font-weight: 900; font-size: 1.5rem; letter-spacing: -1px; color: #000; cursor: pointer;" onclick="window.location.hash='#landing'">PLOC</div>
        <div style="display: flex; gap: 0.8rem; align-items: center;">
            <button id="btn-login-header" style="background: none; border: none; font-weight: 600; cursor: pointer; padding: 0.5rem 1rem; color: #475569;">Entrar</button>
            <button id="btn-register-header" style="background: #000; color: #fff; border: none; padding: 0.7rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">Começar</button>
        </div>
    `;

    // Hero Section
    const hero = document.createElement('main');
    Object.assign(hero.style, {
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'radial-gradient(circle at top right, #f8fafc, #ffffff)'
    });

    hero.innerHTML = `
        <div style="display: inline-block; padding: 0.5rem 1rem; background: #f1f5f9; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: #475569; margin-bottom: 2rem; letter-spacing: 1px;">VERSÃO SPA v1.0</div>
        <h1 style="font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 900; margin: 0 0 1.5rem 0; letter-spacing: -2px; line-height: 1.1; color: #0f172a;">
            Sua rotina,<br><span style="color: #64748b;">sem esforço.</span>
        </h1>
        <p style="color: #64748b; font-size: 1.2rem; max-width: 500px; line-height: 1.6; margin-bottom: 3rem;">
            O Ploc ajuda você a dominar seus hábitos, finanças e trabalho com uma interface minimalista e poderosa.
        </p>
        
        <!-- Círculo Interativo (Logo/Icon) -->
        <div id="main-circle" style="width: 120px; height: 120px; background: #fff; border-radius: 50%; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.15); display: flex; justify-content: center; align-items: center; margin-bottom: 4rem; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);">
            <div style="width: 24px; height: 24px; background: #000; border-radius: 6px; transform: rotate(45deg);"></div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #94a3b8;">
                <span style="display: block; width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></span>
                Mobile First
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: #94a3b8;">
                <span style="display: block; width: 6px; height: 6px; background: #22c55e; border-radius: 50%;"></span>
                Offline Ready
            </div>
        </div>
    `;

    // Event Listeners
    setTimeout(() => {
        const btnLogin = container.querySelector('#btn-login-header');
        const btnRegister = container.querySelector('#btn-register-header');
        const circle = container.querySelector('#main-circle');

        if (btnLogin) btnLogin.onclick = () => window.location.hash = '#login';
        if (btnRegister) btnRegister.onclick = () => window.location.hash = '#register';
        
        if (circle) {
            circle.onclick = () => {
                circle.style.transform = 'scale(0.9) rotate(90deg)';
                setTimeout(() => circle.style.transform = '', 300);
            };
        }
    }, 0);

    container.appendChild(header);
    container.appendChild(hero);

    return container;
};
