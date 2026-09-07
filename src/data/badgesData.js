export const BADGES = [
  {
    id: 'guardiao_propria_vida',
    missaoId: 1,
    nome: 'Guardião da Própria Vida',
    descricao: 'Concluiu a Missão 01. Dominou o combate às 4 ameaças do náufrago, vestimenta térmica e adriçamento automático do Colete Tipo I (SOLAS).',
    icone: '🛡️',
    raridade: 'Especialista Individual',
    cor: '#00e5ff',
    xpMinimo: 300
  },
  {
    id: 'mestre_aguas_telecom',
    missaoId: 2,
    nome: 'Mestre das Águas & Telecom',
    descricao: 'Concluiu a Missão 02. Dominou o desviramento de balsa, o escape hidrostático com elo fraco e a sinalização via EPIRB, SART e pirotecnia.',
    icone: '📡',
    raridade: 'Comandante de Balsa',
    cor: '#d4af37',
    xpMinimo: 800
  },
  {
    id: 'naufrago_resiliente',
    missaoId: 3,
    nome: 'Náufrago Resiliente',
    descricao: 'Concluiu a Missão 03. Dominou o racionamento hídrico, posturas térmicas (HELP e Agrupada) e o protocolo de extração vertical com helicóptero SAR.',
    icone: '🚁',
    raridade: 'Veterano de Resgate',
    cor: '#ff9800',
    xpMinimo: 1400
  },
  {
    id: 'solas_master',
    missaoId: 4,
    nome: 'Herói do Mar — SOLAS Master',
    descricao: 'Conquista Suprema de Salvatagem. Superou todos os desafios com louvor e prontidão operacional sob os padrões da Marinha do Brasil e Convenção SOLAS.',
    icone: '🎖️',
    raridade: 'Lenda da Salvatagem',
    cor: '#ff3b30',
    xpMinimo: 1800
  }
];

export const PATENTES = [
  { nome: 'Praticante de Salvatagem', xpMinimo: 0, icone: '⚓' },
  { nome: 'Marinheiro de Resgate', xpMinimo: 400, icone: '🛟' },
  { nome: 'Mestre de Manobra & Balsas', xpMinimo: 900, icone: '🌊' },
  { nome: 'Comandante de Operações SAR', xpMinimo: 1600, icone: '⭐' }
];

export function calcularPatente(xp) {
  let patenteAtual = PATENTES[0];
  for (const p of PATENTES) {
    if (xp >= p.xpMinimo) {
      patenteAtual = p;
    }
  }
  return patenteAtual;
}
