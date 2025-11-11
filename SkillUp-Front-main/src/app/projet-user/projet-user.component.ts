import { Component, OnInit } from '@angular/core';
import { Project } from '../models/project.model';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-projet-user',
  templateUrl: './projet-user.component.html',
  styleUrls: ['./projet-user.component.css']
})
export class ProjetUserComponent implements OnInit {
  Projects: Project[] = [];
  expandedProjectIndex: number | null = null;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAllProjects().subscribe(listProject => {
      this.Projects = listProject;
    });
  }

  isSidebarCollapsed: boolean = false;

  onSidebarToggle(collapsed: boolean) {
    this.isSidebarCollapsed = collapsed;
  }

  toggleDetails(index: number) {
    this.expandedProjectIndex = this.expandedProjectIndex === index ? null : index;
  }
}
