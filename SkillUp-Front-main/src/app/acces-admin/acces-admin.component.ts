import { Component, OnInit } from '@angular/core';
import { AccessCode } from '../models/accessCode.model';
import { AccessCodeService } from '../acces-code.service';
import { Formation } from '../models/formation.model';
import { FormationService } from '../formation.service';

declare var $: any;

@Component({
  selector: 'app-acces-admin',
  templateUrl: './acces-admin.component.html',
  styleUrls: ['./acces-admin.component.css']
})
export class AccesAdminComponent implements OnInit {

  Formations: Formation[] = [];

  accessCodes: AccessCode[] = [];

  accessCodeToDelete!: AccessCode;

  selectedFormation: Formation | null = null;

  accessCode: AccessCode = { id: 0, code: '', formation: { id: -1, title: "", content: "", documentLink: "", meetingLink: "", videoLink: "", duration: "", date: "", prix: "",formateur: {
    id:-1,
    username:'',
    email:'',
    speciality:'',
    firstname:'',
    lastname:'',
    address:'',
    password:''} } };


    accessCodeCount: number = 0;

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
        password:''}
    };

    constructor(
      private accessCodeService: AccessCodeService,
      private formationService: FormationService,
    ) {}

    loadAccessCodes() {
      this.accessCodeService.getAllAccessCodes().subscribe((data: AccessCode[]) => {
        this.accessCodes = data;
        this.accessCodeCount = this.accessCodes.length;
      });
    }

    loadFormations() {
      this.formationService.getAllFormations().subscribe(listFormation => {
        this.Formations = listFormation;
      });
    }

    isSidebarCollapsed = false;

    onSidebarToggle(collapsed: boolean) {
      this.isSidebarCollapsed = collapsed;
  }
  
  ngOnInit(): void{
    this.loadAccessCodes();
    this.loadFormations();
  }

  
  // Méthodes pour les codes d'accès
  openAjoutAccessCodeModal() {
    $('#ajouAccessCodeModel').modal('show');
  }

  addAccessCode(): void {
    if (this.selectedFormation && this.accessCode.code) {
      this.accessCodeService.addAccessCode(this.accessCode, this.selectedFormation.id).subscribe(
        (response) => {
          console.log('Access code added successfully:', response);
          this.loadAccessCodes(); // Refresh the list after adding
          this.closeAjoutAccessCodeModal();
        },
        (error) => {
          console.error('Error adding access code:', error);
        }
      );
    } else {
      console.error('Invalid access code or formation');
    }
  }
  
  closeAjoutAccessCodeModal() {
    $('#ajouAccessCodeModel').modal('hide');
  }

  openDeleteAccessCodeModal(accessCode: AccessCode) {
    this.accessCodeToDelete = accessCode;
    $('#deleteAccessCodeModal').modal('show');
  }

  deleteAccessCode() {
    if (this.accessCodeToDelete) {
      this.accessCodeService.deleteAccessCode(this.accessCodeToDelete.id).subscribe(() => {
        this.loadAccessCodes(); // Refresh the list after deleting
        this.closeDeleteAccessCodeModal();
      });
    }
  }
  
  closeDeleteAccessCodeModal() {
    $('#deleteAccessCodeModal').modal('hide');
  }

}
