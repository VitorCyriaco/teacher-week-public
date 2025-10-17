import { supabase } from "@/lib/supabase";
import { ProfessorComCurso } from "@/types/professores";

export async function fetchTodosProfessores(): Promise<ProfessorComCurso[]> {
    const { data, error } = await supabase
        .from('professores')
        .select(`
            *,
            cursos (
                nome
            )
        `);

    if (error) throw error;
    return data || [];
}

export async function fetchProfessorPorId(id: number): Promise<ProfessorComCurso | null> {
    const { data, error } = await supabase
        .from('professores')
        .select(`*, cursos(nome)`)
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Erro ao buscar professor com id ${id}:`, error);
        throw error;
    }

    return data;
}