import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// service pour les taches (todo list)
// note: le token est aussi gere par le jwt interceptor, mais on le met
// aussi dans les headers ici par securite (double protection)
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl = 'https://freehub-r2aw.onrender.com/api/tasks';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // construit les headers avec le token JWT
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // recup toutes les taches de l'utilisateur connecte
  getTasks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // cree une nouvelle tache
  createTask(task: any): Observable<any> {
    return this.http.post(this.apiUrl, task, { headers: this.getAuthHeaders() });
  }

  // modifie une tache existante
  updateTask(id: number, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, task, { headers: this.getAuthHeaders() });
  }

  // coche une tache comme terminee
  completeTask(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/complete`, {}, { headers: this.getAuthHeaders() });
  }

  // supprime une tache
  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // assigne un utilisateur a une tache
  assignUser(taskId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${taskId}/assign`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }

  // retire un utilisateur d'une tache
  removeUser(taskId: number, username: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/${taskId}/remove`,
      { username },
      { headers: this.getAuthHeaders() }
    );
  }
}
