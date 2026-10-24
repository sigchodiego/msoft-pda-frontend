import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (typeof localStorage === 'undefined') {
      return next.handle(req);
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
      return next.handle(req);
    }

    return next.handle(
      req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    );
  }
}
