import { apiClient } from '../../shared/api/client.js?v=0.1.3';

export const UserSettingsPage = {
    render: async () => {
        const container = document.createElement('div');
        container.id = 'user-settings-page-root';
        container.style.cssText = `
            min-height: 100vh; background: radial-gradient(circle at top right, #1e293b 0%, #020617 100%); color: #fff;
            display: flex; flex-direction: column; align-items: center;
            padding: 1.5rem; font-family: 'Inter', sans-serif;
            animation: fadeIn 0.4s ease;
            position: relative;
        `;

        // Recupera dados do usuário com blindagem
        let user = {};
        try {
            const storedUser = localStorage.getItem('ploc_user');
            if (storedUser && storedUser !== 'undefined') {
                user = JSON.parse(storedUser);
                // Formata birthDate para o input display (DD / MM / AAAA)
                if (user.birthDate) {
                    const [year, month, day] = user.birthDate.split('T')[0].split('-');
                    user.birthDateDisplay = `${day} / ${month} / ${year}`;
                    user.birthDate = `${year}-${month}-${day}`;
                }
            }
        } catch (e) {
            user = {};
        }

        // Settings List (Formatado como Coluna Premium)
        container.innerHTML = `
            <div style="width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 3rem;">
                
                <!-- FILHA 1: IDENTIDADE (LARGA) -->
                <div id="section-identity-user">
                    <header style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; padding: 0 1rem;">
                        <div id="btn-back-user" style="width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; cursor: pointer;">
                            <span class="material-symbols-rounded">arrow_back</span>
                        </div>
                        <h1 style="font-size: 0.8rem; font-weight: 900; letter-spacing: 3px; margin: 0; color: #38bdf8;">DADOS DO PERFIL</h1>
                        <div style="width: 40px;"></div>
                    </header>

                    <div style="text-align: center; width: 100%;">
                        <div id="avatar-container-user" style="position: relative; width: 110px; height: 110px; margin: 0 auto 1.2rem auto;">
                            <div id="avatar-content-user" style="width: 110px; height: 110px; border-radius: 50%; border: 3px solid #38bdf8; box-shadow: 0 10px 25px rgba(0,0,0,0.3); overflow: hidden; display: flex; align-items: center; justify-content: center; background: ${user.profilePhoto ? 'transparent' : 'linear-gradient(135deg, #38bdf8, #1d4ed8)'};">
                                ${user.profilePhoto
                ? `<img id="avatar-preview-img" src="${user.profilePhoto}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<span id="avatar-initials-user" style="font-size: 2.5rem; font-weight: 800; color: #fff; letter-spacing: 2px;">
                                        ${(user.name || 'PL').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                       </span>`
            }
                            </div>
                            <label for="avatar-upload" style="position: absolute; bottom: 0; right: 0; background: #38bdf8; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.3); z-index: 2;">
                                <span class="material-symbols-rounded" style="color: #0f172a; font-size: 1.2rem;">photo_camera</span>
                            </label>
                            <input type="file" id="avatar-upload" style="display: none;" accept="image/*">
                        </div>
                        
                        <div style="display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; max-width: 400px; margin: 0 auto;">
                            <input type="text" id="header-name-input" 
                                value="${user.name || 'Usuário Ploc'}" 
                                spellcheck="false"
                                autocomplete="off"
                                style="background: transparent; border: none; color: #fff; font-size: 1.5rem; font-weight: 800; text-align: center; flex: 1; min-width: 0; outline: none; margin-bottom: 0.2rem; font-family: 'Roboto', sans-serif;">
                            <span id="btn-save-headerName" class="btn-individual-save">ALTERAR</span>
                        </div>
                        
                        <p style="color: #94a3b8; font-size: 1.2rem; font-weight: 500; margin: 0; opacity: 0.9;">${user.email}</p>
                    </div>
                </div>

                <!-- FILHA 2: DADOS ALTERÁVEIS (ESTREITA) -->
                <div id="section-fields-user" style="width: 100%; max-width: 260px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.8rem;">
                    ${createField('APELIDO', 'username', user.username, 'text', '@usuario')}
                    ${createField('TELEFONE', 'phone', user.phone, 'tel', '(00) 00000-0000')}

                    <!-- Custom Gender Select -->
                    <div class="field-group custom-select-container">
                        <div class="field-label">GÊNERO</div>
                        <div id="gender-trigger" class="field-input" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between;">
                            <span id="gender-value">${user.gender || 'Selecione'}</span>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span id="btn-save-gender" class="btn-individual-save">ALTERAR</span>
                                <span class="material-symbols-rounded" style="font-size: 1rem; opacity: 0.5;">expand_more</span>
                            </div>
                        </div>
                        <div id="gender-options" class="custom-options-list">
                            <div class="option-item" data-value="Masculino">Masculino</div>
                            <div class="option-item" data-value="Feminino">Feminino</div>
                            <div class="option-item" data-value="Outro">Outro</div>
                            <div class="option-item" data-value="Prefiro não dizer">Prefiro não dizer</div>
                        </div>
                    </div>

                    <!-- Custom Masked Birthday with Picker -->
                    <div class="field-group" style="position: relative;">
                        <div class="field-label">NASCIMENTO</div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <input type="text" 
                                id="input-birthDate" 
                                class="field-input" 
                                data-field="birthDate"
                                name="ploc_unique_birthDate_${Math.random().toString(36).substring(7)}"
                                placeholder="DD / MM / AAAA"
                                maxlength="14"
                                inputmode="numeric"
                                autocomplete="one-time-code"
                                spellcheck="false"
                                autocorrect="off"
                                style="width: 100%;"
                                value="${user.birthDateDisplay || ''}">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span id="btn-save-birthDate" class="btn-individual-save">ALTERAR</span>
                                <span id="calendar-trigger" class="material-symbols-rounded" style="cursor: pointer; font-size: 1.2rem; opacity: 0.5;">calendar_month</span>
                            </div>
                        </div>
                        
                        <!-- O Calendário Ploc -->
                        <div id="ploc-calendar" class="custom-options-list" style="width: 280px; padding: 1rem; right: 0; left: auto;">
                            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
                                <span id="cal-prev" class="material-symbols-rounded" style="cursor: pointer; font-size: 1.2rem;">chevron_left</span>
                                <span id="cal-month-year" style="font-size: 0.8rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">MÊS AAAA</span>
                                <span id="cal-next" class="material-symbols-rounded" style="cursor: pointer; font-size: 1.2rem;">chevron_right</span>
                            </div>
                            <div id="cal-days-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center;">
                                <!-- Dias da semana e números gerados via JS -->
                            </div>
                        </div>
                    </div>

                    <!-- Password Field with Visibility Toggle -->
                    <div class="field-group">
                        <div class="field-label">SENHA</div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <input type="password" 
                                id="input-password"
                                class="field-input" 
                                data-field="password"
                                value="••••••••"
                                placeholder="Sua senha"
                                spellcheck="false"
                                autocomplete="new-password">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span id="btn-save-password" class="btn-individual-save">ALTERAR</span>
                                <span id="btn-toggle-password" class="material-symbols-rounded" style="cursor: pointer; font-size: 1.2rem; opacity: 0.5;">visibility</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- FILHA 3: ZONA DE PERIGO (LARGA) -->
                <div id="section-danger-user" style="border-top: 1px solid rgba(255,255,255,0.03); padding-top: 2rem; text-align: center;">
                    <button id="btn-delete-account-user" class="danger-capsule">
                        EXCLUIR CONTA
                    </button>
                </div>
            </div>

            <style>
                .btn-individual-save {
                    background: transparent;
                    border: none;
                    color: #38bdf8;
                    cursor: pointer;
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                    display: none;
                    animation: fadeInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.2s;
                    white-space: nowrap;
                }
                .btn-individual-save.active { display: inline-block; }
                .btn-individual-save.saved-state { color: #22c55e !important; }
                
                @keyframes fadeInRight {
                    from { transform: translateX(10px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .danger-capsule {
                    background: #334155;
                    border: none;
                    color: #fff;
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 2px;
                    cursor: pointer;
                    padding: 0.6rem 1.5rem;
                    border-radius: 30px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    opacity: 0.8;
                }
                .danger-capsule:hover {
                    background: #ef4444;
                    transform: scale(1.05);
                    box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
                    opacity: 1;
                }
                .field-group {
                    position: relative;
                    border-bottom: 1.2px solid rgba(255,255,255,0.08);
                    padding-bottom: 0.4rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .field-group:focus-within {
                    border-bottom-color: #38bdf8;
                }
                
                /* Custom Select Styles */
                .custom-select-container { position: relative; }
                .custom-options-list {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: #1e293b;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 12px;
                    margin-top: 8px;
                    z-index: 100;
                    display: none;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.5);
                    overflow: hidden;
                    animation: slideDown 0.2s ease-out;
                }
                .option-item {
                    padding: 0.8rem 1rem;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .option-item:hover { background: rgba(56, 189, 248, 0.1); color: #38bdf8; }
                
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .field-label {
                    font-size: 0.55rem;
                    font-weight: 900;
                    color: #475569;
                    letter-spacing: 2px;
                    margin-bottom: 0.2rem;
                    text-transform: uppercase;
                }
                .field-input {
                    background: transparent;
                    border: none;
                    color: #fff;
                    font-size: 1.05rem;
                    font-weight: 600;
                    flex: 1;
                    min-width: 0;
                    outline: none;
                    padding: 0.2rem 0;
                    font-family: 'Roboto', sans-serif;
                }
                .field-input::placeholder { color: #334155; font-weight: 400; }
                .field-input:disabled { opacity: 0.4; cursor: not-allowed; }
                
                .field-input:-webkit-autofill {
                    -webkit-box-shadow: 0 0 0 30px #070a13 inset !important;
                    -webkit-text-fill-color: #fff !important;
                }

                .btn-save-indicator {
                    position: absolute;
                    right: 0;
                    bottom: 0.8rem;
                    color: #22c55e;
                    display: none;
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes slideUp {
                    from { transform: translateY(10px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;

        // Lógica de Eventos
        setTimeout(() => {
            const btnBack = container.querySelector('#btn-back-user');
            if (btnBack) btnBack.onclick = () => window.location.hash = '#landing';

            // Uploader de Foto (Sincronizado)
            const fileInput = container.querySelector('#avatar-upload');
            const contentContainer = container.querySelector('#avatar-content-user');

            if (fileInput && contentContainer) {
                fileInput.onchange = async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        // Feedback visual de carregamento
                        const originalContent = contentContainer.innerHTML;
                        contentContainer.innerHTML = `<div style="color: #38bdf8; animation: spin 1s linear infinite;" class="material-symbols-rounded">sync</div>`;
                        
                        try {
                            // 1. Upload do arquivo real (será processado pelo Sharp no backend)
                            const uploadRes = await apiClient.uploadFile(file);
                            const photoUrl = uploadRes.url;

                            // 2. Atualiza UI com a URL final
                            contentContainer.style.background = 'transparent';
                            contentContainer.innerHTML = `<img id="avatar-preview-img" src="${photoUrl}" style="width: 100%; height: 100%; object-fit: cover;">`;

                            // 3. Persiste a URL no perfil do usuário
                            const res = await apiClient.put('/users/me', { profilePhoto: photoUrl });
                            localStorage.setItem('ploc_user', JSON.stringify(res.user));
                            
                            // Evento para atualizar outros componentes (Header/Cápsula)
                            window.dispatchEvent(new CustomEvent('ploc_user_updated', { detail: res.user }));
                        } catch (err) { 
                            console.error('Erro ao processar upload:', err);
                            contentContainer.innerHTML = originalContent;
                            alert('Ops! Erro ao subir sua foto. Tente novamente.');
                        }
                    }
                };
            }

            // Máscara de Telefone Inteligente (Padrão BR)
            const phoneInput = container.querySelector('#input-phone');
            if (phoneInput) {
                phoneInput.oninput = (e) => {
                    let v = e.target.value.replace(/\D/g, ''); // Apenas números
                    if (v.length > 11) v = v.slice(0, 11);

                    if (v.length > 10) {
                        v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
                    } else if (v.length > 6) {
                        v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
                    } else if (v.length > 2) {
                        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
                    } else if (v.length > 0) {
                        v = `(${v}`;
                    }
                    e.target.value = v;
                };
            }

            // Lógica de Salvamento do Nome no Cabeçalho
            const headerNameInput = container.querySelector('#header-name-input');
            const headerIndicator = container.querySelector('#indicator-header-name');

            // Controle de Estados Originais para o Botão de Save
            const originalValues = {
                headerName: headerNameInput.value,
                username: container.querySelector('#input-username') ? container.querySelector('#input-username').value : '',
                phone: container.querySelector('#input-phone') ? container.querySelector('#input-phone').value : '',
                gender: user.gender || 'Selecione',
                birthDate: container.querySelector('#input-birthDate') ? container.querySelector('#input-birthDate').value : '',
                password: '••••••••'
            };

            const toggleSaveBtn = (field, isDirty) => {
                const btn = container.querySelector(`#btn-save-${field}`);
                if (btn) {
                    if (isDirty) {
                        btn.innerText = 'ALTERAR';
                        btn.classList.remove('saved-state');
                        btn.classList.add('active');
                    } else if (!btn.classList.contains('saved-state')) {
                        btn.classList.remove('active');
                    }
                }
            };

            const handleSave = async (field, value) => {
                const btn = container.querySelector(`#btn-save-${field}`);
                try {
                    const payload = {};
                    const apiField = field === 'headerName' ? 'name' : field;
                    payload[apiField] = value;

                    const res = await apiClient.put('/users/me', payload);
                    localStorage.setItem('ploc_user', JSON.stringify(res.user));

                    originalValues[field] = value;

                    if (btn) {
                        btn.innerText = 'SALVO';
                        btn.classList.add('saved-state');
                        setTimeout(() => {
                            btn.classList.remove('saved-state');
                            btn.classList.remove('active');
                            btn.innerText = 'ALTERAR';
                        }, 2000);
                    }
                } catch (err) {
                    console.error('Falha ao salvar campo:', field, err);
                }
            };

            // Eventos para Nome do Header
            headerNameInput.oninput = () => {
                const trimmed = headerNameInput.value.trim();
                toggleSaveBtn('headerName', trimmed !== originalValues.headerName);
            };
            container.querySelector('#btn-save-headerName').onclick = () => handleSave('headerName', headerNameInput.value.trim());

            // Eventos para Campos Gerais (Username, Phone)
            ['username', 'phone'].forEach(fieldId => {
                const input = container.querySelector(`#input-${fieldId}`);
                if (input) {
                    input.oninput = () => {
                        // Bloqueio de espaços em tempo real para o username
                        if (fieldId === 'username') {
                            input.value = input.value.replace(/\s/g, '');
                        }
                        toggleSaveBtn(fieldId, input.value.trim() !== originalValues[fieldId]);
                    };
                    container.querySelector(`#btn-save-${fieldId}`).onclick = () => handleSave(fieldId, input.value.trim());
                }
            });

            // Visibilidade da Senha e Save
            const passInput = container.querySelector('#input-password');
            const passToggle = container.querySelector('#btn-toggle-password');
            const passSave = container.querySelector('#btn-save-password');

            if (passToggle && passInput) {
                passToggle.onclick = () => {
                    const isPass = passInput.type === 'password';
                    passInput.type = isPass ? 'text' : 'password';
                    passToggle.innerText = isPass ? 'visibility_off' : 'visibility';
                };
                passInput.oninput = () => {
                    const isDirty = passInput.value !== '••••••••' && passInput.value.length > 0;
                    toggleSaveBtn('password', isDirty);
                };
                passSave.onclick = () => handleSave('password', passInput.value);
            }

            // Gênero (Custom Select)
            const genderTrigger = container.querySelector('#gender-trigger');
            const genderOptions = container.querySelector('#gender-options');
            const genderValueText = container.querySelector('#gender-value');
            const genderSave = container.querySelector('#btn-save-gender');

            genderTrigger.onclick = (e) => {
                e.stopPropagation();
                const isOpen = genderOptions.style.display === 'block';
                genderOptions.style.display = isOpen ? 'none' : 'block';
            };

            container.querySelectorAll('.option-item').forEach(opt => {
                opt.onclick = () => {
                    const val = opt.getAttribute('data-value');
                    genderValueText.innerText = val;
                    genderOptions.style.display = 'none';
                    toggleSaveBtn('gender', val !== originalValues.gender);
                };
            });
            genderSave.onclick = () => handleSave('gender', genderValueText.innerText);

            // Nascimento
            const birthInput = container.querySelector('#input-birthDate');
            const birthSave = container.querySelector('#btn-save-birthDate');

            if (birthInput) {
                birthInput.oninput = (e) => {
                    let v = e.target.value.replace(/\D/g, '');
                    if (v.length > 8) v = v.slice(0, 8);
                    let formatted = v;
                    if (v.length > 4) formatted = `${v.slice(0, 2)} / ${v.slice(2, 4)} / ${v.slice(4)}`;
                    else if (v.length > 2) formatted = `${v.slice(0, 2)} / ${v.slice(2)}`;
                    birthInput.value = formatted;
                    toggleSaveBtn('birthDate', birthInput.value !== originalValues.birthDate);
                };

                birthSave.onclick = () => {
                    const v = birthInput.value.replace(/\D/g, '');
                    if (v.length === 8) {
                        const isoDate = `${v.slice(4)}-${v.slice(2, 4)}-${v.slice(0, 2)}`;
                        handleSave('birthDate', isoDate);
                    }
                };
            }

            // Calendário Popup Logic
            const calTrigger = container.querySelector('#calendar-trigger');
            const calPopup = container.querySelector('#ploc-calendar');
            const calGrid = container.querySelector('#cal-days-grid');
            const calLabel = container.querySelector('#cal-month-year');
            let currentCalDate = user.birthDate ? new Date(user.birthDate) : new Date();

            const renderCalendar = () => {
                calGrid.innerHTML = '';
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                calLabel.innerText = `${months[currentCalDate.getMonth()]} ${currentCalDate.getFullYear()}`;
                ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach(d => {
                    const el = document.createElement('div');
                    el.style.cssText = 'font-size: 0.6rem; font-weight: 900; opacity: 0.3; padding: 5px 0;';
                    el.innerText = d;
                    calGrid.appendChild(el);
                });
                const firstDay = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth(), 1).getDay();
                const lastDay = new Date(currentCalDate.getFullYear(), currentCalDate.getMonth() + 1, 0).getDate();
                for (let i = 0; i < firstDay; i++) calGrid.appendChild(document.createElement('div'));
                for (let day = 1; day <= lastDay; day++) {
                    const el = document.createElement('div');
                    el.style.cssText = 'font-size: 0.75rem; padding: 8px 0; cursor: pointer; border-radius: 6px;';
                    el.innerText = day;
                    el.onclick = (e) => {
                        e.stopPropagation();
                        const dd = String(day).padStart(2, '0');
                        const mm = String(currentCalDate.getMonth() + 1).padStart(2, '0');
                        birthInput.value = `${dd} / ${mm} / ${currentCalDate.getFullYear()}`;
                        calPopup.style.display = 'none';
                        toggleSaveBtn('birthDate', birthInput.value !== originalValues.birthDate);
                    };
                    calGrid.appendChild(el);
                }
            };

            calTrigger.onclick = (e) => {
                e.stopPropagation();
                const isOpen = calPopup.style.display === 'block';
                calPopup.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) renderCalendar();
            };

            container.querySelector('#cal-prev').onclick = (e) => { e.stopPropagation(); currentCalDate.setMonth(currentCalDate.getMonth() - 1); renderCalendar(); };
            container.querySelector('#cal-next').onclick = (e) => { e.stopPropagation(); currentCalDate.setMonth(currentCalDate.getMonth() + 1); renderCalendar(); };

            window.onclick = () => { if (genderOptions) genderOptions.style.display = 'none'; if (calPopup) calPopup.style.display = 'none'; };

            // Excluir Conta
            const btnDelete = container.querySelector('#btn-delete-account-user');
            btnDelete.onclick = async () => {
                if (confirm('ATENÇÃO: Deseja apagar sua conta definitivamente?')) {
                    try {
                        await apiClient.delete('/users/me');
                        localStorage.clear();
                        window.location.href = '/';
                    } catch (err) { alert('Erro ao processar exclusão'); }
                }
            };

        }, 0);

        return container;
    }
};

function createField(label, field, value, type, placeholder = '') {
    return `
                <div class="field-group">
                    <div class="field-label">${label}</div>
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <input type="${type}" 
                            id="input-${field}"
                            name="ploc_unique_${field}_${Math.random().toString(36).substring(7)}"
                            value="${value || ''}" 
                            class="field-input" 
                            data-field="${field}"
                            autocomplete="one-time-code"
                            spellcheck="false"
                            autocorrect="off"
                            placeholder="${placeholder}">
                        <span id="btn-save-${field}" class="btn-individual-save">ALTERAR</span>
                    </div>
                </div>
            `;
}
