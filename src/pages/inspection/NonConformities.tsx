import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, PackageOpen, Weight, Scissors, AlignCenter, PenTool as Tool, TrendingDown, Footprints, Droplet, Hash, Layers, Wind, Home, Wrench, Paperclip } from 'lucide-react';
import ProgressBar from '../../components/ui/ProgressBar';
import NonConformityItem from '../../components/nonconformities/NonConformityItem';

interface NonConformity {
  id: number;
  title: string;
  description: string;
  details: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  selected: boolean;
  notes?: string;
  photos?: string[];
}

const NonConformitiesPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [nonConformities, setNonConformities] = useState<NonConformity[]>([
    {
      id: 1,
      title: "Armazenagem Incorreta",
      description: "Telhas estocadas em local inadequado, sem proteção contra intempéries.",
      details: "Verificar se as telhas estão armazenadas sobre superfície plana, em pilhas de no máximo 200 unidades, protegidas com lona plástica.",
      icon: <PackageOpen className="h-5 w-5 text-amber-600" />,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
      selected: false
    },
    {
      id: 2,
      title: "Carga Permanente sobre as Telhas",
      description: "Equipamentos ou estruturas apoiadas diretamente sobre as telhas.",
      details: "Identificar qualquer elemento apoiado diretamente sobre as telhas que não tenha sido previsto no projeto original.",
      icon: <Weight className="h-5 w-5 text-red-600" />,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
      selected: false
    },
    {
      id: 3,
      title: "Corte de Canto Incorreto ou Ausente",
      description: "Ausência da remoção do quadrado de 11x11cm nos cantos onde há sobreposição.",
      details: "A ausência do corte diagonal nos cantos pode causar sobreposição de 4 telhas em um mesmo ponto, criando pontos de esforço e possíveis infiltrações.",
      icon: <Scissors className="h-5 w-5 text-blue-600" />,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
      selected: false
    },
    {
      id: 4,
      title: "Estrutura Desalinhada",
      description: "Terças ou caibros sem alinhamento adequado, comprometendo o assentamento.",
      details: "O desalinhamento da estrutura de apoio compromete o assentamento e caimento correto das telhas, podendo causar empoçamentos e infiltrações.",
      icon: <AlignCenter className="h-5 w-5 text-purple-600" />,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
      selected: false
    },
    {
      id: 5,
      title: "Fixação Irregular das Telhas",
      description: "Uso de fixadores incompatíveis ou posicionamento incorreto dos parafusos.",
      details: "A fixação adequada deve ser feita com conjuntos adequados e na crista da onda, nunca na calha. O posicionamento incorreto pode causar vazamentos.",
      icon: <Tool className="h-5 w-5 text-gray-600" />,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
      selected: false
    },
    {
      id: 6,
      title: "Inclinação da Telha Inferior ao Recomendado",
      description: "Caimento abaixo do mínimo especificado pelo fabricante.",
      details: "A inclinação mínima para telhas onduladas é de 15°, enquanto para telhas estruturais é de 10°. Valores inferiores podem causar infiltrações.",
      icon: <TrendingDown className="h-5 w-5 text-green-600" />,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
      selected: false
    },
    {
      id: 7,
      title: "Marcas de Caminhamento sobre o Telhado",
      description: "Evidências de tráfego direto sobre as telhas sem uso de tábuas.",
      details: "O tráfego sobre o telhado deve ser feito apenas com tábuas de distribuição de cargas. Marcas de pisadas podem indicar danos estruturais.",
      icon: <Footprints className="h-5 w-5 text-orange-600" />,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-100",
      selected: false
    },
    {
      id: 8,
      title: "Balanço Livre do Beiral Incorreto",
      description: "Distância entre última terça e extremidade da telha fora das especificações.",
      details: "O balanço máximo permitido varia conforme o comprimento da telha, sendo geralmente entre 10 e 25cm para telhas de fibrocimento.",
      icon: <Droplet className="h-5 w-5 text-cyan-600" />,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-100",
      selected: false
    },
    {
      id: 9,
      title: "Número de Apoios e Vão Livre Inadequados",
      description: "Quantidade insuficiente de apoios ou espaçamento excessivo entre terças.",
      details: "O vão livre máximo e o número de apoios dependem do modelo e espessura da telha. Apoios insuficientes podem levar a deformações e rupturas.",
      icon: <Hash className="h-5 w-5 text-indigo-600" />,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-100",
      selected: false
    },
    {
      id: 10,
      title: "Recobrimento Incorreto",
      description: "Sobreposição longitudinal ou lateral insuficiente entre telhas adjacentes.",
      details: "O recobrimento longitudinal deve ter no mínimo 14cm e o lateral deve ser de 1/4 de onda para garantir vedação adequada.",
      icon: <Layers className="h-5 w-5 text-pink-600" />,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-100",
      selected: false
    },
    {
      id: 11,
      title: "Sentido de Montagem Incorreto",
      description: "Instalação das telhas no sentido contrário aos ventos predominantes.",
      details: "A montagem deve começar do beiral para a cumeeira, no sentido contrário aos ventos predominantes, para evitar infiltrações.",
      icon: <Wind className="h-5 w-5 text-teal-600" />,
      iconColor: "text-teal-600",
      iconBg: "bg-teal-100",
      selected: false
    },
    {
      id: 12,
      title: "Uso de Cumeeira Cerâmica",
      description: "Utilização de peças cerâmicas incompatíveis com as telhas de fibrocimento.",
      details: "A cumeeira deve ser do mesmo material e fabricante das telhas para garantir compatibilidade e vedação adequada.",
      icon: <Home className="h-5 w-5 text-amber-800" />,
      iconColor: "text-amber-800",
      iconBg: "bg-amber-100",
      selected: false
    },
    {
      id: 13,
      title: "Uso de Argamassa em Substituição a Peças Complementares",
      description: "Aplicação de argamassa em vez do uso de peças específicas para vedação.",
      details: "A argamassa não é adequada para vedação com telhas de fibrocimento e pode causar fissuras e infiltrações com a movimentação térmica.",
      icon: <Paperclip className="h-5 w-5 text-stone-600" />,
      iconColor: "text-stone-600",
      iconBg: "bg-stone-100",
      selected: false
    },
    {
      id: 14,
      title: "Fixação Inadequada de Acessórios Complementares",
      description: "Instalação incorreta de rufos, calhas, pingadeiras ou outros acessórios.",
      details: "A instalação incorreta de acessórios pode comprometer todo o sistema de cobertura, causando vazamentos e reduzindo a vida útil da cobertura.",
      icon: <Wrench className="h-5 w-5 text-slate-600" />,
      iconColor: "text-slate-600",
      iconBg: "bg-slate-100",
      selected: false
    }
  ]);
  
  const handleSelectNonConformity = (id: number, isSelected: boolean) => {
    setNonConformities(nonConformities.map(item => 
      item.id === id ? { ...item, selected: isSelected } : item
    ));
  };
  
  const handleAddPhoto = (id: number) => {
    console.log(`Add photo to nonconformity ${id}`);
    // Here you would typically open a camera interface or file picker
  };
  
  const handleAddNote = (id: number, note: string) => {
    setNonConformities(nonConformities.map(item => 
      item.id === id ? { ...item, notes: note } : item
    ));
  };
  
  const getSelectedCount = () => {
    return nonConformities.filter(item => item.selected).length;
  };
  
  const handleNext = () => {
    if (getSelectedCount() > 0) {
      navigate('/registro-fotografico');
    }
  };

  const inspectionSteps = [
    'Cliente',
    'Informações',
    'Telhas',
    'Não Conformidades',
    'Fotos',
    'Finalização'
  ];
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center mb-6">
        <Link to="/selecao-telhas" className="text-gray-500 hover:text-gray-700 mr-2">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Não Conformidades</h1>
      </div>
      
      <ProgressBar 
        currentStep={4} 
        totalSteps={6} 
        labels={inspectionSteps}
      />
      
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Identificação de Não Conformidades</h2>
              <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                Selecionadas: {getSelectedCount()} / {nonConformities.length}
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">
              Selecione todas as não conformidades encontradas durante a vistoria. Para cada item selecionado, 
              adicione observações específicas e fotos que demonstrem o problema.
            </p>
            
            <div className="mt-6">
              {nonConformities.map(item => (
                <NonConformityItem
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  description={item.description}
                  icon={item.icon}
                  iconColor={item.iconColor}
                  iconBg={item.iconBg}
                  details={item.details}
                  isSelected={item.selected}
                  onSelect={handleSelectNonConformity}
                  onAddPhoto={handleAddPhoto}
                  onAddNote={handleAddNote}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Link
            to="/selecao-telhas"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Voltar
          </Link>
          <button
            type="button"
            onClick={handleNext}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
              getSelectedCount() > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={getSelectedCount() === 0}
          >
            Próximo
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NonConformitiesPage;