FROM openjdk:17
EXPOSE 8888
ADD target/ConfigServer-0.0.1-SNAPSHOT.jar config.jar
ENTRYPOINT ["java","-jar","config.jar"]