// --- IMPORTAÇÃO DO SUPABASE ---
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 🔴 COLOQUE AS CREDENCIAIS DO SEU PROJETO AQUI
const supabaseUrl = 'https://qjkroixbfzbwuskuvegt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa3JvaXhiZnpid3Vza3V2ZWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzMDEzNzQsImV4cCI6MjA5Njg3NzM3NH0.t0XscmqNClCMM5SF7LWQxvGzAJhdLtqnPTP-zFm3TcE';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==========================================
// 1. DADOS ESTADOS GLOBAIS E BANCO DE EXERCÍCIOS
// ==========================================

const diasDaSemana = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];
const opcoesDeTreino = [
    'Descanso', 'Peito e Tríceps', 'Costas e Bíceps', 
    'Pernas (Quadríceps/Panturrilha)', 'Posterior e Glúteo', 
    'Ombros e Abdômen', 'Full Body', 'Cardio'
];

// Banco local de exercícios COMPLETO mapeado por categorias
const workoutsDB = [
    { id: 1, title: "Supino Reto com Barra", description: "Exercício fundamental para o peitoral maior e tríceps.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop", muscle: "Peito", category: "Peito e Tríceps", level: "Intermediário", sets: 4, reps: "8-12" },
    { id: 2, title: "Supino Inclinado com Halteres", description: "Foco na porção superior do peitoral.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop", muscle: "Peito", category: "Peito e Tríceps", level: "Intermediário", sets: 4, reps: "10-12" },
    { id: 3, title: "Voador (Peck Deck)", description: "Isolamento para contração máxima do peitoral.", image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop", muscle: "Peito", category: "Peito e Tríceps", level: "Iniciante", sets: 3, reps: "12-15" },
    { id: 4, title: "Tríceps Pulley", description: "Isolamento focado no tríceps braquial.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", muscle: "Tríceps", category: "Peito e Tríceps", level: "Iniciante", sets: 3, reps: "12-15" },
    { id: 5, title: "Tríceps Testa", description: "Excelente para a cabeça longa do tríceps.", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop", muscle: "Tríceps", category: "Peito e Tríceps", level: "Intermediário", sets: 3, reps: "10-12" },
    { id: 6, title: "Puxada Frontal", description: "Foco no grande dorsal. Concentre-se em puxar com as costas.", image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=800&auto=format&fit=crop", muscle: "Costas", category: "Costas e Bíceps", level: "Iniciante", sets: 4, reps: "10-12" },
    { id: 7, title: "Remada Curvada", description: "Constrói densidade e espessura nas costas.", image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=800&auto=format&fit=crop", muscle: "Costas", category: "Costas e Bíceps", level: "Intermediário", sets: 4, reps: "8-10" },
    { id: 8, title: "Pulldown com Corda", description: "Isolamento para a asa (latíssimo do dorso).", image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=800&auto=format&fit=crop", muscle: "Costas", category: "Costas e Bíceps", level: "Iniciante", sets: 3, reps: "12-15" },
    { id: 9, title: "Rosca Direta com Barra", description: "Clássico para construção de volume no bíceps.", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop", muscle: "Bíceps", category: "Costas e Bíceps", level: "Iniciante", sets: 3, reps: "10-12" },
    { id: 10, title: "Rosca Martelo", description: "Foca no braquial e antebraço.", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop", muscle: "Bíceps", category: "Costas e Bíceps", level: "Iniciante", sets: 3, reps: "12" },
    { id: 11, title: "Agachamento Livre", description: "O rei dos exercícios de perna. Trabalha quadríceps e força geral.", image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop", muscle: "Quadríceps", category: "Pernas (Quadríceps/Panturrilha)", level: "Avançado", sets: 4, reps: "8-12" },
    { id: 12, title: "Leg Press 45°", description: "Carga pesada com segurança para os quadríceps.", image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop", muscle: "Quadríceps", category: "Pernas (Quadríceps/Panturrilha)", level: "Intermediário", sets: 4, reps: "10-15" },
    { id: 13, title: "Cadeira Extensora", description: "Isolamento total para esculpir o quadríceps.", image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop", muscle: "Quadríceps", category: "Pernas (Quadríceps/Panturrilha)", level: "Iniciante", sets: 3, reps: "12-15" },
    { id: 14, title: "Elevação de Panturrilha em Pé", description: "Desenvolvimento dos gastrocnêmios.", image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop", muscle: "Panturrilha", category: "Pernas (Quadríceps/Panturrilha)", level: "Iniciante", sets: 4, reps: "15-20" },
    { id: 15, title: "Elevação Pélvica", description: "O melhor exercício para ativação e hipertrofia de glúteos.", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop", muscle: "Glúteos", category: "Posterior e Glúteo", level: "Intermediário", sets: 4, reps: "10-15" },
    { id: 16, title: "Stiff com Barra", description: "Alongamento e contração profunda dos isquiotibiais.", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop", muscle: "Posterior", category: "Posterior e Glúteo", level: "Avançado", sets: 4, reps: "10-12" },
    { id: 17, title: "Cadeira Flexora", description: "Isola os isquiotibiais com segurança e tensão constante.", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop", muscle: "Posterior", category: "Posterior e Glúteo", level: "Iniciante", sets: 3, reps: "12-15" },
    { id: 18, title: "Cadeira Abdutora", description: "Foco no glúteo médio para estabilização pélvica.", image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=800&auto=format&fit=crop", muscle: "Glúteos", category: "Posterior e Glúteo", level: "Iniciante", sets: 3, reps: "15" },
    { id: 19, title: "Desenvolvimento com Halteres", description: "Construção de ombros volumosos e fortes.", image: "https://images.unsplash.com/photo-1532029837206-ebab87ba081f?q=80&w=800&auto=format&fit=crop", muscle: "Ombros", category: "Ombros e Abdômen", level: "Intermediário", sets: 4, reps: "8-12" },
    { id: 20, title: "Elevação Lateral", description: "Exercício chave para a largura e aspecto 'cebola' dos ombros.", image: "https://images.unsplash.com/photo-1532029837206-ebab87ba081f?q=80&w=800&auto=format&fit=crop", muscle: "Ombros", category: "Ombros e Abdômen", level: "Iniciante", sets: 4, reps: "12-15" },
    { id: 21, title: "Abdominal Crunch", description: "Exercício básico e efetivo para o core.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", muscle: "Abdômen", category: "Ombros e Abdômen", level: "Iniciante", sets: 4, reps: "15-20" },
    { id: 22, title: "Prancha Isométrica", description: "Estabilidade global e fortalecimento profundo do core.", image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop", muscle: "Abdômen", category: "Ombros e Abdômen", level: "Intermediário", sets: 3, reps: "45-60 seg" },
    { id: 23, title: "Burpee", description: "Exercício funcional que trabalha o corpo todo e eleva a frequência cardíaca.", image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop", muscle: "Full Body", category: "Full Body", level: "Avançado", sets: 4, reps: "15" },
    { id: 24, title: "Thruster com Halteres", description: "Combina agachamento com desenvolvimento militar.", image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop", muscle: "Full Body", category: "Full Body", level: "Avançado", sets: 3, reps: "12" },
    { id: 25, title: "Kettlebell Swing", description: "Potência de quadril e condicionamento global.", image: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=800&auto=format&fit=crop", muscle: "Full Body", category: "Full Body", level: "Intermediário", sets: 4, reps: "15-20" },
    { id: 26, title: "Corrida na Esteira", description: "Excelente para a saúde cardiovascular e queima de calorias.", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop", muscle: "Cardio", category: "Cardio", level: "Iniciante", sets: 1, reps: "30 min" },
    { id: 27, title: "Bicicleta Ergométrica", description: "Cardio de baixo impacto para proteger as articulações.", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop", muscle: "Cardio", category: "Cardio", level: "Iniciante", sets: 1, reps: "40 min" },
    { id: 28, title: "Pular Corda", description: "Melhora a coordenação, agilidade e condicionamento aeróbico.", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=800&auto=format&fit=crop", muscle: "Cardio", category: "Cardio", level: "Intermediário", sets: 5, reps: "3 min" }
];

function createCard(workout) {
    return `
        <div class="workout-img-container">
            <img src="${workout.image}" alt="${workout.title}" class="workout-img">
            <div class="workout-overlay"></div>
        </div>
        <div class="workout-info" style="padding: 20px;">
            <div class="workout-tags">
                <span class="tag">${workout.muscle}</span>
                <span class="tag">${workout.level}</span>
            </div>
            <h3>${workout.title}</h3>
            <p>${workout.description}</p>
            <div class="workout-meta">
                <span><i class="fa-solid fa-layer-group"></i> ${workout.sets} Séries</span>
                <span><i class="fa-solid fa-rotate-right"></i> ${workout.reps} Reps</span>
            </div>
            <button class="btn btn-primary btn-start-workout" data-title="${workout.title}">
                <i class="fa-solid fa-play"></i> Iniciar Treino
            </button>
        </div>
    `;
}

// ==========================================
// 2. LÓGICA DE INTERFACE E COMPONENTES
// ==========================================

function showToast(message, icon = 'fa-circle-check') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('gymAppTheme', theme);
        if (themeToggleBtn) {
            const themeIcon = themeToggleBtn.querySelector('i');
            if (themeIcon) themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
        }
    }

    setTheme(localStorage.getItem('gymAppTheme') || 'dark');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            setTheme(htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }
}

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));

            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            if (document.getElementById(targetId)) {
                document.getElementById(targetId).classList.add('active');
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

function initWorkouts() {
    const workoutGrid = document.getElementById('workout-grid');
    const searchInput = document.getElementById('search-workout');

    function renderGrid(workouts) {
        if (!workoutGrid) return;
        workoutGrid.innerHTML = '';
        workouts.forEach(w => {
            const div = document.createElement('div');
            div.className = 'glass-card workout-card';
            div.innerHTML = createCard(w);
            workoutGrid.appendChild(div);
        });
        
        document.querySelectorAll('#workout-grid .btn-start-workout').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activeTitle = document.getElementById('active-title');
                const activeModal = document.getElementById('active-workout-modal');
                if (activeTitle) activeTitle.innerText = e.currentTarget.getAttribute('data-title');
                if (activeModal) activeModal.classList.remove('hidden');
            });
        });
    }

    if (workoutGrid) renderGrid(workoutsDB);

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            renderGrid(workoutsDB.filter(w => w.title.toLowerCase().includes(term) || w.muscle.toLowerCase().includes(term) || w.category.toLowerCase().includes(term)));
        });
    }
}

function initModalsAndTimer() {
    let timerInterval;
    let timeLeft = 60;
    let isRunning = false;
    const timerDisplay = document.getElementById('timer-display');
    const btnStart = document.getElementById('btn-timer-start');
    const activeModal = document.getElementById('active-workout-modal');

    function updateDisplay() { if (timerDisplay) timerDisplay.innerText = `${Math.floor(timeLeft/60).toString().padStart(2,'0')}:${(timeLeft%60).toString().padStart(2,'0')}`; }
    function pause() {
        isRunning = false; clearInterval(timerInterval);
        if (btnStart) { btnStart.innerHTML = `<i class="fa-solid fa-play"></i> Continuar`; btnStart.classList.replace('btn-secondary', 'btn-primary'); }
    }

    if (btnStart) {
        btnStart.addEventListener('click', () => {
            if (isRunning) { pause(); } 
            else {
                isRunning = true;
                btnStart.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar`;
                btnStart.classList.replace('btn-primary', 'btn-secondary');
                timerInterval = setInterval(() => {
                    if (timeLeft > 0) { timeLeft--; updateDisplay(); } 
                    else { pause(); showToast('Tempo de descanso finalizado!', 'fa-bell'); if("vibrate" in navigator) navigator.vibrate([200, 100, 200]); }
                }, 1000);
            }
        });
    }

    document.getElementById('btn-timer-reset')?.addEventListener('click', () => { pause(); timeLeft = 60; updateDisplay(); btnStart.innerHTML = `<i class="fa-solid fa-play"></i> Iniciar`; });
    document.getElementById('btn-timer-add')?.addEventListener('click', () => { timeLeft += 15; updateDisplay(); });
    document.getElementById('btn-finish-workout')?.addEventListener('click', () => {
        pause(); if(activeModal) activeModal.classList.add('hidden');
        showToast('Série concluída! Mais um passo para a meta.', 'fa-trophy');
        const counter = document.getElementById('workout-counter');
        if (counter) counter.innerText = parseInt(counter.innerText) + 1;
    });

    document.querySelectorAll('.close-modal-timer').forEach(b => b.addEventListener('click', () => { pause(); if(activeModal) activeModal.classList.add('hidden'); }));

    const pixModal = document.getElementById('checkout-modal');
    document.getElementById('pay-btn')?.addEventListener('click', () => pixModal?.classList.remove('hidden'));
    document.querySelectorAll('.close-modal').forEach(b => b.addEventListener('click', () => pixModal?.classList.add('hidden')));
    
    document.querySelector('.copy-btn')?.addEventListener('click', function() {
        const input = document.getElementById('pix-code');
        if(input) { input.select(); document.execCommand('copy'); }
        showToast('Código Pix copiado!', 'fa-copy');
        this.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
        this.classList.replace('btn-primary', 'btn-success');
        setTimeout(() => { this.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar Código Pix'; this.classList.replace('btn-success', 'btn-primary'); }, 2000);
    });
}

// ==========================================
// 3. LÓGICA DO PLANEJAMENTO E TREINO DO DIA
// ==========================================

function renderTreinoDoDia(scheduleObj) {
    const featuredContainer = document.getElementById('featured-workout');
    if (!featuredContainer) return;

    const hojeData = new Date().getDay(); 
    const mapDias = [6, 0, 1, 2, 3, 4, 5]; 
    const hojeIndex = mapDias[hojeData]; 
    const diaDeHoje = diasDaSemana[hojeIndex];
    
    const categoriaDeHoje = scheduleObj[diaDeHoje] || 'Descanso';

    featuredContainer.className = 'glass-card featured-card';
    featuredContainer.style.background = '';
    featuredContainer.style.border = '';
    featuredContainer.style.boxShadow = '';
    featuredContainer.style.padding = '0';

    if (categoriaDeHoje === 'Descanso') {
        featuredContainer.innerHTML = `
            <div style="text-align: center; padding: 30px 20px;">
                <i class="fa-solid fa-mug-hot" style="font-size: 3.5rem; color: var(--accent-color); margin-bottom: 16px;"></i>
                <h3 style="font-family: 'Outfit', sans-serif;">Hoje é dia de Descanso!</h3>
                <p>A recuperação muscular é fundamental para os ganhos. Aproveite o dia para relaxar.</p>
            </div>
        `;
        return;
    }

    const treinosDeHoje = workoutsDB.filter(w => w.category === categoriaDeHoje);

    if (treinosDeHoje.length > 0) {
        featuredContainer.className = 'workout-grid';
        featuredContainer.style.background = 'transparent';
        featuredContainer.style.border = 'none';
        featuredContainer.style.boxShadow = 'none';
        featuredContainer.innerHTML = '';
        
        treinosDeHoje.forEach(exercicio => {
            const div = document.createElement('div');
            div.className = 'glass-card workout-card';
            div.innerHTML = createCard(exercicio);
            featuredContainer.appendChild(div);
        });
        
        featuredContainer.querySelectorAll('.btn-start-workout').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const activeTitle = document.getElementById('active-title');
                const activeModal = document.getElementById('active-workout-modal');
                if (activeTitle) activeTitle.innerText = e.currentTarget.getAttribute('data-title');
                if (activeModal) activeModal.classList.remove('hidden');
            });
        });

    } else {
         featuredContainer.innerHTML = `
            <div style="text-align: center; padding: 30px 20px;">
                <i class="fa-solid fa-dumbbell" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 16px;"></i>
                <p>Nenhum exercício cadastrado ainda para a modalidade <strong>${categoriaDeHoje}</strong>.</p>
            </div>
        `;
    }
}

// Lógica minimizada do plano semanal (agora atualiza só o texto)
function renderScheduleUI(scheduleObj) {
    const todayText = document.getElementById('today-plan-text');
    if (!todayText) return;

    const hojeData = new Date().getDay(); 
    const mapDias = [6, 0, 1, 2, 3, 4, 5]; 
    const hojeIndex = mapDias[hojeData]; 
    const diaDeHoje = diasDaSemana[hojeIndex];

    const treino = scheduleObj[diaDeHoje] || 'Descanso';
    
    if (treino === 'Descanso') {
        todayText.innerHTML = `Rotina de Hoje: <strong style="color: var(--text-secondary);">${treino}</strong>`;
    } else {
        todayText.innerHTML = `Rotina de Hoje: <strong style="color: var(--accent-color);">${treino}</strong>`;
    }
}

function initScheduleModal(user) {
    const modal = document.getElementById('schedule-modal');
    const container = document.getElementById('schedule-inputs-container');
    const form = document.getElementById('schedule-form');
    
    if (!modal || !container || !form) return;

    container.innerHTML = '';
    diasDaSemana.forEach(dia => {
        const div = document.createElement('div');
        div.className = 'schedule-day-group';
        let optionsHTML = opcoesDeTreino.map(opt => `<option value="${opt}">${opt}</option>`).join('');
        div.innerHTML = `
            <label for="select-${dia}">${dia}</label>
            <select id="select-${dia}" class="glass-input">
                ${optionsHTML}
            </select>
        `;
        container.appendChild(div);
    });

    document.getElementById('btn-edit-schedule')?.addEventListener('click', async () => {
        const { data } = await supabase.from('profiles').select('weekly_schedule').eq('id', user.id).single();
        if(data && data.weekly_schedule) {
            diasDaSemana.forEach(dia => {
                const select = document.getElementById(`select-${dia}`);
                if(select) select.value = data.weekly_schedule[dia] || 'Descanso';
            });
        }
        modal.classList.remove('hidden');
    });

    document.querySelectorAll('.close-schedule-modal').forEach(b => b.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('hidden');
    }));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';

        const newSchedule = {};
        diasDaSemana.forEach(dia => {
            newSchedule[dia] = document.getElementById(`select-${dia}`).value;
        });

        const { error } = await supabase.from('profiles').update({ weekly_schedule: newSchedule }).eq('id', user.id);
        btn.innerHTML = originalText;

        if (error) {
            showToast('Erro ao salvar rotina', 'fa-circle-xmark');
            console.error(error);
        } else {
            showToast('Rotina atualizada com sucesso!', 'fa-calendar-check');
            renderScheduleUI(newSchedule);
            renderTreinoDoDia(newSchedule); 
            modal.classList.add('hidden');
        }
    });
}

// ==========================================
// 4. FUNÇÃO DO PWA (Adicionar ao Ecrã Inicial)
// ==========================================

function initPWA() {
    let deferredPrompt;
    const installModal = document.getElementById('install-modal');
    const btnInstall = document.getElementById('btn-install-app');
    const iosGuide = document.getElementById('ios-install-guide');
    
    if (!installModal) return;

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    if (isStandalone || localStorage.getItem('gymApp_PWA_dismissed') === 'true') {
        return;
    }

    document.querySelectorAll('.close-install-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            installModal.classList.add('hidden');
            localStorage.setItem('gymApp_PWA_dismissed', 'true');
        });
    });

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (btnInstall) btnInstall.classList.remove('hidden');
    });

    if (isIOS && iosGuide) {
        iosGuide.classList.remove('hidden');
    }

    setTimeout(() => {
        if (deferredPrompt || isIOS) {
            installModal.classList.remove('hidden');
        }
    }, 2500);

    if (btnInstall) {
        btnInstall.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    console.log('Usuário instalou o GymApp Pro!');
                }
                deferredPrompt = null;
                installModal.classList.add('hidden');
            }
        });
    }
}

// ==========================================
// 5. AUTENTICAÇÃO E INICIALIZAÇÃO
// ==========================================

async function initSupabaseSession() {
    const { data: sessionData } = await supabase.auth.getSession();
    
    if (!sessionData.session) {
        window.location.href = 'login.html';
        return;
    }

    const user = sessionData.session.user;
    const nomeCompleto = user.user_metadata?.full_name || 'Atleta';
    const welcomeTitle = document.querySelector('.welcome-card h2');
    if (welcomeTitle) welcomeTitle.innerHTML = `Fala, ${nomeCompleto.split(' ')[0]}! ⚡`;

    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i>';
        loginBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }

    initScheduleModal(user);

    try {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
            const counter = document.getElementById('workout-counter');
            if (counter) counter.innerText = profile.workouts_completed || 0;
            const level = document.querySelector('.progress-header span:first-child');
            if (level && profile.level_name) level.innerText = profile.level_name;
            
            if (profile.weekly_schedule) {
                renderScheduleUI(profile.weekly_schedule);
                renderTreinoDoDia(profile.weekly_schedule);
            } else {
                renderTreinoDoDia({ 'segunda': 'Descanso', 'terca': 'Descanso', 'quarta': 'Descanso', 'quinta': 'Descanso', 'sexta': 'Descanso', 'sabado': 'Descanso', 'domingo': 'Descanso' });
            }

            // CHAMA A FUNÇÃO DE INSTALAÇÃO PWA APÓS CARREGAR OS DADOS
            initPWA();
        }
    } catch (err) {
        console.log("Supabase log: Tabela de perfil aguardando criação ou sincronização.");
    }
}

function initLoginScreen() {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = e.target.querySelector('button');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Autenticando...';
        
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            alert("Erro ao entrar: " + error.message);
            btn.innerHTML = originalText;
        } else {
            window.location.href = 'index.html';
        }
    });
}

// ==========================================
// 6. MOTOR DE PARTIDA (Ordem de Execução)
// ==========================================

initTheme();

if (document.getElementById('login-form')) {
    initLoginScreen();
} else {
    initNavigation();
    initWorkouts();
    initModalsAndTimer();
    initSupabaseSession();
}