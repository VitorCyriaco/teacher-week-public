export interface Homenagem {
  id: number;
  created_at: string;
  student_name: string;
  student_course: string;
  student_period: string;
  message: string;
  is_approved: boolean;
  professor_id: number;
  category_id: number;
}

export interface HomenagemComProfessor {
  id: number;
  student_name: string;
  message: string;
  professores: {
    name: string;
  } | null; 
}