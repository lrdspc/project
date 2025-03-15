<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
  <Link
    to="/nova-vistoria"
    className="bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex flex-col items-center justify-center"
  >
    <PlusCircle className="h-6 w-6 mb-1" />
    <span className="text-sm font-medium">Nova Vistoria</span>
  </Link>
  <Link
    to="/clientes"
    className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
  >
    <Search className="h-6 w-6 mb-1 text-gray-500" />
    <span className="text-sm font-medium">Buscar Cliente</span>
  </Link>
  <Link
    to="/relatorios"
    className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
  >
    <FileText className="h-6 w-6 mb-1 text-gray-500" />
    <span className="text-sm font-medium">Relatórios</span>
  </Link>
  <Link
    to="/sincronizar"
    className="bg-white text-gray-700 text-center py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm flex flex-col items-center justify-center"
  >
    <RefreshCw className="h-6 w-6 mb-1 text-gray-500" />
    <span className="text-sm font-medium">Sincronizar</span>
  </Link>
</div> 