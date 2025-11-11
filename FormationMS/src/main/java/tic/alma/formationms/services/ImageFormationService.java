package tic.alma.formationms.services;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.ImageFormation;

import java.io.IOException;

public interface ImageFormationService {

    ResponseEntity<String> uploadImage(MultipartFile file, Long idFormation) throws IOException;

    ResponseEntity<ImageFormation> getImageByFormationId(Long idFormation);

    ResponseEntity<String> updateImage(MultipartFile file, Long idFormation) throws IOException;

    ResponseEntity<String> deleteImage(Long idFormation);
}


