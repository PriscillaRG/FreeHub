import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './bottom-nav.html',
  styleUrls: ['./bottom-nav.css']
})
export class BottomNavComponent implements OnInit, OnDestroy {

  hidden = false;
  showMore = false;
  private lastScroll = 0;
  private routeSub!: Subscription;
  currentRoute = '';

  navItems = [
    { label: 'Accueil',    icon: 'icons/dashboard.png',  route: '/dashboard' },
    { label: 'Clients',    icon: 'icons/clients.png',    route: '/clients' },
    { label: 'Projets',    icon: 'icons/projets.png',    route: '/projets' },
    { label: 'Messages',   icon: 'icons/messagerie.png', route: '/messagerie' },
    { label: 'Factures',   icon: 'icons/factures.png',   route: '/factures' }];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.routeSub = this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.currentRoute = e.urlAfterRedirects;
        this.showMore = false; // ferme le panel au changement de route
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) this.routeSub.unsubscribe();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    const current = window.scrollY;
    if (current > this.lastScroll + 10) {
      this.hidden = true;
      this.showMore = false;
    } else if (current < this.lastScroll - 10) {
      this.hidden = false;
    }
    this.lastScroll = current;
  }

  isActive(route: string): boolean {
    return this.currentRoute === route || this.currentRoute.startsWith(route);
  }

  toggleMore(): void {
    this.showMore = !this.showMore;
  }

  goTo(route: string): void {
    this.showMore = false;
    this.router.navigate([route]);
  }

  logout(): void {
    this.showMore = false;
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
