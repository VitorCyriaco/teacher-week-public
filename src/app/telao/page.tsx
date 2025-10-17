'use client'

import React, { useState, useEffect } from 'react';
import { LiveMessage, StyledLiveMessage, CategoryRankingFromDB } from '@/types/telao';
import { fetchCategoryRankings, fetchInitialMessages } from '@/services/telaoServices';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

import { FaHeart, FaLaughBeam, FaBrain, FaRegSmile, FaBullseye, FaCode, FaRocket, FaHeadphones, FaMicrophone } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { Homenagem } from '@/types/homenagens';

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

const MAX_POSTITS = 20;
const UPDATE_INTERVAL = 10000;

const generateRandomStyles = () => {
    const colors = ['bg-yellow-200', 'bg-lime-200', 'bg-sky-200', 'bg-pink-200'];
    const rotations = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2', 'rotate-1'];

    const top = `${Math.random() * 80}%`;
    const left = `${Math.random() * 78}%`;

    return {
        top,
        left,
        rotation: rotations[Math.floor(Math.random() * rotations.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
    };
};

const PostItCard = ({ msg }: { msg: StyledLiveMessage }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`absolute w-56 min-h-56 p-4 shadow-xl flex flex-col font-kalam text-slate-800
                       transition-all duration-1000 ease-in-out ${msg.rotation} ${msg.color}`}
            style={{
                top: msg.top,
                left: msg.left,
                transform: isVisible ? 'scale(1)' : 'scale(0)',
                opacity: isVisible ? 1 : 0,
            }}
        >
            <p className="flex-grow text-xl italic overflow-hidden">{msg.message}</p>
            <div className="font-bold text-right text-slate-700 text-sm">
                <p>- {msg.studentName}</p>
                <p>p/ <span className="text-indigo-600">{msg.professorName}</span></p>
            </div>
        </div>
    );
};

const RankingColuna = ({ data }: { data: CategoryRankingFromDB[] }) => (
    <div className="flex flex-col gap-4">
        {data.map(cat => {
            const Icone = iconMap[cat.Icon];
            return (
                <div key={cat.categoryTitle} className="bg-slate-900/60 p-4 rounded-lg border border-amber-400/20">
                    <div className="flex items-center gap-3 mb-3">
                        {Icone && <Icone className="w-8 h-8 text-amber-400 flex-shrink-0" />}
                        <h2 className="text-xl font-bold text-amber-400 truncate">{cat.categoryTitle}</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                        {cat.ranking && cat.ranking.length > 0 ? (
                            cat.ranking.map((prof, index) => (
                                <div key={prof.id} className="flex items-center gap-3 bg-slate-800 p-2 rounded">
                                    <span className="text-lg font-bold text-slate-400 w-6 text-center">{index + 1}º</span>
                                    <Image
                                        key={prof.id}
                                        src={prof.imageUrl}
                                        alt={prof.name}
                                        width={96}
                                        height={96}
                                        className="w-10 h-10 rounded-full border-2 border-slate-600"
                                    />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-white truncate">{prof.name}</p>
                                        {prof.votes > 1 && <p className="text-sm text-slate-400">{prof.votes} votos</p>}
                                        {prof.votes === 1 && <p className="text-sm text-slate-400">{prof.votes} voto</p>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 italic px-2">Aguardando os primeiros votos...</p>
                        )}
                    </div>
                </div>
            )
        })}
    </div>
);

export default function TelaoPage() {
    const [mensagens, setMensagens] = useState<StyledLiveMessage[]>([]);
    const [rankings, setRankings] = useState<CategoryRankingFromDB[]>([]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [rankingsData, initialMessagesData] = await Promise.all([
                    fetchCategoryRankings(2),
                    fetchInitialMessages(MAX_POSTITS)
                ]);

                setRankings(rankingsData);
                setMensagens(initialMessagesData.map(msg => ({ ...msg, ...generateRandomStyles() })));

            } catch (error) {
                console.error("Falha ao carregar dados iniciais do telão:", error);
            }
        };
        loadInitialData();

        const channel = supabase
            .channel('homenagens-realtime')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'homenagens' },
                async (payload: RealtimePostgresChangesPayload<Homenagem>) => {
                    if (
                        (payload.eventType === 'INSERT' && payload.new.is_approved) ||
                        (payload.eventType === 'UPDATE' && payload.new.is_approved && !payload.old.is_approved)
                    ) {
                        const novaHomenagem = payload.new;
                        const { data: prof } = await supabase.from('professores').select('name').eq('id', novaHomenagem.professor_id).single();
                        const novaMensagem: LiveMessage = {
                            id: novaHomenagem.id,
                            studentName: novaHomenagem.student_name,
                            professorName: prof?.name || 'um mestre',
                            message: novaHomenagem.message,
                        };

                        setMensagens(prev => {
                            const mensagensFiltradas = prev.filter(m => m.id !== novaMensagem.id);
                            const novasMensagens = [novaMensagem, ...mensagensFiltradas];
                            return novasMensagens.slice(0, MAX_POSTITS).map(msg => ({ ...msg, ...generateRandomStyles() }));
                        });

                        console.log("Atualizando rankings em tempo real...");
                        const updatedRankings = await fetchCategoryRankings(2);
                        setRankings(updatedRankings);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    useEffect(() => {
        const shuffleInterval = setInterval(() => {
            setMensagens(prev => prev.map(msg => ({ ...msg, ...generateRandomStyles() })));
        }, UPDATE_INTERVAL);
        return () => clearInterval(shuffleInterval);
    }, []);

    const metade = Math.ceil(rankings.length / 2);
    const rankingEsquerda = rankings.slice(0, metade);
    const rankingDireita = rankings.slice(metade);

    return (
        <main className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-indigo-800 font-sans text-slate-200 p-6 overflow-hidden">
            <header className="text-center mb-6">
                <h1 className="text-5xl font-extrabold text-amber-400 tracking-wider [text-shadow:_0_4px_8px_rgb(0_0_0_/_40%)]">
                    HALL DA FAMA DOS MESTRES
                </h1>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                <aside className="hidden lg:block lg:col-span-1">
                    <RankingColuna data={rankingEsquerda} />
                </aside>

                <section className="col-span-1 lg:col-span-2 relative h-[75vh]">
                    {mensagens.map(msg => (
                        <PostItCard key={msg.id} msg={msg} />
                    ))}
                </section>

                <aside className="hidden lg:block lg:col-span-1">
                    <RankingColuna data={rankingDireita} />
                </aside>
            </div>
        </main>
    );
}