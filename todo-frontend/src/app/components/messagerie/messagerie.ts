import { Component, OnInit } from '@angular/core';
import { SidebarToggleComponent } from '../sidebar-toggle/sidebar-toggle';
import { BottomNavComponent } from '../bottom-nav/bottom-nav';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

interface Mail {
  id: number;
  from?: string;
  to?: string;
  subject: string;
  body: string;
  date: string;
  read?: boolean;
}

@Component({
  selector: 'app-messagerie',
  standalone: true,
  imports: [ CommonModule, BottomNavComponent, SidebarToggleComponent, FormsModule, RouterModule],
  templateUrl: './messagerie.html',
  styleUrls: ['./messagerie.css']
})
export class MessagerieComponent implements OnInit {

  username: string = '';
  sidebarOpen = true;

  role: string = '';
  mailAddress: string = '';
  showCompose = false;
  activeTab: 'recus' | 'envoyes' = 'recus';

  newMail = { to: '', subject: '', body: '' };

  // liste des messages (mock pour la demo — a connecter au backend)
  inbox: Mail[] = [];
  sent: Mail[] = [];

  private jwtHelper = new JwtHelperService();
  private nextId = 1;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    if (token) {
      const decoded = this.jwtHelper.decodeToken(token);
      this.username = decoded?.sub || decoded?.username || 'utilisateur';
      this.role = decoded?.role || 'USER';
      this.mailAddress = `${this.username}@FreeHub.com`;
    }
    // charge les messages sauvegardes localement (persistance demo)
    const savedInbox = localStorage.getItem('fh_inbox');
    const savedSent = localStorage.getItem('fh_sent');
    if (savedInbox) this.inbox = JSON.parse(savedInbox);
    if (savedSent) this.sent = JSON.parse(savedSent);
  }

  send() {
    if (!this.newMail.to || !this.newMail.subject) return;
    const mail: Mail = {
      id: this.nextId++,
      to: this.newMail.to,
      subject: this.newMail.subject,
      body: this.newMail.body,
      from: this.mailAddress,
      date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
    };
    this.sent.push(mail);
    localStorage.setItem('fh_sent', JSON.stringify(this.sent));
    this.newMail = { to: '', subject: '', body: '' };
    this.showCompose = false;
    this.activeTab = 'envoyes';
  }

  markRead(mail: Mail) {
    mail.read = true;
    localStorage.setItem('fh_inbox', JSON.stringify(this.inbox));
  }

  deleteMail(list: Mail[], id: number, key: string) {
    const idx = list.findIndex(m => m.id === id);
    if (idx !== -1) list.splice(idx, 1);
    localStorage.setItem(key, JSON.stringify(list));
  }

  unreadCount(): number {
    return this.inbox.filter(m => !m.read).length;
  }

  get initials(): string {
    return this.username ? this.username.slice(0, 2).toUpperCase() : 'FH';
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
