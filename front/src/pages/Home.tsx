import { useEffect, useState } from 'react';
import Header from '../components/Header.tsx';
import Container from '../components/Container.tsx';
import { useUser } from '../hooks/use-user.ts';
import { useRings } from '../hooks/use-rings.ts';
import { RingCard } from '@/components/RingCard.tsx';
import CreateRing from '@/components/CreateRing.tsx';
import { toast } from 'react-toastify';
import useAuth from '@/middleware/auth.ts';
import { Loader2, PlusCircle, BellRingIcon as Ring } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';

const Home = () => {
  const { rings, loading, error, fetchRings } = useRings();
  const user = useUser((state) => state.user);
  useAuth();

  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchRings();
  }, [fetchRings]);

  const Loading = () => (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 ">
      <Header />
      <Container>
        <div className="py-8 space-y-8">
          <Card className="bg-white bg-opacity-50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl">
                Bem-vindo, {user?.user.username || 'Usuário'}!
              </CardTitle>
              <CardDescription>
                Gerencie seus anéis e acompanhe seu progresso
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg">
                    Total de Anéis: <span className="font-bold">{rings.length}</span>
                  </p>
                </div>
                <Button onClick={() => setIsCreating((prev) => !prev)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Criar Novo Anel
                </Button>
              </div>
              {isCreating && <CreateRing />}
            </CardContent>
          </Card>

          <Card className="bg-white bg-opacity-50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ring className="mr-2 h-5 w-5" />
                Seus Anéis
              </CardTitle>
              <CardDescription>Todos os seus anéis</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Loading />
              ) : (
                <ScrollArea className="h-[500px] w-full rounded-md border p-4">
                  {rings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rings.map((ring) => (
                        <RingCard key={ring.id} ring={ring} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-400">Nenhum anel encontrado.</p>
                  )}
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
      {error &&
        toast.error(error || 'Erro ao carregar anéis.', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        })}
    </div>
  );
};

export default Home;
