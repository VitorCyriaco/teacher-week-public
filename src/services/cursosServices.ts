import { supabase } from "@/lib/supabase";
import { CourseOption } from "@/types/cursos";

export async function fetchCursos(): Promise<CourseOption[]> {
    const { data, error } = await supabase
        .from('cursos')
        .select('nome')
        .order('nome', { ascending: true });

    if (error) {
        console.error("Erro no service ao buscar cursos:", error);
        throw error;
    }

    if (!data) {
        return [];
    }

    const options: CourseOption[] = data.map(curso => ({
        value: curso.nome,
        label: curso.nome,
    }));

    return options;
}