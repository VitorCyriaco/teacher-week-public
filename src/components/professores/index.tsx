'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { ProfessorComCurso } from '@/types/professores';
import { useRouter } from 'next/navigation';
import { fetchTodosProfessores } from '@/services/professoresServices';
import { CourseOption } from '@/types/cursos';
import { fetchCursos } from '@/services/cursosServices';
import Image from 'next/image';

export function ProfessoresPage() {
    const router = useRouter();
    const [cursoSelecionado, setCursoSelecionado] = useState<string>('Todos os Cursos');
    const [selecionado, setSelecionado] = useState<number | null>(null);

    const [professores, setProfessores] = useState<ProfessorComCurso[]>([]);
    const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true);
            try {
                const [professoresData, cursosData] = await Promise.all([
                    fetchTodosProfessores(),
                    fetchCursos()
                ]);
                setProfessores(professoresData);
                setCourseOptions(cursosData);
            } catch (error) {
                console.error("Falha ao carregar dados da página:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const professoresFiltrados = useMemo(() => {
        if (cursoSelecionado === 'Todos os Cursos') {
            return professores;
        }
        return professores.filter(p => p.cursos?.nome === cursoSelecionado);
    }, [cursoSelecionado, professores]);

    const handleSelect = (id: number) => {
        setSelecionado(id);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelecionado(null);
        setCursoSelecionado(e.target.value);
    };

    const handleNavigation = () => {
        if (selecionado !== null) {
            router.push(`/homenagem/${selecionado}/categorias`);
        }
    };

    return (
        <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 font-sans text-slate-200 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 z-20 bg-slate-900/80 backdrop-blur-lg p-4 shadow-xl">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                            Escolha Sua Estrela
                        </h1>
                        <p className="mt-1 text-sm text-slate-300">Selecione o professor que você quer homenagear.</p>
                    </div>
                    <div className="mt-4 max-w-xs mx-auto">
                        <label htmlFor="curso-filtro" className="sr-only">Filtrar por Curso</label>
                        <select
                            id="curso-filtro"
                            onChange={handleFilterChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                        >
                            <option>Todos os Cursos</option>
                            {courseOptions.map(curso => <option key={curso.value} value={curso.value}>{curso.label}</option>)}
                        </select>
                    </div>
                </div>
            </header>

            <div className="flex-grow overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full text-amber-400">Carregando professores...</div>
                ) : (
                    <div className="p-4 max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-28">
                        {professoresFiltrados.map(prof => (
                            <div key={prof.id} onClick={() => handleSelect(prof.id)} className="cursor-pointer">
                                <input
                                    type="radio"
                                    id={`prof-${prof.id}`}
                                    name="professor-selecao"
                                    checked={selecionado === prof.id}
                                    readOnly
                                    className="sr-only peer"
                                />
                                <div className="relative bg-slate-800/50 rounded-lg p-3 text-center border-2 border-transparent 
                                              peer-checked:border-amber-400 peer-checked:shadow-lg peer-checked:shadow-amber-400/20 
                                              transform hover:-translate-y-2 transition-all duration-300">
                                    <Image
                                        src={prof.image_url ?? '/img/placeholder.png'}
                                        alt={prof.name}
                                        width={96}
                                        height={96}
                                        className={"w-24 h-24 rounded-full mx-auto border-4 border-slate-700"}
                                    />
                                    <h3 className="mt-3 font-bold text-white truncate">{prof.name}</h3>
                                    <p className="text-xs text-amber-400">{prof.cursos?.nome || 'Curso não definido'}</p>
                                    <div className="absolute top-2 right-2 w-6 h-6 ...">✓</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="flex-shrink-0 z-20 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/80">
                <button
                    disabled={selecionado === null}
                    className="w-full max-w-md mx-auto bg-amber-400 text-slate-900 font-bold py-4 rounded-lg
                     text-lg flex items-center justify-center gap-3
                     hover:bg-amber-300 transform hover:scale-105 transition-all
                     disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed"
                    onClick={handleNavigation}
                >
                    Próximo: Escolher uma categoria →
                </button>
            </footer>
        </main>
    );
}