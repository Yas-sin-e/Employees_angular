import { Injectable } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Grade } from '../model/Grade.model';
import { Image } from '../model/image.model'; // ← AJOUTER
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Auth } from './auth';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class EmpServices {

  apiURL: string = 'http://localhost:8081/Employees/api/employes';
  imageURL: string = 'http://localhost:8081/Employees/api/image'; // ← AJOUTER

  constructor(private http: HttpClient, private authService: Auth) { }

  // ─── EMPLOYÉS ────────────────────────────────────────────
  listerEmp(): Observable<Employees[]> {
    return this.http.get<Employees[]>(this.apiURL + '/all');
  }

  consulterEmployee(id: number): Observable<Employees> {
    return this.http.get<Employees>(this.apiURL + '/getbyid/' + id);
  }

  ajouterEmp(emp: Employees): Observable<Employees> {
    return this.http.post<Employees>(this.apiURL + '/addemp', emp);
  }

  updateEmp(emp: Employees): Observable<Employees> {
    return this.http.put<Employees>(this.apiURL + '/updateemp', emp);
  }

  supprimerEmp(id: number): Observable<void> {
    return this.http.delete<void>(this.apiURL + '/delemp/' + id);
  }

  rechercherParGrade(idGra: number): Observable<Employees[]> {
    return this.http.get<Employees[]>(this.apiURL + '/EmployeeGrade/' + idGra);
  }

  // ─── GRADES ──────────────────────────────────────────────
  listegrades(): Observable<Grade[]> {
    return this.http.get<Grade[]>(`${environment.apiGradeURL}`);
  }

  ajouterGrade(gra: Grade): Observable<Grade> {
    return this.http.post<Grade>(`${environment.apiGradeURL}`, gra, httpOptions);
  }

  updateGrade(gra: Grade): Observable<Grade> {
    return this.http.put<Grade>(`${environment.apiGradeURL}/${gra.idGraEmp}`, gra, httpOptions);
  }

  supprimerGrade(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiGradeURL}/${id}`);
  }

  getGradeById(id: number): Observable<Grade> {
    return this.http.get<Grade>(`${environment.apiGradeURL}/${id}`);
  }

  // ─── IMAGES ──────────────────────────────────────────────

  // Upload image (stockage en BD)
  uploadImage(file: File, filename: string): Observable<Image> {
    const formData = new FormData();
    formData.append('image', file, filename);
    return this.http.post<Image>(`${this.imageURL}/upload`, formData);
  }

  // Charger les détails d'une image (base64)
  loadImage(id: number): Observable<Image> {
    return this.http.get<Image>(`${this.imageURL}/get/info/${id}`);
  }

  // Supprimer une image
  supprimerImage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.imageURL}/delete/${id}`);
  }
  uploadImageProd(file: File, filename: string, idEmp: number): Observable<Image> {
    const formData = new FormData();
    formData.append('image', file, filename);
    return this.http.post<Image>(`${this.imageURL}/uploadImageEmp/${idEmp}`, formData);
  }
  uploadImageFS(file: File, filename: string, idEmp: number): Observable<any> {
    const formData = new FormData();
    formData.append('image', file, filename);
    return this.http.post(`${this.imageURL}/uploadFS/${idEmp}`, formData);
  }

  // Charger image depuis FileSystem
  getImageFS(id: number): Observable<Blob> {
    return this.http.get(`${this.imageURL}/loadfromFS/${id}`, { responseType: 'blob' });
  }

  // ← Plusieurs images par employé
  getImagesByEmp(idEmp: number): Observable<Image[]> {
    return this.http.get<Image[]>(`${this.imageURL}/getImagesByEmp/${idEmp}`);
  }
}
