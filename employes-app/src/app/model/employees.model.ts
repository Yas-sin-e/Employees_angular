import { Categorie } from "./categorie.model";

export class Employees {
idEmploye? : number;
nomEmploye? : string;
prenomEmploye? : string;
posteEmploye? : string;
dateEmbauche? : Date;
salaire? : number;
email? : string;
telephone? : string;
adresse? : string;
categorie!: Categorie
showDetails: any;
}
