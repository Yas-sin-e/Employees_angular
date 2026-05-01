import { Employees } from './employees.model';

export class Image {
  idImage!: number;
  name!: string;
  type!: string;
  image!: string;
  employe?: Employees;  // ← AJOUTER pour @ManyToOne
}
