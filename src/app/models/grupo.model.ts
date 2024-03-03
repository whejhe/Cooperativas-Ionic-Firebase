export interface Grupo {
  id: string;
  name: string;
  image: string;
  description: string;
  members: string[];
  sector: string;
  role: 'admin' | 'usuario';
  createdAt: Date;
}
