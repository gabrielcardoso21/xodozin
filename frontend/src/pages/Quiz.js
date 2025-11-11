import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Heart, Users, Home as HomeIcon, Smile, Sparkles, 
  Moon, Sun, CheckCircle2, ArrowRight, ArrowLeft,
  Briefcase, Calendar, Gift, Coffee
} from 'lucide-react';
import { toast } from 'sonner';
import { hybridApi } from '../utils/api-hybrid';

// TELA 1: BEM-VINDO(A)!
const screen1Questions = [
  {
    id: 'recipient',
    question: 'Esse presente é pra quem?',
    options: [
      { value: 'proprio', label: 'Pra mim mesmo(a) - eu mereço!', icon: Smile },
      { value: 'parceiro', label: 'Pro(a) parceiro(a)/amor', icon: Heart },
      { value: 'amigo', label: 'Pra um(a) amigo(a) especial', icon: Users },
      { value: 'familia', label: 'Pra alguém da família', icon: HomeIcon },
      { value: 'colega', label: 'Pra colega/parceiro de trabalho', icon: Briefcase }
    ]
  },
  {
    id: 'vibe',
    question: 'Qual vibe essa pessoa tá precisando agora?',
    options: [
      { value: 'pausar', label: 'Pausar e respirar - tá no corre pesado', icon: Moon },
      { value: 'reconectar', label: 'Reconectar consigo mesmo(a)', icon: Heart },
      { value: 'fortalecer', label: 'Fortalecer vínculos com pessoas queridas', icon: Users },
      { value: 'celebrar', label: 'Celebrar algo especial', icon: Gift },
      { value: 'planejar', label: 'Planejar e manifestar sonhos', icon: Sparkles },
      { value: 'divertir', label: 'Se divertir e curtir a própria companhia', icon: Smile },
      { value: 'apimentar', label: 'Apimentar a relação/intimidade', icon: Heart }
    ]
  },
  {
    id: 'moment',
    question: 'Qual o momento?',
    options: [
      { value: 'natal', label: 'Natal/Fim de Ano', icon: Gift },
      { value: 'aniversario', label: 'Aniversário', icon: Calendar },
      { value: 'sem-data', label: 'Sem data específica - só porque sim', icon: Sparkles },
      { value: 'inicio-ciclo', label: 'Início de ciclo (ano novo, novo emprego, mudança)', icon: Sun },
      { value: 'fim-ciclo', label: 'Fim de ciclo (encerramento, despedida)', icon: Moon },
      { value: 'dificil', label: 'Momento difícil (precisa de colo)', icon: Heart }
    ]
  },
  {
    id: 'personality',
    question: 'Essa pessoa é mais...',
    options: [
      { value: 'introspectiva', label: 'Introspectiva - curte momento solo', icon: Moon },
      { value: 'parceira', label: 'Parceira - adora dividir experiências', icon: Users },
      { value: 'pratica', label: 'Prática - gosta de coisa que usa', icon: Briefcase },
      { value: 'sensivel', label: 'Sensível - se emociona fácil', icon: Heart },
      { value: 'divertida', label: 'Divertida - prefere leveza que peso', icon: Smile },
      { value: 'reflexiva', label: 'Reflexiva - gosta de se aprofundar', icon: Sparkles }
    ]
  },
  {
    id: 'sense',
    question: 'Qual sentido ela mais curte?',
    options: [
      { value: 'olfato', label: 'Olfato (aromas, perfumes, incensos)', icon: Sparkles },
      { value: 'tato', label: 'Tato (texturas, toques, conforto)', icon: Heart },
      { value: 'visao', label: 'Visão (cores, beleza, estética)', icon: Sun },
      { value: 'paladar', label: 'Paladar (sabores especiais)', icon: Coffee },
      { value: 'audicao', label: 'Audição (sons, música, silêncio)', icon: Moon },
      { value: 'todos', label: 'Todos! (Premium)', icon: Gift }
    ]
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(1); // 1, 2, 3
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    // Tela 1
    recipient: '',
    vibe: '',
    moment: '',
    personality: '',
    sense: '',
    // Tela 2
    name: '',
    colors: [],
    aromas: [],
    heartTouch: [],
    popCulture: '',
    // Tela 3
    message: '',
    specificLikes: '',
    whatsapp: ''
  });

  const progress = screen === 1 
    ? ((currentQuestion + 1) / screen1Questions.length) * 33.33
    : screen === 2 
    ? 66.66 
    : 100;

  const handleAnswer = (questionId, value) => {
    if (questionId === 'colors' || questionId === 'aromas' || questionId === 'heartTouch') {
      const current = answers[questionId] || [];
      const newValue = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [questionId]: newValue });
    } else {
      const newAnswers = { ...answers, [questionId]: value };
      setAnswers(newAnswers);
      
      // Avança automaticamente para a próxima pergunta (apenas na tela 1)
      if (screen === 1) {
        setTimeout(() => {
          if (currentQuestion < screen1Questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
          } else {
            // Verifica se todas as perguntas foram respondidas antes de avançar
            const allAnswered = screen1Questions.every(q => {
              if (q.id === questionId) {
                return value; // A pergunta atual acabou de ser respondida
              }
              return newAnswers[q.id];
            });
            if (allAnswered) {
              setScreen(2);
              setCurrentQuestion(0);
            }
          }
        }, 300); // Pequeno delay para feedback visual
      }
    }
  };

  const handleNext = () => {
    if (screen === 1) {
      if (currentQuestion < screen1Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      } else {
        // Verificar se todas as perguntas foram respondidas
        const allAnswered = screen1Questions.every(q => answers[q.id]);
        if (allAnswered) {
          setScreen(2);
          setCurrentQuestion(0);
        } else {
          toast.error('Por favor, responda todas as perguntas antes de continuar.');
        }
      }
    } else if (screen === 2) {
      if (answers.name && answers.colors.length > 0 && answers.aromas.length > 0) {
        setScreen(3);
      } else {
        toast.error('Por favor, preencha pelo menos o nome, cores e aromas.');
      }
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (screen === 1 && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (screen === 1 && currentQuestion === 0) {
      navigate('/');
    } else if (screen === 2) {
      setScreen(1);
      setCurrentQuestion(screen1Questions.length - 1);
    } else if (screen === 3) {
      setScreen(2);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await hybridApi.getQuizSuggestion({
        recipient: answers.recipient,
        moment: answers.moment,
        feeling: answers.vibe
      });
      navigate('/custom-ritual', { 
        state: { 
          ritualData: response,
          personalization: answers
        } 
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Erro ao processar suas respostas. Tente novamente.');
    }
  };

  // TELA 1: Perguntas múltiplas
  if (screen === 1) {
    const currentQ = screen1Questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
      <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
      {/* Header */}
          {currentQuestion === 0 && (
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
                Vamos criar um presente que vai direto no coração? 💜
              </h1>
              <p className="text-lg text-[#463f3a]">
                Responde essas perguntinhas pra gente montar o ritual perfeito.
              </p>
      </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
              {screen1Questions.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index < currentQuestion
                      ? 'bg-[#da2c38]'
                  : index === currentQuestion
                      ? 'bg-[#da2c38]'
                      : 'bg-[#da2c38]/20'
              }`}
            />
          ))}
        </div>
            <p className="text-center text-[#463f3a] text-sm font-medium">
              Pergunta {currentQuestion + 1} de {screen1Questions.length}
        </p>
      </div>

      {/* Question */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#Da2c38] mb-8 text-center font-serif">
            {currentQ.question}
          </h2>

            <div className="grid sm:grid-cols-2 gap-4">
            {currentQ.options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = currentAnswer === option.value;
              return (
                <div
                  key={option.value}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    isSelected 
                        ? 'border-[#da2c38] bg-[#F2cc8f] shadow-md'
                        : 'border-[#da2c38]/30 hover:border-[#da2c38]/50 hover:bg-white/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`h-6 w-6 ${isSelected ? 'text-[#da2c38]' : 'text-[#463f3a]'}`} />
                      <p className={`font-medium ${isSelected ? 'text-[#Da2c38]' : 'text-[#463f3a]'}`}>
                        {option.label}
                      </p>
                    {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-[#da2c38] ml-auto" />
                    )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-[#da2c38] text-[#Da2c38] hover:bg-[#F2cc8f]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {currentQuestion === 0 ? 'Voltar' : 'Anterior'}
            </Button>
            {currentQuestion < screen1Questions.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="bg-[#da2c38] text-white hover:bg-[#da2c38] disabled:opacity-50"
              >
                Pular
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
            {currentQuestion === screen1Questions.length - 1 && (
              <Button
                onClick={handleNext}
                disabled={!currentAnswer}
                className="bg-[#da2c38] text-white hover:bg-[#da2c38] disabled:opacity-50"
              >
                Continuar
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // TELA 2: Personalização
  if (screen === 2) {
    const colorOptions = [
      { value: 'terrosos', label: 'Tons terrosos (bege, marrom, verde musgo)' },
      { value: 'quentes', label: 'Cores quentes (vermelho, laranja, amarelo)' },
      { value: 'frias', label: 'Cores frias (azul, verde, roxo)' },
      { value: 'pastel', label: 'Tons pastel/suaves' },
      { value: 'neutras', label: 'Preto/cinza/branco' },
      { value: 'vibrantes', label: 'Cores vibrantes/intensas' }
    ];

    const aromaOptions = [
      { value: 'lavanda', label: 'Lavanda/calmantes' },
      { value: 'citricos', label: 'Cítricos/energizantes' },
      { value: 'florais', label: 'Florais/românticos' },
      { value: 'amadeirados', label: 'Amadeirados/terrosos' },
      { value: 'doces', label: 'Doces/gourmand' },
      { value: 'herbais', label: 'Herbais/frescos' }
    ];

    const heartTouchOptions = [
      { value: 'palavras', label: 'Palavras e mensagens escritas' },
      { value: 'musica', label: 'Música e sons' },
      { value: 'beleza', label: 'Beleza visual' },
      { value: 'objetos', label: 'Objetos com significado' },
      { value: 'sensorial', label: 'Experiências sensoriais' },
      { value: 'desafios', label: 'Desafios e reflexões' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
              Agora vamos deixar ainda mais especial!
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Nome */}
            <div>
              <Label htmlFor="name" className="text-[#Da2c38] font-semibold text-lg mb-2 block">
                Nome de quem vai receber
              </Label>
              <Input
                id="name"
                value={answers.name}
                onChange={(e) => handleAnswer('name', e.target.value)}
                placeholder="Digite o nome..."
                className="border-[#da2c38] focus:border-[#da2c38]"
              />
            </div>

            {/* Cores */}
            <div>
              <Label className="text-[#Da2c38] font-semibold text-lg mb-2 block">
                Cores que ela ama (pode escolher até 3)
              </Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {colorOptions.map((option) => {
                  const isSelected = answers.colors?.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleAnswer('colors', option.value)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#da2c38] bg-[#F2cc8f]'
                          : 'border-[#da2c38]/30 hover:border-[#da2c38]/50'
                      }`}
                    >
                      <p className={`text-sm ${isSelected ? 'text-[#Da2c38] font-medium' : 'text-[#463f3a]'}`}>
                        {option.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Aromas */}
            <div>
              <Label className="text-[#Da2c38] font-semibold text-lg mb-2 block">
                Aromas preferidos (escolha até 2)
              </Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {aromaOptions.map((option) => {
                  const isSelected = answers.aromas?.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleAnswer('aromas', option.value)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#da2c38] bg-[#F2cc8f]'
                          : 'border-[#da2c38]/30 hover:border-[#da2c38]/50'
                      }`}
                    >
                      <p className={`text-sm ${isSelected ? 'text-[#Da2c38] font-medium' : 'text-[#463f3a]'}`}>
                        {option.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* O que toca o coração */}
            <div>
              <Label className="text-[#Da2c38] font-semibold text-lg mb-2 block">
                O que toca o coração dessa pessoa?
              </Label>
              <div className="grid sm:grid-cols-2 gap-3">
                {heartTouchOptions.map((option) => {
                  const isSelected = answers.heartTouch?.includes(option.value);
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleAnswer('heartTouch', option.value)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[#da2c38] bg-[#F2cc8f]'
                          : 'border-[#da2c38]/30 hover:border-[#da2c38]/50'
                      }`}
                    >
                      <p className={`text-sm ${isSelected ? 'text-[#Da2c38] font-medium' : 'text-[#463f3a]'}`}>
                    {option.label}
                  </p>
                </div>
              );
            })}
              </div>
            </div>

            {/* Cultura Pop */}
            <div>
              <Label htmlFor="popCulture" className="text-[#Da2c38] font-semibold text-lg mb-2 block">
                Tem algo que essa pessoa seja muito fã da cultura pop (filmes, música, livros, séries)? Descreva quais
              </Label>
              <Textarea
                id="popCulture"
                value={answers.popCulture}
                onChange={(e) => handleAnswer('popCulture', e.target.value)}
                placeholder="Ex: Harry Potter, Taylor Swift, Friends..."
                className="border-[#da2c38] focus:border-[#da2c38] min-h-[100px]"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-[#da2c38] text-[#Da2c38] hover:bg-[#F2cc8f]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              className="bg-[#da2c38] text-white hover:bg-[#da2c38]"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // TELA 3: Finalizando
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F2cc8f] to-[#F2cc8f] pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#Da2c38] mb-4 font-serif">
            Finalizando a magia
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          {/* Mensagem especial */}
          <div>
            <Label htmlFor="message" className="text-[#Da2c38] font-semibold text-lg mb-2 block">
              Quer adicionar uma mensagem especial na carta? (opcional)
            </Label>
            <Textarea
              id="message"
              value={answers.message}
              onChange={(e) => handleAnswer('message', e.target.value)}
              placeholder="Digite sua mensagem especial..."
              maxLength={280}
              className="border-[#da2c38] focus:border-[#da2c38] min-h-[120px]"
            />
            <p className="text-sm text-[#463f3a] mt-2">
              {answers.message?.length || 0}/280 caracteres
            </p>
          </div>

          {/* Gostos específicos */}
          <div>
            <Label htmlFor="specificLikes" className="text-[#Da2c38] font-semibold text-lg mb-2 block">
              Tem algo específico que essa pessoa adora? (opcional)
            </Label>
            <Input
              id="specificLikes"
              value={answers.specificLikes}
              onChange={(e) => handleAnswer('specificLikes', e.target.value)}
              placeholder="Ex: chá de camomila, cristais, chocolate 70% cacau, escrita à mão..."
              className="border-[#da2c38] focus:border-[#da2c38]"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <Label htmlFor="whatsapp" className="text-[#Da2c38] font-semibold text-lg mb-2 block">
              Seu whatsapp para eu tirar qualquer dúvida na hora de montar
            </Label>
            <Input
              id="whatsapp"
              type="tel"
              value={answers.whatsapp}
              onChange={(e) => handleAnswer('whatsapp', e.target.value)}
              placeholder="(11) 99999-9999"
              className="border-[#da2c38] focus:border-[#da2c38]"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            className="border-[#da2c38] text-[#Da2c38] hover:bg-[#F2cc8f]"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            className="bg-[#da2c38] text-white hover:bg-[#da2c38] px-8"
          >
            Ver Sugestões de Kits ✨
          </Button>
        </div>
      </div>
    </div>
  );
}
