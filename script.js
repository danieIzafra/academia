document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BANCO DE DADOS (Expandido com Séries e Repetições) ---
    const workoutsDB = [
        {
            id: 1,
            title: "Supino Reto com Barra",
            description: "Exercício fundamental para o peitoral maior e tríceps. Mantenha as escápulas retraídas.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
            muscle: "Peito",
            level: "Intermediário",
            sets: 4,
            reps: "8-12"
        },
        {
            id: 2,
            title: "Agachamento Livre",
            description: "O rei dos exercícios de perna. Trabalha quadríceps e glúteos. Foque na amplitude.",
            image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop",
            muscle: "Pernas",
            level: "Avançado",
            sets: 4,
            reps: "10-15"
        },
        {
            id: 3,
            title: "Puxada Frontal",
            description: "Foco no grande dorsal. Concentre-se em puxar a barra com as costas.",
            image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=800&auto=format&fit=crop",
            muscle: "Costas",
            level: "Iniciante",
            sets: 3,
            reps: "12"
        },
        {
            id: 4,
            title: "Desenvolvimento com Halteres",
            description: "Construção de ombros volumosos e fortes. O controle na descida é crucial.",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
            muscle: "Ombros",
            level: "Intermediário",
            sets: 3,
            reps: "10"
        }
    ];

    // --- 2. NAVEGAÇÃO SPA ---
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

    // --- 3. GESTÃO DE TEMAS (DARK/LIGHT) ---
    // Refatorado para evitar erros na tela de login e unificar lógica
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('gymAppTheme', theme);
        
        if (themeToggleBtn) {
            const themeIcon = themeToggleBtn.querySelector('i');
            if (themeIcon) {
                themeIcon.className = theme === 'light' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            }
        }
    }

    const savedTheme = localStorage.getItem('gymAppTheme') || 'dark';
    setTheme(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // --- 4. SISTEMA DE NOTIFICAÇÕES (TOASTS) ---
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

    // --- 5. RENDERIZAÇÃO DOM ---
    const workoutGrid = document.getElementById('workout-grid');
    const searchInput = document.getElementById('search-workout');
    const featuredContainer = document.getElementById('featured-workout');

    function createWorkoutCard(workout, isFeatured = false) {
        return `
            <div class="workout-img-container">
                <img src="${workout.image}" alt="${workout.title}" class="workout-img">
                <div class="workout-overlay"></div>
            </div>
            <div class="workout-info">
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

    function renderFeatured() {
        const featured = workoutsDB[1]; // Agachamento em destaque
        if(featuredContainer) featuredContainer.innerHTML = createWorkoutCard(featured, true);
    }

    function renderWorkouts(workouts) {
        if(!workoutGrid) return;
        workoutGrid.innerHTML = '';
        workouts.forEach(workout => {
            const card = document.createElement('div');
            card.className = 'glass-card workout-card';
            card.innerHTML = createWorkoutCard(workout);
            workoutGrid.appendChild(card);
        });
        attachWorkoutListeners();
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = workoutsDB.filter(workout => 
                workout.title.toLowerCase().includes(searchTerm) || 
                workout.muscle.toLowerCase().includes(searchTerm)
            );
            renderWorkouts(filtered);
        });
    }

    // --- 6. FUNCIONALIDADE: CRONÔMETRO DE DESCANSO ---
    const activeModal = document.getElementById('active-workout-modal');
    const activeTitle = document.getElementById('active-title');
    const timerDisplay = document.getElementById('timer-display');
    const btnTimerStart = document.getElementById('btn-timer-start');
    const btnTimerReset = document.getElementById('btn-timer-reset');
    const btnTimerAdd = document.getElementById('btn-timer-add');
    const btnFinishWorkout = document.getElementById('btn-finish-workout');
    
    let timerInterval;
    let timeLeft = 60; 
    let isRunning = false;

    function formatTime(seconds) {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }

    function updateTimerDisplay() {
        if(timerDisplay) timerDisplay.innerText = formatTime(timeLeft);
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        btnTimerStart.innerHTML = `<i class="fa-solid fa-pause"></i> Pausar`;
        btnTimerStart.classList.replace('btn-primary', 'btn-secondary');
        
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                pauseTimer();
                showToast('Tempo de descanso finalizado! Hora de puxar ferro.', 'fa-bell');
                if("vibrate" in navigator) navigator.vibrate([200, 100, 200]); 
            }
        }, 1000);
    }

    function pauseTimer() {
        isRunning = false;
        clearInterval(timerInterval);
        if(btnTimerStart) {
            btnTimerStart.innerHTML = `<i class="fa-solid fa-play"></i> Continuar`;
            btnTimerStart.classList.replace('btn-secondary', 'btn-primary');
        }
    }

    if(btnTimerStart) {
        btnTimerStart.addEventListener('click', () => {
            isRunning ? pauseTimer() : startTimer();
        });
    }

    if(btnTimerReset) {
        btnTimerReset.addEventListener('click', () => {
            pauseTimer();
            timeLeft = 60;
            updateTimerDisplay();
            btnTimerStart.innerHTML = `<i class="fa-solid fa-play"></i> Iniciar`;
        });
    }

    if(btnTimerAdd) {
        btnTimerAdd.addEventListener('click', () => {
            timeLeft += 15;
            updateTimerDisplay();
        });
    }

    if(btnFinishWorkout) {
        btnFinishWorkout.addEventListener('click', () => {
            if(activeModal) activeModal.classList.add('hidden');
            pauseTimer();
            showToast('Série concluída! Mais um passo para a meta.', 'fa-trophy');
            
            const counter = document.getElementById('workout-counter');
            if(counter) counter.innerText = parseInt(counter.innerText) + 1;
        });
    }

    document.querySelectorAll('.close-modal-timer').forEach(btn => {
        btn.addEventListener('click', () => {
            if(activeModal) activeModal.classList.add('hidden');
            pauseTimer();
        });
    });

    function attachWorkoutListeners() {
        document.querySelectorAll('.btn-start-workout').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const title = e.currentTarget.getAttribute('data-title');
                if(activeTitle) activeTitle.innerText = title;
                timeLeft = 60; 
                updateTimerDisplay();
                pauseTimer();
                if(btnTimerStart) btnTimerStart.innerHTML = `<i class="fa-solid fa-play"></i> Iniciar`;
                if(activeModal) activeModal.classList.remove('hidden');
            });
        });
    }

    // --- 7. MODAL FINANCEIRO (PIX) ---
    const payBtn = document.getElementById('pay-btn');
    const pixModal = document.getElementById('checkout-modal');
    const copyBtn = document.querySelector('.copy-btn');
    const pixInput = document.getElementById('pix-code');

    if(payBtn && pixModal) payBtn.addEventListener('click', () => pixModal.classList.remove('hidden'));
    
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            if(pixModal) pixModal.classList.add('hidden');
        });
    });

    if(copyBtn) {
        copyBtn.addEventListener('click', () => {
            if(pixInput) {
                pixInput.select();
                document.execCommand("copy");
            }
            showToast('Código Pix copiado com sucesso!', 'fa-copy');
            
            copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copiado!';
            copyBtn.classList.replace('btn-primary', 'btn-success');
            
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copiar Código Pix';
                copyBtn.classList.replace('btn-success', 'btn-primary');
            }, 2000);
        });
    }

    // Inicialização apenas se for a tela principal
    if (document.getElementById('workout-grid')) {
        renderFeatured();
        renderWorkouts(workoutsDB);
    }
});