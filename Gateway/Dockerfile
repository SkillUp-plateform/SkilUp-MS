FROM openjdk:17
EXPOSE 9095
ADD target/Gateway-0.0.1-SNAPSHOT.jar gateway.jar
ENTRYPOINT ["java","-jar","gateway.jar"]