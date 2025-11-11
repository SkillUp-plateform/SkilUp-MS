import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormationService } from '../formation.service';
import { ResourceService } from '../resource.service';
import { Formation } from '../models/formation.model';
import { Resource } from '../models/resource.model';

@Component({
  selector: 'app-formation-for',
  templateUrl: './formation-for.component.html',
  styleUrls: ['./formation-for.component.css']
})
export class FormationForComponent implements OnInit {
  currentFormation: Formation | null = null;
  formations: Formation[] = [];
  isSidebarCollapsed: boolean = false;
  resources: Resource[] = [];
  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private resourceService: ResourceService,
    private router: Router
  ) {}
  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }
  ngOnInit(): void {
    // Fetch all formations
    this.formationService.getAllFormations().subscribe(
      (formations) => {
        console.log('Fetched formations:', formations); // Debug log
        this.formations = formations;
  
        // Get the formation ID from route parameters
        this.route.paramMap.subscribe(params => {
          const formationKey = params.get('id');
          console.log('Formation key from route:', formationKey); // Debug log
  
          if (formationKey) {
            const formationId = Number(formationKey); // Convert to number
            console.log('Formation ID:', formationId); // Debug log
  
            if (!isNaN(formationId)) {
              this.currentFormation = this.formations.find(f => f.id === formationId) || null;
              if (!this.currentFormation) {
                console.warn('Formation not found for ID:', formationId);
              } else {
                // Load resources for the current formation
                this.loadResources(formationId);
              }
            } else {
              console.warn('Invalid formation ID:', formationKey);
              this.currentFormation = null;
            }
          } else {
            console.warn('Formation ID is null or undefined');
            this.currentFormation = null;
          }
        });
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
  }

  // Load resources for the current formation
  loadResources(formationId: number): void {
    this.resourceService.getResourcesByFormationId(formationId).subscribe(
      (resources) => {
        this.resources = resources;
        console.log('Loaded resources:', resources);
      },
      (error) => {
        console.error('Error loading resources:', error);
        this.resources = [];
      }
    );
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Upload a new resource
  uploadResource(): void {
    if (!this.selectedFile || !this.currentFormation) {
      return;
    }

    this.isUploading = true;
    this.resourceService.uploadResource(this.currentFormation.id, this.selectedFile).subscribe(
      (resource) => {
        console.log('Resource uploaded successfully:', resource);
        this.resources.push(resource);
        this.selectedFile = null;
        this.isUploading = false;
        // Reset file input
        const fileInput = document.getElementById('resourceFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      (error) => {
        console.error('Error uploading resource:', error);
        this.isUploading = false;
      }
    );
  }

  // Delete a resource
  deleteResource(resourceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      this.resourceService.deleteResource(resourceId).subscribe(
        () => {
          console.log('Resource deleted successfully');
          this.resources = this.resources.filter(r => r.id !== resourceId);
        },
        (error) => {
          console.error('Error deleting resource:', error);
        }
      );
    }
  }

  // Download a resource
  downloadResource(resource: Resource): void {
    this.resourceService.getResourceById(resource.id).subscribe(
      (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resource.name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error) => {
        console.error('Error downloading resource:', error);
      }
    );
  }

  // Get file size in human readable format
  getFileSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let i = 0;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(2)} ${units[i]}`;
  }

  // Navigate to quiz creation page
  navigateToQuiz(): void {
    if (this.currentFormation) {
      console.log('Navigating to quiz page for formation:', this.currentFormation.id);
      this.router.navigate(['/formateur/add-quiz', this.currentFormation.id]);
    } else {
      console.error('No current formation to create quiz for');
    }
  }
  
}
