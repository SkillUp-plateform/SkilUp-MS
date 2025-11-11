import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Formateur } from '../models/formateur.model';
import { FormateurService } from '../formateur.service';
import { ImageFormateurService } from '../image-formateur.service';
import { KeycloakAdminService } from '../services/keycloak-admin.service';

declare var $: any;

@Component({
  selector: 'app-gestion-formateur',
  templateUrl: './gestion-formateur.component.html',
  styleUrls: ['./gestion-formateur.component.css']
})
export class GestionFormateurComponent implements OnInit {

  constructor(
    private formateurService: FormateurService,
    private formBuilder: FormBuilder,
    private imageFormateurService: ImageFormateurService,
    private keycloakAdminService: KeycloakAdminService
  ) {}
  forminput!: FormGroup;
  filteredFormateur: Formateur[] = [];
  searchTerm: string = '';
  formateurCount: number = 0;
  Formateurs: Formateur[] = [];
  imageMap: Map<string | number, string> = new Map<string | number, string>();
  selectedFile: File | null = null;


  formateur: Formateur = {
    id: -1,
    firstname: '',
    lastname: '',
    email: '',
    speciality: '',
    username: '',
    password: '',
    address: ''
  };

  formateurToUpdate: Formateur = {
    id: -1,
    firstname: '',
    lastname: '',
    email: '',
    speciality: '',
    username: '',
    password: '',
    address: ''
  };

  ngOnInit(): void {
    this.loadUsers();
    this.forminput = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      username: ['', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      address: ['', [Validators.required]],
      speciality :['', [Validators.required]],
    });
  }

  // Charger la liste des formateurs
  loadUsers() {
    // Try to load from Keycloak first
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
        this.filteredFormateur = this.Formateurs;
        this.formateurCount = this.Formateurs.length;

        // Load images for formateurs
        this.Formateurs.forEach(formateur => {
          const numericId = typeof formateur.id === 'number' ? formateur.id : parseInt(String(formateur.id));
          if (!isNaN(numericId) && numericId > 0) {
            this.imageFormateurService.getImageByUserId(numericId).subscribe(
              (response: any) => {
                this.imageMap.set(formateur.id, response);
              },
              (error: any) => {
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
          this.filteredFormateur = this.Formateurs;
          this.formateurCount = this.Formateurs.length;

          this.Formateurs.forEach(formateur => {
            const numericId = typeof formateur.id === 'number' ? formateur.id : parseInt(String(formateur.id));
            if (!isNaN(numericId)) {
              this.imageFormateurService.getImageByUserId(numericId).subscribe(
              (response: any) => {
                this.imageMap.set(formateur.id, response);
              },
                (error: any) => {
                  console.error('Failed to retrieve image:', error);
                }
              );
            }
          });
        });
      }
    );
  }

  // Filtrer les formateurs en fonction de la recherche
  searchFormateurs() {
    if (this.searchTerm) {
      this.filteredFormateur = this.Formateurs.filter(formateur =>
        formateur.username.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredFormateur = this.Formateurs;
    }
  }

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

    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0] as File;
    }
  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  // Ajouter formateur
  AjoutModel() {
    $('#ajouModel').modal('show');
  }

  AjoutEvent() {
    if (this.forminput.valid) {
      const formData = this.forminput.value;
      
      // Create user in Keycloak with 'formateur' role
      const keycloakUser = {
        username: formData.username,
        email: formData.email,
        firstName: formData.firstname,
        lastName: formData.lastname,
        temporaryPassword: formData.password,
        role: 'formateur' as 'formateur'
      };

      this.keycloakAdminService.createUser(keycloakUser).subscribe(
        (response) => {
          console.log('Formateur created in Keycloak:', response);
          alert('Formateur créé avec succès dans Keycloak!');
          
          // Also create in local service for backward compatibility
          this.formateurService.addFormateur(formData).subscribe(
            newFormateur => {
              if (this.selectedFile && typeof newFormateur.id === 'number') {
                this.imageFormateurService.uploadImage(this.selectedFile, newFormateur.id).subscribe(
                  response => {
                    console.log('Image uploaded successfully:', response);
                  },
                  error => {
                    console.error('Error uploading image:', error);
                  }
                );
              }
              this.loadUsers();
              this.closeEvent();
            },
            error => {
              console.error('Error creating formateur in local service:', error);
              this.loadUsers();
              this.closeEvent();
            }
          );
        },
        (error) => {
          console.error('Failed to create formateur in Keycloak:', error);
          alert('Erreur lors de la création du formateur dans Keycloak. Vérifiez la console.');
          
          // Fallback: create only in local service
          this.formateurService.addFormateur(formData).subscribe(
            newFormateur => {
              if (this.selectedFile && typeof newFormateur.id === 'number') {
                this.imageFormateurService.uploadImage(this.selectedFile, newFormateur.id).subscribe(
                  response => {
                    console.log('Image uploaded successfully:', response);
                  },
                  error => {
                    console.error('Error uploading image:', error);
                  }
                );
              }
              window.location.reload();
              this.loadUsers();
              this.closeEvent();
            },
            error => {
              console.error('Erreur', error);
            }
          );
        }
      );
    }
  }

  closeEvent() {
    $('#ajouModel').modal('hide');
  }

  // Modifier formateur
  editFormateur(formateur: Formateur) {
    this.formateurToUpdate = { ...formateur };
    $('#ModifModel').modal('show');
  }

  modifEvent() {
    if (this.formateurToUpdate && typeof this.formateurToUpdate.id === 'number') {
      this.formateurService.updateFormateur(this.formateurToUpdate.id, this.formateurToUpdate).subscribe(updatedFormateur => {
        if (this.selectedFile && typeof this.formateurToUpdate.id === 'number') {
          this.imageFormateurService.updateImage(this.selectedFile, this.formateurToUpdate.id).subscribe(response => {
            console.log('Image updated successfully:', response);
          }, error => {
            console.error('Error updating image:', error);
          });
        }
        
        const index = this.Formateurs.findIndex(formateur => formateur.id === updatedFormateur.id);
        if (index !== -1) {
          this.Formateurs[index] = updatedFormateur;
          this.searchFormateurs(); // Reapply the filter after update
        }
        this.closeModif();
        window.location.reload();
      }, error => {
        console.error('Erreur', error);
      });
    }
  }

  closeModif() {
    $('#ModifModel').modal('hide');
  }

  // Supprimer formateur
  formateurToDelete!: Formateur;

  deleteFormateur(formateur: Formateur) {
    this.formateurToDelete = formateur; // Initialize formateurToDelete here
    $('#deleteModal').modal('show');
  }

  deleteEvent() {
    if (typeof this.formateurToDelete.id === 'number') {
      this.formateurService.deleteFormateur(this.formateurToDelete.id).subscribe(() => {
        this.loadUsers(); // Reload formateurs to update the list
        this.closeDelete();
      }, error => {
        console.error('Erreur', error);
      });
    }
  }

  closeDelete() {
    $('#deleteModal').modal('hide');
  }

  // Détails formateur
  formateurToShow: Formateur = {
    id: -1,
    firstname: '',
    lastname: '',
    email: '',
    speciality: '',
    username: '',
    password: '',
    address: ''
  };

  detailsFormateur(formateur: Formateur) {
    this.formateurToShow = formateur;
    $('#detailsModel').modal('show');
  }

  closeDetails() {
    $('#detailsModel').modal('hide');
  }
}
