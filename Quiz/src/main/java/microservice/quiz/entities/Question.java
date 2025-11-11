package microservice.quiz.entities;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Question implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String questionText;
    String optionA;
    String optionB;
    String optionC;
    String optionD;

    String correctAnswer; // ex: "A", "B", "C", "D"

    @ManyToOne
    @JoinColumn(name = "quiz_id")
    @JsonIgnore
    Quiz quiz;



}
