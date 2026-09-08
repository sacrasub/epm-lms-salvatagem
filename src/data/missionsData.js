export const MISSIONS = [
  {
    id: 1,
    codigo: 'MISSAO_01',
    dia: 'DIA 08',
    titulo: 'Missão 01: Operação Alarme Geral — O Naufrágio e o Escudo Individual',
    subtitulo: 'Fundamentos da Sobrevivência, Psicologia, 4 Inimigos e Equipamentos Individuais',
    cargaHoraria: 'Dia 08 — 2h (19h às 21h)',
    badgeId: 'guardiao_propria_vida',
    slidesPdf: '/slides/TSP Dia 08 - Maritime_Survival_Tactics.pdf',
    slidesTitulo: 'Slides de Aula — Dia 08: Maritime Survival Tactics',
    slidesCount: 12,
    slidesImages: Array.from({ length: 12 }, (_, i) => `/slides/dia08/slide-${String(i + 1).padStart(2, '0')}.webp`),
    infograficoUrl: '/assets/Guia_Técnico_de_Sobrevivência_Pessoal.png',
    infograficoTitulo: 'Infográfico Técnico — Equipamentos Individuais & Tabela Mestra',
    briefing: 'Alarme Geral de Emergência soou no meio da noite! Um abalroamento comprometeu a estanqueidade do casco. Sua primeira missão é combater o pânico imediato, reconhecer as 4 ameaças mortais e equipar seu escudo térmico individual.',
    videos: [
      {
        id: 'v1_1',
        titulo: 'Pílula 1.1: Os 4 Grandes Inimigos do Náufrago',
        duracao: '6 min',
        url: '/videos/Como_Derrotar_os_4_Inimigos_do_Náufrago.mp4',
        foco: 'Controle psicológico do pânico, afogamento, exposição climática e o perigo mortal da ingestão de água salgada.'
      },
      {
        id: 'v1_2',
        titulo: 'Pílula 1.2: A Ciência do Colete Salva-Vidas Tipo I',
        duracao: '5 min',
        url: '/videos/A_Ciência_do_Colete_Salva-Vidas_Tipo_I.mp4',
        foco: 'Diferenças de homologação DPC e o recurso de adriçamento automático para desvirar vítimas inconscientes em até 5 segundos.'
      },
      {
        id: 'v1_3',
        titulo: 'Pílula 1.3: Como Roupas de Sobrevivência Vencem o Frio Extremo',
        duracao: '6 min',
        url: '/videos/Como_Roupas_de_Sobrevivência_Vencem_o_Frio_Extremo.mp4',
        foco: 'Condutividade térmica da água (24x maior que o ar) e uso das roupas de imersão e TPAs aluminizados.'
      },
      {
        id: 'v1_4',
        titulo: 'Pílula 1.4: O Cérebro da Sobrevivência Naval (Muster List)',
        duracao: '5 min',
        url: '/videos/O_Cérebro_da_Sobrevivência_Naval.mp4',
        foco: 'A importância da Tabela Mestra, sinal de 7 apitos curtos e 1 longo e funções de emergência.'
      }
    ],
    esquemasVisuais: [
      {
        id: 'esq_1',
        titulo: 'Anatomia do Colete Salva-Vidas Tipo I (SOLAS)',
        pontosChave: [
          'Centro de gravidade deslocado para desvirar o corpo desacordado',
          'Flutuabilidade mínima de 150 N para mar aberto',
          'Acessórios obrigatórios: Apito naval, fita retrorrefletora e luz estroboscópica acionada por água'
        ],
        regraOuro: 'NUNCA salte de grandes alturas com o colete sem travá-lo firmemente com as mãos cruzadas sobre o peito.'
      },
      {
        id: 'esq_2',
        titulo: 'As 4 Ameaças Pós-Abandono',
        pontosChave: [
          '1. AFOGAMENTO: Controlado pelo colete e combate ao pânico',
          '2. EXPOSIÇÃO: Hipotermia mata antes da sede ou da fome',
          '3. SEDE: Proibição absoluta de beber água do mar',
          '4. FOME: Sobrevive-se semanas sem comida se houver hidratação'
        ],
        regraOuro: 'A água do mar acelera a desidratação celular devido à alta concentração de sal nos rins.'
      }
    ],
    dinamicas: [
      {
        id: 'din_1_1',
        tipo: 'quiz_pressao',
        titulo: 'Desafio Tático: O Alarme da Madrugada',
        tempoSegundos: 45,
        pontosXP: 150,
        enunciado: 'O Alarme Geral de Emergência (7 curtos e 1 longo) soou às 02h00. Há fumaça e a temperatura externa é de 11°C. Qual sua conduta imediata regulamentar antes de seguir ao Posto de Reunião?',
        opcoes: [
          { id: 'A', texto: 'Correr imediatamente descalço para a balsa salva-vidas no convés de embarque para garantir vaga.' },
          { id: 'B', texto: 'Vestir roupas quentes de lã/algodão de manga longa, calçado fechado e pegar o colete salva-vidas.', correta: true },
          { id: 'C', texto: 'Ir até a ponte de comando para confirmar com o Comandante se não é alarme falso.' },
          { id: 'D', texto: 'Pular diretamente na água com o colete salva-vidas já inflado para se afastar da fumaça.' }
        ],
        explicacao: 'A SOLAS e o manual de TSP determinam que o náufrago deve se agasalhar ao máximo com roupas de mangas compridas e calçado para retardar a perda térmica corporal (hipotermia) e pegar o colete antes de ir ao seu posto de reunião.',
        referencia: 'SOLAS Cap. III / NORMAM-01 / DPC'
      },
      {
        id: 'din_1_2',
        tipo: 'peer_instruction',
        titulo: 'Debate Tático de Pares: O Marinheiro Inconsciente',
        tempoSegundos: 60,
        pontosXP: 200,
        enunciado: 'Um tripulante desacordado foi lançado à água. Qual característica exclusiva do Colete Salva-Vidas Tipo I (SOLAS) é vital para salvar sua vida?',
        opcoes: [
          { id: 'A', texto: 'Possui rádio transmissor embutido que envia sinal automático para a guarda costeira.' },
          { id: 'B', texto: 'Possui formato anatômico que desvira automaticamente o náufrago com as vias aéreas para fora da água em até 5 segundos.', correta: true },
          { id: 'C', texto: 'Possui aquecimento químico alimentado por água salgada.' },
          { id: 'D', texto: 'Tem flutuabilidade permanente que suporta até 4 pessoas simultâneas apoiadas.' }
        ],
        explicacao: 'O Colete Tipo I (classe marítima internacional) possui maior flutuabilidade na parte frontal do tórax, obrigando o corpo a girar sobre o eixo hidrostático e mantendo a boca e nariz a pelo menos 12 cm acima da linha d\'água mesmo se o tripulante estiver desacordado.',
        referencia: 'Código LSA (Life-Saving Appliances) Seção 2.2'
      }
    ]
  },
  {
    id: 2,
    codigo: 'MISSAO_02',
    dia: 'DIA 09',
    titulo: 'Missão 02: Operação Abandono Tático — Fuga Coletiva e O Chamado de Socorro',
    subtitulo: 'Embarcações de Sobrevivência vs. Salvamento, Escape Hidrostático e Telecomunicações',
    cargaHoraria: 'Dia 09 — 2h (19h às 21h)',
    badgeId: 'mestre_aguas_telecom',
    slidesPdf: '/slides/TSP Dia 09 - Engenharia_da_Sobrevivência.pdf',
    slidesTitulo: 'Slides de Aula — Dia 09: Engenharia da Sobrevivência',
    slidesCount: 15,
    slidesImages: Array.from({ length: 15 }, (_, i) => `/slides/dia09/slide-${String(i + 1).padStart(2, '0')}.webp`),
    infograficoUrl: '/assets/Guia_de_Sobrevivência_Marítima.png',
    infograficoTitulo: 'Infográfico Técnico — Lançamentos, Eletrônica de Socorro e Pirotécnicos',
    briefing: 'A ordem oficial de abandono foi dada! O navio aderna rapidamente. Sua missão é coordenar o lançamento das balsas infláveis, garantir a atuação do escape hidrostático e ativar os guardiões eletrônicos de socorro (EPIRB e SART).',
    videos: [
      {
        id: 'v2_1',
        titulo: 'Pílula 2.1: Sobrevivência vs. Salvamento — A Grande Diferença',
        duracao: '5 min',
        url: '/videos/Diferença_Entre_Sobrevivência_e_Salvamento.mp4',
        foco: 'Distinção tática entre embarcações de sobrevivência (passivas para abrigo, balsas e baleeiras) e embarcações de salvamento (ativas para resgate rápido).'
      },
      {
        id: 'v2_2',
        titulo: 'Pílula 2.2: Sobrevivência na Prática — Como Desvirar uma Balsa',
        duracao: '6 min',
        url: '/videos/Sobrevivência_na_Prática__Como_Desvirar_uma_Balsa.mp4',
        foco: 'Técnica de alinhamento com o vento, subida no cilindro de gás e uso das tiras de endireitamento no fundo da balsa.'
      },
      {
        id: 'v2_3',
        titulo: 'Pílula 2.3: Como a Tecnologia Encontra Náufragos (EPIRB vs. SART)',
        duracao: '6 min',
        url: '/videos/Como_a_Tecnologia_Encontra_Náufragos.mp4',
        foco: 'EPIRB 406 MHz (satélites COSPAS-SARSAT) vs. SART 9 GHz (Banda X de radares navais a curta distância).'
      },
      {
        id: 'v2_4',
        titulo: 'Pílula 2.4: Como Usar os Sinais Pirotécnicos de Salvatagem',
        duracao: '5 min',
        url: '/videos/Como_Usar_os_Sinais_Pirotécnicos_de_Salvatagem.mp4',
        foco: 'Foguete com paraquedas (300m de altitude), facho manual vermelho a sotavento e fumígeno laranja diurno.'
      }
    ],
    esquemasVisuais: [
      {
        id: 'esq_3',
        titulo: 'O Mecanismo de Flutuação Livre (Escape Hidrostático)',
        pontosChave: [
          'Profundidade de ativação: 1.5 a 4.0 metros',
          'A pressão hidrostática corta o retém mecânico',
          'A balsa flutua, a boça desenrola e abre a válvula de CO2',
          'O Elo Fraco (Weak Link) rompe com tração de ~2.2 kN'
        ],
        regraOuro: 'NUNCA amarre a boça de disparo com nós fixos no berço sem passar pelo elo fraco.'
      },
      {
        id: 'esq_4',
        titulo: 'Diferença Tática: EPIRB vs. SART',
        pontosChave: [
          'EPIRB: Frequência 406.0 MHz | Cobertura Global via Satélite | Identificação única MMSI da embarcação',
          'SART: Frequência 9.2 - 9.5 GHz | Cobertura Tática Local (8 a 10 milhas) | Gera 12 pontos na tela de radar Banda X'
        ],
        regraOuro: 'O SART deve ser mantido na posição vertical o mais alto possível dentro da balsa inflável.'
      }
    ],
    dinamicas: [
      {
        id: 'din_2_1',
        tipo: 'quiz_pressao',
        titulo: 'Simulação Crítica: Afundamento Repentino',
        tempoSegundos: 40,
        pontosXP: 180,
        enunciado: 'O navio naufragou antes que a tripulação pudesse arriar manualmente a balsa inflável. O que acontece com a balsa presa em seu berço?',
        opcoes: [
          { id: 'A', texto: 'A balsa vai para o fundo com o navio e fica perdida.' },
          { id: 'B', texto: 'O dispositivo hidrostático dispara entre 1.5m e 4m de profundidade, a balsa sobe, infla e o elo fraco se rompe soltando-a na superfície.', correta: true },
          { id: 'C', texto: 'O sensor elétrico da balsa envia um pulso para o guincho do navio ejetar a balsa.' },
          { id: 'D', texto: 'A balsa infla dentro do berço e quebra a estrutura de metal do navio.' }
        ],
        explicacao: 'O dispositivo hidrostático (ex: Hammar H20) tem lâmina ativada pela pressão da água entre 1.5 e 4m. A balsa flutua livremente, a boça aciona o gás e o elo fraco (feixe de menor resistência) rompe para que o navio afundando não arraste a balsa para as profundezas.',
        referencia: 'Código LSA Seção 4.1.6'
      },
      {
        id: 'din_2_2',
        tipo: 'peer_instruction',
        titulo: 'Desafio Tático: Radar Banda X & Pirotecnia',
        tempoSegundos: 50,
        pontosXP: 200,
        enunciado: 'Em noite escura de mar agitado, o Oficial de Quarto de uma fragata de resgate detecta uma linha de 12 pontos luminosos em seu radar. Qual o significado e como o náufrago na balsa deve proceder?',
        opcoes: [
          { id: 'A', texto: 'É o alarme da EPIRB; o náufrago deve disparar imediatamente todos os foguetes paraquedas.' },
          { id: 'B', texto: 'É o SART ativado; o náufrago deve usar o VHF no Canal 16 e acionar um facho manual vermelho a sotavento ao avistar o navio.', correta: true },
          { id: 'C', texto: 'É um submarino; o náufrago deve apagar todas as luzes da balsa.' },
          { id: 'D', texto: 'É um defeito do radar da fragata; deve-se ignorar até o amanhecer.' }
        ],
        explicacao: 'Os 12 pontos no radar Banda X (9 GHz) são a assinatura inconfundível do transponder SART interrogado pelo radar do navio. Ao notar que o navio se aproxima (os pontos viram arcos), o náufrago usa o VHF 16 e aciona o facho manual apontando a sotavento (a favor do vento) para evitar que faíscas queimem o tecido da balsa.',
        referencia: 'GMDSS / SOLAS Cap. IV'
      }
    ]
  },
  {
    id: 3,
    codigo: 'MISSAO_03',
    dia: 'DIA 10',
    titulo: 'Missão 03: Operação Resgate Oceânico — A Batalha dos Primeiros 20 Minutos e a Extração Vertical',
    subtitulo: 'Fainas Práticas, Sobrevivência na Água Gelada, Racionamento Fisiológico e Resgate SAR com Helicóptero',
    cargaHoraria: 'Dia 10 — 2h (19h às 21h)',
    badgeId: 'naufrago_resiliente',
    slidesPdf: '/slides/TSP Dia 10 - Tactical_Marine_Survival.pdf',
    slidesTitulo: 'Slides de Aula — Dia 10: Tactical Marine Survival',
    slidesCount: 15,
    slidesImages: Array.from({ length: 15 }, (_, i) => `/slides/dia10/slide-${String(i + 1).padStart(2, '0')}.webp`),
    infograficoUrl: '/assets/Guia_de_Sobrevivência_e_Emergência.png',
    infograficoTitulo: 'Infográfico Técnico — Abandono, Hipotermia, Helicóptero e Racionamento',
    briefing: 'Vocês estão na balsa há mais de 18 horas. O mar está hostil e os recursos são limitados. A aeronave SAR do Esquadrão de Helicópteros da Marinha do Brasil acaba de pairar sobre a balsa! Execute os protocolos de segurança de voo e garanta a sobrevivência de todos.',
    videos: [
      {
        id: 'v3_1',
        titulo: 'Pílula 3.1: Física do Resgate — A Tensão Entre Navio e Helicóptero',
        duracao: '6 min',
        url: '/videos/Física_do_Resgate__A_Tensão_Entre_Navio_e_Helicóptero.mp4',
        foco: 'Perigo do rotor wash, descarga eletrostática obrigatória do cabo de içamento e proibição absoluta de amarrar o cabo.'
      },
      {
        id: 'v3_2',
        titulo: 'Pílula 3.2: Como Sobreviver ao Frio Extremo no Mar',
        duracao: '6 min',
        url: '/videos/Como_Sobreviver_ao_Frio_Extremo_no_Mar.mp4',
        foco: 'Proibição de nadar (perda rápida de calor), postura individual HELP e Posição Agrupada (Huddle) para proteção mútua.'
      },
      {
        id: 'v3_3',
        titulo: 'Pílula 3.3: A Caixa de Ferramentas da Sobrevivência no Mar',
        duracao: '6 min',
        url: '/videos/A_Caixa_de_Ferramentas_da_Sobrevivência_no_Mar.mp4',
        foco: 'Palamenta da balsa: âncora flutuante (estabilidade e deriva), machadinha de corte rápido, esponjas e heliógrafo.'
      },
      {
        id: 'v3_4',
        titulo: 'Pílula 3.4: Por Que Náufragos Fazem Jejum de Água',
        duracao: '6 min',
        url: '/videos/Por_Que_Náufragos_Fazem_Jejum_de_Água.mp4',
        foco: 'Disciplina fisiológica das primeiras 24 horas, controle da cinetose com comprimidos de enjoo e dotação hídrica.'
      }
    ],
    esquemasVisuais: [
      {
        id: 'esq_5',
        titulo: 'Faina de Resgate com Helicóptero (Protocolo SAR da Marinha)',
        pontosChave: [
          '1. DESCARGA ESTÁTICA: Deixe o gancho do guincho tocar na água ou no convés metálico antes de tocá-lo com as mãos!',
          '2. NUNCA AMARRAR: O cabo de aço do guincho NUNCA deve ser fixado à balsa ou ao navio (risco de queda da aeronave).',
          '3. OBJETOS SOLTOS: Remova bonés, panos ou sacolas soltas que possam ser sugados pela turbina ou rotor.'
        ],
        regraOuro: 'Entre no sling de resgate com o anel passando sob os braços e as costas bem apoiadas.'
      },
      {
        id: 'esq_6',
        titulo: 'Regra de Ouro do Racionamento na Balsa',
        pontosChave: [
          'Primeiras 24 Horas: NENHUMA água doce deve ser consumida (exceto feridos e queimados graves).',
          'A partir do 2º Dia: 500 ml de água potável por pessoa dividida em 3 tomadas diárias.',
          'Ração Alimentar: Blocos compactados de glicose/carboidrato (10.000 kJ por pessoa). Não consumir ração se não houver água disponível!'
        ],
        regraOuro: 'A digestão de proteínas e gorduras exige grande consumo de água corporal.'
      }
    ],
    dinamicas: [
      {
        id: 'din_3_1',
        tipo: 'quiz_pressao',
        titulo: 'Simulação Tática SAR: O Cabo de Aço do Helicóptero',
        tempoSegundos: 35,
        pontosXP: 200,
        enunciado: 'O helicóptero SAR da Marinha paira sobre a balsa e arria o cabo de aço do guincho com o sling de resgate. Qual a PRIMEIRA ação obrigatória do náufrago antes de segurar o cabo?',
        opcoes: [
          { id: 'A', texto: 'Segurar o cabo no ar com força para evitar que ele balance com o vento do rotor.' },
          { id: 'B', texto: 'Deixar o cabo e o gancho tocarem primeiro na água para descarregar a alta carga de eletricidade estática acumulada pela aeronave.', correta: true },
          { id: 'C', texto: 'Amarrar o cabo de aço firmemente na borda da balsa salva-vidas para estabilizá-la.' },
          { id: 'D', texto: 'Acionar um facho manual pirotécnico bem embaixo das pás do helicóptero para guiar o piloto.' }
        ],
        explicacao: 'O atrito das pás com o ar gera milhares de volts de eletricidade estática. Se o náufrago tocar no gancho antes do contato com a água ou solo, sofrerá um choque violento que pode levá-lo à perda de consciência. Amarrar o cabo ao navio pode derrubar a aeronave se houver movimento do mar.',
        referencia: 'Manual IAMSAR Vol. III / DPC'
      },
      {
        id: 'din_3_2',
        tipo: 'peer_instruction',
        titulo: 'Debate Fisiológico: O Tabu da Água nas Primeiras 24 Horas',
        tempoSegundos: 55,
        pontosXP: 200,
        enunciado: 'São 16 horas após o abandono do navio em clima quente. Um tripulante jovem, em bom estado físico, suplica por um copo de água. Por que o líder da balsa DEVE manter a proibição do consumo de água nas primeiras 24h?',
        opcoes: [
          { id: 'A', texto: 'Porque a água da balsa precisa de 24 horas para decantar e se tornar potável.' },
          { id: 'B', texto: 'Porque o organismo humano ainda possui reservas hídricas suficientes e ingerir água precocemente acelera a excreção renal e vômitos decorrentes da cinetose (enjoo marítimo).', correta: true },
          { id: 'C', texto: 'Porque a Convenção SOLAS estabelece que a água só pode ser consumida por náufragos que sabem nadar.' },
          { id: 'D', texto: 'Porque o corpo deve primeiro esgotar todas as reservas de carboidratos antes de receber qualquer líquido.' }
        ],
        explicacao: 'Nas primeiras 24 horas, o náufrago está sob forte impacto da cinetose (enjoo do mar com náuseas). Beber água provoca vômitos imediatos, fazendo o corpo perder não só a água ingerida, mas também os fluidos e eletrólitos gástricos vitais. Além disso, o rim conserva líquidos quando estimulado.',
        referencia: 'Manual de Sobrevivência no Mar DPC / SOLAS'
      }
    ]
  }
];
