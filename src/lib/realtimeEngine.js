import { supabase, isSupabaseConfigured } from './supabaseClient';
import { db, ref, set, onValue, push, isFirebaseConfigured } from './firebaseClient';

class RealtimeEngine {
  constructor() {
    this.roomCode = 'EPM2026';
    this.channel = null;
    this.broadcastChannel = null;
    this.firebaseUnsubscribes = [];
    this.listeners = new Set();
    this.state = {
      missaoAtual: 1,
      etapaIndex: 0,
      tipoConteudo: 'slides', // 'slides', 'storytelling', 'video', 'esquema', 'dinamica'
      slideAtualIndex: 0,
      isBlackout: false,
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

    // 2. Conecta ao Firebase Realtime Database se configurado
    if (isFirebaseConfigured() && db) {
      try {
        // Limpa listeners antigos se houver
        this.firebaseUnsubscribes.forEach(unsub => unsub && unsub());
        this.firebaseUnsubscribes = [];

        // Escuta o estado da sala
        const stateRef = ref(db, `salas/${this.roomCode}/state`);
        const unsubState = onValue(stateRef, (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.state = { ...this.state, ...val };
            this.notifyListeners();
          }
        });
        this.firebaseUnsubscribes.push(unsubState);

        // Escuta participantes
        const partRef = ref(db, `salas/${this.roomCode}/participantes`);
        const unsubPart = onValue(partRef, (snapshot) => {
          const val = snapshot.val();
          if (val) {
            const list = Object.values(val);
            list.forEach((remoteP) => {
              if (!remoteP || !remoteP.nome) return;
              const idx = this.participantes.findIndex(
                (localP) => localP.nome.toLowerCase() === remoteP.nome.toLowerCase()
              );
              if (idx >= 0) {
                this.participantes[idx] = {
                  ...this.participantes[idx],
                  ...remoteP,
                  xp: Math.max(this.participantes[idx].xp || 0, remoteP.xp || 0),
                  badges: Array.from(new Set([...(this.participantes[idx].badges || []), ...(remoteP.badges || [])]))
                };
              } else {
                this.participantes.push(remoteP);
              }
            });
            this.notifyListeners();
          }
        });
        this.firebaseUnsubscribes.push(unsubPart);

        // Escuta respostas
        const respRef = ref(db, `salas/${this.roomCode}/respostas`);
        const unsubResp = onValue(respRef, (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.respostas = Object.values(val);
            this.notifyListeners();
          }
        });
        this.firebaseUnsubscribes.push(unsubResp);

        // Escuta dúvidas
        const duvRef = ref(db, `salas/${this.roomCode}/duvidas`);
        const unsubDuv = onValue(duvRef, (snapshot) => {
          const val = snapshot.val();
          if (val) {
            this.duvidas = Object.values(val).reverse();
            this.notifyListeners();
          }
        });
        this.firebaseUnsubscribes.push(unsubDuv);

        console.log(`[Firebase] Conectado à sala ${this.roomCode}`);
      } catch (err) {
        console.warn('[Firebase] Erro ao conectar:', err);
      }
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

    // Grava no Firebase Realtime Database se configurado
    if (isFirebaseConfigured() && db) {
      try {
        if (type === 'UPDATE_STATE') {
          set(ref(db, `salas/${this.roomCode}/state`), { ...this.state, ...payload });
        } else if (type === 'JOIN_PARTICIPANT') {
          const pKey = payload.nome.replace(/[.#$[\]]/g, '_');
          set(ref(db, `salas/${this.roomCode}/participantes/${pKey}`), payload);
        } else if (type === 'SUBMIT_ANSWER') {
          push(ref(db, `salas/${this.roomCode}/respostas`), payload);
          // Atualiza também o nó do participante correspondente no Firebase
          const part = this.participantes.find((item) => item.nome.toLowerCase() === (payload.participanteNome || '').toLowerCase());
          if (part) {
            const pKey = part.nome.replace(/[.#$[\]]/g, '_');
            set(ref(db, `salas/${this.roomCode}/participantes/${pKey}`), part);
          }
        } else if (type === 'SUBMIT_DOUBT') {
          push(ref(db, `salas/${this.roomCode}/duvidas`), payload);
        }
      } catch (e) {
        console.warn('[Firebase Emit Err]', e);
      }
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
        const existingIdx = this.participantes.findIndex(
          (item) => item.nome.toLowerCase() === (p.nome || '').toLowerCase()
        );
        if (existingIdx >= 0) {
          const existing = this.participantes[existingIdx];
          this.participantes[existingIdx] = {
            ...existing,
            ...p,
            xp: Math.max(existing.xp || 0, p.xp || 0),
            badges: Array.from(new Set([...(existing.badges || []), ...(p.badges || [])]))
          };
        } else {
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

        // Atualiza XP e Badges do participante
        const part = this.participantes.find(
          (item) => item.nome.toLowerCase() === (resp.participanteNome || '').toLowerCase()
        );
        if (part) {
          if (resp.correta) {
            part.xp = (part.xp || 0) + (resp.xpGanho || 0);
          }
          if (resp.newBadge && !part.badges.includes(resp.newBadge)) {
            part.badges.push(resp.newBadge);
          }

          // Persiste localmente os dados do aluno
          if (typeof window !== 'undefined') {
            try {
              const pKey = part.nome.replace(/[.#$[\]]/g, '_');
              localStorage.setItem(`epm_aluno_${this.roomCode}_${pKey}`, JSON.stringify(part));
            } catch (e) {}
          }

          // Persiste no Firebase
          if (isFirebaseConfigured() && db) {
            try {
              const pKey = part.nome.replace(/[.#$[\]]/g, '_');
              set(ref(db, `salas/${this.roomCode}/participantes/${pKey}`), part);
            } catch (e) {
              console.warn('[Firebase Save Part Err]', e);
            }
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
      tipoConteudo: 'slides',
      slideAtualIndex: 0,
      isBlackout: false,
      videoAtivoId: null,
      dinamicaAtiva: false,
      perguntaAtiva: null
    });
  }

  setSlide(slideIndex, isBlackout = false) {
    this.emit('UPDATE_STATE', {
      tipoConteudo: 'slides',
      slideAtualIndex: slideIndex,
      isBlackout: Boolean(isBlackout)
    });
  }

  setBlackout(isBlackout) {
    this.emit('UPDATE_STATE', {
      isBlackout: Boolean(isBlackout)
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
    const nomeLimpo = (nome || 'Marinheiro').trim();
    const pKey = nomeLimpo.replace(/[.#$[\]]/g, '_');

    // 1. Verifica se já existe na lista de participantes em memória
    let student = this.participantes.find(
      (item) => item.nome.toLowerCase() === nomeLimpo.toLowerCase()
    );

    // 2. Se não estiver em memória, tenta recuperar do localStorage
    if (!student && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`epm_aluno_${this.roomCode}_${pKey}`);
        if (saved) {
          student = JSON.parse(saved);
        }
      } catch (e) {}
    }

    // 3. Se ainda não existir, cria o registro inicial
    if (!student) {
      student = {
        id: 'student_' + Math.random().toString(36).substring(2, 9),
        nome: nomeLimpo,
        patente: 'Praticante de Salvatagem',
        xp: 0,
        badges: []
      };
    } else {
      student = {
        ...student,
        nome: nomeLimpo,
        xp: student.xp || 0,
        badges: student.badges || []
      };
    }

    // Atualiza/insere na lista de participantes
    const idx = this.participantes.findIndex(
      (item) => item.nome.toLowerCase() === nomeLimpo.toLowerCase()
    );
    if (idx >= 0) {
      this.participantes[idx] = { ...this.participantes[idx], ...student };
    } else {
      this.participantes.push(student);
    }

    // Salva no localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`epm_aluno_${this.roomCode}_${pKey}`, JSON.stringify(student));
        localStorage.setItem('epm_last_nome_guerra', nomeLimpo);
      } catch (e) {}
    }

    this.emit('JOIN_PARTICIPANT', student);
    return student;
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
