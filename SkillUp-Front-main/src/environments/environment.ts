// Development environment configuration
export const environment = {
  production: false,
  
  // API Gateway URL - All microservices are accessed through this gateway
  apiGateway: 'http://localhost:9095',
  
  // Microservice routes through Gateway
  feedbackService: 'http://localhost:9095/feedbackMS',
  formationService: 'http://localhost:9095/FormationMS',
  recrutementService: 'http://localhost:9095/recrutementMS',
  reclamationService: 'http://localhost:9095/reclamationMS',
  userManagementService: 'http://localhost:9095/user-management',
  quizService: 'http://localhost:9095/Quiz',
  projetService: 'http://localhost:9095/projetMS',
  accessCodeService: 'http://localhost:9095/accesscodeMS',
  
  // Direct service URLs (for development/debugging only - not recommended for production)
  directUrls: {
    feedback: 'http://localhost:9094/feedback',
    formation: 'http://localhost:9094/formation',
    recrutement: 'http://localhost:9095/candidatures',
    reclamation: 'http://localhost:8080/api/reclamations',
    userManagement: 'http://localhost:8089/api/admin/keycloak'
  }
};
