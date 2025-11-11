FROM openjdk:17
EXPOSE 8082
ADD target/feedback-service-0.0.1-SNAPSHOT.jar feedback.jar
ENTRYPOINT ["java", "-jar", "feedback.jar"]
