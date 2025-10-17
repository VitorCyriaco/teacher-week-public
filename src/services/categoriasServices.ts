import { supabase } from "@/lib/supabase";
import { Categoria } from "@/types/categorias";

export async function fetchAllCategorias(): Promise<Categoria[]> {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('titulo', { ascending: true });

    if (error) {
        console.error("Erro ao buscar categorias:", error);
        throw new Error("Não foi possível buscar as categorias.");
    }
    
    return data || [];
}

export async function fetchCategoriaPorTitulo(titulo: string): Promise<Categoria | null> {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .eq('titulo', titulo)
        .single();

    if (error) {
        console.error(`Erro ao buscar categoria com título ${titulo}:`, error);
        throw error;
    }

    return data;
}