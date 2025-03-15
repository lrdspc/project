import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { MCPSupabase } from '../lib/mcp-supabase';

const SupabaseTest: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('Verificando conexão com Supabase...');
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    async function testConnection() {
      try {
        // Teste básico de conexão
        const { data, error } = await supabase
          .from('clients')
          .select('count()', { count: 'exact' });

        if (error) {
          throw error;
        }

        setStatus('success');
        setMessage('Conexão com Supabase estabelecida com sucesso!');

        // Listar tabelas disponíveis
        const availableTables = [];

        // Verificar cada tabela definida nos tipos
        try {
          const clientsResult = await MCPSupabase.fetchRecords('clients', {
            limit: 1,
          });
          if (!clientsResult.error) availableTables.push('clients');
        } catch (e) {
          console.log('Tabela clients não disponível');
        }

        try {
          const inspectionsResult = await MCPSupabase.fetchRecords(
            'inspections',
            { limit: 1 }
          );
          if (!inspectionsResult.error) availableTables.push('inspections');
        } catch (e) {
          console.log('Tabela inspections não disponível');
        }

        try {
          const tilesResult = await MCPSupabase.fetchRecords(
            'inspection_tiles',
            { limit: 1 }
          );
          if (!tilesResult.error) availableTables.push('inspection_tiles');
        } catch (e) {
          console.log('Tabela inspection_tiles não disponível');
        }

        try {
          const photosResult = await MCPSupabase.fetchRecords(
            'inspection_photos',
            { limit: 1 }
          );
          if (!photosResult.error) availableTables.push('inspection_photos');
        } catch (e) {
          console.log('Tabela inspection_photos não disponível');
        }

        try {
          const nonconformitiesResult = await MCPSupabase.fetchRecords(
            'nonconformities',
            { limit: 1 }
          );
          if (!nonconformitiesResult.error)
            availableTables.push('nonconformities');
        } catch (e) {
          console.log('Tabela nonconformities não disponível');
        }

        setTables(availableTables);
      } catch (error) {
        console.error('Erro ao testar conexão:', error);
        setStatus('error');
        setMessage(
          `Erro na conexão com Supabase: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    testConnection();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão com Supabase</h1>

      <div
        className={`p-4 rounded-md mb-6 ${
          status === 'loading'
            ? 'bg-blue-50 text-blue-700'
            : status === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
        }`}
      >
        <p className="font-medium">{message}</p>
      </div>

      {status === 'success' && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Tabelas disponíveis:</h2>
          {tables.length > 0 ? (
            <ul className="list-disc ml-6 space-y-1">
              {tables.map(table => (
                <li key={table}>{table}</li>
              ))}
            </ul>
          ) : (
            <p className="text-amber-600">
              Nenhuma tabela disponível. Você precisa criar as tabelas no seu
              projeto Supabase.
            </p>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-md">
            <h3 className="text-lg font-medium mb-2">Próximos passos:</h3>
            <ol className="list-decimal ml-6 space-y-2">
              <li>
                Se nenhuma tabela estiver disponível, você precisa criar as
                tabelas no seu novo projeto Supabase.
              </li>
              <li>
                Você pode encontrar os scripts de migração na pasta{' '}
                <code>supabase/migrations</code> deste projeto.
              </li>
              <li>
                Execute esses scripts no SQL Editor do seu projeto Supabase para
                criar a estrutura necessária.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest;
