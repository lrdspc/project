import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

// Interface para o evento BeforeInstallPromptEvent que não está disponível por padrão no TypeScript
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Verificar se o app já está instalado
    const checkIfInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as { standalone?: boolean }).standalone === true;
      setIsInstalled(isStandalone);
    };

    checkIfInstalled();

    // Ouvir o evento de prompt de instalação
    const handleInstallPrompt = (e: Event) => {
      // Armazenar o evento para uso posterior
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Mostrar o banner se não for instalado
      if (!isInstalled) {
        setShowBanner(true);
      }
    };

    // Ouvir o evento personalizado de quando o prompt estiver pronto
    document.addEventListener('pwaInstallReady', handleInstallPrompt);

    // Verificar mudanças no modo de exibição (quando instalado)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsInstalled(e.matches);
      if (e.matches) {
        setShowBanner(false);
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    // Verificar se o evento deferredPrompt já existe na window
    if (
      (window as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt
    ) {
      setDeferredPrompt(
        (window as { deferredPrompt?: BeforeInstallPromptEvent })
          .deferredPrompt || null
      );
      if (!isInstalled) {
        setShowBanner(true);
      }
    }

    return () => {
      document.removeEventListener('pwaInstallReady', handleInstallPrompt);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Mostrar o prompt de instalação
    deferredPrompt.prompt();

    // Esperar pela escolha do usuário
    const { outcome } = await deferredPrompt.userChoice;
    console.log(
      `Usuário ${outcome === 'accepted' ? 'aceitou' : 'recusou'} a instalação`
    );

    // Limpar o deferredPrompt - só pode ser usado uma vez
    setDeferredPrompt(null);
    (window as { deferredPrompt?: BeforeInstallPromptEvent }).deferredPrompt =
      undefined;
    setShowBanner(false);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    // Guardar preferência do usuário para não mostrar novamente por um tempo
    localStorage.setItem('pwaInstallDismissed', Date.now().toString());
  };

  // Não mostrar se já estiver instalado ou se o banner foi dispensado recentemente
  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-50 border-t border-blue-200 p-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Download className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800">Instalar aplicativo</h3>
            <p className="text-sm text-blue-600">
              Usar o Sistema de Vistorias offline e em tela cheia
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleInstallClick}
            className="mr-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Instalar
          </button>
          <button
            onClick={dismissBanner}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
