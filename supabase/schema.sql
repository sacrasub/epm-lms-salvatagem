-- ================================================================
-- ESQUEMA SUPABASE — LMS SALVATAGEM NO MAR (EPM / MARINHA DO BRASIL)
-- Curso: Técnicas de Sobrevivência Pessoal (TSP)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ================================================================

-- 1. Criação da Tabela de Salas de Aula
CREATE TABLE IF NOT EXISTS salas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    titulo TEXT DEFAULT 'Turma CAAQ/EPM - TSP',
    missao_atual INT DEFAULT 1,
    etapa_index INT DEFAULT 0,
    dinamica_ativa BOOLEAN DEFAULT false,
    pergunta_ativa JSONB DEFAULT NULL,
    timer_fim TIMESTAMPTZ DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criação da Tabela de Participantes (Alunos)
CREATE TABLE IF NOT EXISTS participantes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sala_codigo TEXT NOT NULL REFERENCES salas(codigo) ON DELETE CASCADE,
    nome_guerra TEXT NOT NULL,
    patente TEXT DEFAULT 'Praticante de Salvatagem',
    xp_total INT DEFAULT 0,
    badges TEXT[] DEFAULT ARRAY[]::TEXT[],
    online BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(sala_codigo, nome_guerra)
);

-- 3. Criação da Tabela de Respostas e Decisões Táticas
CREATE TABLE IF NOT EXISTS respostas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sala_codigo TEXT NOT NULL,
    participante_id UUID NOT NULL REFERENCES participantes(id) ON DELETE CASCADE,
    pergunta_id TEXT NOT NULL,
    opcao TEXT NOT NULL,
    correta BOOLEAN NOT NULL,
    tempo_ms INT DEFAULT 0,
    xp_ganho INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Criação da Tabela de Sinalizador de Dúvidas (S.O.S. Teórico)
CREATE TABLE IF NOT EXISTS duvidas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sala_codigo TEXT NOT NULL,
    participante_nome TEXT NOT NULL,
    texto TEXT NOT NULL,
    respondida BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Configuração de Políticas de Segurança (Row Level Security - RLS)
-- Como é um ambiente de sala de aula interativa, permitimos acesso com a chave ANON
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE participantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvidas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público leitura/escrita em salas" ON salas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público leitura/escrita em participantes" ON participantes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público leitura/escrita em respostas" ON respostas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Acesso público leitura/escrita em duvidas" ON duvidas FOR ALL USING (true) WITH CHECK (true);

-- 6. Habilitação do Supabase Realtime para sincronização instantânea
-- Permite que inserts/updates sejam transmitidos aos canais WebSocket
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'salas') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE salas;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'participantes') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE participantes;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'respostas') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE respostas;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'duvidas') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE duvidas;
    END IF;
END
$$;

-- 7. Inserção de Sala Padrão de Demonstração
INSERT INTO salas (codigo, titulo, missao_atual, etapa_index)
VALUES ('EPM2026', 'Turma de Salvatagem Marítima 2026', 1, 0)
ON CONFLICT (codigo) DO NOTHING;
