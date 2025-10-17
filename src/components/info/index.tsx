'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FormData } from '@/types/formulario';
import { CourseOption } from '@/types/cursos';
import Select from 'react-select';
import { fetchCursos } from '@/services/cursosServices';

export function InfoPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        nome: '',
        curso: '',
        periodo: '',
    });

    const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);

    useEffect(() => {
        const loadCourses = async () => {
            setIsLoadingCourses(true);
            try {
                const response = await fetchCursos();
                setCourseOptions(response);
            } catch (error) {
                console.error("Falha ao buscar cursos:", error);
            } finally {
                setIsLoadingCourses(false);
            }
        };
        loadCourses();
    }, []);

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const handleCourseChange = (selectedOption: CourseOption | null) => {
        setFormData(prev => ({ ...prev, curso: selectedOption ? selectedOption.value : '' }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isFormValid) {
            try {
                sessionStorage.setItem('studentInfo', JSON.stringify(formData));
                
                router.push('/professores');

            } catch (error) {
                console.error("Falha ao salvar dados no sessionStorage:", error);
                alert("Ocorreu um erro ao salvar suas informações. Tente novamente.");
            }
        }
    };

    const isFormValid = formData.nome.trim() !== '' && formData.curso !== '' && formData.periodo !== '';

    const selectedCourseValue = courseOptions.find(option => option.value === formData.curso) || null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-800 flex flex-col items-center justify-center p-4 font-sans text-slate-200">
            <div className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-amber-400 tracking-tight">
                    Sua Credencial de Fã
                </h1>
                <p className="mt-2 text-base md:text-lg text-slate-300 font-light max-w-md">
                    Para que todos saibam quem é o autor desta homenagem incrível!
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="w-full max-w-lg bg-slate-800/50 backdrop-blur-sm border border-amber-400/20 rounded-2xl p-6 md:p-8 shadow-2xl"
            >
                <div className="flex flex-col gap-y-6">
                    <div>
                        <label htmlFor="nome" className="block text-sm font-medium text-amber-400 mb-2">
                            Seu Nome
                        </label>
                        <input
                            type="text"
                            id="nome"
                            name="nome"
                            value={formData.nome}
                            onChange={handleChange}
                            placeholder="Digite seu nome completo"
                            className="w-full bg-slate-900/70 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="curso" className="block text-sm font-medium text-amber-400 mb-2">
                            Seu Curso
                        </label>
                        <Select
                            id="curso"
                            name="curso"
                            options={courseOptions}
                            isLoading={isLoadingCourses}
                            value={selectedCourseValue}
                            onChange={handleCourseChange}
                            placeholder={isLoadingCourses ? "Carregando cursos..." : "Digite para buscar..."}
                            isClearable
                            styles={{
                                control: (base) => ({ ...base, backgroundColor: '#0f172a', borderColor: '#334155', minHeight: '46px' }),
                                singleValue: (base) => ({ ...base, color: 'white' }),
                                input: (base) => ({ ...base, color: 'white' }),
                                menu: (base) => ({ ...base, backgroundColor: '#1e293b' }),
                                option: (base, state) => ({ ...base, backgroundColor: state.isFocused ? '#334155' : 'transparent', color: 'white' }),
                            }}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-amber-400 mb-3">
                        Período
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {['manha', 'tarde', 'noite'].map((periodo) => (
                            <div key={periodo}>
                                <input
                                    type="radio"
                                    id={periodo}
                                    name="periodo"
                                    value={periodo}
                                    className="sr-only peer"
                                    onChange={handleChange}
                                    checked={formData.periodo === periodo}
                                    required
                                />
                                <label htmlFor={periodo} className="block w-full text-center cursor-pointer rounded-lg border border-slate-700 p-3 peer-checked:border-amber-400 peer-checked:bg-amber-400 peer-checked:text-slate-900 peer-checked:font-bold transition-all">
                                    {periodo.charAt(0).toUpperCase() + periodo.slice(1)}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={!isFormValid}
                    className="w-full mt-4 bg-amber-400 text-slate-900 font-bold py-4 rounded-lg 
                           text-lg hover:bg-amber-300 focus:outline-none focus:ring-4 
                           focus:ring-amber-400/50 transition-all duration-300 transform hover:scale-105
                           disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:scale-100"
                >
                    Próximo Passo →
                </button>
            </form>
        </main>
    );
}