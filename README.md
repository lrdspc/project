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
│   └── supabase.ts     # Cliente Supabase
├── pages/              # Páginas da aplicação
│   ├── auth/           # Páginas de autenticação
│   ├── Dashboard.tsx   # Página principal
│   ├── Clients.tsx     # Página de clientes
│   └── ...             # Outras páginas
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

## Deployment

O projeto está configurado para deploy na plataforma Vercel, integrado com GitHub para CI/CD. 