import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Heart, Users, Home as HomeIcon, Smile, Sparkles, Moon, Sun, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const questions = [
  {
    id: 'recipient',
    question: 'Quem vai receber o seu ritual?',
    options: [
      { value: 'parceiro', label: 'Meu parceiro(a)', icon: Heart },
      { value: 'amigo', label: 'Um amigo especial', icon: Users },
      { value: 'familia', label: 'Alguém da família', icon: HomeIcon },
      { value: 'proprio', label: 'Eu mesmo(a)', icon: Smile }
    ]
  },
  {
    id: 'moment',
    question: 'Qual o momento que você quer celebrar?',
    options: [
      { value: 'romance', label: 'Romance e conexão', icon: Heart },
      { value: 'gratidao', label: 'Gratidão e afeto', icon: Sparkles },
      { value: 'relaxamento', label: 'Relaxamento e paz', icon: Moon },
      { value: 'energia', label: 'Energia e foco', icon: Sun }
    ]
  },
  {
    id: 'feeling',
    question: 'Como essa pessoa se sentiria amada?',
    options: [
      { value: 'presente', label: 'Com presença e atenção', icon: Heart },
      { value: 'cuidado', label: 'Com cuidado e carinho', icon: Sparkles },
      { value: 'surpresa', label: 'Com surpresas e gestos', icon: Smile },
      { value: 'palavras', label: 'Com palavras e afirmações', icon: Users }
    ]
  }
];

export default function Quiz() {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({
    recipient: '',
    moment: '',
    feeling: ''
  });

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${API}/quiz/suggest`, answers);
      navigate('/custom-ritual', { state: { ritualData: response.data } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Erro ao processar suas respostas. Tente novamente.');
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ.id];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="container py-6">
        <button 
          data-testid="back-btn"
          onClick={() => currentQuestion > 0 ? setCurrentQuestion(currentQuestion - 1) : navigate('/')}
          className="text-[#8B5A3C] hover:text-[#6B5244] font-medium"
        >
          ← Voltar
        </button>
      </div>

      {/* Progress Bar - Melhorado */}
      <div className="container mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-2 rounded-full transition-all ${
                index < currentQuestion
                  ? 'bg-[#C19A6B]'
                  : index === currentQuestion
                  ? 'bg-[#C19A6B]'
                  : 'bg-[#C19A6B]/20'
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          {questions.map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                index < currentQuestion
                  ? 'bg-[#C19A6B] text-white'
                  : index === currentQuestion
                  ? 'bg-[#8B5A3C] text-white ring-2 ring-[#C19A6B] ring-offset-2'
                  : 'bg-[#C19A6B]/20 text-[#6B5244]'
              }`}
            >
              {index < currentQuestion ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <span className="text-sm font-bold">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-[#6B5244] mt-2 text-sm font-medium">
          Pergunta {currentQuestion + 1} de {questions.length}
        </p>
      </div>

      {/* Question */}
      <div className="container flex-1 flex flex-col justify-center py-8">
        <div className="max-w-2xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#8B5A3C] mb-12 text-center fade-in-up">
            {currentQ.question}
          </h2>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {currentQ.options.map((option, index) => {
              const Icon = option.icon;
              const isSelected = currentAnswer === option.value;
              return (
                <div
                  key={option.value}
                  data-testid={`quiz-option-${option.value}`}
                  onClick={() => handleAnswer(currentQ.id, option.value)}
                  className={`quiz-option fade-in-up transition-all cursor-pointer ${
                    isSelected 
                      ? 'ring-4 ring-[#C19A6B] shadow-xl bg-gradient-to-br from-[#FFF8F0] to-[#FFE8E0]' 
                      : 'hover:ring-2 hover:ring-[#C19A6B]/50 hover:shadow-lg'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative">
                    {isSelected && (
                      <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-[#C19A6B] bg-white rounded-full" />
                    )}
                    <Icon className={`w-10 h-10 mx-auto mb-3 transition-colors ${
                      isSelected ? 'text-[#8B5A3C]' : 'text-[#C19A6B]'
                    }`} />
                  </div>
                  <p className={`font-medium transition-colors ${
                    isSelected ? 'text-[#8B5A3C] font-bold' : 'text-[#6B5244]'
                  }`}>
                    {option.label}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              data-testid="next-btn"
              onClick={handleNext}
              disabled={!currentAnswer}
              className="btn-primary px-12 py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentQuestion < questions.length - 1 ? 'Próxima' : 'Gerar meu ritual ✨'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}