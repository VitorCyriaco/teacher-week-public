import { supabase } from "@/lib/supabase";
import { CategoryRankingFromDB, LiveMessage, HomenagemComProfessor } from "@/types/telao";

export async function fetchCategoryRankings(limit = 2): Promise<CategoryRankingFromDB[]> {
    const { data, error } = await supabase.rpc('get_category_rankings', { limit_per_category: limit });

    if (error) {
        console.error("Erro ao buscar rankings:", error);
        throw new Error("Não foi possível buscar os rankings.");
    }
    return data || [];
}

export async function fetchInitialMessages(limit = 4): Promise<LiveMessage[]> {
    const { data, error } = await supabase
        .from('homenagens')
        .select<string, HomenagemComProfessor>(`
            id,
            student_name,
            message,
            professores ( name ) 
        `)
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Erro ao buscar mensagens iniciais:", error);
        throw new Error("Não foi possível buscar as mensagens iniciais.");
    }

    if (!data) {
        return [];
    }

    return data.map(item => ({
        id: item.id,
        studentName: item.student_name,
        message: item.message,
        professorName: item.professores?.name || 'Professor não encontrado',
    }));
}