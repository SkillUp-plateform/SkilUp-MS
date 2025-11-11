import { Component, OnInit } from '@angular/core';
import { FeedbackService } from '../feedback.service'; // Adjust the import path
import { Feedback } from '../models/feedback.model'; // Adjust the import path
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; // For modal dialogs
import { ImageUserService } from '../image-user.service';
@Component({
  selector: 'app-feedback-admin',
  templateUrl: './feedback-admin.component.html',
  styleUrls: ['./feedback-admin.component.css']
})
export class FeedbackAdminComponent implements OnInit {
  comments: Feedback[] = [];
  selectedFeedback: Feedback | null = null;
  isSidebarCollapsed = false;
  showActionColumn = true;
  updateSuccess = false;
  selectedFile: File | null = null;
  imageMap: Map<number, string> = new Map<number, string>();
  constructor(private feedbackService: FeedbackService, private modalService: NgbModal, private imageUserService: ImageUserService) { }

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getAllFeedbacks().subscribe({
      next: (data) => this.comments = data,
      error: (err) => console.error('Failed to load feedbacks', err)

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
  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  confirmDelete(feedback: Feedback, content: any) {
    this.selectedFeedback = feedback;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  deleteFeedback() {
    if (this.selectedFeedback) {
      this.feedbackService.deleteFeedback(this.selectedFeedback.id!).subscribe({
        next: () => {
          this.loadFeedbacks(); // Refresh the list
          this.modalService.dismissAll();
        },
        error: (err) => console.error('Failed to delete feedback', err)
      });
    }
  }

  closeDelete() {
    this.modalService.dismissAll();
  }
}
