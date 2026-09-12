// Motor de Pareamento Dinâmico para Discussão entre Pares (Peer Instruction) - M20
import { realtimeEngine } from './realtimeEngine';

class PeerEngine {
  constructor() {
    this.activePairs = new Map();
  }

  /**
   * Emparelha aleatoriamente participantes para rodada de discussão de 60s
   */
  generatePairs(participantes = []) {
    const shuffled = [...participantes].sort(() => 0.5 - Math.random());
    const pairs = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      if (i + 1 < shuffled.length) {
        pairs.push({
          p1: shuffled[i].nome,
          p2: shuffled[i + 1].nome
        });
      } else {
        // Ímpar: junta com a última dupla formando um trio
        if (pairs.length > 0) {
          pairs[pairs.length - 1].p3 = shuffled[i].nome;
        } else {
          pairs.push({ p1: shuffled[i].nome, p2: 'Instrutor Naval' });
        }
      }
    }
    return pairs;
  }

  /**
   * Encontra o par designado para determinado aluno
   */
  findMyPartner(nomeAluno, pairs = []) {
    const cleanNome = (nomeAluno || '').toLowerCase();
    for (const pair of pairs) {
      if (pair.p1?.toLowerCase() === cleanNome) return pair.p2;
      if (pair.p2?.toLowerCase() === cleanNome) return pair.p1;
      if (pair.p3?.toLowerCase() === cleanNome) return `${pair.p1} e ${pair.p2}`;
    }
    return 'Companheiro de Bordo';
  }
}

export const peerEngine = new PeerEngine();
