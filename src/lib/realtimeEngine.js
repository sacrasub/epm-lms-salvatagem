import { supabase, isSupabaseConfigured } from './supabaseClient';

class RealtimeEngine {
  constructor() {
    this.roomCode = 'EPM2026';
    this.channel = null;
    this.broadcastChannel = null;
    this.listeners = new Set();
    this.state = {
      missaoAtual: 1,
      etapaIndex: 0,
      tipoConteudo: 'storytelling', // 'storytelling', 'video', 'esquema', 'dinamica'
      videoAtivoId: null,
      dinamicaAtiva: false,
      perguntaAtiva: null,
      timerFim: null,
      segundosRestantes: 0
    };
    this.participantes = [];
    this.respostas = [];
    this.duvidas = [];
  }

  init(roomCode = 'EPM2026') {
    this.roomCode = roomCode;

    // 1. Inicializa canal local BroadcastChannel para fallback instantâneo
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      if (this.broadcastChannel) {
        this.broadcastChannel.close();
      }
      this.broadcastChannel = new BroadcastChannel(`epm_room_${this.roomCode}`);
      this.broadcastChannel.onmessage = (event) => {
        this.handleIncomingMessage(event.data);
      };
    }

    // 2. Tenta conectar ao Supabase Realtime se configurado
    if (isSupabaseConfigured() && supabase) {
      try {
        if (this.channel) {
          supabase.removeChannel(this.channel);
        }

        this.channel = supabase.channel(`room_${this.roomCode}`, {
          config: {
            broadcast: { self: false }
          }
        });

        this.channel
          .on('broadcast', { event: 'EPM_EVENT' }, ({ payload }) => {
            this.handleIncomingMessage(payload);
          })
          .subscribe((status) => {
            console.log(`[Supabase Realtime] Canal ${this.roomCode}: ${status}`);
          });
      } catch (err) {
        console.warn('[RealtimeEngine] Erro ao conectar canal Supabase, usando canal local:', err);
      }
    }

    // Carrega estado persistido localmente se houver
    const localSaved = localStorage.getItem(`epm_state_${this.roomCode}`);
    if (localSaved) {
      try {
        const parsed = JSON.parse(localSaved);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        // ignora
      }
    }

    const localPart = localStorage.getItem(`epm_part_${this.roomCode}`);
    if (localPart) {
      try {
        this.participantes = JSON.parse(localPart);
      } catch (e) {}
    }

    const localResp = localStorage.getItem(`epm_resp_${this.roomCode}`);
    if (localResp) {
      try {
        this.respostas = JSON.parse(localResp);
      } catch (e) {}
    }

    const localDuv = localStorage.getItem(`epm_duv_${this.roomCode}`);
    if (localDuv) {
      try {
        this.duvidas = JSON.parse(localDuv);
      } catch (e) {}
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    // Dispara imediatamente o estado atual para quem acabou de se inscrever
    callback({
      state: this.state,
      participantes: this.participantes,
      respostas: this.respostas,
      duvidas: this.duvidas
    });

    return () => {
      this.listeners.delete(callback);
    };
  }

  notifyListeners() {
    const snapshot = {
      state: { ...this.state },
      participantes: [...this.participantes],
      respostas: [...this.respostas],
      duvidas: [...this.duvidas]
    };

    // Salva localmente
    localStorage.setItem(`epm_state_${this.roomCode}`, JSON.stringify(this.state));
    localStorage.setItem(`epm_part_${this.roomCode}`, JSON.stringify(this.participantes));
    localStorage.setItem(`epm_resp_${this.roomCode}`, JSON.stringify(this.respostas));
    localStorage.setItem(`epm_duv_${this.roomCode}`, JSON.stringify(this.duvidas));

    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (e) {
        console.error(e);
      }
    });
  }

  emit(type, payload) {
    const message = { type, payload, timestamp: Date.now() };

    // Dispara no canal de broadcast local
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage(message);
    }

    // Dispara no Supabase Realtime Broadcast se configurado
    if (isSupabaseConfigured() && this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'EPM_EVENT',
        payload: message
      }).catch((e) => console.warn('[Supabase Broadcast Err]', e));
    }

    // Processa localmente
    this.handleIncomingMessage(message);
  }

  handleIncomingMessage(message) {
    if (!message || !message.type) return;

    switch (message.type) {
      case 'UPDATE_STATE':
        this.state = { ...this.state, ...message.payload };
        break;

      case 'JOIN_PARTICIPANT': {
        const p = message.payload;
        const exists = this.participantes.find((item) => item.nome === p.nome);
        if (!exists) {
          this.participantes.push({
            id: p.id || String(Date.now()),
            nome: p.nome,
            patente: p.patente || 'Praticante de Salvatagem',
            xp: p.xp || 0,
            badges: p.badges || []
          });
        }
        break;
      }

      case 'SUBMIT_ANSWER': {
        const resp = message.payload;
        this.respostas.push(resp);

        // Atualiza XP do participante
        const part = this.participantes.find((item) => item.nome === resp.participanteNome);
        if (part) {
          part.xp = (part.xp || 0) + (resp.xpGanho || 0);
          if (resp.newBadge && !part.badges.includes(resp.newBadge)) {
            part.badges.push(resp.newBadge);
          }
        }
        break;
      }

      case 'SUBMIT_DOUBT': {
        this.duvidas.unshift({
          id: String(Date.now()),
          aluno: message.payload.aluno,
          texto: message.payload.texto,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
        break;
      }

      case 'RESET_ROOM':
        this.respostas = [];
        this.duvidas = [];
        break;

      default:
        break;
    }

    this.notifyListeners();
  }

  // Ações do Instrutor / Telão
  setMission(missaoId) {
    this.emit('UPDATE_STATE', {
      missaoAtual: missaoId,
      etapaIndex: 0,
      tipoConteudo: 'storytelling',
      videoAtivoId: null,
      dinamicaAtiva: false,
      perguntaAtiva: null
    });
  }

  setEtapa(etapaIndex, tipoConteudo, videoAtivoId = null) {
    this.emit('UPDATE_STATE', {
      etapaIndex,
      tipoConteudo,
      videoAtivoId,
      dinamicaAtiva: false,
      perguntaAtiva: null
    });
  }

  triggerDynamic(pergunta, tempoSegundos) {
    const timerFim = Date.now() + tempoSegundos * 1000;
    this.emit('UPDATE_STATE', {
      dinamicaAtiva: true,
      tipoConteudo: 'dinamica',
      perguntaAtiva: pergunta,
      timerFim,
      segundosRestantes: tempoSegundos
    });
  }

  closeDynamic() {
    this.emit('UPDATE_STATE', {
      dinamicaAtiva: false,
      perguntaAtiva: null,
      timerFim: null,
      segundosRestantes: 0
    });
  }

  // Ações do Aluno / Smartphone
  registerStudent(nome) {
    const newStudent = {
      id: 'student_' + Math.random().toString(36).substring(2, 9),
      nome: nome.trim(),
      patente: 'Praticante de Salvatagem',
      xp: 0,
      badges: []
    };
    this.emit('JOIN_PARTICIPANT', newStudent);
    return newStudent;
  }

  submitAnswer(participanteNome, perguntaId, opcaoId, correta, tempoMs, xpGanho, newBadge = null) {
    this.emit('SUBMIT_ANSWER', {
      id: 'resp_' + Date.now(),
      participanteNome,
      perguntaId,
      opcaoId,
      correta,
      tempoMs,
      xpGanho,
      newBadge,
      created_at: new Date().toISOString()
    });
  }

  sendDoubt(aluno, texto) {
    this.emit('SUBMIT_DOUBT', { aluno, texto });
  }

  resetRoom() {
    this.emit('RESET_ROOM', {});
  }
}

export const realtimeEngine = new RealtimeEngine();
