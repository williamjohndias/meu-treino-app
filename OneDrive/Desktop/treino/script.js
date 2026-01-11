// Gerenciamento de dados
let workouts = JSON.parse(localStorage.getItem('workouts')) || [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Definir data padrão como hoje
    document.getElementById('workout-date').valueAsDate = new Date();
    
    // Event listeners
    document.getElementById('workout-form').addEventListener('submit', handleAddWorkout);
    document.getElementById('exercise-select').addEventListener('change', handleExerciseSelect);
    
    // Carregar dados
    renderExercises();
    updateExerciseSelect();
});

// Adicionar novo treino
function handleAddWorkout(e) {
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
    
    workouts.push(workout);
    workouts.sort((a, b) => b.timestamp - a.timestamp); // Mais recentes primeiro
    
    saveWorkouts();
    renderExercises();
    updateExerciseSelect();
    
    // Limpar formulário
    document.getElementById('workout-form').reset();
    document.getElementById('workout-date').valueAsDate = new Date();
    
    // Mostrar feedback
    showNotification('Exercício adicionado com sucesso!');
}

// Salvar no localStorage
function saveWorkouts() {
    localStorage.setItem('workouts', JSON.stringify(workouts));
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
function deleteWorkout(date, exerciseName) {
    if (confirm('Tem certeza que deseja excluir este treino?')) {
        workouts = workouts.filter(w => !(w.date === date && w.exerciseName === exerciseName));
        saveWorkouts();
        renderExercises();
        updateExerciseSelect();
        
        // Limpar gráficos se necessário
        if (document.getElementById('exercise-select').value === exerciseName) {
            document.getElementById('exercise-select').value = '';
            handleExerciseSelect();
        }
        
        showNotification('Treino excluído!');
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
function showNotification(message) {
    // Criar elemento de notificação
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
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

