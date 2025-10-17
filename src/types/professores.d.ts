export interface Professor {
  id: number;
  name: string;
  curso?: string;
  image_url: string;
  video_urls?: string[];
  curso_id: number | null;
}

export type ProfessorComCurso = Professor & {
  cursos: {
    nome: string;
  } | null;
};