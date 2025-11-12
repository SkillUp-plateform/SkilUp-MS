# 🧠 SkillUp – Plateforme de Formation en Ligne (Microservices)

## 📘 Description du Projet

**SkillUp** est une application web de formation en ligne conçue pour optimiser la gestion et l’organisation interne des centres de formation.  
Elle facilite la **planification des activités**, le **suivi des apprenants** et la **gestion des processus administratifs**, tout en offrant une architecture moderne basée sur les **microservices**.

L’objectif principal du projet est de **moderniser et automatiser** les pratiques de gestion afin d’améliorer l’efficacité opérationnelle et la qualité du suivi pédagogique.

---

## 🏗️ Architecture du Projet

Le projet est développé selon une **architecture microservices** afin de garantir la modularité, la scalabilité et la facilité de maintenance.  
Chaque module est déployé indépendamment et communique à travers un **API Gateway**.

### 🧩 Microservices

| Microservice | Rôle | Détails |
|---------------|------|---------|
| **ConfigServer** | Gestion centralisée des configurations | Fournit les configurations à tous les microservices |
| **EurekaServer** | Service de découverte | Permet l’enregistrement et la découverte dynamique des microservices |
| **Gateway** | API Gateway | Point d’entrée unique du système, gère le routage et la sécurité |
| **FormationMS** | Service de formation | Gère la création, la consultation et la mise à jour des formations |
| **Projet** | Service de projets | Gère des projets pédagogiques et professionnels |
| **Quiz** | Service de quiz | Gère les évaluations et les tests pour les apprenants |
| **accesscode** | Service de codes d’accès | Gère la génération et la validation des codes d’accès aux formations |
| **feedback-service** | Service de feedback | Permet de collecter et gérer les retours des apprenants |
| **gestion-user** | Service de gestion des utilisateurs | Authentification, rôles, gestion des comptes utilisateurs |
| **reclamation** | Service de réclamations | Permet la gestion et le suivi des réclamations des utilisateurs |
| **recrutement** | Service de recrutement | Gère les offres, candidatures et processus de recrutement |
| **SkillUp-Front-main** | Frontend Angular | Interface utilisateur principale de l’application |

---

## ⚙️ Technologies Utilisées

### 🖥️ Back-end
- **Java 17**
- **Python**
- **Spring Boot / Spring Cloud**
- **Spring Data JPA**
- **Keycloak** (authentification et autorisation)
- **Eureka Discovery Server**
- **Spring Cloud Config**
- **API Gateway**

### 💾 Base de Données
- **MySQL**
- **H2**
- **PostgreSQL** (gestion user)
  

### 🌐 Front-end
- **Angular**
- **Bootstrap**

### 🐳 DevOps
- **Docker** et **Docker Compose** pour la conteneurisation
- **Maven** pour la gestion des dépendances et builds

---

## 🚀 Installation et Exécution

1. **Cloner le projet :**
   ```bash
   git clone https://github.com/faroukabdelkebir/SkillUp-platform.git
   cd SkillUp-platform
   ```

2. **Lancer les services de base :**
   - Config Server  
   - Eureka Server  
   - API Gateway  

3. **Démarrer les microservices :**
   Chaque microservice peut être lancé individuellement :
   ```bash
   mvn spring-boot:run
   ```

4. **Lancer le front-end Angular :**
   ```bash
   cd SkillUp-Front-main
   npm install
   ng serve
   ```

5. **Accéder à l’application :**
   👉 [http://localhost:4200](http://localhost:4200)


## 🎯 Objectifs du Projet

- Digitaliser la gestion des centres de formation.  
- Faciliter le suivi des formateurs et des apprenants.  
- Améliorer la coordination entre les services internes.  
- Fournir une plateforme moderne, modulaire et évolutive.
