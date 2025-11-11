// Production environment configuration
export const environment = {
  production: true,
  
  // API Gateway URL - All microservices are accessed through this gateway
  apiGateway: 'http://your-production-gateway:9095',
  
  // Microservice routes through Gateway
  feedbackService: 'http://your-production-gateway:9095/feedbackMS',
  formationService: 'http://your-production-gateway:9095/FormationMS',
  recrutementService: 'http://your-production-gateway:9095/recrutementMS',
  reclamationService: 'http://your-production-gateway:9095/reclamationMS',
  userManagementService: 'http://your-production-gateway:9095/user-management',
  quizService: 'http://your-production-gateway:9095/Quiz',
  projetService: 'http://your-production-gateway:9095/projetMS',
  accessCodeService: 'http://your-production-gateway:9095/accesscodeMS',
  
  // Direct service URLs should not be used in production
  directUrls: {
    feedback: '',
    formation: '',
    recrutement: '',
    reclamation: '',
    userManagement: ''
  }
};
