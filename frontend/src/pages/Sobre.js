import { Heart, Sparkles, BookOpen, Leaf, Gift } from 'lucide-react';

export default function Sobre() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
            Sobre a Xodózin
          </h1>
          <p className="text-lg text-[#ff595e] italic">
            O xodó que conecta gente de verdade
          </p>
        </div>

        {/* Missão */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#Da2c38] mb-4 font-serif">
            Nossa Missão
          </h2>
          <p className="text-[#ff595e] leading-relaxed mb-4">
            Transformar presentes em portais de conexão verdadeira, criando rituais que mostram o quanto você conhece e se importa com quem ama.
          </p>
          <p className="text-[#ff595e] leading-relaxed">
            Cada caixa Xodózin é um convite para atravessar: um momento de pausa, de reconexão, de reencontro com o que há de mais humano em nós. Não é sobre ter mais uma coisa bonita - é sobre viver uma experiência que transfere significado, que cria vínculo, que marca a memória afetiva.
          </p>
        </section>

        {/* Valores */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#Da2c38] mb-6 font-serif">
            Nossos Valores
          </h2>
          
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <BookOpen className="h-6 w-6 text-[#da2c38] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#Da2c38] mb-2">
                  1. Intencionalidade com fundamento
                </h3>
                <p className="text-[#ff595e] leading-relaxed">
                  Cada elemento tem propósito e base teórica. Criamos experiências a partir de estudos de cultura material e consumo - porque entendemos que rituais transferem significados, constroem identidades e fortalecem vínculos. Não fazemos "caixinha fofa" - fazemos portais de transformação.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Heart className="h-6 w-6 text-[#da2c38] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#Da2c38] mb-2">
                  2. Personalização que enxerga de verdade
                </h3>
                <p className="text-[#ff595e] leading-relaxed">
                  Conhecer a pessoa profundamente faz toda diferença. Por isso, cada kit carrega detalhes que só quem pratica a escuta afetuosa consegue captar. É esse olhar que acolhe sem invadir, que vê sem julgar.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Sparkles className="h-6 w-6 text-[#da2c38] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#Da2c38] mb-2">
                  3. Leveza com provocação
                </h3>
                <p className="text-[#ff595e] leading-relaxed">
                  Cuidar pode (e deve) ser gostoso, não solene. Temos humor que desarma, perguntas que cutucam com ternura, e aquele convite gentil para sair da zona de conforto. Porque conexão real pede um pouco de coragem.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Leaf className="h-6 w-6 text-[#da2c38] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#Da2c38] mb-2">
                  4. Experiência sensorial completa
                </h3>
                <p className="text-[#ff595e] leading-relaxed">
                  Nos kits premium, TODOS os sentidos são despertados. Porque reconexão acontece no corpo inteiro, não só na cabeça. O ritual precisa ser sentido, não apenas pensado.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Gift className="h-6 w-6 text-[#da2c38] mt-1" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#Da2c38] mb-2">
                  5. Autenticidade sem apropriação
                </h3>
                <p className="text-[#ff595e] leading-relaxed">
                  Criamos nossos próprios rituais contemporâneos, com base em conhecimento antropológico sólido, sem romantizar ou nos apropriar de práticas sagradas de outras culturas. Cada ritual é único, pensado para o mundo de hoje.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tom de Voz */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-[#Da2c38] mb-6 font-serif">
            Tom de Voz
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-[#Da2c38] mb-3">
                SOMOS:
              </h3>
              <ul className="space-y-2 text-[#ff595e]">
                <li>• Acolhedores com firmeza gentil</li>
                <li>• Provocadores sem perder a ternura</li>
                <li>• Próximos tipo "aquela amiga que sempre sabe o que você precisa ouvir"</li>
                <li>• Casuais mas nunca superficiais</li>
                <li>• Com conhecimento profundo falado de forma leve</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-[#Da2c38] mb-3">
                NÃO SOMOS:
              </h3>
              <ul className="space-y-2 text-[#ff595e]">
                <li>• Solenes ou herméticos</li>
                <li>• Corporativos ou distantes</li>
                <li>• Infantilizadores</li>
                <li>• Místicos inacessíveis</li>
                <li>• Autoajuda rasa</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Fundamento Teórico */}
        <section className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-[#Da2c38] mb-4 font-serif">
            Fundamento Teórico
          </h2>
          <p className="text-[#ff595e] leading-relaxed mb-4">
            A Xodózin tem base sólida: 25 anos de experiência em comunicação estratégica e especialização em Cultura Material e Consumo. Por isso, entendemos que:
          </p>
          <ul className="space-y-3 text-[#ff595e]">
            <li>• Rituais transferem significados do mundo cultural para os objetos, e dos objetos para as pessoas</li>
            <li>• Presentes constroem vínculos quando carregam símbolos que comunicam afeto, reconhecimento e pertencimento</li>
            <li>• Experiências sensoriais ancoram memórias afetivas e fortalecem conexões</li>
          </ul>
          <p className="text-[#ff595e] leading-relaxed mt-4 italic">
            Esse conhecimento não precisa estar escancarado - ele está na curadoria de cada elemento, na escolha de cada palavra das cartas, no desenho de cada ritual.
          </p>
        </section>
      </div>
    </div>
  );
}

