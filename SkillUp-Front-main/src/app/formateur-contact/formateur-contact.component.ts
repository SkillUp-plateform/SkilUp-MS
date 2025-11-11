import { Component, OnInit } from '@angular/core';
import { Formateur } from '../models/formateur.model'
import { FormateurService } from '../formateur.service';
import { ImageFormateurService } from '../image-formateur.service';
import { KeycloakAdminService } from '../services/keycloak-admin.service';

@Component({
  selector: 'app-formateur-contact',
  templateUrl: './formateur-contact.component.html',
  styleUrls: ['./formateur-contact.component.css']
})
export class FormateurContactComponent implements OnInit {

  constructor(
    private formateurService: FormateurService,
    private imageFormateurService: ImageFormateurService,
    private keycloakAdminService: KeycloakAdminService
  ) {}
  isSidebarCollapsed = false;
  imageMap: Map<string | number, string> = new Map<string | number, string>();
  selectedFile: File | null = null;
  Formateurs:Formateur[]=[];
  selectedImage: string | null = null;
    loadImage(imageFile: File) {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        this.selectedImage = event.target.result;
      };
      reader.readAsDataURL(imageFile);
    }

    getImageUrl(image: any): string {
      return 'data:' + image.type + ';base64,' + image.picByte;
    }
  ngOnInit(): void {
    // Fetch formateurs from Keycloak first
    this.keycloakAdminService.listUsersByRole('formateur').subscribe(
      (keycloakUsers: any[]) => {
        console.log('Loaded formateurs from Keycloak:', keycloakUsers);
        // Map Keycloak users to Formateur model
        this.Formateurs = keycloakUsers.map((kUser: any) => ({
          id: kUser.id || '',  // Keep as string (Keycloak UUID)
          keycloakId: kUser.id || '',
          username: kUser.username || '',
          email: kUser.email || '',
          firstname: kUser.firstName || '',
          lastname: kUser.lastName || '',
          speciality: '',
          password: '',
          address: ''
        }));

        // Load images for formateurs
        this.Formateurs.forEach(formateur => {
          const numericId = typeof formateur.id === 'number' ? formateur.id : parseInt(String(formateur.id));
          if (!isNaN(numericId) && numericId > 0) {
            this.imageFormateurService.getImageByUserId(numericId).subscribe(
              (response: any) => {
                this.imageMap.set(formateur.id, response);
              },
              (error) => {
                console.error('Failed to retrieve image:', error);
              }
            );
          }
        });
      },
      (error: any) => {
        console.error('Failed to load formateurs from Keycloak, falling back to local service:', error);
        // Fallback to local service
        this.formateurService.getAllFormateur().subscribe(listFormateur => {
          this.Formateurs = listFormateur;

          this.Formateurs.forEach(formateur => {
            const numericId = typeof formateur.id === 'number' ? formateur.id : parseInt(String(formateur.id));
            if (!isNaN(numericId)) {
              this.imageFormateurService.getImageByUserId(numericId).subscribe(
              (response: any) => {
                this.imageMap.set(formateur.id, response);
              },
                (error) => {
                  console.error('Failed to retrieve image:', error);
                }
              );
            }
          });
        });
      }
    );
  }
  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }
}
