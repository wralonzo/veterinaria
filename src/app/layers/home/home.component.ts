import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../layer.module';
import { WeatherService } from '../../services/time-layer.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  showFiller = false;
  constructor(private router: Router, private weatherService: WeatherService) {}

  ngOnInit() {
    this.getUserLocation();
  }

  closeSession() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  async getUserLocation() {
    this.weatherService.getCurrentPosition();
  }
}
