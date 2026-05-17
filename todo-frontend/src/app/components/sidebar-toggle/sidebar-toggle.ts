import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar-toggle.html',
  styleUrls: ['./sidebar-toggle.css']
})
export class SidebarToggleComponent {
  @Input() open: boolean = true;
  @Output() toggle = new EventEmitter<void>();
}
