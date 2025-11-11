import { Component, OnInit } from '@angular/core';
import { Project } from '../models/project.model'
import { ProjectService } from '../project.service';
declare var $: any;

@Component({
  selector: 'app-getion-project',
  templateUrl: './getion-project.component.html',
  styleUrls: ['./getion-project.component.css']
})
export class GetionProjectComponent implements OnInit{

  constructor(private projectService : ProjectService){}
  filteredProjects: Project[] = [];
  searchTerm: string = '';
  projetCount:number = 0;
  Projects:Project[]=[];

  project:Project={
    id: -1,
    title: "",
    description: ""
  }

  projectToUpdate:Project={
    id: -1,
    title: "",
    description: ""
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.projectService.getAllProjects().subscribe(listProject => {
    this.Projects = listProject;
    this.projetCount = this.Projects.length;
    this.filteredProjects = this.filterProjects(this.searchTerm);
    });
  }
  filterProjects(term: string): Project[] {
    if (!term.trim()) {
      return this.Projects;
    }
    return this.Projects.filter(project =>
      project.title.toLowerCase().includes(term.toLowerCase())
    );
  }
  onSearch() {
    this.filteredProjects = this.filterProjects(this.searchTerm);
  }

  isSidebarCollapsed: boolean = false; // Définir la propriété

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  openAddModal() {
    $('#addModal').modal('show');
  }
  AddModal() {
    this.projectService.addProject(this.project).subscribe(newProject=>{
      window.location.reload();
      this.loadUsers();
      this.closeAddModal();
    }, error=>{
      console.error("Erreur",error);
    })
  }
  closeAddModal() {
    $('#addModal').modal('hide');
  }
////////////////////////////////////
  openModifyModal( project : Project) {
    this.projectToUpdate = { ...project };
    $('#modifyModal').modal('show');
  }

  ModifyModal() {
    if (this.projectToUpdate) {
      this.projectService.updateProject(this.projectToUpdate.id, this.projectToUpdate).subscribe(updatetdProject => {
        const index = this.Projects.findIndex(project => project.id === updatetdProject.id);

        if (index !== -1) {
          this.Projects[index] = updatetdProject;
        }
        //window.location.reload();
        this.loadUsers();
        this.closeModifyModal();
      }, error => {
        console.error('Erreur', error);
      });
    }  }

  closeModifyModal() {
    $('#modifyModal').modal('hide');
  }
////////////////////////////////////
projectToDelete!:Project;

  openDeleteModal( project : Project) {
    this.projectToDelete = project;
    $('#deleteModal').modal('show');
  }
  DeleteModal() {
    this.projectService.deleteProject(this.projectToDelete.id).subscribe(()=>{
      window.location.reload();
    })
  }
  closeDeleteModal() {
    $('#deleteModal').modal('hide');
  }
}
