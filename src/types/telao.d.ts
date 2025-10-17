import { IconType } from 'react-icons';

export interface CategoryRankingFromDB {
  categoryTitle: string;
  Icon: string;
  ranking: RankedProfessor[] | null;
}

export interface RankedProfessor {
  id: number
  name: string;
  imageUrl: string;
  votes: number;
}

export interface CategoryRanking {
  categoryTitle: string;
  icone_nome: IconType;
  ranking: RankedProfessor[];
}

export interface LiveMessage {
  id: number;
  studentName: string;
  professorName: string;
  message: string;
}

export interface HomenagemComProfessor {
  id: number;
  student_name: string;
  message: string;
  professores: {
    name: string;
  } | null;
}

export interface StyledLiveMessage extends LiveMessage {
  top: string;
  left: string;
  rotation: string;
  color: string;
}