package tic.alma.formationms.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Formation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String content;
    private String meetingLink;
    private String videoLink;
    private String duration;
    private LocalDate date;
    private Double prix;

    @OneToMany(mappedBy = "formation", cascade = CascadeType.ALL)
    private List<Resource> resources;

    @OneToOne(mappedBy = "formation", cascade = CascadeType.ALL)
    private ImageFormation formationImage;

    // Keycloak ID of the formateur (user with 'formateur' role)
    private String keycloakFormateurId;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getPrix() {
        return prix;
    }

    public void setPrix(Double prix) {
        this.prix = prix;
    }

    public ImageFormation getFormationImage() {
        return formationImage;
    }

    public void setFormationImage(ImageFormation formationImage) {
        this.formationImage = formationImage;
    }

    public String getKeycloakFormateurId() {
        return keycloakFormateurId;
    }

    public void setKeycloakFormateurId(String keycloakFormateurId) {
        this.keycloakFormateurId = keycloakFormateurId;
    }


}
