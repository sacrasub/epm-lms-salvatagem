// Anotações Didáticas & Diretrizes Oficiais DPC / NORMAM-05 por Slide
// Exibição exclusiva no Cockpit do Apresentador (Laptop do Instrutor)

export const INSTRUCTOR_NOTES = {
  // ==========================================
  // DIA 08 — MISSÃO 01: OPERAÇÃO ALARME GERAL
  // ==========================================
  dia08: {
    1: {
      titulo: 'Abertura & Apresentação da Disciplina TSP',
      pontosChave: [
        'Apresentar o objetivo do CAAQ-BC: formar marítimos aptos a agir com sangue frio e precisão técnica em emergências extremas no mar.',
        'Enfatizar o marco regulatório: Convenção SOLAS 74/78 Capítulo III e NORMAM-05/DPC.',
        'Explicar o conceito de Sobrevivência Pessoal: a vida do tripulante depende primeiramente da sua própria conduta antes do socorro externo.'
      ],
      dicaPedagogica: 'Pergunte à turma se alguém já vivenciou um alarme real a bordo. Use o relato para capturar a atenção imediata.',
      acaoRecomendada: 'Manter tom imersivo. Preparar para acionar o Alarme Geral no próximo slide.'
    },
    2: {
      titulo: 'Cenário de Crise: O Abandono e os Primeiros 60 Segundos',
      pontosChave: [
        'A decisão de abandonar o navio é competência EXCLUSIVA do Comandante.',
        'Estatística marítima: 70% das fatalidades ocorrem nos primeiros 15 minutos pós-abandono por pânico e choque térmico.',
        'Ordem de ação: vestir roupas quentes, pegar o colete salva-vidas e deslocar-se ao Posto de Reunião com calma.'
      ],
      dicaPedagogica: 'Ressalte que ninguém deve saltar na água sem ordem expressa do oficial responsável pelo posto.',
      acaoRecomendada: '🚨 MOMENTO IDEAL: Clicar no botão "Soar Alarme SOLAS" para ambientar o cenário.'
    },
    3: {
      titulo: 'Psicologia do Náufrago & A Tríade do Pânico',
      pontosChave: [
        'O pânico é contagioso e compromete a capacidade de julgamento motor fino.',
        'A vontade inabalável de viver (Will to Live) é o fator psicológico mais decisivo documentado pela Marinha.',
        'Ações para conter o pânico: respirar fundo, focar nas tarefas da Tabela Mestra e acatar ordens da cadeia de comando.'
      ],
      dicaPedagogica: 'Destaque que o náufrago calmo economiza oxigênio, preserva calorias e reduz a perda de calor corporal.',
      acaoRecomendada: null
    },
    4: {
      titulo: 'Os 4 Grandes Inimigos do Náufrago',
      pontosChave: [
        '1. AFOGAMENTO: Prevenido pelo colete e combate à hiperventilação.',
        '2. HIPOTERMIA (Exposição): A água rouba calor 24 a 26 vezes mais rápido que o ar.',
        '3. DESIDRATAÇÃO (Sede): Proibição absoluta e categórica de beber água do mar.',
        '4. FOME: O corpo humano tolera até 30 dias sem alimento, mas apenas poucos dias sem água.'
      ],
      dicaPedagogica: 'Pergunta de prova da DPC: Por que a água salgada mata? (Causa falência renal acelerada por sobrecarga osmótica).',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 1.1" para exibir o vídeo de 6 min no projetor.'
    },
    5: {
      titulo: 'Colete Salva-Vidas Classe I (SOLAS / Mar Aberto)',
      pontosChave: [
        'Flutuabilidade mínima obrigatória: 150 N para adultos.',
        'Material resistente a chamas de hidrocarbonetos por pelo menos 2 segundos.',
        'Acessórios obrigatórios: apito naval sem esfera móvel, fita retrorrefletora SOLAS e luz de localização acionada por contato com a água (duração mínima 8h, intensidade 0.75 cd).'
      ],
      dicaPedagogica: 'Mostre o colete físico em sala se disponível. Demonstre o ajuste firme das fitas abdominais.',
      acaoRecomendada: null
    },
    6: {
      titulo: 'A Ciência do Adriçamento Automático',
      pontosChave: [
        'Tempo limite SOLAS: deve desvirar uma pessoa inconsciente com a face para cima em no máximo 5 SEGUNDOS.',
        'Boca e nariz devem ficar suspensos a pelo menos 12 cm acima da lâmina d\'água.',
        'Ângulo de inclinação do tronco para trás entre 20° e 50° para evitar aspiração de espuma marinha.'
      ],
      dicaPedagogica: 'Ponto crítico de prova do CAAQ-BC: "Em quanto tempo o colete classe I desvira a vítima?" -> 5 segundos.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 1.2" (A Ciência do Colete Tipo I).'
    },
    7: {
      titulo: 'Roupas de Imersão e Ajudas Térmicas (TPA)',
      pontosChave: [
        'Roupa de Imersão (Immersion Suit): Neoprene de 5mm, cobre 100% do corpo exceto o rosto, permite vestir em menos de 2 minutos sem auxílio.',
        'Evita queda de temperatura interna superior a 2°C após 6h em águas a 0°C - 2°C.',
        'TPA (Thermal Protective Aid): Saco térmico aluminizado impermeável que reduz perda por evaporação e radiação.'
      ],
      dicaPedagogica: 'Explique que o TPA não é flutuador: deve ser usado DENTRO da balsa ou por cima do colete.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 1.3" (Como Roupas Vencem o Frio).'
    },
    8: {
      titulo: 'Técnica Padronizada de Salto na Água',
      pontosChave: [
        'Regra n° 1: NUNCA salte de cabeça. Somente em pé, pernas esticadas e pés cruzados.',
        'Mão direita: cobre boca e nariz, com os dedos travando a aba superior do colete.',
        'Mão esquerda: aperta o cotovelo oposto e trava a lateral do colete para baixo.',
        'Olhar fixo no horizonte (não olhar para baixo para não desequilibrar).'
      ],
      dicaPedagogica: 'Faça os alunos ficarem em pé na sala e executarem a postura de salto simultaneamente.',
      acaoRecomendada: null
    },
    9: {
      titulo: 'A Tabela Mestra (Muster List) e Sinais Sonoros',
      pontosChave: [
        'Alarme Geral de Emergência: 7 apitos curtos seguidos de 1 apito longo.',
        'Sinal de Abandono de Navio: Ordem verbal direta do Comandante por megafone/PA, complementada por sinal específico.',
        'Cada tripulante possui número e função definida (preparador de balsa, operador de rádio, socorrista).'
      ],
      dicaPedagogica: 'Enfatize: Ninguém inventa função na hora da crise. Cada um cumpre exatamente sua atribuição na Tabela Mestra.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 1.4" (O Cérebro da Sobrevivência Naval).'
    },
    10: {
      titulo: 'Posições de Conservação Térmica: HELP e HUDDLE',
      pontosChave: [
        'Posição H.E.L.P. (Heat Escape Lessening Posture): Para náufrago isolado — joelhos dobrados contra o peito, braços colados às axilas.',
        'Posição HUDDLE (Abraço Coletivo): Para grupos — náufragos abraçados peito com peito, crianças/feridos no centro.',
        'Reduz a taxa de resfriamento corporal em até 50% em comparação a nadar sem rumo.'
      ],
      dicaPedagogica: 'Ponto chave: NUNCA nade para se aquecer! Nadar aumenta a perda térmica através da circulação periférica.',
      acaoRecomendada: null
    },
    11: {
      titulo: 'Simulação Tática: Desafio de Pressão',
      pontosChave: [
        'Aplicação do Método Mazur (Peer Instruction) com os smartphones dos alunos.',
        'Momento de avaliar se os alunos assimilaram as prioridades do abandono.',
        'Tempo de resposta limitado a 45 segundos para treinar a tomada de decisão sob estresse.'
      ],
      dicaPedagogica: 'Peça silêncio na sala nos primeiros 30s de resposta individual e estimule a discussão em duplas se houver divergência.',
      acaoRecomendada: '⚡ MOMENTO CRÍTICO: Clicar em "Disparar Desafio Tático" para abrir o Quiz 1.1 nos celulares.'
    },
    12: {
      titulo: 'Debriefing do Dia 08 & Síntese Operacional',
      pontosChave: [
        'Revisão dos 4 inimigos e do tempo de adriçamento do colete (5s).',
        'Parabenizar os alunos pelo engajamento nas dinâmicas e mostrar o placar.',
        'Introdução ao Dia 09: Balsa salva-vidas, engate hidrostático e técnicas de sobrevivência coletiva.'
      ],
      dicaPedagogica: 'Abra 5 minutos para responder às principais dúvidas enviadas pelo aplicativo.',
      acaoRecomendada: '🏆 RECOMENDAÇÃO: Clicar em "Exibir Placar" para mostrar o ranking do Dia 08 aos alunos.'
    }
  },

  // ==========================================
  // DIA 09 — MISSÃO 02: ENGENHARIA DA SOBREVIVÊNCIA
  // ==========================================
  dia09: {
    1: {
      titulo: 'Abertura do Dia 09: A Balsa Salva-Vidas e a Vida Coletiva',
      pontosChave: [
        'Recapitulação rápida de 2 minutos do Dia 08.',
        'Objetivo do Dia 09: Dominar o funcionamento mecânico da balsa salva-vidas inflável classe SOLAS.',
        'Foco nos 4 equipamentos de bordo: HRU, elo fraco, válvula de inflagem e bolsos de estabilização.'
      ],
      dicaPedagogica: 'Mencione que a balsa salva-vidas é o refúgio primário que transforma um grupo de náufragos em uma unidade de sobrevivência organizada.',
      acaoRecomendada: null
    },
    2: {
      titulo: 'Anatomia do Casulo da Balsa Salva-Vidas',
      pontosChave: [
        'Casulo rígido de fibra de vidro reforçada (GRP), hermeticamente selado para suportar intempéries marinhas.',
        'Capacidades regulamentares SOLAS comuns: 6, 10, 12, 16, 20 e 25 pessoas.',
        'Identificação externa obrigatória: nome do navio, porto de registro, data da última revisão anual e capacidade máxima.'
      ],
      dicaPedagogica: 'Explique que as balsas passam por revisão anual obrigatória em estação homologada pela Autoridade Marítima (DPC).',
      acaoRecomendada: null
    },
    3: {
      titulo: 'Unidade de Disparo Hidrostático (HRU - Hammar H20)',
      pontosChave: [
        'Mecanismo de liberação automática sem necessidade de intervenção humana.',
        'Aciona por pressão hidrostática entre 1.5 e 4.0 metros de profundidade.',
        'Uma lâmina acionada por mola corta o cabo de amarração, liberando o casulo que flutua até a superfície.'
      ],
      dicaPedagogica: 'Pegadinha clássica de prova: "Se o navio afundar rápido demais e a tripulação não soltar a balsa manualmente, ela afunda junto?" -> NÃO, a HRU corta e libera automaticamente a 1.5 - 4m.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 2.1" (O Segredo do Disparo Hidrostático).'
    },
    4: {
      titulo: 'O Princípio do Elo Fraco (Weak Link)',
      pontosChave: [
        'O cabo de acionamento (boça) é conectado ao navio através de um "elo fraco".',
        'Resistência à ruptura calibrada: 2,2 ± 0,4 kN (cerca de 220 kgf).',
        'Função: quando o navio afunda, a boça é puxada até o fim, infla a balsa, e o elo fraco se rompe, impedindo que a balsa seja puxada para o fundo.'
      ],
      dicaPedagogica: 'Desenhe o esquema no quadro ou projete o infográfico: Casulo -> Boça -> Elo Fraco -> Casco do Navio.',
      acaoRecomendada: null
    },
    5: {
      titulo: 'O Sistema de Inflagem: Cilindro de CO2 e N2',
      pontosChave: [
        'Cilindro de alta pressão com mistura de CO2 (dióxido de carbono) e Nitrogênio (N2 para evitar congelamento da válvula).',
        'Tempo total de inflagem completa da balsa: de 20 a 30 segundos, mesmo a temperaturas de -30°C.',
        'Duas câmaras de flutuação independentes sobrepostas: se uma furar, a outra suporta 100% dos tripulantes.'
      ],
      dicaPedagogica: 'Enfatize a redundância de segurança: cada anel da balsa tem capacidade de suportar toda a lotação.',
      acaoRecomendada: null
    },
    6: {
      titulo: 'Bolsos de Lastro / Estabilização Hidrodinâmica',
      pontosChave: [
        'Localizados no fundo exterior da balsa (4 a 8 bolsas em tecido reforçado).',
        'Enchem-se automaticamente de água do mar assim que a balsa cai na água.',
        'Função vital: aumentar a inércia e reduzir a deriva provocada pelo vento, impedindo que a balsa emborque (capsize).',
      ],
      dicaPedagogica: 'Ponto de prova: "Qual a função dos bolsos de água sob o fundo da balsa?" -> Estabilidade contra capotamento e redução de deriva.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 2.2" (Estabilidade e Bolsas de Lastro).'
    },
    7: {
      titulo: 'Técnica de Adriçamento da Balsa Emborcada',
      pontosChave: [
        'Se a balsa inflar de cabeça para baixo (comum em mar revolto), um tripulante deve adriçá-la.',
        'Posicionar-se do lado do cilindro de CO2 (com o vento pelas costas).',
        'Subir no fundo da balsa, segurar a tira de adriçamento e jogar o peso do corpo para trás.',
        'A balsa desvirará por cima do operador; nadar para fora por uma das aberturas laterais.'
      ],
      dicaPedagogica: 'Reforce o detalhe tático: SEMPRE ficar de costas para o vento para que o vento ajude a levantar a balsa.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 2.3" (Adriçamento Tático da Balsa).'
    },
    8: {
      titulo: 'Embarque Seguro e Organização Interna da Balsa',
      pontosChave: [
        'Preferência absoluta: embarcar seco, descendo por escadas de quebra-peito ou pulando no teto da balsa (se altura for segura).',
        'Se embarcar pela água: usar a rampa/escada de embarque inflável.',
        'Primeiras ações a bordo: recolher outros sobreviventes, cortar o cabo de amarração com a faca de ponta redonda fixada junto à entrada.'
      ],
      dicaPedagogica: 'Por que a faca tem ponta redonda? -> Para evitar furar as câmaras de ar da balsa no escuro.',
      acaoRecomendada: null
    },
    9: {
      titulo: 'A Âncora Flutuante (Drogue)',
      pontosChave: [
        'Cone de lona lançado na água imediatamente após afastar-se do navio.',
        'Funções: mantém a entrada da balsa de costas para as ondas, reduz a velocidade de deriva e estabiliza o balanço.',
        'Acompanha cabo guia de recolhimento para facilitar puxar de volta.'
      ],
      dicaPedagogica: 'Sem âncora flutuante, a balsa fica atravessada nas ondas e os tripulantes sofrem com enjoo severo (cinetose).',
      acaoRecomendada: null
    },
    10: {
      titulo: 'Equipamentos Obrigatórios do Pacote SOLAS A',
      pontosChave: [
        'Faca de ponta redonda flutuante, vertedouro manual (bailer) e 2 esponjas.',
        'Bomba de ar manual ou fole para completar pressão dos tubos.',
        'Kit de buchas e grampos de vedação rápida para estancar vazamentos nos tubos de ar.',
        'Lanterna estanque com código Morse e baterias sobressalentes.'
      ],
      dicaPedagogica: 'Diferencie SOLAS A (navegação irrestrita/longo curso) de SOLAS B (navegação de cabotagem/curto curso).',
      acaoRecomendada: null
    },
    11: {
      titulo: 'Regime de Água e Alimentos: A Regra das 24 Horas',
      pontosChave: [
        'PRIMEIRAS 24 HORAS: NENHUMA GOTA DE ÁGUA DEVE SER CONSUMIDA (exceto feridos graves).',
        'Razão médica: o organismo ainda retém líquidos corporais; a sede nas primeiras 24h é psicológica.',
        'A partir do 2° dia: ração estrita de 500 ml de água doce por pessoa/dia fracionada em 3 doses.',
        'Ração sólida de emergência: biscoitos energéticos de alta caloria (mínimo 10.000 kJ por ração).'
      ],
      dicaPedagogica: 'Ponto mais cobrado em bancas de salvatagem no Brasil: Proibição de água no 1° dia!',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 2.4" (Racionamento Crítico a Bordo).'
    },
    12: {
      titulo: 'Prevenção e Tratamento da Cinetose (Enjoo do Mar)',
      pontosChave: [
        'O enjoo provoca vômito, que acelera brutalmente a perda de água corporal e eletrólitos.',
        'Comprimidos contra enjoo (Dimenidrinato) devem ser tomados imediatamente ao embarcar, antes que o enjoo comece.',
        'Manter ventilação cruzada na balsa abrindo as duas portinholas e colocar os tripulantes olhando para o horizonte.'
      ],
      dicaPedagogica: 'Vômito na balsa é emergência médica: desidrata quem vomitou e causa enjoo reflexo nos demais companheiros.',
      acaoRecomendada: null
    },
    13: {
      titulo: 'Serviço de Quarto e Manutenção da Moral a Bordo',
      pontosChave: [
        'Estabelecer turnos de vigilância de 2 horas (vigia de horizonte por navios e aeronaves).',
        'Secagem constante do fundo da balsa com as esponjas para prevenir "pé de imersão".',
        'Liderança ativa: designar tarefas a todos os tripulantes para combater o desespero e a inércia.'
      ],
      dicaPedagogica: 'Um tripulante ocupado com uma tarefa tem 80% menos chances de entrar em surto de ansiedade.',
      acaoRecomendada: null
    },
    14: {
      titulo: 'Desafio Tático: A Balsa em Crise',
      pontosChave: [
        'Aplicação do Quiz 2.1 e 2.2 do LMS.',
        'Cenário: Mar força 6, navio adernando rapidamente e rompimento da boça.',
        'Verificação das decisões de abandono e conduta dentro da balsa.'
      ],
      dicaPedagogica: 'Estimule a turma a responder com rapidez. O cronômetro de 45s gera engajamento intenso.',
      acaoRecomendada: '⚡ MOMENTO CRÍTICO: Clicar em "Disparar Desafio Tático" para enviar aos celulares dos alunos.'
    },
    15: {
      titulo: 'Debriefing do Dia 09 & Transição para o Dia 10',
      pontosChave: [
        'Revisão dos pontos-chave: HRU (1.5 - 4m), elo fraco (2.2 kN) e jejum de água nas primeiras 24h.',
        'Revelar as respostas corretas e comentar os erros mais comuns.',
        'Antecipar o Dia 10: Comunicações GMDSS, Pirotécnicos, SART, EPIRB e Resgate por Helicóptero.'
      ],
      dicaPedagogica: 'Exiba o ranking de líderes do Dia 09 para estimular a competição saudável.',
      acaoRecomendada: '🏆 RECOMENDAÇÃO: Clicar em "Exibir Placar" para atualizar os líderes da turma.'
    }
  },

  // ==========================================
  // DIA 10 — MISSÃO 03: TACTICAL MARINE SURVIVAL
  // ==========================================
  dia10: {
    1: {
      titulo: 'Abertura do Dia 10: Comunicações de Socorro & Resgate',
      pontosChave: [
        'Último dia do módulo TSP — Foco total em atrair o socorro e ser resgatado com vida.',
        'Estatística SAR (Search and Rescue): O tempo médio de localização cai de 72h para 40 minutos com uso correto de rádio e pirotecnia.',
        'Apresentar os 4 pilares: Pirotecnia SOLAS, SART 9 GHz, EPIRB 406 MHz e Operações com Helicóptero.'
      ],
      dicaPedagogica: 'Diga à turma: "Estar na balsa garante a vida por dias; fazer-se visto e ouvido garante o resgate hoje".',
      acaoRecomendada: null
    },
    2: {
      titulo: 'Artefatos Pirotécnicos de Salvatagem (SOLAS)',
      pontosChave: [
        'Dotação obrigatória de balsa SOLAS A: 4 Foguetes com Paraquedas, 6 Fachos Manuais e 2 Sinais Fumígenos Flutuantes.',
        'Validade máxima: 3 anos da data de fabricação (deve ser verificada na carcaça).',
        'Cuidados de disparo: sempre a favor do vento (sotavento), inclinados a 45° sobre a borda da balsa.'
      ],
      dicaPedagogica: 'NUNCA disparar pirotécnico sem antes avistar ou ouvir navio ou aeronave. Desperdiçar sinalizador em mar vazio é sentença de morte.',
      acaoRecomendada: null
    },
    3: {
      titulo: 'Foguete Manual com Paraquedas (Rocket Parachute Flare)',
      pontosChave: [
        'Altitude mínima de lançamento: 300 metros.',
        'Intensidade luminosa mínima: 30.000 candelas.',
        'Tempo de queima mínima durante a descida com paraquedas: 40 segundos.',
        'Velocidade de descida controlada: não superior a 5 m/s.'
      ],
      dicaPedagogica: 'Ponto frequente em provas: Altitude (300m), Candelas (30.000) e Duração (40s). Memorizar esses 3 números.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 3.1" (Pirotecnia Naval de Precisão).'
    },
    4: {
      titulo: 'Facho Manual Vermelho (Hand Flare)',
      pontosChave: [
        'Sinalizador de curto alcance para aproximação final visual.',
        'Intensidade luminosa: 15.000 candelas com queima mínima de 1 minuto.',
        'Continua queimando mesmo após submerso em água a 10 cm por 10 segundos.',
        'Modo de uso: segurar com o braço estendido sobre a água para que os respingos incandescentes não caiam na balsa.'
      ],
      dicaPedagogica: 'Alerte: Respingos de magnésio perfuram o tecido emborrachado da balsa instantaneamente.',
      acaoRecomendada: null
    },
    5: {
      titulo: 'Sinal Fumígeno Flutuante (Buoyant Smoke Signal)',
      pontosChave: [
        'Uso exclusivo DIURNO para guiar aeronaves e embarcações rápidas.',
        'Emite fumaça de cor LARANJA de alta densidade por no mínimo 3 minutos.',
        'Não emite chamas e não incendeia óleo combustível flutuando na água.',
        'Lançado na água a sotavento da balsa.'
      ],
      dicaPedagogica: 'Cor da fumaça: Laranja. Tempo: 3 minutos.',
      acaoRecomendada: null
    },
    6: {
      titulo: 'Transponder Radar SART (9 GHz / Banda X)',
      pontosChave: [
        'Opera na frequência marítima de 9.2 a 9.5 GHz (radares de navegação Banda X de 3 cm).',
        'Ao ser atingido por um pulso de radar de um navio socorrista, responde imediatamente transmitindo um sinal codificado.',
        'No visor do radar socorrista: desenha uma linha reta com 12 PONTOS luminosos na direção do náufrago.',
        'Quando o navio se aproxima a menos de 1 milha náutica: os pontos se transformam em arcos e depois em CÍRCULOS CONCÊNTRICOS.'
      ],
      dicaPedagogica: 'Ponto crítico de prova da Marinha: "Quantos pontos o SART gera no radar?" -> 12 pontos.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 3.2" (O Eco do SART na Tela do Radar).'
    },
    7: {
      titulo: 'Operação e Instalação do SART na Balsa',
      pontosChave: [
        'Deve ser montado a pelo menos 1 metro acima do nível do mar (usar a haste telescópica fixada no topo da balsa).',
        'Autonomia da bateria: 96 horas em prontidão (standby) + 8 horas de transmissão contínua interrogada.',
        'Possui sinal sonoro e luz LED que indicam aos tripulantes quando um radar o está interrogando (sinal de que o resgate está próximo!).'
      ],
      dicaPedagogica: 'Explique que a cada metro adicional de altura, o alcance do SART aumenta significativamente pela curvatura da Terra.',
      acaoRecomendada: null
    },
    8: {
      titulo: 'EPIRB — Radiobaliza Indicadora de Posição em Emergência',
      pontosChave: [
        'Transmite sinal de socorro via satélite na frequência digital de 406 MHz para a constelação COSPAS-SARSAT.',
        'Possui transmissor local de homologação em 121.5 MHz para busca fina visual por aeronaves (homing).',
        'Contém chip GPS integrado que fornece as coordenadas geográficas exatas com precisão métrica em menos de 5 minutos.',
        'Disparo automático por sensor hidrostático ou manual por interruptor protegido.'
      ],
      dicaPedagogica: 'Diferença entre EPIRB e SART: EPIRB avisa o mundo via satélite (406 MHz); SART guia o navio próximo via radar (9 GHz).',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 3.3" (EPIRB 406 MHz e a Rede Espacial).'
    },
    9: {
      titulo: 'Rádio VHF Portátil Bidirecional de Salvatagem (GMDSS)',
      pontosChave: [
        'Cor obrigatória: AMARELA ou LARANJA brilhante de alta visibilidade.',
        'Bateria primária selada de lítio com validade de emergência de 4 anos (lacre inviolável).',
        'Canal obrigatório pré-programado: Canal 16 VHF (156.8 MHz - chamada e socorro) e canal simplex 6.',
        'Resistente a quedas de 1 metro no concreto e estanque a 1 metro de água por 5 minutos.'
      ],
      dicaPedagogica: 'Reforce: A bateria de emergência com lacre NUNCA deve ser usada para conversas de rotina.',
      acaoRecomendada: null
    },
    10: {
      titulo: 'Espelho de Sinalização (Heliógrafo) e Apito Naval',
      pontosChave: [
        'Heliógrafo: espelho especial com orifício central de mira para refletir raios solares em direção a navios e aviões.',
        'Pode ser avistado a mais de 15 milhas náuticas em dias ensolarados, mesmo quando o rádio estiver inoperante.',
        'Apito naval sem esfera (pea-less): funciona mesmo molhado e com areia, audível a até 1 milha a barlavento.'
      ],
      dicaPedagogica: 'Demonstre como mirar o heliógrafo: olhe pelo furo central e alinhe o ponto brilhante refletido no alvo.',
      acaoRecomendada: null
    },
    11: {
      titulo: 'Operações de Resgate por Helicóptero: Regras Críticas',
      pontosChave: [
        'REGRA DE OURO N° 1: NUNCA TOQUE NO CABO DO GUINCHO OU NO GANCHO ANTES QUE ELE TOQUE NA ÁGUA OU NO CONVÉS!',
        'Razão: A rotação das pás do helicóptero gera eletricidade estática de milhares de volts; tocar nele no ar causa choque incapacitante.',
        'Deixar o gancho tocar na água para descarregar a estática antes de segurá-lo.',
        'NUNCA amarrar o cabo de içamento à balsa (se o helicóptero manobrar, virará a balsa).'
      ],
      dicaPedagogica: 'A pergunta mais perigosa de toda a prova de salvatagem! Enfatize essa regra 3 vezes com a turma.',
      acaoRecomendada: '🎬 RECOMENDAÇÃO: Clicar em "Pílula 3.4" (Evacuação Aeromédica Vertical).'
    },
    12: {
      titulo: 'Uso do Laço de Salvamento (Rescue Sling) e Cesto',
      pontosChave: [
        'Rescue Sling (Alça de Içamento): Passar a alça por trás das costas, sob as axilas, e cruzar os braços com firmeza sobre o peito.',
        'NUNCA levantar os braços durante o içamento (a pessoa escorregará e cairá no mar).',
        'Ficar de frente para o operador do guincho e acenar com o polegar para cima quando estiver pronto para ser içado.'
      ],
      dicaPedagogica: 'Demonstre a postura de içamento: cotovelos colados ao tronco e braços travados sobre a alça.',
      acaoRecomendada: null
    },
    13: {
      titulo: 'Chegada da Embarcação de Resgate e Transbordo',
      pontosChave: [
        'Aproximação sempre pelo bordo de barlavento (de onde vem o vento) para proteger a balsa do mar batido.',
        'Lançamento da retinida: o náufrago deve amarrar a retinida na cruzeta da balsa, não em torno do próprio corpo.',
        'Embarque um a um, dando prioridade absoluta a feridos, hipotérmicos e inconscientes.'
      ],
      dicaPedagogica: 'A sobrevivência só termina quando todos os sobreviventes estiverem em segurança a bordo do navio socorrista.',
      acaoRecomendada: null
    },
    14: {
      titulo: 'Desafio Tático Final: O Resgate no Atlântico Sul',
      pontosChave: [
        'Quiz integrador final com pontuação de XP máxima.',
        'Combina SART, EPIRB, Pirotecnia e Helicóptero.',
        'Consolidação do conhecimento para a prova presencial da DPC.'
      ],
      dicaPedagogica: 'Momento de máxima vibração e competição entre os alunos. Incentive todos a responderem no aplicativo.',
      acaoRecomendada: '⚡ MOMENTO CRÍTICO: Clicar em "Disparar Desafio Tático" para abrir o Quiz Final 3.1.'
    },
    15: {
      titulo: 'Encerramento do Curso TSP & Cerimônia de Condecorações',
      pontosChave: [
        'Revisão dos compromissos da Marinha Mercante e do dever ético de socorro no mar.',
        'Apresentação do Placar Final e entrega das medalhas virtuais no aplicativo dos alunos.',
        'Mensagem de encerramento do instrutor: "Mar calmo nunca fez bom marinheiro; mas o bom marinheiro sabe como sobreviver à tempestade".'
      ],
      dicaPedagogica: 'Agradeça a dedicação de todos e faça a salva de palmas para os líderes da turma.',
      acaoRecomendada: '🏆 RECOMENDAÇÃO: Clicar em "Exibir Placar" para comemorar os formandos do CAAQ-BC!'
    }
  }
};
