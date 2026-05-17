import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

// intercepteur HTTP -- ajoute automatiquement le token JWT dans chaque requete
// comme ca on a pas besoin de le faire a la main dans chaque service
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (token) {
      // on clone la requete et on ajoute le header Authorization
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    // passe la requete (modifiee ou non) au suivant dans la chaine
    return next.handle(req);
  }
}

