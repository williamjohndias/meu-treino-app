-- Script SQL para criar a estrutura do banco de dados
-- Execute este script no SQL Editor do Supabase: https://supabase.com/dashboard/project/nkbwiyvrblvylwibaxoy/editor

-- Criar tabela de treinos (workouts)
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

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_workouts_exercise_name ON workouts(exercise_name);
CREATE INDEX IF NOT EXISTS idx_workouts_date ON workouts(workout_date);
CREATE INDEX IF NOT EXISTS idx_workouts_created_at ON workouts(created_at);

-- Habilitar Row Level Security (RLS)
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;

-- Criar política de acesso público (já que não temos autenticação por enquanto)
-- ATENÇÃO: Em produção, você deve implementar autenticação de usuários!
CREATE POLICY "Permitir acesso público completo aos treinos" 
ON workouts
FOR ALL
USING (true)
WITH CHECK (true);

-- Criar trigger para atualizar updated_at automaticamente
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

-- Comentários nas tabelas
COMMENT ON TABLE workouts IS 'Tabela para armazenar os registros de treinos dos usuários';
COMMENT ON COLUMN workouts.exercise_name IS 'Nome do exercício (ex: Supino, Agachamento)';
COMMENT ON COLUMN workouts.sets IS 'Número de séries realizadas';
COMMENT ON COLUMN workouts.reps IS 'Número de repetições realizadas';
COMMENT ON COLUMN workouts.weight IS 'Carga utilizada em kg';
COMMENT ON COLUMN workouts.workout_date IS 'Data em que o treino foi realizado';

