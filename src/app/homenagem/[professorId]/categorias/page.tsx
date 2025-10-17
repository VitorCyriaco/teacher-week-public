import React from 'react'; 
import { CategoriasPage} from '@/components/categorias'; 

export default function Page({ params }: { params: Promise<{ professorId: string }> }) {
  
  const resolvedParams = React.use(params);

  const professorId = parseInt(resolvedParams.professorId, 10);

  if (isNaN(professorId)) {
    return (
      <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 flex items-center justify-center text-center text-white p-4">
        <div>
          <h1 className="text-2xl font-bold text-amber-400">ID de professor inválido.</h1>
          <p className="mt-2 text-slate-300">A URL parece estar incorreta.</p>
        </div>
      </main>
    )
  }

  return <CategoriasPage professorId={professorId} />;
}