import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/time-layer.service';
import { SharedModule } from '../layer.module';
import { WeatherCardComponent } from '../weather-card/weather-card.component';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.css'],
  standalone: true,
  imports: [SharedModule, WeatherCardComponent],
})
export class TimeComponent {
  weatherData: any;
  city: string = 'Guetemala'; // Ciudad predeterminada
  latitude: number | undefined;
  longitude: number | undefined;
  errorMessage: string | undefined;

  constructor(private weatherService: WeatherService) {
    this.getWeather();
    this.getUserLocation();
  }

  async getUserLocation() {
    this.weatherService
      .getCurrentPosition()
      .then((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
      })
      .catch((error) => {
        this.errorMessage = 'Error al obtener la ubicación: ' + error;
      });
  }

  // Función para obtener el clima
  public async getWeather() {
    this.weatherData = await this.weatherService.getWeather(this.city);
    console.log(this.weatherData);

    // .subscribe(
    //   (data) => {
    //     this.weatherData = data;
    //   },
    //   (error) => {
    //     console.error('Error al obtener el clima:', error);
    //   }
    // );
  }

  // Función para cambiar la ciudad
  updateCity(city: string) {
    this.city = city;
    this.getWeather();
  }
}
