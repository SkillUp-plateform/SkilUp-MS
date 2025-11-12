# 🎓 Formation Microservice – SkillUp Platform

## 📘 Description

Le **Formation Microservice** fait partie de la plateforme **SkillUp**, une application de formation en ligne développée avec une architecture **microservices**.  
Ce service est responsable de la **gestion des formations**, incluant leur création, leur mise à jour et leur consultation par différents rôles utilisateurs.

### Fonctionnalités principales :
- Création et modification des formations
- Association de formateurs et d’apprenants à une formation  
- Consultation de la liste et des détails d’une formation 


---

## ⚙️ Technologies Utilisées

- **Java 17**  
- **Spring Boot**  
- **Spring Data JPA**  
- **Spring Cloud Config**  
- **Spring Cloud Netflix Eureka**  
- **Keycloak**  
- **MySQL**  
- **Maven**

---

## 🧱 Architecture

Le microservice **Formation** s’enregistre dans **Eureka Server** et récupère sa configuration depuis le **Config Server**.  
Il est exposé via l’**API Gateway** et communique avec d’autres microservices comme celui des **Projets** et des **Utilisateurs**.

### Diagramme simplifié :
```
[Client/Frontend]
        |
    [Gateway]
        |
  [Formation Microservice]
        |
     [MySQL Database]
```

---

## 🚀 Installation et Exécution

### 1️⃣ Prérequis
- Java 17  
- Maven  
- MySQL  
- Eureka Server et Config Server actifs

### 2️⃣ Cloner le dépôt
```bash
git clone https://github.com/faroukabdelkebir/SkillUp-platform.git
cd SkillUp-platform/FormationMS
```

### 3️⃣ Configurer la base de données
Dans `application.yml` :
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/formationdb
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
👉 Accessible sur `http://localhost:8082` (ou selon la configuration)

---

## 🔗 Endpoints REST (Exemples)

| Méthode | Endpoint | Rôle / Accès | Description |
|----------|-----------|--------------|-------------|
| `GET` | `/api/formations` | Tous | Lister toutes les formations |
| `GET` | `/api/formations/{id}` | Tous | Consulter les détails d’une formation |
| `POST` | `/api/formations`| Créer une nouvelle formation |
| `PUT` | `/api/formations/{id}`| Modifier une formation existante |
| `DELETE` | `/api/formations/{id}` | Supprimer une formation |
| `POST` | `/api/formations/{id}/inscription`| S’inscrire à une formation |

---

## 🧪 Exemple de Requête POST (Création d’une formation)

```json
POST /api/formations
{
  "titre": "Développement Spring Boot & Angular",
  "description": "Formation complète pour apprendre à développer des applications web modernes.",
  "dateDebut": "2025-02-01",
  "dateFin": "2025-03-01",
  "status": "A venir"
}
```

---

## 👥 Rôles et Permissions

| Rôle | Actions autorisées |
|------|--------------------|
| **Admin** | Créer, modifier, supprimer et consulter les formations |
| **Formateur** | Consulter les formations et les apprenants associés |
| **User** | Consulter les formations et s’y inscrire |

---


