import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Formation } from '../models/formation.model';
import { FormationService } from '../formation.service';
import { Formateur } from '../models/formateur.model';
import { FormateurService } from '../formateur.service';
import { ImageFormationService } from '../image-formation.service';
import { KeycloakAdminService } from '../services/keycloak-admin.service';
declare var $: any;

@Component({
  selector: 'app-gestion-formation',
  templateUrl: './gestion-formation.component.html',
  styleUrls: ['./gestion-formation.component.css']
})
export class GestionFormationComponent implements OnInit {

  imageMap: Map<number, string> = new Map<number, string>();
  selectedFile: File | null = null;
  Formations: Formation[] = [];
  formateurs: Formateur[] = [];
  formateurOptions: Array<{id: string, name: string}> = [];  // Simple array for dropdown
  formateurNameMap: Map<string, string> = new Map<string, string>();  // Map Keycloak ID to username
  selectedFormateur: Formateur | null = null;
  selectedFormateurId: string = '';  // Store selected ID
  searchTerm: string = '';
  formationCount: number = 0;
  formation: Formation = {
    id: -1,
    title: "",
    content: "",
    documentLink: "",
    meetingLink: "",
    videoLink: "",
    duration: "",
    date: "",
    prix: "",
    formateur: {
      id:-1,
      username:'',
      email:'',
      speciality:'',
      firstname:'',
      lastname:'',
      address:'',
      password:''
    }
  };

  formationToUpdate: Formation = {
    id: -1,
    title: "",
    content: "",
    documentLink: "",
    meetingLink: "",
    videoLink: "",
    duration: "",
    date: "",
    prix: "",
    formateur: {
      id:-1,
      username:'',
      email:'',
      speciality:'',
      firstname:'',
      lastname:'',
      address:'',
      password:''
    }
  };

  constructor(
    private formationService: FormationService,
    private formateurService: FormateurService,
    private imageFormationService: ImageFormationService,
    private keycloakAdminService: KeycloakAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadFormateurs();
  }

  // TrackBy function for better performance
  trackByFormateurId(index: number, formateur: Formateur): any {
    return formateur.id || formateur.keycloakId || index;
  }

  // Select formateur by ID
  selectFormateur(id: string): void {
    this.selectedFormateurId = id;
    console.log('Formateur selected:', id);
  }

  // Get selected formateur name
  getSelectedFormateurName(): string {
    const selected = this.formateurOptions.find(opt => opt.id === this.selectedFormateurId);
    return selected ? selected.name : '';
  }

  // Get formateur name by Keycloak ID
  getFormateurNameById(keycloakId: string): string {
    return this.formateurNameMap.get(keycloakId) || keycloakId;
  }

  loadFormations() {
    this.formationService.getAllFormations().subscribe((data: Formation[]) => {
      this.Formations = data;
      this.formationCount = this.Formations.length;
      
      console.log('Loaded formations:', this.Formations);
      
      this.Formations.forEach(formation => {
        console.log('Formation:', formation.title, 'Formateur:', formation.formateur, 'KeycloakId:', formation.keycloakFormateurId);
        
        this.imageFormationService.getImageByUserId(formation.id).subscribe(
          (response: any) => {  // Assurez-vous que `response` est de type base64 string
            this.imageMap.set(formation.id, response); // On stocke directement la chaîne base64
          },
          (error) => {
            console.error('Failed to retrieve image:', error);
          }
        );
      });

    }, error => {
      console.error('Erreur lors du chargement des formations:', error);
    });
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
  loadFormateurs() {
    // Try to load from Keycloak first
    this.keycloakAdminService.listUsersByRole('formateur').subscribe(
      (keycloakUsers: any[]) => {
        console.log('Loaded formateurs from Keycloak for dropdown:', keycloakUsers);
        
        // Map Keycloak users to Formateur model
        this.formateurs = keycloakUsers.map((kUser: any) => {
          // Keycloak may return 'username' or we need to construct it from firstName/lastName
          const displayName = kUser.username || 
                             `${kUser.firstName || ''} ${kUser.lastName || ''}`.trim() || 
                             kUser.email || 
                             'Unknown User';
          
          console.log('Mapping user:', {
            id: kUser.id,
            username: kUser.username,
            firstName: kUser.firstName,
            lastName: kUser.lastName,
            email: kUser.email,
            displayName: displayName
          });
          
          return {
            id: kUser.id || '',  // Keep as string (Keycloak UUID)
            keycloakId: kUser.id || '',  // Store Keycloak UUID
            username: displayName,  // Use displayName for dropdown
            email: kUser.email || '',
            firstname: kUser.firstName || '',
            lastname: kUser.lastName || '',
            speciality: '',
            password: '',
            address: ''
          };
        });
        
        console.log('Formateurs available for selection:', this.formateurs);
        console.log('Number of formateurs:', this.formateurs.length);
        
        // Create simple array for dropdown and populate name map
        this.formateurOptions = this.formateurs.map(f => {
          const keycloakId = f.keycloakId || String(f.id);
          const name = f.username || f.email || f.firstname || f.lastname || 'Unknown';
          
          // Store in map for quick lookup
          this.formateurNameMap.set(keycloakId, name);
          
          const option = {
            id: keycloakId,
            name: name
          };
          console.log('Creating option:', option);
          return option;
        });
        
        console.log('Formateur options for dropdown:', this.formateurOptions);
        console.log('Formateur name map:', this.formateurNameMap);
        
        // Force Angular to detect changes with a small delay
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('Change detection triggered');
        }, 100);
      },
      (error: any) => {
        console.error('Failed to load formateurs from Keycloak, falling back to local service:', error);
        // Fallback to local service
        this.formateurService.getAllFormateur().subscribe(
          data => {
            this.formateurs = data;
            console.log('Formateurs loaded from local service:', this.formateurs);
          },
          error => {
            console.error('Erreur lors du chargement des formateurs:', error);
          }
        );
      }
    );
  }

  isSidebarCollapsed = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] as File;
  }
  // Ajout Modal
  openAjoutModal() {
    $('#ajouModel').modal('show');
  }

  AjoutModel() {
    if (this.selectedFormateurId && this.formation) {
      // Use the selected formateur ID directly
      this.formationService.addFormation(this.formation, this.selectedFormateurId).subscribe(
        (response) => {
          console.log('Formation ajoutée avec succès', response);
          
          // Upload image if selected
          if (this.selectedFile) {
            this.imageFormationService.uploadImage(this.selectedFile, response.id).subscribe(
              imageResponse => {
                console.log('Image uploaded successfully:', imageResponse);
                this.loadFormations();  // Reload after image upload
                this.closeAjoutModal();
              }, 
              error => {
                console.error('Error uploading image:', error);
                this.loadFormations();  // Reload even if image upload fails
                this.closeAjoutModal();
              }
            );
          } else {
            // No image to upload, just reload
            this.loadFormations();
            this.closeAjoutModal();
          }
          
          // Reset form
          this.formation = {
            id: -1,
            title: "",
            content: "",
            documentLink: "",
            meetingLink: "",
            videoLink: "",
            duration: "",
            date: "",
            prix: "",
            formateur: {
              id:-1,
              username:'',
              email:'',
              speciality:'',
              firstname:'',
              lastname:'',
              address:'',
              password:''
            }
          };
          this.selectedFormateur = null;
          this.selectedFormateurId = '';
          this.selectedFile = null;
        },
        (error) => {
          console.error('Erreur lors de l\'ajout de la formation', error);
          alert('Erreur lors de l\'ajout de la formation. Veuillez vérifier les détails.');
        }
      );
    } else {
      console.error('Formateur non sélectionné ou formation invalide');
      alert('Veuillez sélectionner un formateur');
    }
  }
  
  closeAjoutModal() {
    $('#ajouModel').modal('hide');
  }

  // Modif Modal
  editFormation(formation: Formation) {
    this.formationToUpdate = { ...formation };
    this.selectedFormateur = formation.formateur;
    $('#ModifModel').modal('show');
  }

  updateFormation() {
    if (this.formationToUpdate.id !== -1) {
      // Use keycloakId if available, otherwise use id as string
      const formateurId = this.formationToUpdate.formateur.keycloakId || String(this.formationToUpdate.formateur.id || '');
      this.formationService.updateFormation(this.formationToUpdate.id, this.formationToUpdate, formateurId).subscribe(
        (response: any) => {
          console.log('Formation mise à jour avec succès', response);
          
          // Upload image if selected
          if (this.selectedFile) {
            this.imageFormationService.updateImage(this.selectedFile, response.id).subscribe(
              imageResponse => {
                console.log('Image updated successfully:', imageResponse);
                this.loadFormations();
                this.closeModifModal();
              }, 
              error => {
                console.error('Error updating image:', error);
                this.loadFormations();
                this.closeModifModal();
              }
            );
          } else {
            // No image to update, just reload
            this.loadFormations();
            this.closeModifModal();
          }
          
          this.selectedFile = null;
        },
        (error: any) => {
          console.error('Erreur lors de la mise à jour de la formation', error);
          alert('Erreur lors de la mise à jour de la formation');
        }
      );
    }
  }
  
  closeModifModal() {
    $('#ModifModel').modal('hide');
  }

  

  openDetailsModal(formation: Formation) {
    this.formation = formation;
    $('#detailsModel').modal('show');
  }

  closeDetailsModal() {
    $('#detailsModel').modal('hide');
  }

  // Delete Modal
  formationToDelete!: Formation;

  openDeleteModal(formation: Formation) {
    this.formationToDelete = formation;
    $('#deleteModal').modal('show');
  }
 
  deleteFormation() {
    if (this.formationToDelete) {
      this.formationService.deleteFormation(this.formationToDelete.id).subscribe(() => {
        this.loadFormations();
        this.closeDeleteModal();
      }, error => {
        console.error('Erreur lors de la suppression de la formation:', error);
      });
    }
  }
   
  closeDeleteModal() {
    $('#deleteModal').modal('hide');
  }
}
