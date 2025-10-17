import { supabase } from "@/lib/supabase";
import { HomenagemInsert } from "@/types/formulario";

export async function submitHomenagem(homenagemData: HomenagemInsert) {
    
    const { data, error } = await supabase
        .from('homenagens')
        .insert([homenagemData])
        .select()
        .single();

    if (error) {
        console.error("Erro ao inserir homenagem:", error.message);
        throw new Error("Não foi possível enviar a homenagem.");
    }

    return data;
}