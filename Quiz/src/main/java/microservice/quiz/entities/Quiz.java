package microservice.quiz.entities;


import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Quiz  implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String title;
    String description;
    Long formationId;
    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true,fetch = FetchType.EAGER)
    List<Question> questions = new ArrayList<>();

}
