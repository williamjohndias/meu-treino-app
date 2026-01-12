// Gerenciamento de dados
let workouts = [];
let isOnline = true;

// Estrutura de exercícios por dia (baseado nos PDFs)
const workoutRoutines = {
    'segunda': [
        { name: 'Desenvolvimento com Halteres', sets: 4, reps: 10 },
        { name: 'Elevação Lateral', sets: 3, reps: 12 },
        { name: 'Elevação Frontal', sets: 3, reps: 12 },
        { name: 'Crucifixo Invertido', sets: 3, reps: 12 },
        { name: 'Remada Alta', sets: 3, reps: 12 }
    ],
    'terça': [
        { name: 'Rosca Direta com Barra', sets: 4, reps: 10 },
        { name: 'Rosca Alternada', sets: 3, reps: 12 },
        { name: 'Rosca Martelo', sets: 3, reps: 12 },
        { name: 'Tríceps Pulley', sets: 4, reps: 10 },
        { name: 'Tríceps Francês', sets: 3, reps: 12 },
        { name: 'Tríceps Testa', sets: 3, reps: 12 }
    ],
    'quarta': [
        { name: 'Stiff', sets: 4, reps: 10 },
        { name: 'Levantamento Terra', sets: 3, reps: 8 },
        { name: 'Flexão de Pernas', sets: 4, reps: 12 },
        { name: 'Elevação Pélvica', sets: 3, reps: 15 },
        { name: 'Abdução de Quadril', sets: 3, reps: 15 }
    ],
    'quinta': [
        { name: 'Supino Reto', sets: 4, reps: 10 },
        { name: 'Supino Inclinado', sets: 3, reps: 12 },
        { name: 'Crucifixo', sets: 3, reps: 12 },
        { name: 'Tríceps Pulley', sets: 4, reps: 10 },
        { name: 'Tríceps Francês', sets: 3, reps: 12 },
        { name: 'Paralelas', sets: 3, reps: 12 }
    ],
    'sexta': [
        { name: 'Barra Fixa', sets: 4, reps: 10 },
        { name: 'Puxada Frontal', sets: 4, reps: 10 },
        { name: 'Remada Curvada', sets: 4, reps: 10 },
        { name: 'Remada Unilateral', sets: 3, reps: 12 },
        { name: 'Puxada Alta', sets: 3, reps: 12 }
    ],
    'sábado': [
        { name: 'Agachamento Livre', sets: 4, reps: 10 },
        { name: 'Leg Press', sets: 4, reps: 12 },
        { name: 'Extensão de Pernas', sets: 3, reps: 15 },
        { name: 'Afundo', sets: 3, reps: 12 },
        { name: 'Cadeira Extensora', sets: 3, reps: 15 }
    ]
};

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Aguardar Supabase inicializar (máximo 5 segundos)
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!supabase && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        
        // Tentar inicializar novamente a cada tentativa
        if (!supabase && typeof supabase !== 'undefined' && supabase.createClient) {
            const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
            const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';
            try {
                supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase inicializado durante o carregamento!');
                break;
            } catch (e) {
                console.warn('Tentativa de inicialização falhou:', e);
            }
        }
    }
    
    if (!supabase) {
        console.warn('⚠️ Supabase não inicializado após', maxAttempts * 100, 'ms. Usando modo offline.');
        console.warn('Verifique se o script do Supabase foi carregado corretamente.');
    } else {
        console.log('✅ Supabase pronto para uso!');
    }
    
    // Definir data padrão como hoje
    const dateInput = document.getElementById('workout-date');
    if (dateInput) {
        dateInput.valueAsDate = new Date();
    }
    
    // Event listeners
    const workoutForm = document.getElementById('workout-form');
    if (workoutForm) {
        workoutForm.addEventListener('submit', handleAddWorkout);
    }
    
    const exerciseSelect = document.getElementById('exercise-select');
    if (exerciseSelect) {
        exerciseSelect.addEventListener('change', handleExerciseSelect);
    }
    
    const dashboardSelect = document.getElementById('dashboard-exercise-select');
    if (dashboardSelect) {
        dashboardSelect.addEventListener('change', handleDashboardExerciseSelect);
    }
    
    // Mostrar loading
    showLoading(true);
    
    // Carregar dados do Supabase
    await loadWorkoutsFromSupabase();
    
    // Carregar interface
    renderExercises();
    updateExerciseSelect();
    
    // Destacar treino do dia atual
    highlightTodayWorkout();
    
    // Inicializar calendário
    renderCalendar();
    
    // Atualizar dashboard
    updateDashboard();
    updateExerciseSelect();
    updateDashboardExerciseSelect();
    
    // Atualizar streak no header
    updateHeaderStreak();
    
    // Esconder loading
    showLoading(false);
});

// Navegação entre seções
function showSection(sectionId) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar seção selecionada
    const section = document.getElementById(`section-${sectionId}`);
    if (section) {
        section.classList.add('active');
    }
    
    // Atualizar links ativos
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`.nav-link[onclick="showSection('${sectionId}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Atualizar título
    const titles = {
        'rotina': 'Minha Rotina',
        'dashboard': 'Dashboard',
        'adicionar': 'Adicionar Exercício',
        'exercicios': 'Meus Exercícios',
        'calendario': 'Calendário',
        'evolucao': 'Evolução',
        'workout-session': 'Sessão de Treino'
    };
    
    const titleEl = document.getElementById('page-title');
    if (titleEl && titles[sectionId]) {
        titleEl.textContent = titles[sectionId];
    }
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Atualizar streak no header
function updateHeaderStreak() {
    const streak = calculateStreak();
    const streakEl = document.getElementById('header-streak');
    if (streakEl) {
        streakEl.textContent = `🔥 ${streak} dias`;
    }
}

// Carregar treinos do Supabase
async function loadWorkoutsFromSupabase() {
    try {
        console.log('🔄 Carregando treinos do Supabase...');
        
        // Verificar se Supabase está inicializado
        if (!supabase) {
            // Tentar inicializar novamente
            if (typeof window.supabase !== 'undefined') {
                const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
                const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';
                supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } else if (typeof Supabase !== 'undefined') {
                const SUPABASE_URL = 'https://nkbwiyvrblvylwibaxoy.supabase.co';
                const SUPABASE_ANON_KEY = 'sb_publishable_TQhWvoQrxpgnzStwGhMkBw_VtJyY2-r';
                supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            } else {
                throw new Error('Supabase não está configurado! Verifique se o script do Supabase foi carregado.');
            }
        }
        
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('workout_date', { ascending: false });
        
        if (error) {
            console.error('❌ Erro do Supabase:', error);
            throw error;
        }
        
        // Converter formato do banco para formato local
        if (data && data.length > 0) {
            workouts = data.map(workout => ({
                id: workout.id,
                exerciseName: workout.exercise_name,
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
                date: workout.workout_date,
                timestamp: new Date(workout.workout_date).getTime()
            }));
            
            // Salvar backup no localStorage
            localStorage.setItem('workouts', JSON.stringify(workouts));
            
            isOnline = true;
            console.log('✅ Dados carregados do Supabase:', workouts.length, 'treinos');
        } else {
            // Nenhum dado ainda, mas conexão OK
            workouts = [];
            isOnline = true;
            console.log('ℹ️ Nenhum treino no banco ainda. Pronto para receber dados!');
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar do Supabase:', error);
        
        let errorMsg = '⚠️ Não foi possível conectar ao banco de dados. ';
        if (error.message && error.message.includes('does not exist')) {
            errorMsg += 'A tabela não existe! Execute criar-tabela.sql no Supabase primeiro.';
        } else {
            errorMsg += 'Usando dados locais.';
        }
        
        // Tentar carregar do localStorage como fallback
        const localData = localStorage.getItem('workouts');
        if (localData) {
            workouts = JSON.parse(localData);
            isOnline = false;
            showNotification(errorMsg, 'warning');
        } else {
            workouts = [];
            showNotification(errorMsg, 'warning');
        }
    }
}

// Salvar treino no Supabase
async function saveWorkoutToSupabase(workout) {
    try {
        console.log('🔄 Tentando salvar no Supabase:', workout);
        
        // Verificar se Supabase está configurado
        if (!supabase) {
            throw new Error('Supabase não está configurado!');
        }
        
        const { data, error } = await supabase
            .from('workouts')
            .insert([{
                exercise_name: workout.exerciseName,
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
                workout_date: workout.date
            }])
            .select();
        
        if (error) {
            console.error('❌ Erro do Supabase:', error);
            throw error;
        }
        
        if (!data || data.length === 0) {
            throw new Error('Nenhum dado retornado do Supabase');
        }
        
        // Atualizar ID local com ID do banco
        workout.id = data[0].id;
        
        console.log('✅ Treino salvo no Supabase:', data[0]);
        showNotification(`✅ Treino salvo! ID: ${data[0].id}`, 'success');
        return true;
        
    } catch (error) {
        console.error('❌ Erro completo ao salvar no Supabase:', error);
        
        // Mensagem de erro mais detalhada
        let errorMsg = '⚠️ Erro ao salvar no banco de dados. ';
        
        if (error.message) {
            if (error.message.includes('does not exist')) {
                errorMsg += 'A tabela "workouts" não existe! Execute o SQL criar-tabela.sql no Supabase primeiro.';
            } else if (error.message.includes('permission denied')) {
                errorMsg += 'Sem permissão! Verifique as políticas RLS no Supabase.';
            } else {
                errorMsg += error.message;
            }
        } else {
            errorMsg += 'Verifique o console (F12) para mais detalhes.';
        }
        
        showNotification(errorMsg, 'error');
        
        // Salvar localmente como backup
        const localData = JSON.parse(localStorage.getItem('workouts') || '[]');
        localData.push(workout);
        localStorage.setItem('workouts', JSON.stringify(localData));
        
        return false;
    }
}

// Deletar treino do Supabase
async function deleteWorkoutFromSupabase(date, exerciseName) {
    try {
        const { error } = await supabase
            .from('workouts')
            .delete()
            .eq('workout_date', date)
            .eq('exercise_name', exerciseName);
        
        if (error) throw error;
        
        console.log('✅ Treino deletado do Supabase');
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao deletar do Supabase:', error);
        showNotification('⚠️ Erro ao deletar online', 'warning');
        return false;
    }
}

// Mostrar loading
function showLoading(show) {
    let loading = document.getElementById('loading-overlay');
    
    if (!loading) {
        loading = document.createElement('div');
        loading.id = 'loading-overlay';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;
        loading.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 12px; text-align: center;">
                <div style="font-size: 40px; margin-bottom: 15px;">⏳</div>
                <div style="font-size: 18px; color: #6366f1; font-weight: 600;">Carregando seus treinos...</div>
            </div>
        `;
        document.body.appendChild(loading);
    }
    
    loading.style.display = show ? 'flex' : 'none';
}

// Destacar o treino do dia atual
function highlightTodayWorkout() {
    const today = new Date().toLocaleLowerCase();
    const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    const dayIndex = new Date().getDay();
    const todayName = daysOfWeek[dayIndex];
    
    // Remover destaque de todos os dias
    document.querySelectorAll('.routine-day').forEach(day => {
        day.classList.remove('today');
    });
    
    // Adicionar destaque ao dia atual
    const todayCard = document.querySelector(`.routine-day[data-day="${todayName}"]`);
    if (todayCard) {
        todayCard.classList.add('today');
        todayCard.style.border = '3px solid #fbbf24';
        todayCard.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.5)';
    }
}

// Visualizar PDF do Supabase no modal
function viewRoutineFromSupabase(pdfFile, title) {
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfDownload = document.getElementById('pdf-download');
    
    // Obter URL pública do Supabase Storage
    const { data } = supabase.storage
        .from('workout-pdfs')
        .getPublicUrl(pdfFile);
    
    const publicUrl = data.publicUrl;
    
    modalTitle.textContent = title;
    pdfViewer.src = publicUrl;
    pdfDownload.href = publicUrl;
    pdfDownload.download = pdfFile;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fallback para PDFs locais (se ainda não fez upload)
function viewRoutine(pdfFile, title) {
    const modal = document.getElementById('pdf-modal');
    const modalTitle = document.getElementById('modal-title');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfDownload = document.getElementById('pdf-download');
    
    modalTitle.textContent = title;
    pdfViewer.src = pdfFile;
    pdfDownload.href = pdfFile;
    pdfDownload.download = pdfFile;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closePdfModal() {
    const modal = document.getElementById('pdf-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Limpar iframe
    document.getElementById('pdf-viewer').src = '';
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', (e) => {
    const modal = document.getElementById('pdf-modal');
    if (e.target === modal) {
        closePdfModal();
    }
});

// Fechar modal com tecla ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePdfModal();
    }
});

// Adicionar novo treino
async function handleAddWorkout(e) {
    e.preventDefault();
    
    const exerciseName = document.getElementById('exercise-name').value.trim();
    const sets = parseInt(document.getElementById('sets').value);
    const reps = parseInt(document.getElementById('reps').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const date = document.getElementById('workout-date').value;
    
    if (!exerciseName || !sets || !reps || !weight || !date) {
        showNotification('❌ Preencha todos os campos!', 'error');
        return;
    }
    
    const workout = {
        id: Date.now(),
        exerciseName,
        sets,
        reps,
        weight,
        date,
        timestamp: new Date(date).getTime()
    };
    
    // Adicionar à lista local primeiro (para UI responsiva)
    workouts.push(workout);
    workouts.sort((a, b) => b.timestamp - a.timestamp);
    renderExercises();
    updateExerciseSelect();
    
    // Limpar formulário
    document.getElementById('workout-form').reset();
    document.getElementById('workout-date').valueAsDate = new Date();
    
    // Salvar no Supabase (em background)
    showLoading(true);
    const saved = await saveWorkoutToSupabase(workout);
    showLoading(false);
    
    // Se salvou no Supabase, atualizar ID; se não, manter local
    if (!saved) {
        // Se falhou, já está na lista mas precisamos atualizar localStorage
        localStorage.setItem('workouts', JSON.stringify(workouts));
        // Recarregar para garantir sincronia
        await loadWorkoutsFromSupabase();
        renderExercises();
        updateExerciseSelect();
    } else {
        // Backup local também
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }
}

// Renderizar lista de exercícios
function renderExercises() {
    const container = document.getElementById('exercises-list');
    
    if (workouts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <div class="empty-state-text">Nenhum exercício registrado ainda.<br>Adicione seu primeiro treino acima!</div>
            </div>
        `;
        return;
    }
    
    // Agrupar por exercício e data
    const grouped = {};
    workouts.forEach(workout => {
        const key = `${workout.exerciseName}_${workout.date}`;
        if (!grouped[key]) {
            grouped[key] = [];
        }
        grouped[key].push(workout);
    });
    
    container.innerHTML = Object.values(grouped).map(group => {
        const workout = group[0];
        const totalSets = group.reduce((sum, w) => sum + w.sets, 0);
        const avgReps = Math.round(group.reduce((sum, w) => sum + w.reps, 0) / group.length);
        const maxWeight = Math.max(...group.map(w => w.weight));
        
        return `
            <div class="exercise-item">
                <div class="exercise-header">
                    <div>
                        <div class="exercise-name">${workout.exerciseName}</div>
                        <div class="exercise-date">${formatDate(workout.date)}</div>
                    </div>
                </div>
                <div class="exercise-details">
                    <div class="detail-item">
                        <div class="detail-label">Séries</div>
                        <div class="detail-value">${totalSets}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Repetições</div>
                        <div class="detail-value">${avgReps}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Carga Máx</div>
                        <div class="detail-value">${maxWeight} kg</div>
                    </div>
                </div>
                <button class="btn-delete" onclick="deleteWorkout('${workout.date}', '${workout.exerciseName}')">
                    Excluir
                </button>
            </div>
        `;
    }).join('');
}

// Deletar treino
async function deleteWorkout(date, exerciseName) {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
        showLoading(true);
        const deleted = await deleteWorkoutFromSupabase(date, exerciseName);
        showLoading(false);
        
        if (deleted) {
            workouts = workouts.filter(w => !(w.date === date && w.exerciseName === exerciseName));
            localStorage.setItem('workouts', JSON.stringify(workouts));
            
            renderExercises();
            updateExerciseSelect();
            
            // Limpar gráficos se necessário
            if (document.getElementById('exercise-select').value === exerciseName) {
                document.getElementById('exercise-select').value = '';
                handleExerciseSelect();
            }
            
            showNotification('✅ Treino excluído!', 'success');
        }
    }
}

// Atualizar select de exercícios
function updateExerciseSelect() {
    const select = document.getElementById('exercise-select');
    const uniqueExercises = [...new Set(workouts.map(w => w.exerciseName))].sort();
    
    select.innerHTML = '<option value="">Selecione um exercício</option>' +
        uniqueExercises.map(ex => `<option value="${ex}">${ex}</option>`).join('');
    
    // Atualizar também o select do dashboard
    if (typeof updateDashboardExerciseSelect === 'function') {
        updateDashboardExerciseSelect();
    }
    
    // Atualizar também o select do dashboard
    updateDashboardExerciseSelect();
}

// Selecionar exercício para ver evolução
let evolutionChart = null;

function handleExerciseSelect() {
    const exerciseName = document.getElementById('exercise-select').value;
    
    if (!exerciseName) {
        document.getElementById('evolution-chart-container').innerHTML = 
            '<canvas id="evolution-chart"></canvas>';
        document.getElementById('projection-container').innerHTML = 
            '<p class="info-text">Selecione um exercício para ver a projeção</p>';
        return;
    }
    
    // Filtrar treinos do exercício selecionado
    const exerciseWorkouts = workouts
        .filter(w => w.exerciseName === exerciseName)
        .sort((a, b) => a.timestamp - b.timestamp);
    
    if (exerciseWorkouts.length === 0) {
        document.getElementById('evolution-chart-container').innerHTML = 
            '<p class="info-text">Nenhum dado disponível para este exercício</p>';
        return;
    }
    
    // Renderizar gráfico
    renderEvolutionChart(exerciseWorkouts);
    
    // Renderizar projeção
    renderProjection(exerciseWorkouts);
}

// Renderizar gráfico de evolução
function renderEvolutionChart(exerciseWorkouts) {
    const ctx = document.getElementById('evolution-chart');
    
    // Agrupar por data e pegar melhor resultado do dia
    const dailyData = {};
    exerciseWorkouts.forEach(workout => {
        if (!dailyData[workout.date] || workout.weight > dailyData[workout.date].weight) {
            dailyData[workout.date] = workout;
        }
    });
    
    const dates = Object.keys(dailyData).sort();
    const weights = dates.map(date => dailyData[date].weight);
    const reps = dates.map(date => dailyData[date].reps);
    
    if (evolutionChart) {
        evolutionChart.destroy();
    }
    
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates.map(d => formatDate(d)),
            datasets: [
                {
                    label: 'Carga (kg)',
                    data: weights,
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y',
                    fill: true
                },
                {
                    label: 'Repetições',
                    data: reps,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    tension: 0.4,
                    yAxisID: 'y1',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Carga (kg)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Repetições'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Renderizar projeção
function renderProjection(exerciseWorkouts) {
    if (exerciseWorkouts.length < 2) {
        document.getElementById('projection-container').innerHTML = 
            '<p class="info-text">É necessário pelo menos 2 treinos para fazer uma projeção</p>';
        return;
    }
    
    // Agrupar por data e pegar melhor resultado do dia
    const dailyData = {};
    exerciseWorkouts.forEach(workout => {
        if (!dailyData[workout.date] || workout.weight > dailyData[workout.date].weight) {
            dailyData[workout.date] = workout;
        }
    });
    
    const dates = Object.keys(dailyData).sort();
    const weights = dates.map(date => dailyData[date].weight);
    const reps = dates.map(date => dailyData[date].reps);
    
    // Calcular tendência usando regressão linear simples
    const n = weights.length;
    const x = Array.from({length: n}, (_, i) => i);
    
    // Médias
    const xMean = x.reduce((a, b) => a + b, 0) / n;
    const yMean = weights.reduce((a, b) => a + b, 0) / n;
    
    // Calcular coeficientes
    let numerator = 0;
    let denominator = 0;
    for (let i = 0; i < n; i++) {
        numerator += (x[i] - xMean) * (weights[i] - yMean);
        denominator += Math.pow(x[i] - xMean, 2);
    }
    
    const slope = denominator !== 0 ? numerator / denominator : 0;
    const intercept = yMean - slope * xMean;
    
    // Projeção para próximo treino
    const nextX = n;
    const projectedWeight = slope * nextX + intercept;
    const lastWeight = weights[weights.length - 1];
    const avgReps = Math.round(reps.reduce((a, b) => a + b, 0) / reps.length);
    
    // Calcular aumento percentual
    const increase = ((projectedWeight - lastWeight) / lastWeight) * 100;
    const trend = increase > 0 ? 'up' : 'down';
    
    // Calcular volume total (séries * reps * peso) do último treino
    const lastWorkout = exerciseWorkouts[exerciseWorkouts.length - 1];
    const lastVolume = lastWorkout.sets * lastWorkout.reps * lastWorkout.weight;
    
    // Projeção de volume (assumindo mesma série e reps)
    const projectedVolume = lastWorkout.sets * avgReps * projectedWeight;
    const volumeIncrease = ((projectedVolume - lastVolume) / lastVolume) * 100;
    
    document.getElementById('projection-container').innerHTML = `
        <div class="projection-card">
            <div class="projection-title">${exerciseWorkouts[0].exerciseName}</div>
            <div class="projection-details">
                <div class="projection-item">
                    <div class="projection-label">Carga Atual</div>
                    <div class="projection-value">${lastWeight.toFixed(1)} kg</div>
                </div>
                <div class="projection-item">
                    <div class="projection-label">Carga Projetada</div>
                    <div class="projection-value">${projectedWeight.toFixed(1)} kg</div>
                    <div class="projection-trend trend-${trend}">
                        ${increase > 0 ? '↑' : '↓'} ${Math.abs(increase).toFixed(1)}%
                    </div>
                </div>
                <div class="projection-item">
                    <div class="projection-label">Repetições Sugeridas</div>
                    <div class="projection-value">${avgReps}</div>
                </div>
                <div class="projection-item">
                    <div class="projection-label">Volume Projetado</div>
                    <div class="projection-value">${projectedVolume.toFixed(0)} kg</div>
                    <div class="projection-trend trend-${volumeIncrease > 0 ? 'up' : 'down'}">
                        ${volumeIncrease > 0 ? '↑' : '↓'} ${Math.abs(volumeIncrease).toFixed(1)}%
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Formatar data
function formatDate(dateString) {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Notificação
function showNotification(message, type = 'success') {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    
    const colors = {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.success};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Adicionar animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===========================================
// CALENDÁRIO E FUNCIONALIDADES DE TREINO
// ===========================================

let currentCalendarDate = new Date();

// Renderizar calendário
function renderCalendar() {
    const container = document.getElementById('calendar-container');
    const monthYearEl = document.getElementById('current-month-year');
    
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Atualizar título
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    monthYearEl.textContent = `${monthNames[month]} ${year}`;
    
    // Primeiro dia do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    // Dados de treinos do mês
    const monthWorkouts = workouts.filter(w => {
        const workoutDate = new Date(w.date);
        return workoutDate.getFullYear() === year && workoutDate.getMonth() === month;
    });
    
    // Agrupar por dia
    const workoutsByDay = {};
    monthWorkouts.forEach(w => {
        const day = new Date(w.date).getDate();
        if (!workoutsByDay[day]) {
            workoutsByDay[day] = [];
        }
        workoutsByDay[day].push(w);
    });
    
    // Limpar container
    container.innerHTML = '';
    
    // Cabeçalho dos dias da semana
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekDays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.style.gridColumn = 'span 1';
        dayHeader.textContent = day;
        container.appendChild(dayHeader);
    });
    
    // Espaços vazios antes do primeiro dia
    for (let i = 0; i < startingDayOfWeek; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day';
        emptyDay.style.visibility = 'hidden';
        container.appendChild(emptyDay);
    }
    
    // Dias do mês
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        
        const dayDate = new Date(year, month, day);
        const isToday = dayDate.toDateString() === today.toDateString();
        const hasWorkout = workoutsByDay[day];
        
        if (isToday) dayEl.classList.add('today');
        if (hasWorkout) dayEl.classList.add('has-workout');
        
        dayEl.innerHTML = `
            <div class="calendar-day-number">${day}</div>
            ${hasWorkout ? `
                <div class="calendar-day-exercises">${hasWorkout.length} exercício${hasWorkout.length > 1 ? 's' : ''}</div>
                <div class="calendar-day-weight">${Math.max(...hasWorkout.map(w => w.weight))}kg</div>
            ` : ''}
        `;
        
        if (hasWorkout) {
            dayEl.onclick = () => showDayDetails(year, month, day, workoutsByDay[day]);
        }
        
        container.appendChild(dayEl);
    }
}

// Mostrar detalhes do dia
function showDayDetails(year, month, day, dayWorkouts) {
    const detailsEl = document.getElementById('day-details');
    const titleEl = document.getElementById('day-details-title');
    const exercisesEl = document.getElementById('day-exercises');
    
    const date = new Date(year, month, day);
    titleEl.textContent = `Treinos de ${formatDate(date.toISOString().split('T')[0])}`;
    
    exercisesEl.innerHTML = dayWorkouts.map(w => `
        <div class="day-exercise-item">
            <div class="day-exercise-name">${w.exerciseName}</div>
            <div class="day-exercise-details">
                <div class="day-exercise-detail">
                    <div class="day-exercise-detail-label">Séries</div>
                    <div class="day-exercise-detail-value">${w.sets}</div>
                </div>
                <div class="day-exercise-detail">
                    <div class="day-exercise-detail-label">Repetições</div>
                    <div class="day-exercise-detail-value">${w.reps}</div>
                </div>
                <div class="day-exercise-detail">
                    <div class="day-exercise-detail-label">Carga</div>
                    <div class="day-exercise-detail-value">${w.weight} kg</div>
                </div>
            </div>
        </div>
    `).join('');
    
    detailsEl.style.display = 'block';
    detailsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Mudar mês do calendário
function changeMonth(direction) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + direction);
    renderCalendar();
}

// Buscar peso anterior de um exercício
function getPreviousWeight(exerciseName) {
    const exerciseWorkouts = workouts
        .filter(w => w.exerciseName.toLowerCase() === exerciseName.toLowerCase())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (exerciseWorkouts.length > 0) {
        const lastWorkout = exerciseWorkouts[0];
        const lastDate = formatDate(lastWorkout.date);
        return {
            weight: lastWorkout.weight,
            sets: lastWorkout.sets,
            reps: lastWorkout.reps,
            date: lastDate
        };
    }
    return null;
}

// Iniciar treino (mostra exercícios do dia)
function startWorkout(day, dayName) {
    try {
        // Obter exercícios do dia
        const dayKey = day.toLowerCase();
        const exercises = workoutRoutines[dayKey] || [];
        
        if (exercises.length === 0) {
            showNotification('Nenhum exercício encontrado para este dia.', 'warning');
            return;
        }
        
        // Mostrar seção de sessão de treino
        showSection('workout-session');
        
        // Atualizar título
        const titleEl = document.getElementById('workout-session-title');
        if (titleEl) {
            titleEl.textContent = `💪 ${dayName}`;
        }
        
        // Definir data
        const daysOfWeek = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
        const todayIndex = new Date().getDay();
        const todayName = daysOfWeek[todayIndex];
        const workoutDate = day.toLowerCase() === todayName ? new Date() : new Date();
        
        const dateEl = document.getElementById('workout-session-date');
        if (dateEl) {
            dateEl.textContent = `Data: ${formatDate(workoutDate.toISOString().split('T')[0])}`;
        }
        
        // Renderizar exercícios
        renderWorkoutExercises(exercises, workoutDate);
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro ao iniciar treino:', error);
        showNotification('Erro ao iniciar treino. Tente novamente.', 'error');
    }
}

// Renderizar lista de exercícios da sessão de treino
function renderWorkoutExercises(exercises, workoutDate) {
    const container = document.getElementById('workout-exercises-list');
    if (!container) return;
    
    const dateStr = workoutDate.toISOString().split('T')[0];
    
    container.innerHTML = exercises.map((exercise, index) => {
        // Buscar peso anterior
        const previous = getPreviousWeight(exercise.name);
        const previousHint = previous ? `<div class="previous-hint">📊 Último: ${previous.weight}kg (${previous.reps} reps)</div>` : '';
        
        return `
            <div class="workout-exercise-card" data-exercise="${exercise.name}">
                <div class="workout-exercise-header">
                    <div class="workout-exercise-number">${index + 1}</div>
                    <div class="workout-exercise-info">
                        <h3>${exercise.name}</h3>
                        <div class="workout-exercise-preset">
                            ${exercise.sets} séries × ${exercise.reps} reps
                        </div>
                        ${previousHint}
                    </div>
                </div>
                <div class="workout-exercise-form">
                    <div class="form-row">
                        <div class="form-group">
                            <label>Séries</label>
                            <input type="number" class="exercise-sets" value="${exercise.sets}" min="1">
                        </div>
                        <div class="form-group">
                            <label>Repetições</label>
                            <input type="number" class="exercise-reps" value="${exercise.reps}" min="1">
                        </div>
                        <div class="form-group">
                            <label>Carga (kg)</label>
                            <input type="number" class="exercise-weight" value="${previous ? previous.weight : ''}" min="0" step="0.5" placeholder="0" required>
                        </div>
                    </div>
                    <button class="btn-primary btn-add-exercise" onclick="addExerciseFromSession('${exercise.name}', '${dateStr}', ${index})">
                        ✅ Adicionar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Adicionar exercício da sessão de treino
async function addExerciseFromSession(exerciseName, dateStr, index) {
    try {
        const card = document.querySelectorAll('.workout-exercise-card')[index];
        if (!card) return;
        
        const sets = parseInt(card.querySelector('.exercise-sets').value) || 3;
        const reps = parseInt(card.querySelector('.exercise-reps').value) || 10;
        const weight = parseFloat(card.querySelector('.exercise-weight').value) || 0;
        
        if (weight <= 0) {
            showNotification('Por favor, informe a carga utilizada.', 'warning');
            return;
        }
        
        const workout = {
            exerciseName: exerciseName,
            sets: sets,
            reps: reps,
            weight: weight,
            date: dateStr,
            timestamp: new Date(dateStr).getTime()
        };
        
        // Adicionar ao array
        workouts.push(workout);
        
        // Salvar no Supabase
        await saveWorkoutToSupabase(workout);
        
        // Marcar como adicionado
        card.classList.add('completed');
        const btn = card.querySelector('.btn-add-exercise');
        btn.textContent = '✅ Adicionado';
        btn.disabled = true;
        btn.classList.add('disabled');
        
        // Atualizar interface
        renderExercises();
        updateExerciseSelect();
        updateDashboard();
        updateHeaderStreak();
        
        showNotification(`✅ ${exerciseName} adicionado!`, 'success');
        
    } catch (error) {
        console.error('Erro ao adicionar exercício:', error);
        showNotification('Erro ao adicionar exercício. Tente novamente.', 'error');
    }
}

// Fechar sessão de treino
function closeWorkoutSession() {
    showSection('rotina');
}

// Mostrar dica de peso anterior
function showPreviousWeightHint(exerciseName, previous) {
    removePreviousWeightHint();
    
    const formGroup = document.getElementById('exercise-name').parentElement;
    const hint = document.createElement('div');
    hint.className = 'previous-weight-hint';
    hint.id = 'previous-weight-hint';
    hint.innerHTML = `
        <strong>📊 Último treino de ${exerciseName}:</strong><br>
        ${previous.date} - ${previous.sets}x${previous.reps} com ${previous.weight}kg
    `;
    formGroup.appendChild(hint);
    
    // Preencher automaticamente se quiser
    const weightInput = document.getElementById('weight');
    if (!weightInput.value) {
        weightInput.value = previous.weight;
        weightInput.style.borderColor = '#10b981';
        setTimeout(() => {
            weightInput.style.borderColor = '';
        }, 2000);
    }
}

// Remover dica de peso anterior
function removePreviousWeightHint() {
    const hint = document.getElementById('previous-weight-hint');
    if (hint) hint.remove();
}

// Atualizar calendário quando workouts mudarem
// Sobrescrever renderExercises para atualizar calendário também
const originalRenderExercises = renderExercises;
renderExercises = function() {
    originalRenderExercises();
    renderCalendar();
    updateDashboard();
    updateHeaderStreak();
};

