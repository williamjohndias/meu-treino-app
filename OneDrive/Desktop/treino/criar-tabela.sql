-- Criar tabela de treinos
CREATE TABLE IF NOT EXISTS workouts (
    id BIGSERIAL PRIMARY KEY,
    exercise_name TEXT NOT NULL,
    sets INTEGER NOT NULL,
    reps INTEGER NOT NULL,
    weight DECIMAL(10, 2) NOT NULL,
    workout_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_workouts_exercise_name ON workouts(exercise_name);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);

-- Habilitar acesso público
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso público aos treinos" 
ON workouts
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger para atualizar data
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workouts_updated_at 
BEFORE UPDATE ON workouts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

