# MCP Supabase

Este documento descreve como utilizar a integração MCP Supabase no projeto.

## Sobre

MCP Supabase é uma camada de abstração para facilitar a interação com o Supabase, 
oferecendo funções utilitárias para operações comuns de banco de dados como 
busca, inserção, atualização, exclusão e assinaturas em tempo real.

## Configuração

A configuração já está pronta no projeto. O Supabase está configurado com as
variáveis de ambiente definidas no arquivo `.env` na raiz do projeto:

```
VITE_SUPABASE_URL=https://lauifnnlmjrikqhbonbt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Estrutura de Arquivos

- `src/lib/supabase.ts` - Configuração básica do cliente Supabase
- `src/lib/database.types.ts` - Tipos TypeScript para o banco de dados
- `src/lib/mcp-supabase.ts` - Classe utilitária MCP Supabase
- `src/lib/mcp-supabase-example.ts` - Exemplos de uso

## Como Usar

### Buscar Registros

```typescript
import { MCPSupabase } from './lib/mcp-supabase';

// Buscar todos os clientes
const response = await MCPSupabase.fetchRecords('clients');

// Buscar com limite e ordenação
const response = await MCPSupabase.fetchRecords(
  'clients',
  {
    limit: 10,
    orderBy: {
      column: 'created_at',
      ascending: false
    }
  }
);

// Buscar com filtros
const response = await MCPSupabase.fetchRecords(
  'clients',
  { limit: 5 },
  { type: 'corporate' }
);

// Verificar erro e acessar dados
if (response.error) {
  console.error('Erro:', response.error);
} else {
  const clients = response.data;
  // Processar clientes...
}
```

### Inserir Registros

```typescript
import { MCPSupabase } from './lib/mcp-supabase';
import type { Database } from './lib/database.types';

// Dados a serem inseridos
const newClient: Database['public']['Tables']['clients']['Insert'] = {
  name: 'Empresa ABC',
  type: 'corporate',
  address: 'Rua Principal, 123',
  city: 'São Paulo',
  state: 'SP',
  zip_code: '01234-567'
};

// Inserir o registro
const response = await MCPSupabase.insertRecord('clients', newClient);

// Verificar resultado
if (response.error) {
  console.error('Erro ao inserir:', response.error);
} else {
  const insertedClient = response.data?.[0];
  console.log('Cliente inserido:', insertedClient);
}
```

### Atualizar Registros

```typescript
import { MCPSupabase } from './lib/mcp-supabase';

// ID do registro a ser atualizado
const clientId = '123e4567-e89b-12d3-a456-426614174000';

// Dados a serem atualizados
const updates = {
  name: 'Empresa ABC Atualizada',
  contact_phone: '(11) 98765-4321'
};

// Atualizar o registro
const response = await MCPSupabase.updateRecord('clients', clientId, updates);

// Verificar resultado
if (response.error) {
  console.error('Erro ao atualizar:', response.error);
} else {
  const updatedClient = response.data?.[0];
  console.log('Cliente atualizado:', updatedClient);
}
```

### Excluir Registros

```typescript
import { MCPSupabase } from './lib/mcp-supabase';

// ID do registro a ser excluído
const clientId = '123e4567-e89b-12d3-a456-426614174000';

// Excluir o registro
const response = await MCPSupabase.deleteRecord('clients', clientId);

// Verificar resultado
if (response.error) {
  console.error('Erro ao excluir:', response.error);
} else {
  console.log('Cliente excluído com sucesso');
}
```

### Assinaturas em Tempo Real

```typescript
import { MCPSupabase } from './lib/mcp-supabase';

// Função de callback para processar mudanças
const handleClientChanges = (payload) => {
  console.log('Mudança detectada:', payload);
  
  // Verificar o tipo de evento
  const { eventType } = payload;
  
  if (eventType === 'INSERT') {
    console.log('Novo cliente adicionado:', payload.new);
  } else if (eventType === 'UPDATE') {
    console.log('Cliente atualizado:', payload.new);
    console.log('Valores anteriores:', payload.old);
  } else if (eventType === 'DELETE') {
    console.log('Cliente removido:', payload.old);
  }
};

// Iniciar assinatura
const unsubscribe = MCPSupabase.subscribeToTable(
  'clients',
  handleClientChanges
);

// Para cancelar a assinatura quando não for mais necessária
// unsubscribe();
```

## Melhores Práticas

1. **Tipagem Forte**: Sempre use os tipos do `database.types.ts` para garantir consistência.

2. **Tratamento de Erros**: Sempre verifique `response.error` antes de acessar `response.data`.

3. **Cancelamento de Assinaturas**: Cancele assinaturas quando não forem mais necessárias para evitar vazamentos de memória.

4. **Evite Chamadas Redundantes**: Use a função correta para cada operação para minimizar o tráfego de rede.

5. **Segurança**: Nunca exponha a chave `SUPABASE_SERVICE_KEY` no código do cliente. Use apenas a `SUPABASE_ANON_KEY` para operações do cliente.

## Solução de Problemas

Se encontrar problemas ao usar o MCP Supabase, verifique:

1. Se as variáveis de ambiente estão configuradas corretamente
2. Se você está usando os nomes corretos de tabelas e colunas
3. Os logs de erro do Supabase para mensagens mais detalhadas
4. Se a conexão com a internet está funcionando

## Recursos Adicionais

- [Documentação oficial do Supabase](https://supabase.io/docs)
- [Repositório do supabase-js](https://github.com/supabase/supabase-js)
- [Guia de autenticação do Supabase](https://supabase.io/docs/guides/auth) 