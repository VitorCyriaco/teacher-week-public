'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { ProfessorComCurso } from '@/types/professores';
import { fetchProfessorPorId } from '@/services/professoresServices';

function VideoPageContent({ professorId }: { professorId: number }) {
    const router = useRouter();
    const [professor, setProfessor] = useState<ProfessorComCurso | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isNaN(professorId)) {
            setIsLoading(false);
            return;
        }

        const loadProfessor = async () => {
            setIsLoading(true);
            try {
                const data = await fetchProfessorPorId(professorId);
                setProfessor(data);
            } catch (error) {
                console.error(`Erro ao buscar dados do professor ${professorId}:`, error);
                setProfessor(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfessor();
    }, [professorId]);

    useEffect(() => {
        if (professor && professor.video_urls && professor.video_urls.length > 0) {
            const randomIndex = Math.floor(Math.random() * professor.video_urls.length);
            setVideoUrl(professor.video_urls[randomIndex]);
        }
    }, [professor]);

    if (isLoading) {
        return <main className="h-screen flex items-center justify-center bg-slate-900 text-amber-400">Carregando recompensa...</main>;
    }

    if (!professor || !videoUrl) {
        return (
            <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 flex items-center justify-center text-center text-white p-4">
                <div>
                    <h1 className="text-2xl font-bold text-amber-400">Oops!</h1>
                    <p className="mt-2 text-slate-300">Professor não encontrado ou sem vídeos de homenagem disponíveis.</p>
                    <button
                        onClick={() => router.push('/')}
                        className="mt-6 bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-lg hover:bg-amber-300 transition-colors"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="h-screen bg-gradient-to-br from-slate-900 to-indigo-800 font-sans text-slate-200 flex flex-col overflow-hidden">
            <header className="flex-shrink-0 z-10 p-4 text-center">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
                    Sua Recompensa do Mestre!
                </h1>
                <p className="mt-2 text-md text-slate-300">
                    Uma mensagem especial do(a) <strong className="font-bold text-white">{professor.name}</strong> para você!
                </p>
            </header>

            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full max-w-2xl aspect-video rounded-lg shadow-2xl overflow-hidden border-2 border-amber-400">
                    <iframe
                        className="w-full h-full"
                        src={`${videoUrl}?autoplay=1&rel=0`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={`Vídeo de homenagem do(a) Professor(a) ${professor.name}`}
                    ></iframe>
                </div>
            </div>

            <footer className="flex-shrink-0 z-10 p-4 bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/80">
                <button
                    onClick={() => router.push('/')}
                    className="w-full max-w-md mx-auto bg-amber-400 text-slate-900 font-bold py-4 rounded-lg
                               text-lg flex items-center justify-center gap-3
                               hover:bg-amber-300 transform hover:scale-105 transition-all"
                >
                    Fazer outra homenagem! 🎉
                </button>
            </footer>
        </main>
    );
}

export default function VideoPageWrapper({ params }: { params: Promise<{ professorId: string }> }) {
    const resolvedParams = React.use(params);
    const professorId = parseInt(resolvedParams.professorId, 10);

    return (
        <Suspense fallback={<main className="h-screen flex items-center justify-center bg-slate-900 text-amber-400">Carregando...</main>}>
            <VideoPageContent professorId={professorId} />
        </Suspense>
    );
}