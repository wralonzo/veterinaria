import { Component, Input } from '@angular/core';
import { SharedModule } from '../layer.module';

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.component.html',
  styleUrls: ['./weather-card.component.css'],
  standalone: true,
  imports: [SharedModule],
})
export class WeatherCardComponent {
  @Input() weatherData: any; // Este input recibirá los datos del tiempo
  showDetails: boolean = false;

  toggleDetails() {
    this.showDetails = !this.showDetails; // Alternar la visualización de detalles
  }
}
