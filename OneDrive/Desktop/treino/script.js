// Gerenciamento de dados
let workouts = [];
let isOnline = true;

// Inicialização
document.addEventListener('DOMContentLoaded', async () => {
    // Definir data padrão como hoje
    document.getElementById('workout-date').valueAsDate = new Date();
    
    // Event listeners
    document.getElementById('workout-form').addEventListener('submit', handleAddWorkout);
    document.getElementById('exercise-select').addEventListener('change', handleExerciseSelect);
    
    // Mostrar loading
    showLoading(true);
    
    // Carregar dados do Supabase
    await loadWorkoutsFromSupabase();
    
    // Carregar interface
    renderExercises();
    updateExerciseSelect();
    
    // Destacar treino do dia atual
    highlightTodayWorkout();
    
    // Esconder loading
    showLoading(false);
});

// Carregar treinos do Supabase
async function loadWorkoutsFromSupabase() {
    try {
        const { data, error } = await supabase
            .from('workouts')
            .select('*')
            .order('workout_date', { ascending: false });
        
        if (error) throw error;
        
        // Converter formato do banco para formato local
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
        
    } catch (error) {
        console.error('❌ Erro ao carregar do Supabase:', error);
        
        // Tentar carregar do localStorage como fallback
        const localData = localStorage.getItem('workouts');
        if (localData) {
            workouts = JSON.parse(localData);
            isOnline = false;
            showNotification('⚠️ Modo offline - usando dados locais', 'warning');
        }
    }
}

// Salvar treino no Supabase
async function saveWorkoutToSupabase(workout) {
    try {
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
        
        if (error) throw error;
        
        // Atualizar ID local com ID do banco
        workout.id = data[0].id;
        
        console.log('✅ Treino salvo no Supabase:', data[0]);
        return true;
        
    } catch (error) {
        console.error('❌ Erro ao salvar no Supabase:', error);
        showNotification('⚠️ Erro ao salvar online - salvo localmente', 'warning');
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

// Visualizar PDF no modal
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
    
    const workout = {
        id: Date.now(),
        exerciseName,
        sets,
        reps,
        weight,
        date,
        timestamp: new Date(date).getTime()
    };
    
    // Salvar no Supabase
    showLoading(true);
    const saved = await saveWorkoutToSupabase(workout);
    showLoading(false);
    
    if (saved) {
        workouts.push(workout);
        workouts.sort((a, b) => b.timestamp - a.timestamp);
        
        // Backup local
        localStorage.setItem('workouts', JSON.stringify(workouts));
        
        renderExercises();
        updateExerciseSelect();
        
        // Limpar formulário
        document.getElementById('workout-form').reset();
        document.getElementById('workout-date').valueAsDate = new Date();
        
        // Mostrar feedback
        showNotification('✅ Exercício adicionado com sucesso!', 'success');
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

