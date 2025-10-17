'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { ProfessorComCurso } from '@/types/professores';
import { fetchTodosProfessores } from '@/services/professoresServices';

const NUM_VISIBLE = 7;

export function HomePage() {

    const router = useRouter();

    const animations = ['animate-float1', 'animate-float2', 'animate-float3'];

    const [visibleProfessors, setVisibleProfessors] = useState<ProfessorComCurso[]>([]);

    const getStyleForIndex = (index: number) => {
        const positions = [
            { top: '10%', left: '25%' }, { top: '50%', left: '10%' },
            { top: '0%', left: '55%' }, { top: '60%', left: '70%' },
            { top: '20%', left: '80%' }, { top: '55%', left: '40%' },
            { top: '5%', left: '0%' },
        ];
        return positions[index % positions.length];
    };

    useEffect(() => {
        const initializeAndAnimate = async () => {
            const allProfessors = await fetchTodosProfessores();

            if (!allProfessors || allProfessors.length === 0) return;

            setVisibleProfessors(allProfessors.slice(0, Math.min(allProfessors.length, NUM_VISIBLE)));

            if (allProfessors.length > NUM_VISIBLE) {
                const intervalId = setInterval(() => {
                    setVisibleProfessors((currentVisible) => {
                        const visibleIds = currentVisible.map(p => p.id);
                        const availablePool = allProfessors.filter(p => !visibleIds.includes(p.id));

                        if (availablePool.length === 0) return currentVisible;

                        const nextProf = availablePool[Math.floor(Math.random() * availablePool.length)];
                        const indexToReplace = Math.floor(Math.random() * currentVisible.length);

                        const newVisible = [...currentVisible];
                        newVisible[indexToReplace] = nextProf;
                        return newVisible;
                    });
                }, 3000);

                return () => clearInterval(intervalId);
            }
        };

        initializeAndAnimate();
    }, []);


    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 to-indigo-800 flex flex-col items-center font-sans text-slate-200 overflow-hidden">

            <header className="w-full max-w-6xl px-4 pt-6 md:pt-8 z-10">
                <Image
                    src={""}//adicione sua logo aqui
                    alt="Logo do Senac"
                    width={96}
                    height={96}
                    className="w-32 md:w-40"
                />
            </header>

            <div className="w-full max-w-2xl lg:max-w-4xl flex-grow flex flex-col justify-center items-center text-center p-4 z-10">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-amber-400 tracking-tight">
                    Hall da Fama dos Mestres
                </h1>
                <p className="mt-4 text-base md:text-lg text-slate-300 font-light max-w-lg">
                    Homenageie quem te inspira e descubra uma surpresa!
                </p>

                <div className="relative w-full h-64 md:h-80 my-8 md:my-12">
                    {visibleProfessors.map((prof, index) => (
                        <Image
                            key={prof.id}
                            src={prof.image_url ?? '/img/placeholder.png'}
                            alt={prof.name}
                            width={96}
                            height={96}
                            className={`absolute rounded-full object-cover border-2 border-amber-400/50 shadow-lg
                w-20 h-20 md:w-28 md:h-28
                filter grayscale hover:grayscale-0
                transform hover:scale-110 transition-all duration-300
                ${animations[index % animations.length]}`}
                            style={getStyleForIndex(index)}
                        />
                    ))}
                </div>
            </div>

            <footer className="w-full max-w-2xl lg:max-w-3xl flex justify-center px-4 pb-6 md:pb-8 z-10">
                <button className="w-full md:w-auto bg-amber-400 text-slate-900 font-bold py-4 rounded-lg 
                     text-lg md:text-xl md:px-16 flex items-center justify-center gap-3
                     hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50 
                     transition-all duration-300 transform hover:scale-105 animate-pulse"
                    onClick={() => router.push('/info')}>🏆 Começar a Homenagem</button>
            </footer>
        </main>
    );
}