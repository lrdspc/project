# Sistema de Vistorias Brasilit

Sistema para gerenciamento de vistorias técnicas em coberturas, desenvolvido para a Brasilit.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
src/
├── components/         # Componentes reutilizáveis
│   ├── auth/           # Componentes relacionados à autenticação
│   ├── clients/        # Componentes para gestão de clientes
│   ├── dashboard/      # Componentes do painel principal
│   ├── layout/         # Componentes de layout (Sidebar, Header, etc.)
│   ├── nonconformities/ # Componentes para gestão de não conformidades
│   ├── tiles/          # Componentes de tiles/cards
│   ├── ui/             # Componentes de UI genéricos
│   └── users/          # Componentes relacionados a usuários
├── hooks/              # Custom hooks
│   ├── useClients.ts   # Hook para gerenciar clientes
│   ├── useInspections.ts # Hook para gerenciar inspeções
│   └── useProfile.ts   # Hook para gerenciar perfil do usuário
├── lib/                # Bibliotecas e utilitários
│   ├── auth.context.tsx # Contexto de autenticação
│   ├── database.types.ts # Tipos do banco de dados
│   ├── supabase.ts     # Cliente Supabase
│   └── template-report-generator.ts # Gerador de relatórios baseado em templates
├── pages/              # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação
│   ├── Dashboard.tsx   # Página principal
│   ├── Clients.tsx     # Página de clientes
│   └── ...             # Outras páginas
├── workers/            # Web Workers para processamento em segundo plano
│   └── template-report-worker.js # Worker para geração de relatórios
├── App.tsx             # Componente principal da aplicação
└── main.tsx            # Ponto de entrada da aplicação
```

## Funcionalidades

- **Autenticação**: Login, registro e recuperação de senha
- **Gestão de Clientes**: Cadastro e gerenciamento de clientes
- **Vistorias**: Criação e gerenciamento de vistorias técnicas
- **Relatórios**: Geração de relatórios de vistorias
- **Modo Offline**: Funcionalidade PWA para trabalhar sem conexão

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Autenticação, Storage)
- **PWA**: Service Worker para funcionalidade offline
- **Relatórios**: Docxtemplater e PizZip para geração de documentos DOCX

## Instalação e Execução

1. Clone o repositório
2. Instale as dependências:
   ```
   npm install
   ```
3. Execute o projeto em modo de desenvolvimento:
   ```
   npm run dev
   ```

## Criação de Templates para Relatórios

O sistema utiliza Docxtemplater para geração de relatórios baseados em templates. Para criar um novo template:

1. Crie um documento DOCX no Microsoft Word
2. Utilize a sintaxe de placeholders do Docxtemplater: `{variavel}`
3. Salve o arquivo como `report-template.docx` no diretório `public/templates/`

### Variáveis disponíveis no template:

- **Informações básicas**: `{reportId}`, `{reportDate}`, `{currentDate}`
- **Cliente**: `{clientName}`, `{clientProject}`, `{clientAddress}`, etc.
- **Equipe**: `{technicianName}`, `{department}`, `{unit}`, etc.
- **Telhas**: Loop com `{#roofTiles}` ... `{/roofTiles}` contendo `{type}`, `{quantity}`, `{area}`, `{totalArea}`
- **Não conformidades**: Loop com `{#nonConformities}` ... `{/nonConformities}` contendo `{title}`, `{description}`, `{notes}`
- **Fotos**: Loops para `{#overviewPhotos}`, `{#nonconformityPhotos}` e `{#otherPhotos}`
- **Comentários**: `{comments}`

Para mais informações sobre a sintaxe de templates, consulte a [documentação do Docxtemplater](https://docxtemplater.com/docs/).

## Deployment

O projeto está configurado para deploy na plataforma Vercel, integrado com GitHub para CI/CD.

# Projeto Bolt

Aplicativo para gerenciamento de vistorias técnicas.

## Recursos Principais

- Gerenciamento de vistorias técnicas
- Suporte a modo offline com sincronização automática
- Geração de relatórios em PDF com suporte a imagens
- Interface responsiva e intuitiva

## Atualizações Recentes

- Adicionado o componente NewInspection para criar novas vistorias
- Corrigido problema de importação dinâmica de módulos
- Implementado suporte para modo offline
- Melhorado gerador de relatórios com suporte a imagens 