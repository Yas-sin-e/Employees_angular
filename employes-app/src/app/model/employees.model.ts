import { Grade } from "./Grade.model";
import { Image } from "./image.model";

export class Employees {
  idEmploye?: number;
  nomEmploye?: string;
  prenomEmploye?: string;
  posteEmploye?: string;
  dateEmbauche?: Date;
  salaire?: number;
  email?: string;
  telephone?: string;
  adresse?: string;
  grade!: Grade;
  showDetails!: boolean;
  image?: Image;
  imageStr?: string;
  images?: Image[];
  imagePath?: string;
}
