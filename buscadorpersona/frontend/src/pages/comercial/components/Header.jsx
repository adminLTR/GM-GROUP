import Button from "../../../components/Button"

export default function Header({activeTab, setActiveTab}) {
    return <header className="bg-indigo-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Sistema de Gestión Comercial</h1>
            <div className="flex space-x-4">
                <Button type={activeTab === 'filter' ? 'outline' : 'normal'}
                    onClick={() => setActiveTab('filter')}>
                    Filtrar Empresas
                </Button>
                <Button type={activeTab === 'kanban' ? 'outline' : 'normal'}
                    onClick={() => setActiveTab('kanban')}>
                    Tablero Kanban
                </Button>
            </div>
          </div>
        </div>
      </header>
}