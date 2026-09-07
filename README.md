# ⚓ EPM — LMS Dual-Screen: Técnicas de Sobrevivência Pessoal (TSP)
> **Ensino Profissional Marítimo — Diretoria de Portos e Costas (DPC) / Marinha do Brasil**  
> *Em conformidade com a Convenção SOLAS e Código LSA (Life-Saving Appliances).*

Aplicação web LMS de alta performance projetada para uso em **duas telas simultâneas (Dual-Screen)**:
- 🖥️ **Visão do Telão (Instrutor):** Exibe o Storytelling do naufrágio, as 12 Pílulas de Vídeo Microlearning (≤ 7 min), o cronômetro tático regressivo, o Placar de Líderes (Leaderboard) e o Sinalizador de Dúvidas ao vivo.
- 📱 **Visão do Smartphone (Aluno):** Interface tátil focada na tomada de decisão imediata, resposta a quizzes sob pressão, desafios de pares (*Peer Instruction / Método Mazur*), inventário de medalhas (Badges) e infográficos técnicos de bolso.

---

## 🚀 Como Executar Localmente

### 1. Pré-requisitos
- Node.js v18 ou superior instalado.

### 2. Instalação e Execução
```bash
# Entrar no diretório do projeto
cd c:/Projetos/Marinha/EPM

# Instalar as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

Abra no navegador:
- **Página Inicial / Seletor:** `http://localhost:5173/`
- **Telão da Sala (Instrutor):** `http://localhost:5173/telao`
- **Terminal do Aluno (Smartphone):** `http://localhost:5173/aluno`

> 💡 **Modo Híbrido Automático:** O sistema possui um motor de sincronização local inteligente (`BroadcastChannel API`). Mesmo sem configurar o Supabase, você pode abrir duas abas ou janelas no seu computador e testar a sincronização em tempo real na hora!

---

## 🌐 Como Configurar o Supabase (Para sincronização em nuvem / celulares reais)

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. No menu lateral esquerdo do Supabase, clique em **SQL Editor**.
3. Abra o arquivo [`supabase/schema.sql`](./supabase/schema.sql) deste projeto, copie todo o conteúdo e cole no SQL Editor do Supabase. Clique em **Run**.
4. No menu lateral, acesse **Project Settings** -> **API**.
5. Copie os valores de:
   - `Project URL`
   - `anon public key`
6. Crie um arquivo `.env` na raiz deste projeto com esses valores:
   ```env
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
   ```

---

## 📦 Como Hospedar no GitHub

Execute no terminal:

```bash
# 1. Inicializar o repositório git (se ainda não estiver inicializado)
git init

# 2. Adicionar os arquivos
git add .

# 3. Criar o commit inicial
git commit -m "feat: LMS Dual-Screen de Salvatagem Marítima EPM/DPC"

# 4. Conectar ao seu repositório no GitHub (crie um novo repo em github.com/new)
git remote add origin https://github.com/SEU-USUARIO/epm-lms-salvatagem.git

# 5. Enviar para o GitHub
git branch -M main
git push -u origin main
```

---

## ⚡ Como Publicar na Vercel com o domínio `epm.vercel.app`

1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta do GitHub.
2. Clique em **"Add New..."** -> **"Project"**.
3. Selecione o repositório `epm-lms-salvatagem` que você acabou de enviar ao GitHub.
4. Em **Project Name**, digite `epm` (se o nome `epm` estiver disponível, o domínio será automaticamente `https://epm.vercel.app`). Caso o nome já esteja em uso por outro usuário global da Vercel, você poderá escolher `epm-marinha.vercel.app` ou configurar seu domínio próprio.
5. Na seção **Environment Variables**, adicione as variáveis do Supabase:
   - `VITE_SUPABASE_URL` = `https://seu-projeto.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `sua-chave-anon-publica`
6. Clique em **Deploy**.
7. O arquivo [`vercel.json`](./vercel.json) já está configurado para garantir o roteamento SPA das rotas `/telao` e `/aluno` sem nenhum erro 404!

---

## 🎮 Estrutura Pedagógica das 3 Missões

| Missão | Tema Oficial DPC / SOLAS | Pílulas de Vídeo | Badge Conquistado |
| :--- | :--- | :--- | :--- |
| **Missão 01: Alarme Geral** | Psicologia, 4 Inimigos, Coletes Tipo I a IV e Muster List | 4 Vídeos (≤ 7 min) | 🛡️ **Guardião da Própria Vida** |
| **Missão 02: Abandono Tático** | Balsas Infláveis, Escape Hidrostático, EPIRB e SART | 4 Vídeos (≤ 7 min) | 📡 **Mestre das Águas & Telecom** |
| **Missão 03: Resgate Oceânico** | Hipotermia, Jejum de Água e Resgate com Helicóptero | 4 Vídeos (≤ 7 min) | 🚁 **Náufrago Resiliente** |
| **Conclusão Geral** | Aprovação e Desempenho Operacional Máximo | Revisão Técnica | 🎖️ **Herói do Mar — SOLAS Master** |

---

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React 18, Vite 5.
- **Estilo:** Vanilla CSS Moderno com Design System Militar Naval, paleta SOLAS e tokens táticos.
- **Áudio:** Web Audio API nativa (Alarme Geral SOLAS 7 curtos + 1 longo, sonar naval e efeitos táteis).
- **Backend em Tempo Real:** Supabase Realtime (WebSockets) + Fallback via BroadcastChannel API.
- **Interação Mobile:** QR Code dinâmico, Haptic feedback (vibração) e confetes táticos.
