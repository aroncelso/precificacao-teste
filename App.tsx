import React, { useState, useEffect } from "react";
import { 
  Store, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Menu, 
  Bell, 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  Settings 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

// --- Componentes Internos (Simulando os arquivos importados para o Dashboard funcionar) ---

const Sidebar = () => (
  <div className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 overflow-y-auto">
    <div className="p-6 border-b border-slate-800">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Store className="text-brand-500" /> Dash.AI
      </h1>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <div className="flex items-center gap-3 px-4 py-3 bg-brand-600 rounded-lg text-white cursor-pointer">
        <LayoutDashboard size={20} />
        <span className="font-medium">Visão Geral</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
        <BarChart3 size={20} />
        <span>Vendas</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
        <Users size={20} />
        <span>Clientes</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors">
        <Settings size={20} />
        <span>Configurações</span>
      </div>
    </nav>
  </div>
);

const Header = () => (
  <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
    <div className="flex items-center gap-4">
      <Menu className="md:hidden text-slate-600 cursor-pointer" />
      <div className="relative hidden sm:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input 
          type="text" 
          placeholder="Buscar..." 
          className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 w-64"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full">
        <Bell size={20} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200">
        AD
      </div>
    </div>
  </header>
);

const MetricCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm">
      <span className="text-green-600 font-medium flex items-center gap-1">
        <TrendingUp size={14} /> {trend}
      </span>
      <span className="text-slate-400">vs. mês anterior</span>
    </div>
  </div>
);

// --- Main App Component ---

const App = () => {
  const [selectedStore, setSelectedStore] = useState("Todas as Lojas");
  const [selectedMonth, setSelectedMonth] = useState("Dezembro");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [dados, setDados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Correção da sintaxe do useEffect e tratamento de erro
  useEffect(() => {
    setLoading(true);
    fetch("https://script.google.com/macros/s/AKfycby5L01fyZ9Lqt7lZ0ZyKvCIkVnXBxEKxzZ-l22GCFJ9Yb76i9O-DhiHOg9kfI8dxLVTVQ/exec")
      .then(res => res.json())
      .then(data => {
        console.log("Dados recebidos:", data);
        // Garantir que data seja um array ou tratar conforme estrutura
        setDados(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro no fetch:", err);
        setLoading(false);
      });
  }, []); // Array de dependências vazio para rodar apenas uma vez

  // Dados Mockados para o gráfico caso a API esteja vazia ou carregando (para visualização)
  const chartData = [
    { name: 'Loja A', vendas: 4000, lucro: 2400 },
    { name: 'Loja B', vendas: 3000, lucro: 1398 },
    { name: 'Loja C', vendas: 2000, lucro: 9800 },
    { name: 'Loja D', vendas: 2780, lucro: 3908 },
    { name: 'Loja E', vendas: 1890, lucro: 4800 },
  ];

  const pieData = [
    { name: 'Varejo', value: 400 },
    { name: 'Atacado', value: 300 },
    { name: 'Online', value: 300 },
    { name: 'Outros', value: 200 },
  ];
  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      
      <div className="flex-1 md:ml-64 transition-all duration-300">
        <Header />
        
        <main className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
          
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Dashboard de Vendas</h2>
              <p className="text-slate-500 text-sm">Acompanhe seus indicadores em tempo real</p>
            </div>
            <div className="flex gap-2">
              <select 
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
              >
                <option>Todas as Lojas</option>
                <option>Loja Centro</option>
                <option>Loja Shopping</option>
              </select>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2.5"
              >
                <option>Dezembro</option>
                <option>Novembro</option>
              </select>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Vendas Totais" 
              value={loading ? "..." : "R$ 124.500"} 
              icon={ShoppingCart} 
              trend="+12.5%" 
              color="bg-blue-500" 
            />
            <MetricCard 
              title="Lojas Ativas" 
              value={loading ? "..." : (dados.length > 0 ? dados.length : "12")} 
              icon={Store} 
              trend="+2" 
              color="bg-emerald-500" 
            />
            <MetricCard 
              title="Ticket Médio" 
              value="R$ 342,00" 
              icon={TrendingUp} 
              trend="+5.2%" 
              color="bg-amber-500" 
            />
            <MetricCard 
              title="Produtos" 
              value="1,240" 
              icon={Package} 
              trend="+1.8%" 
              color="bg-purple-500" 
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sales Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Desempenho por Loja</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`} />
                    <Tooltip 
                      cursor={{ fill: '#f1f5f9' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="vendas" name="Vendas" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lucro" name="Lucro" fill="#22c55e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Distribution Chart */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Canais de Venda</h3>
              <div className="h-[300px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-2xl font-bold text-slate-800">100%</span>
                </div>
              </div>
            </div>

          </div>

          {/* List Section (Using data from fetch) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-200">
               <h3 className="text-lg font-bold text-slate-800">Dados Brutos (Google Sheets)</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                    <tr>
                      <th className="px-6 py-3">ID</th>
                      <th className="px-6 py-3">Dados (JSON)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                       <tr><td colSpan={2} className="px-6 py-4 text-center">Carregando dados...</td></tr>
                    ) : (
                      dados.slice(0, 5).map((row: any, idx) => (
                        <tr key={idx} className="bg-white border-b hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">#{idx + 1}</td>
                          <td className="px-6 py-4 font-mono text-xs">{JSON.stringify(row).substring(0, 100)}...</td>
                        </tr>
                      ))
                    )}
                    {!loading && dados.length === 0 && (
                      <tr><td colSpan={2} className="px-6 py-4 text-center">Nenhum dado encontrado</td></tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;