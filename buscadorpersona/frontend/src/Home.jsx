import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-3xl font-bold mb-10 text-indigo-800">Bienvenido a GM Group</h1>
      <div className="space-y-4">
        <button
          onClick={() => navigate('/comercial')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          Área Comercial
        </button>
        <button
          onClick={() => navigate('/consulta')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          Consulta de Personas
        </button>
      </div>
    </div>
  );
};

export default Home;

