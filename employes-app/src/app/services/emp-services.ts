import { EnvironmentInjector, Injectable } from '@angular/core';
import { Employees } from '../model/employees.model';
import { Grade } from '../model/Grade.model';
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
  constructor(private http: HttpClient, private authService: Auth) { }
apiURL: string = 'http://localhost:8081/Employees/api/employes';
  // ---------------- EMPLOYES ----------------

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
    return this.http.put<Employees>(this.apiURL + "/updateemp", emp);
  }

  supprimerEmp(id: number): Observable<void> {
   return this.http.delete<void>(this.apiURL + "/delemp/" + id);

  }

  rechercherParGrade(idGra: number): Observable<Employees[]> {
    return this.http.get<Employees[]>(this.apiURL + "/EmployeeGrade/" + idGra);
  }

  // ----------------- GRADES -----------------

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
}
