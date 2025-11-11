package tic.alma.formationms.controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.ImageFormation;
import tic.alma.formationms.services.ImageFormationService;

import java.io.IOException;

@RestController
@RequestMapping("/imageFormation")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ImageFormationController {

    @Autowired
    ImageFormationService imageFormationService;

    @PostMapping("/upload/{idFormation}")
    public ResponseEntity<String> uploadImage(@RequestParam("imageFile") MultipartFile file, @PathVariable Long idFormation) throws IOException {
        return imageFormationService.uploadImage(file,idFormation);

    }

    @GetMapping("/get/{idFormation}")
    public ResponseEntity<ImageFormation> getImageByUseId(@PathVariable Long idFormation){
        return imageFormationService.getImageByFormationId(idFormation);
    }

    @PutMapping("/update/{idFormation}")
    public ResponseEntity<String> updateImage(@RequestParam("imageFile")MultipartFile file,@PathVariable Long idFormation) throws IOException {
        return imageFormationService.updateImage(file,idFormation);
    }

    @DeleteMapping("/delete/{idFormation}")
    public ResponseEntity<String> deleteImage(@PathVariable Long idFormation){
        return imageFormationService.deleteImage(idFormation);
    }
}
