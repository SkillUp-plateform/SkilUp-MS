import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormationService } from '../formation.service';
import { Formation } from '../models/formation.model';
import { AuthUserService } from '../auth-user-service.service';
import { User } from '../models/user.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payment-user',
  templateUrl: './payment-user.component.html',
  styleUrls: ['./payment-user.component.css']
})
export class PaymentUserComponent implements OnInit {
  isSidebarCollapsed: boolean = false;

  courses: Formation[] = [];
  selectedCourse: Formation | null = null;
  selectedPrice: string = "";
  user: any; // Remplacez 'any' par le type approprié si vous en avez un

  @ViewChild('paymentRef', { static: true }) paymentRef!: ElementRef;
  constructor(private formationService: FormationService, private authUserService :AuthUserService) {}
  
  ngOnInit(): void {
    this.loadFormations();
    this.user = this.authUserService.getCurrentUser(); }

  private loadFormations() {
    this.formationService.getAllFormations().subscribe(
      (formations) => {
        this.courses = formations;
        this.selectedCourse = this.courses[0];
        this.updatePrice();
      },
      (error) => {
        console.error('Erreur lors de la récupération des formations', error);
      }
    );
  }

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  updatePrice() {
    if (this.selectedCourse) {
      this.selectedPrice = this.selectedCourse.prix ?? "";
    }
  }

  pay(amount: string) {
    const handler = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51HxRkiCumzEESdU2Z1FzfCVAJyiVHyHifo0GeCMAyzHPFme6v6ahYeYbQPpD9BvXbAacO2yFQ8ETlKjo4pkHSHSh00qKzqUVK9',
      locale: 'auto',
      token: (token: any) => {
        console.log(token);
        this.generatePDF(token.email, token.card.name); // Inclure l'email et le nom à partir du token
      }
    });

    handler.open({
      name: 'Site de Démonstration',
      description: 'Paiement de la Formation',
      amount: parseFloat(amount) * 100 // Convertir en centimes
    });
  }

  generatePDF(userEmail: string, userName: string) {
    const doc = new jsPDF();
  
    // Définir une couleur de fond pour le titre
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 30, 'F');
  
    // Ajouter un titre centré
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.setFont("helvetica", "bold");
    doc.text('Facture', 105, 20, { align: 'center' });
  
    // Ajouter une ligne horizontale sous le titre
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 35, 200, 35);
  
    // Ajouter les détails de l'utilisateur avec un en-tête
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text('Détails du Client', 10, 45);
    
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text('Nom : ' + this.user.lastname, 10, 55);   // Nom de famille
    doc.text('Prénom : ' + this.user.firstname, 10, 65); // Prénom
    doc.text('Email : ' + userEmail, 10, 75);
    doc.text('Date : ' + new Date().toLocaleDateString(), 10, 85);
  
    // Ajouter les détails de la formation avec un autre en-tête
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text('Détails de la Formation', 10, 100);
    
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.text('Formation : ' + (this.selectedCourse?.title || 'N/A'), 10, 110);
    doc.text('Montant : $' + this.selectedPrice, 10, 120);
  
    // Ajouter une ligne horizontale
    doc.setDrawColor(0, 0, 0);
    doc.line(10, 125, 200, 125);
  
    // Ajouter un tableau avec les détails des articles
    autoTable(doc, {
      startY: 130,
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
      head: [['Article', 'Description', 'Prix']],
      body: [
        ['Formation', this.selectedCourse?.title || 'N/A', '$' + this.selectedPrice],
      ],
      styles: { fontSize: 12 }
    });
  
    // Ajouter une image de logo (optionnel)
    const logo = '../../assets/template/img/Blue_Modern_Free_Academy_Logo__1_-removebg-preview.png'; // Remplacez par le chemin ou le base64 de votre logo
    doc.addImage(logo, 'PNG', 160, 10, 40, 20); // Ajuster les coordonnées et la taille de l'image
  
    // Ajouter le pied de page
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.text('Merci pour votre paiement !', 105, doc.internal.pageSize.height - 10, { align: 'center' });
  
    // Générer le PDF et le télécharger
    doc.save('paiement.pdf');
  }
  
}  
