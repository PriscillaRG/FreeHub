import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// interface pour un projet
export interface Projet {
  id?: number;
  titre: string;
  description?: string;
  status?: string;       // EN_COURS, TERMINE, EN_ATTENTE, ANNULE
  dateDebut?: string;
  dateFin?: string;
  domaine?: string;      // ex: Web, Graphisme, Photo...
  domaineCustom?: string; // si domaine = "Autre", on stocke ici la valeur perso
  client?: { id: number; name: string };
}

// interface pour une tache (todo list liee a un projet)
export interface Task {
  id?: number;
  title: string;
  completed?: boolean;
}

// service pour les projets et les taches
@Injectable({ providedIn: 'root' })
export class ProjetService {

  private baseUrl = 'https://freehub-r2aw.onrender.com/api/projets';
  private taskUrl = 'https://freehub-r2aw.onrender.com/api/tasks';

  constructor(private http: HttpClient) {}

  // recup tous les projets de l'utilisateur connecte
  getProjets(): Observable<Projet[]> {
    return this.http.get<Projet[]>(this.baseUrl);
  }

  // recup les projets d'un client specifique
  getProjetsByClient(clientId: number): Observable<Projet[]> {
    return this.http.get<Projet[]>(`${this.baseUrl}/client/${clientId}`);
  }

  // cree un nouveau projet (avec ou sans client associe)
  addProjet(projet: Projet, clientId?: number): Observable<Projet> {
    const params = clientId ? `?clientId=${clientId}` : '';
    return this.http.post<Projet>(`${this.baseUrl}${params}`, projet);
  }

  // modifie un projet existant
  updateProjet(id: number, projet: Projet): Observable<Projet> {
    return this.http.put<Projet>(`${this.baseUrl}/${id}`, projet);
  }

  // met a jour uniquement le statut (PATCH = modif partielle)
  updateStatus(id: number, status: string): Observable<Projet> {
    return this.http.patch<Projet>(`${this.baseUrl}/${id}/status`, { status });
  }

  // supprime un projet
  deleteProjet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // --- taches liees a un projet ---

  getTasksByProjet(projetId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.taskUrl}?projetId=${projetId}`);
  }

  addTask(task: Task, projetId: number): Observable<Task> {
    return this.http.post<Task>(`${this.taskUrl}?projetId=${projetId}`, task);
  }

  // coche ou decoche une tache
  toggleTask(id: number, done: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.taskUrl}/${id}`, { completed: done });
  }
}
