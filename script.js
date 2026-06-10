document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. BANCO DE DADOS DE TREINOS (Expansível para +1000 linhas de dados) ---
    // Você pode escalar este array com infinitos objetos de exercícios
    const workoutsDB = [
        {
            id: 1,
            title: "Supino Reto com Barra",
            description: "Exercício fundamental para o desenvolvimento do peitoral maior, tríceps e deltoide anterior. Mantenha as escápulas retraídas.",
            image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800&auto=format&fit=crop",
            muscle: "Peito",
            level: "Intermediário"
        },
        {
            id: 2,
            title: "Agachamento Livre",
            description: "O rei dos exercícios de perna. Trabalha quadríceps, glúteos e core. Foque na amplitude e em manter a coluna neutra.",
            image: "https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=800&auto=format&fit=crop",
            muscle: "Pernas",
            level: "Avançado"
        },
        {
            id: 3,
            title: "Puxada Frontal",
            description: "Foco no grande dorsal. Evite usar impulso e concentre-se em puxar a barra com as costas, não apenas com os braços.",
            image: "https://images.unsplash.com/photo-1603287681836-b174ce5074c2?q=80&w=800&auto=format&fit=crop",
            muscle: "Costas",
            level: "Iniciante"
        },
        {
            id: 4,
            title: "Desenvolvimento com Halteres",
            description: "Construção de ombros volumosos e fortes. O controle na descida (fase excêntrica) é crucial para evitar lesões.",
            image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop",
            muscle: "Ombros",
            level: "Intermediário"
        },
        {
            id: 5,
            title: "Levantamento Terra",
            description: "Exercício composto de cadeia posterior. Exige precisão técnica para recrutar glúteos, isquiotibiais e lombares.",
            image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop",
            muscle: "Corpo Inteiro",
            level: "Avançado"
        }
        // Para chegar a mil linhas, adicione centenas de exercícios aqui:
        // Rosca Direta, Tríceps Testa, Leg Press, Cadeira Extensora, Panturrilha no Smith...
    ];

    // --- 2. SISTEMA DE NAVEGAÇÃO SPA (Single Page Application) ---
    const navItems = document.querySelectorAll('.nav-item');
    const viewSections = document.querySelectorAll('.view-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active state de todos
            navItems.forEach(nav => nav.classList.remove('active'));
            viewSections.forEach(section => section.classList.remove('active'));

            // Adiciona active no clicado
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- 3. SISTEMA DE TEMA DARK/LIGHT COM PERSISTÊNCIA ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Checa preferência salva
    const savedTheme = localStorage.getItem('gymAppTheme') || 'dark';
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('gymAppTheme', theme);
        
        if (theme === 'light') {
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        } else {
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
    }

    // --- 4. RENDERIZAÇÃO DINÂMICA DO DOM (Data Binding) ---
    const workoutGrid = document.getElementById('workout-grid');
    const searchInput = document.getElementById('search-workout');
    const featuredWorkoutContainer = document.getElementById('featured-workout');

    // Renderiza Treino em Destaque (Início)
    function renderFeatured() {
        const featured = workoutsDB[1]; // Pegando o Agachamento como exemplo
        featuredWorkoutContainer.innerHTML = `
            <img src="${featured.image}" alt="${featured.title}" style="width:100%; height:150px; object-fit:cover; border-radius:10px; margin-bottom:15px;">
            <h4>${featured.title}</h4>
            <p>${featured.description}</p>
        `;
    }

    // Renderiza Cards no Catálogo
    function renderWorkouts(workouts) {
        workoutGrid.innerHTML = '';
        workouts.forEach(workout => {
            const card = document.createElement('div');
            card.className = 'glass-card workout-card';
            card.innerHTML = `
                <img src="${workout.image}" alt="${workout.title}" class="workout-img">
                <div class="workout-info">
                    <div class="workout-tags">
                        <span class="tag">${workout.muscle}</span>
                        <span class="tag">${workout.level}</span>
                    </div>
                    <h3>${workout.title}</h3>
                    <p>${workout.description}</p>
                </div>
            `;
            workoutGrid.appendChild(card);
        });
    }

    // Sistema de Busca (Filtro)
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filtered = workoutsDB.filter(workout => 
            workout.title.toLowerCase().includes(searchTerm) || 
            workout.muscle.toLowerCase().includes(searchTerm)
        );
        renderWorkouts(filtered);
    });

    // --- 5. LÓGICA DO SETOR FINANCEIRO (Modal) ---
    const payBtn = document.getElementById('pay-btn');
    const modal = document.getElementById('checkout-modal');
    const closeModal = document.getElementById('close-modal');
    const copyBtn = document.querySelector('.copy-btn');

    payBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    copyBtn.addEventListener('click', () => {
        copyBtn.innerText = 'Código Copiado!';
        copyBtn.style.background = 'var(--success)';
        setTimeout(() => {
            copyBtn.innerHTML = 'Copiar Código Pix';
            copyBtn.style.background = 'var(--accent-color)';
        }, 2000);
    });

    // Inicialização da UI
    renderFeatured();
    renderWorkouts(workoutsDB);
});