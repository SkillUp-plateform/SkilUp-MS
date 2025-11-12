# 🧩 Projet Microservice – SkillUp Platform

## 📘 Description

Le **Projet Microservice** fait partie de la plateforme **SkillUp**, une application de formation en ligne développée avec une architecture **microservices**.  
Ce service est responsable de la **gestion des projets pédagogiques et professionnels** au sein de la plateforme.

Les projets sont créés et gérés uniquement par l’administrateur, tandis que les formateurs et les utilisateurs peuvent les consulter et en suivre les détails.
Fonctionnalités principales :
-Création, modification et suppression de projets (réservé à l’admin)
-Consultation des projets par les formateurs et les utilisateurs
-Gestion des informations de base (titre, description, )

---

## ⚙️ Technologies Utilisées

- **Java 17**  
- **Spring Boot**  
- **Spring Data JPA**  
- **Spring Cloud Netflix Eureka** (pour la découverte de services)  
- **Spring Cloud Config** (pour la configuration centralisée)  
- **Keycloak** (pour la gestion des rôles et de la sécurité)  
- **MySQL** (base de données)  
- **Maven** (gestionnaire de dépendances)

---

## 🧱 Architecture

Le microservice **Projet** est entièrement indépendant.  
Il s’enregistre dans **Eureka Server** et récupère ses configurations depuis le **Config Server**.

### Diagramme simplifié :
```
[Client/Frontend]
        |
    [Gateway]
        |
  [Projet Microservice]
        |
     [Database]
```

---

## 🚀 Installation et Exécution

### 1️⃣ Prérequis
- Java 17  
- Maven  
- MySQL  
- Eureka Server et Config Server en cours d’exécution

### 2️⃣ Cloner le dépôt
```bash
git clone https://github.com/faroukabdelkebir/SkillUp-platform.git
cd SkillUp-platform/Projet
```

### 3️⃣ Configurer la base de données
Modifier le fichier `application.yml` :
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/projetdb
    username: root
    password: root
  jpa:
    hibernate:
      ddl-auto: update
```

### 4️⃣ Lancer le microservice
```bash
mvn spring-boot:run
```

### 5️⃣ Vérifier le service
Le microservice sera disponible sur :  
👉 `http://localhost:8083` (ou le port défini dans le `application.yml`)

---

## 🔗 Endpoints REST (Exemples)

| Méthode | Endpoint | Description |
|----------|-----------|-------------|
| `GET` | `/api/projets` | Récupérer la liste des projets |
| `GET` | `/api/projets/{id}` | Consulter un projet par ID |
| `POST` | `/api/projets` | Créer un nouveau projet |
| `PUT` | `/api/projets/{id}` | Mettre à jour un projet existant |
| `DELETE` | `/api/projets/{id}` | Supprimer un projet |

---

## 🧪 Exemple de Requête POST

```json
POST /api/projets
{
  "title": "Application e-learning",
  "description": "Développement d’une application web éducative",
  
}


## 🧑‍💻 Mayssa Ammari


