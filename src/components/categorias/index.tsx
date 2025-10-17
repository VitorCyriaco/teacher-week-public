'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Categoria } from '@/types/categorias';
import { ProfessorComCurso } from '@/types/professores';
import { fetchAllCategorias } from '@/services/categoriasServices';
import { fetchProfessorPorId } from '@/services/professoresServices';

import { FaHeart, FaLaughBeam, FaBrain, FaRegSmile, FaBullseye, FaCode, FaRocket, FaHeadphones, FaMicrophone } from 'react-icons/fa';
import { IconType } from 'react-icons';

const iconMap: { [key: string]: IconType } = {
    'FaLaughBeam': FaLaughBeam,
    'FaHeart': FaHeart,
    'FaBrain': FaBrain,
    'FaRegSmile': FaRegSmile,
    'FaBullseye': FaBullseye,
    'FaCode': FaCode,
    'FaRocket': FaRocket,
    'FaHeadphones': FaHeadphones,
    'FaMicrophone': FaMicrophone,
};

export function CategoriasPage({ professorId }: { professorId: number }) {
    const router = useRouter();
    
    const [professor, setProfessor] = useState<ProfessorComCurso | null>(null);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);

    console.log(categorias)

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [professorData, categoriasData] = await Promise.all([
                    fetchProfessorPorId(professorId),
                    fetchAllCategorias()
                ]);
                setProfessor(professorData);
                setCategorias(categoriasData);
            } catch (error) {
                console.error("Erro ao carregar dados da página de categorias:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [professorId]);

    const handleSelect = (titulo: string) => {
        setCategoriaSelecionada(titulo);
    };

    const handleNavigation = () => {
        if (categoriaSelecionada !== null) {
            const categoriaFormatada = encodeURIComponent(categoriaSelecionada);
            router.push(`/homenagem/${professorId}/mensagem?categoria=${categoriaFormatada}`);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-900 text-amber-400">Carregando categorias...</div>;
    }
    
    if (!professor) {
        return <div className="flex justify-center items-center h-screen bg-slate-900 text-red-400">Professor não encontrado.</div>;
    }

    return (
        <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 font-sans text-slate-200 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 z-10 p-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                    Qual troféu este mestre merece?
                </h1>
                <p className="mt-2 text-md text-slate-300">
                    Você está homenageando: <strong className="font-bold text-white">{professor.name}</strong>
                </p>
            </header>

            <div className="flex-grow overflow-y-auto p-4">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
                    {categorias.map((cat) => {
                        const Icone = iconMap[cat.icone_nome];
                        return (
                            <div key={cat.titulo} onClick={() => handleSelect(cat.titulo)} className="cursor-pointer">
                                <input type="radio" id={cat.titulo} name="categoria-selecao" checked={categoriaSelecionada === cat.titulo} readOnly className="sr-only peer" />
                                <div className="h-full bg-slate-800/50 rounded-lg p-6 text-center border-2 border-slate-700 peer-checked:border-amber-400 peer-checked:bg-slate-800 peer-checked:shadow-lg peer-checked:shadow-amber-400/20 transform hover:-translate-y-2 transition-all duration-300 flex flex-col items-center">
                                    {Icone && <Icone className="w-12 h-12 text-amber-400 mb-4" />}
                                    <h3 className="font-bold text-lg text-white">{cat.titulo}</h3>
                                    <p className="text-sm text-slate-400 mt-1 flex-grow">{cat.descricao}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <footer className="flex-shrink-0 z-10 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/80">
                <button
                    disabled={categoriaSelecionada === null}
                    className="w-full max-w-md mx-auto bg-amber-400 text-slate-900 font-bold py-4 rounded-lg text-lg flex items-center justify-center gap-3 hover:bg-amber-300 transform hover:scale-105 transition-all disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    onClick={handleNavigation}
                >
                    Próximo: Escrever a Mensagem →
                </button>
            </footer>
        </main>
    );
};