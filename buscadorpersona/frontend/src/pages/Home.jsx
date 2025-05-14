import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const Home = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <h1 className="text-3xl font-bold mb-10 text-indigo-800">Bienvenido a GM Group</h1>
      <div className="space-y-4 gap-4 flex items-start">
        <Button onCLick={() => navigate('/comercial')}>
          Área Comercial
        </Button>
        <Button onCLick={() => navigate('/consulta')}>
          Consulta de Personas
        </Button>
      </div>
    </div>
  );
};

export default Home;

