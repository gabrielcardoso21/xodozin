import { Sparkles, Heart, Moon, Sun, Calendar, BookOpen, Users } from 'lucide-react';

const rituais = [
  {
    id: 1,
    name: 'Ritual da Pausa Intencional',
    duration: '20min diários por 7 dias',
    icon: Moon,
    description: 'Acender vela/incenso (ancoragem sensorial), puxar 1 carta do baralho (provocação gentil do dia), refletir e anotar no caderno, respiração guiada (3min)',
    exemplo: 'Você tem honrado seus limites ou só esperado o corpo gritar?'
  },
  {
    id: 2,
    name: 'Ritual do Amor Próprio',
    duration: 'Experiência única de 2h',
    icon: Heart,
    description: 'Preparar ambiente sensorial, banho/ducha com intenção, atividade do baralho + journaling (perguntas provocadoras), cuidado com o corpo (máscara, óleo), carta de compromisso consigo mesmo(a)',
    exemplo: 'Acolhimento radical + cutucadas gentis sobre autocuidado real'
  },
  {
    id: 3,
    name: 'Ritual de Conexão a Dois',
    duration: 'Noite especial 2-3h',
    icon: Users,
    description: 'Preparar espaço juntos (velas, aromas), jogo de perguntas profundas ("O que você precisa de mim que nunca pediu?"), troca de toques intencionais, compartilhar sabor especial, escrever intenções para a relação',
    exemplo: 'O que você precisa de mim que nunca pediu?'
  },
  {
    id: 4,
    name: 'Ritual de Encerramento de Ciclo',
    duration: '3 dias consecutivos',
    icon: Calendar,
    description: 'Dia 1: Revisão e gratidão (o que foi), Dia 2: Liberação (o que deixar ir), Dia 3: Plantio (o que nasce agora)',
    exemplo: 'O que você tá carregando que nem é mais seu?'
  },
  {
    id: 5,
    name: 'Ritual de Manifestação',
    duration: '21 dias (1 atividade/dia)',
    icon: Sun,
    description: 'Semana 1: Clareza (visualizar), Semana 2: Intenção (sentir), Semana 3: Ação (mover)',
    exemplo: 'Que vida você tá construindo quando ninguém tá olhando?'
  },
  {
    id: 6,
    name: 'Ritual de Celebração',
    duration: 'Momento único',
    icon: Sparkles,
    description: 'Montar linha do tempo visual, cartas de gratidão (para si e/outros), acender vela de intenção pro próximo ciclo, registrar conquistas',
    exemplo: 'O que você conquistou que nem percebeu?'
  },
  {
    id: 7,
    name: 'Ritual de Reconexão com Amigo(a)',
    duration: 'Tarde/noite juntos',
    icon: Users,
    description: 'Preparar espaço acolhedor, baralho de memórias e cumplicidade, criar cápsula do tempo, planejar próxima aventura',
    exemplo: 'O que você nunca agradeceu mas devia? O que ainda não falou mas precisa?'
  },
  {
    id: 8,
    name: 'Ritual do Prazer da Própria Companhia',
    duration: 'Encontro marcado consigo mesmo(a)',
    icon: Heart,
    description: 'Preparar tudo com capricho (como se fosse pra visita especial), atividade aleatória do baralho, momento de diversão pura (filme, música, dança, arte), zero culpa, só curtição',
    exemplo: 'Quando foi a última vez que você se deu um encontro de verdade? Tipo, se arrumou pra você mesmo(a)?'
  }
];

export default function Rituais() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
            Rituais que Transformam
          </h1>
          <p className="text-lg text-[#ff595e] max-w-2xl mx-auto leading-relaxed">
            Cada ritual é um portal de reconexão. Não é sobre seguir regras - é sobre criar um momento intencional que marca a memória afetiva.
          </p>
        </div>

        {/* Rituais Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rituais.map((ritual) => {
            const Icon = ritual.icon;
            
            return (
              <div
                key={ritual.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-[#F2cc8f] p-3 rounded-full">
                    <Icon className="h-6 w-6 text-[#da2c38]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#Da2c38] font-serif">
                      {ritual.name}
                    </h3>
                    <p className="text-sm text-[#ff595e]">
                      {ritual.duration}
                    </p>
                  </div>
                </div>
                
                <p className="text-[#ff595e] leading-relaxed mb-4">
                  {ritual.description}
                </p>
                
                <div className="bg-[#F2cc8f] rounded-lg p-4 border-l-4 border-[#da2c38]">
                  <p className="text-sm text-[#ff595e] italic">
                    "{ritual.exemplo}"
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#Da2c38] mb-4 font-serif">
            Pronto pra criar seu ritual?
          </h2>
          <p className="text-[#ff595e] mb-6">
            Cada ritual é único e pensado especialmente pra você ou pra quem você ama.
          </p>
          <a
            href="/quiz"
            className="inline-block bg-[#da2c38] text-white px-8 py-3 rounded-lg hover:bg-[#da2c38] transition-colors duration-200 font-medium"
          >
            Criar Meu Ritual Personalizado
          </a>
        </div>
      </div>
    </div>
  );
}

