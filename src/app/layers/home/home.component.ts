import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../layer.module';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showFiller = false;
  constructor(private router: Router) {}

  ngOnInit() {}

  closeSession() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }
}
