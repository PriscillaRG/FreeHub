# FreeHub

## Description

**FreeHub** est une plateforme web fullstack gratuite, conçue pour les freelances créatifs.
Elle centralise la gestion de l'activité freelance : clients, projets, prestations, factures, messagerie et dashboard financier.

Projet réalisé dans le cadre du titre professionnel **CDA RNCP37873** — DesCodeuses, Promo Danielle, Mai 2026.

---

## Fonctionnalités principales

- **Authentification JWT** — inscription, connexion, rôles `USER` et `ADMIN`, token 24h signé HMAC-SHA256
- **Gestion des clients** — CRUD complet, avatar initiales, historique des projets par client
- **Gestion des projets** — statuts (EN_COURS, TERMINE, EN_ATTENTE, ANNULE), prestations et tâches associées
- **Gestion des prestations** — 5 statuts (EN_ATTENTE, CONFIRME, EN_COURS, TERMINE, ANNULE), prix, description
- **Gestion des factures** — 5 statuts (brouillon, envoyée, payée, en retard, annulée), liées à un client et un projet
- **Messagerie interne** — adresse @FreeHub.com, formulaire de composition
- **Dashboard** — CA total, montant à recevoir, graphique d'activité (Chart.js), raccourcis rapides
- **Interface ADMIN** — gestion des utilisateurs (visualisation, rôles)
- **Paramètres** — profil utilisateur, changement de mot de passe
- **Isolation des données** — chaque utilisateur ne voit que ses propres données (`findByOwnerUsername`)

---

## Stack technique

### Frontend
- Angular 20 (standalone components, AuthGuard, JwtInterceptor, RxJS)
- TypeScript, HTML, CSS (Poppins, variables CSS, design system cohérent)
- Hébergé sur **Netlify** — [https://spontaneous-ganache-966b5a.netlify.app](https://spontaneous-ganache-966b5a.netlify.app)

### Backend
- Spring Boot 3.5 — API REST, Spring Security 6, JWT (HMAC-SHA256)
- Spring Data JPA + Hibernate (ddl-auto=update)
- Architecture multicouche : Controller → Service → Repository
- Hébergé sur **Render**

### Base de données
- PostgreSQL 15+ (local) / Render Cloud (production)

### CI/CD & Déploiement
- **GitLab CI** — 4 stages : build, test, quality (SonarQube), e2e (Selenium)
- **Docker** — multi-stage build (node:20-alpine + nginx:alpine pour le frontend)
- **docker-compose** — orchestration backend + PostgreSQL en local

---

## Installation & Lancement

### Prérequis

- JDK 17+ et Maven
- Node.js 20+ et Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL 15+ installé localement

### Lancer en local (sans Docker)

#### 1. Démarrer PostgreSQL

```sql
CREATE DATABASE todoapp;
```

Vérifier `application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todoapp
spring.datasource.username=postgres
spring.datasource.password=Floup973
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

#### 2. Lancer le backend

```bash
cd todo
mvn spring-boot:run
```

Le backend sera disponible sur [http://localhost:8080](http://localhost:8080)

#### 3. Lancer le frontend

```bash
cd todo-frontend
npm install
ng serve -o
```

Le frontend sera disponible sur [http://localhost:4200](http://localhost:4200)

### Lancer avec Docker

```bash
docker-compose up --build
```

---

## Structure du projet

```
TP-Todo-List-main/
├── todo/                  # Backend Spring Boot (API REST + Security + JPA)
│   └── src/main/java/com/example/todo/
│       ├── config/        # SecurityConfig, JwtUtil
│       ├── filter/        # JwtFilter
│       ├── controller/    # AuthController, ClientController, ProjetController...
│       ├── service/       # ClientService, ProjetService...
│       ├── repository/    # ClientRepository, ProjetRepository...
│       └── model/         # User, Client, Projet, Prestation, Task, Facture
├── todo-frontend/         # Frontend Angular 20
│   └── src/app/
│       ├── guards/        # AuthGuard
│       ├── interceptors/  # JwtInterceptor
│       ├── services/      # AuthService, ClientService, ProjetService...
│       └── components/    # home, login, dashboard, clients, projets, factures...
├── docker-compose.yml
└── .gitlab-ci.yml
```

---

## Authentification & Sécurité

- Token JWT signé **HMAC-SHA256**, validité **24h**, stocké en `localStorage`
- Mots de passe hashés avec **BCrypt** (coût 10), jamais stockés en clair
- **JwtFilter** Spring intercepte chaque requête et valide le token
- **JwtInterceptor** Angular injecte le token dans chaque requête HTTP
- **AuthGuard** Angular protège toutes les routes internes
- Protection **XSS** : Angular échappe automatiquement les valeurs affichées
- Protection **SQL Injection** : JPA avec requêtes paramétrées exclusivement
- **CORS** configuré via bean `CorsConfigurationSource` pour Netlify → Render
- Isolation des données : `findByOwnerUsername()` sur chaque repository

---

## Modèle de données

```
User (id, username, email, password, role: USER|ADMIN)
  └── Client (id, nom, email, tel, adresse, user)
        └── Projet (id, titre, description, statut, dateDebut, dateFin, client)
              ├── Prestation (id, titre, description, prix, statut, projet)
              └── Task (id, titre, done, projet)

Facture (id, montant, statut, dateEmission, dateEcheance, client, projet)
```

---

## Perspectives v2

- Refresh tokens JWT (sessions plus sécurisées)
- Génération PDF automatique des factures
- Notifications temps réel (WebSocket)
- Export CSV des données
- Application mobile native
- Intégration bancaire (suivi des paiements)
