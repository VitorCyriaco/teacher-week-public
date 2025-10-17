export interface FormData {
    nome: string;
    curso: string;
    periodo: string;
}

export type HomenagemInsert = {
  student_name: string;
  student_course: string;
  student_period: string;
  professor_id: number;
  category_id: number;
  message: string;
};