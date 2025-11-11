import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/user.model';
import { UserService } from '../user.service';
import { KeycloakAdminService, CreateKeycloakUserDto } from '../services/keycloak-admin.service';
import { ImageUserService } from '../image-user.service';
declare var $: any;

@Component({
  selector: 'app-gestion-utilisateur',
  templateUrl: './gestion-utilisateur.component.html',
  styleUrls: ['./gestion-utilisateur.component.css']
})
export class GestionUtilisateurComponent implements OnInit {
    forminput!: FormGroup;
    users: User[] = [];
    filteredUsers: User[] = [];
    searchTerm: string = '';
    userCount: number = 0;
    selectedFile: File | null = null;
    user: User = { id: -1, firstname: '', lastname: '', email: '', username: '', password: '', address: '' };
    userToUpdate: User = { id: -1, firstname: '', lastname: '', email: '', username: '', password: '', address: '' };
    isSidebarCollapsed = false;
    imageMap: Map<number, string> = new Map<number, string>();
  
    constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private imageUserService: ImageUserService,
    private keycloakAdmin: KeycloakAdminService
  ) {}
  
    ngOnInit(): void {
      this.loadUsers();
      this.forminput = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]],
        username: ['', [Validators.required]],
        firstname: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
        address: ['', [Validators.required]],
      });
    }
  
    searchUsers() {
      if (this.searchTerm) {
        this.filteredUsers = this.users.filter(user => user.username.toLowerCase().includes(this.searchTerm.toLowerCase()));
      } else {
        this.filteredUsers = this.users;
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
    onSidebarToggle(collapsed: boolean) {
      this.isSidebarCollapsed = collapsed;
    }
  
    onFileSelected(event: any) {
      this.selectedFile = event.target.files[0] as File;
    }
  
    loadUsers() {
    // Load Keycloak users with role 'user' for the table
    this.keycloakAdmin.listUsersByRole('user').subscribe({
      next: (kcUsers: any[]) => {
        // Map to local display model shape when possible
        this.users = kcUsers.map(u => ({
          id: u.id || -1,
          firstname: u.firstName || '',
          lastname: u.lastName || '',
          email: u.email || '',
          username: u.username || '',
          password: '',
          address: ''
        }));
        this.filteredUsers = this.users;
        this.userCount = this.users.length;
        // Skip image loading for Keycloak users
      },
      error: (err) => {
        console.error('Failed to load Keycloak users by role user:', err);
        // Fallback to existing local users if backend not ready
        this.userService.getAllUsers().subscribe(listUser => {
          this.users = listUser;
          this.filteredUsers = this.users;
          this.userCount = this.users.length;
        });
      }
    });
  }
     


  // Ajout model
  AjoutModel() {
    $('#ajouModel').modal('show');
  }

  AjoutEvent() {
    if (this.forminput.valid) {
      const dto: CreateKeycloakUserDto = {
        username: this.forminput.value.username,
        email: this.forminput.value.email,
        firstName: this.forminput.value.firstname,
        lastName: this.forminput.value.lastname,
        temporaryPassword: this.forminput.value.password,
        role: 'user'
      };

      this.keycloakAdmin.createUser(dto).subscribe({
        next: () => {
          // Refresh list from Keycloak
          this.loadUsers();
          this.closeEvent();
        },
        error: (error) => {
          console.error('Erreur lors de la création Keycloak', error);
        }
      });
    }
  }

  closeEvent() {
    $('#ajouModel').modal('hide');
  }

  // Modif model
  editEtudiant(user: User) {
    this.userToUpdate = { ...user };
    $('#ModifModel').modal('show');
  }

  modifEvent() {
    if (this.userToUpdate) {
      this.userService.updateUser(this.userToUpdate.id, this.userToUpdate).subscribe(updatedUser => {
        console.log('User updated', updatedUser);
        if (this.selectedFile) {
          this.imageUserService.updateImage(this.selectedFile, this.userToUpdate.id).subscribe(response => {
            console.log('Image updated successfully:', response);
          }, error => {
            console.error('Error updating image:', error);
          });
        }
        const index = this.users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
          this.searchUsers();
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

  userToDelete!: User;

  // Delete
  deleteEtudiant(user: User) {
    $('#deleteModal').modal('show');
    this.userToDelete = user;
  }

  deleteEvent() {
    this.userService.deleteUser(this.userToDelete.id).subscribe(() => {
      this.loadUsers();
      this.closeDelete();
    }, error => {
      console.error('Erreur', error);
    });
  }

  closeDelete() {
    $('#deleteModal').modal('hide');
  }

  // Details
  userToShow: User = { id: -1, firstname: '', lastname: '', email: '', username: '', password: '', address: '' };
  detailsFormateur(user: User) {
      this.userToShow = user;
      $('#detailsModel').modal('show');
  }

  closeDetails() {
    $('#detailsModel').modal('hide');
  }
}
