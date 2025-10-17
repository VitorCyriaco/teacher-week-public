'use client'

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { HomenagemInsert, FormData } from '@/types/formulario';
import { submitHomenagem } from '@/services/formularioService';
import { fetchProfessorPorId } from '@/services/professoresServices';
import { fetchCategoriaPorTitulo } from '@/services/categoriasServices';
import { ProfessorComCurso } from '@/types/professores';
import { Categoria } from '@/types/categorias';

import { IconType } from 'react-icons';
import { FaHeart, FaLaughBeam, FaBrain, FaRegSmile, FaBullseye, FaCode, FaRocket, FaHeadphones, FaMicrophone } from 'react-icons/fa';

const iconMap: { [key: string]: IconType } = {
    'FaLaughBeam': FaLaughBeam, 'FaHeart': FaHeart, 'FaBrain': FaBrain,
    'FaRegSmile': FaRegSmile, 'FaBullseye': FaBullseye, 'FaCode': FaCode,
    'FaRocket': FaRocket, 'FaHeadphones': FaHeadphones, 'FaMicrophone': FaMicrophone,
};

export default function Mensagem({ params }: { params: Promise<{ professorId: string }> }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [professor, setProfessor] = useState<ProfessorComCurso | null>(null);
    const [categoria, setCategoria] = useState<Categoria | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const MAX_CHARS = 200;

    const resolvedParams = React.use(params);
    const professorId = parseInt(resolvedParams.professorId);

    const categoriaTitulo = searchParams.get('categoria');

    useEffect(() => {
        const loadData = async () => {
            if (!professorId || !categoriaTitulo) {
                setIsLoading(false);
                return;
            }
            try {
                const [profData, catData] = await Promise.all([
                    fetchProfessorPorId(professorId),
                    fetchCategoriaPorTitulo(categoriaTitulo),
                ]);
                setProfessor(profData);
                setCategoria(catData);
            } catch (error) {
                console.error("Erro ao carregar dados para a página de mensagem:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [professorId, categoriaTitulo]);

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMensagem(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const studentInfoString = sessionStorage.getItem('studentInfo');

        if (!studentInfoString || !professor || !categoria) {
            alert("Dados da sessão inválidos ou faltando. Por favor, reinicie o processo.");
            router.push('/info');
            return;
        }

        const studentInfo: FormData = JSON.parse(studentInfoString);
        const homenagemCompleta: HomenagemInsert = {
            student_name: studentInfo.nome,
            student_course: studentInfo.curso,
            student_period: studentInfo.periodo,
            professor_id: professor.id,
            category_id: categoria.id,
            message: mensagem,
        };

        try {
            await submitHomenagem(homenagemCompleta);
            router.push(`/homenagem/${professorId}/video`);
        } catch (error) {
            console.error(error);
            alert("Ocorreu um erro ao enviar sua homenagem. Tente novamente.");
        }
    };

    if (isLoading) {
        return <main className="h-screen flex items-center justify-center bg-slate-900 text-amber-400">Carregando...</main>;
    }

    if (!professor || !categoria) {
        return <main className="h-screen flex items-center justify-center bg-slate-900 text-red-400">Dados do professor ou categoria não encontrados.</main>;
    }

    const Icone = iconMap[categoria.icone_nome];

    return (
        <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 font-sans text-slate-200 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 z-10 p-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                    Palavras que Valem Ouro
                </h1>
                <p className="mt-2 text-md text-slate-300">
                    Esta é a sua chance de deixar uma marca inesquecível.
                </p>
            </header>

            <div className="flex-grow overflow-y-auto p-4 flex justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-4">

                    <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <p className="text-sm text-slate-400">Homenagem para:</p>
                        <h2 className="text-xl font-bold text-white">{professor.name}</h2>

                        <div className="mt-2 flex items-center gap-2 text-amber-400">
                            {Icone && <Icone className="w-6 h-6" />}
                            <p className="text-lg font-semibold">{categoria.titulo}</p>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow">
                        <label htmlFor="mensagem" className="sr-only">Sua Homenagem</label>
                        <textarea
                            id="mensagem"
                            value={mensagem}
                            onChange={handleMessageChange}
                            maxLength={MAX_CHARS}
                            placeholder="Escreva aqui uma mensagem de carinho, uma memória divertida ou um agradecimento especial..."
                            className="w-full h-full flex-grow bg-slate-900/70 border border-slate-700 rounded-lg p-4 text-white placeholder-slate-500 
                                       focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
                            required
                        />
                        <div className="text-right text-sm text-slate-400 mt-2 pr-1">
                            <span className={mensagem.length > MAX_CHARS - 20 ? 'text-amber-400' : ''}>
                                {mensagem.length} / {MAX_CHARS}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={mensagem.trim().length === 0}
                        className="w-full bg-amber-400 text-slate-900 font-bold py-4 rounded-lg
                                   text-lg flex items-center justify-center gap-3
                                   hover:bg-amber-300 transform hover:scale-105 transition-all
                                   disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    >
                        Enviar Homenagem 🚀
                    </button>
                </form>
            </div>
        </main>
    );
}