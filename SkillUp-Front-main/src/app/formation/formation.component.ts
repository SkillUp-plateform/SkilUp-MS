import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../formation.service';
import { Formation } from '../models/formation.model';
import { ResourceService } from '../resource.service';
import { Resource } from '../models/resource.model';



@Component({
  selector: 'app-formation',
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.css']
})
export class FormationComponent implements OnInit {
  currentFormation: Formation | null = null;
  formations: Formation[] = [];
  isSidebarCollapsed: boolean = false;
  resources: Resource[] = [];
  selectedFile: File | null = null;
  isUploading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private resourceService: ResourceService
  ) {}

  onSidebarToggle(collapsed: boolean): void {
    this.isSidebarCollapsed = collapsed;
  }

  ngOnInit(): void {
    this.formationService.getAllFormations().subscribe(
      (formations) => {
        this.formations = formations;

        // Get the formation ID from route parameters
        this.route.paramMap.subscribe(params => {
          const formationId = Number(params.get('id'));

          if (!isNaN(formationId)) {
            this.currentFormation = this.formations.find(f => f.id === formationId) || null;
            if (!this.currentFormation) {
              console.warn('Formation not found for ID:', formationId);
            } else {
              this.loadResources(formationId);
            }
          } else {
            console.warn('Invalid formation ID:', params.get('id'));
            this.currentFormation = null;
          }
        });
      },
      (error) => {
        console.error('Error fetching formations:', error);
      }
    );
  }

  loadResources(formationId: number): void {
    this.resourceService.getResourcesByFormationId(formationId).subscribe(
      (resources: Resource[]) => {
        this.resources = resources;
      },
      (error: any) => {
        console.error('Error loading resources:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  uploadResource(): void {
    if (!this.selectedFile || !this.currentFormation) {
      return;
    }

    this.isUploading = true;
    this.resourceService.uploadResource(this.currentFormation.id, this.selectedFile).subscribe(
      (resource: Resource) => {
        this.resources.push(resource);
        this.selectedFile = null;
        this.isUploading = false;
        // Reset file input
        const fileInput = document.getElementById('resourceFile') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      (error: any) => {
        console.error('Error uploading resource:', error);
        this.isUploading = false;
      }
    );
  }

  deleteResource(resourceId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette ressource ?')) {
      this.resourceService.deleteResource(resourceId).subscribe(
        () => {
          this.resources = this.resources.filter(r => r.id !== resourceId);
        },
        (error: any) => {
          console.error('Error deleting resource:', error);
        }
      );
    }
  }

  downloadResource(resourceId: number, resourceName: string): void {
    this.resourceService.getResourceById(resourceId).subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resourceName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      },
      (error: any) => {
        console.error('Error downloading resource:', error);
      }
    );
  }

  getFileSize(size: number): string {
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
