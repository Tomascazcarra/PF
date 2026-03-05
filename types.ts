
export interface Project {
  id: string;
  code: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  color: string;
  texture?: 'smooth' | 'rough' | 'recycled';
  imageUrl: string;
  stats: number[]; 
  aspectRatio: number; // width / height ratio
}

export interface FolderProps {
  project: Project;
  isActive: boolean;
  index: number;
  total: number;
  onClick: (id: string) => void;
  scatter: {
    x: string | number;
    y: string | number;
    rotation: number;
  };
}

export enum ViewMode {
  STACK = 'STACK',
  GRID = 'GRID'
}
