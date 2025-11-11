package tic.alma.formationms.services;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import tic.alma.formationms.entities.Formation;
import tic.alma.formationms.entities.ImageFormation;
import tic.alma.formationms.repositories.FormationRepository;
import tic.alma.formationms.repositories.ImageFormationRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Optional;
import java.util.zip.DataFormatException;
import java.util.zip.Deflater;
import java.util.zip.Inflater;

@Service
public class ImageFormationServiceImpl implements ImageFormationService{
    @Autowired
    FormationRepository formationRepository;
    @Autowired
    ImageFormationRepository imageFormationRepository;

    @Override
    public ResponseEntity<String> uploadImage(MultipartFile file, Long idFormation) throws IOException {
        Optional<Formation> formation=formationRepository.findById(idFormation);
        if(formation.isPresent()){
            if(formation.get().getFormationImage()!=null){
                return ResponseEntity.badRequest().body("user has already image ");
            }
            ImageFormation image =new ImageFormation();
            image.setName(file.getOriginalFilename());
            image.setPicByte(compressBytes(file.getBytes()));
            image.setFormation(formation.get());
            imageFormationRepository.save(image);
            return ResponseEntity.ok("Image ("+image.getName()+" ) added user : "+image.getFormation().getTitle());
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<ImageFormation> getImageByFormationId(Long idFormation) {
        Optional<ImageFormation> image = imageFormationRepository.findByFormationId(idFormation);
        if(image.isPresent()){
            ImageFormation img=image.get();
            img.setPicByte(decompressBytes(img.getPicByte()));
            return ResponseEntity.ok(img);
        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<String> updateImage(MultipartFile file, Long idFormation) throws IOException {
        Optional<Formation> formation=formationRepository.findById(idFormation);
        if (formation.isPresent()){
            if (formation.get().getFormationImage()==null){
                return ResponseEntity.badRequest().body("user hasn't image ");
            }
            Formation formation1=formation.get();
            ImageFormation image = formation1.getFormationImage();
            image.setName(file.getOriginalFilename());
            image.setPicByte(compressBytes(file.getBytes()));
            imageFormationRepository.save(image);
            return ResponseEntity.ok("image updated");

        }else {
            return ResponseEntity.notFound().build();
        }
    }

    @Override
    public ResponseEntity<String> deleteImage(Long idFormation) {
        Optional<Formation> formation=formationRepository.findById(idFormation);
        if(formation.isPresent()){
            ImageFormation img=formation.get().getFormationImage();
            if(img!=null){
                imageFormationRepository.delete(img);
                return ResponseEntity.ok("image deleted !");
            }
        }
        return null;
    }

    public static byte[] compressBytes(byte[] data) {
        Deflater deflater = new Deflater();
        deflater.setInput(data);
        deflater.finish();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        while (!deflater.finished()) {
            int count = deflater.deflate(buffer);
            outputStream.write(buffer, 0, count);
        }
        try {
            outputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        System.out.println("Compressed Image Byte Size - " + outputStream.toByteArray().length);

        return outputStream.toByteArray();
    }

    public static byte[] decompressBytes(byte[] data) {
        Inflater inflater = new Inflater();
        inflater.setInput(data);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream(data.length);
        byte[] buffer = new byte[1024];
        try {
            while (!inflater.finished()) {
                int count = inflater.inflate(buffer);
                outputStream.write(buffer, 0, count);
            }
            outputStream.close();
        } catch (IOException | DataFormatException e) {
            e.printStackTrace();
        }
        return outputStream.toByteArray();
    }
}
