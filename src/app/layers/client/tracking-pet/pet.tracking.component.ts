import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../layer.module';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { AxiosService } from '../../shared/axios.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Constancia,
  Consulta,
  Examene,
  ITracking,
  Reservacione,
  Servicio,
} from './interface/pet';

@Component({
  selector: 'app-pet-add',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pet.tracking.component.html',
  styleUrl: './pet-tracking.component.css',
})
export class PetTrackingComponent implements AfterViewInit, OnInit {
  elementData: Consulta[] = [];
  elementDataE: Examene[] = [];
  elementDataR: Reservacione[] = [];
  elementDataC: Constancia[] = [];
  elementDataS: Servicio[] = [];

  displayedColumns: string[] = ['id', 'name', 'description', 'dateCreated'];

  displayedColumnsE: string[] = ['id', 'diagnostico', 'motivo', 'createdAt'];

  displayedColumnsR: string[] = [
    'id',
    'horaInicio',
    'horaFin',
    'fecha',
    'comentario',
    'estado',
    'createdAt',
  ];

  displayedColumnsC: string[] = ['id', 'comentario', 'createdAt'];

  displayedColumnsS: string[] = [
    'id',
    'name',
    'time',
    'servicio',
    'dateCreated',
  ];
  idClient: number = 0;

  dataSource = new MatTableDataSource<Consulta>(this.elementData);
  dataSourceE = new MatTableDataSource<Examene>(this.elementDataE);
  dataSourceR = new MatTableDataSource<Reservacione>(this.elementDataR);
  dataSourceC = new MatTableDataSource<Constancia>(this.elementDataC);
  dataSourceS = new MatTableDataSource<Servicio>(this.elementDataS);

  // consult
  @ViewChild('paginatorS') paginatorS!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  // exam
  @ViewChild('paginatorE') paginatorE!: MatPaginator;
  @ViewChild(MatSort) sortE!: MatSort;
  @ViewChild(MatTable) tableE!: MatTable<any>;

  // Reservacion
  @ViewChild('paginatorR') paginatorR!: MatPaginator;
  @ViewChild(MatSort) sortR!: MatSort;
  @ViewChild(MatTable) tableR!: MatTable<any>;

  // Constancias
  @ViewChild('paginatorC') paginatorC!: MatPaginator;
  @ViewChild(MatSort) sortC!: MatSort;
  @ViewChild(MatTable) tableC!: MatTable<any>;

  // Constancias
  @ViewChild('paginatorSer') paginatorSer!: MatPaginator;
  @ViewChild(MatSort) sortSer!: MatSort;
  @ViewChild(MatTable) tableSer!: MatTable<any>;

  constructor(
    private axiosService: AxiosService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    try {
      this.route.params.subscribe((params) => {
        this.idClient = params['id'];
        this.getData();
      });
    } catch (error) {}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorS;
    this.dataSourceE.paginator = this.paginatorE;
    this.dataSourceC.paginator = this.paginatorC;
    this.dataSourceS.paginator = this.paginatorSer;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getData() {
    try {
      return this.axiosService
        .getApi(`client/tracking?idPet=${this.idClient}`)
        .subscribe(
          (response) => {
            // consulta
            this.elementData = response.consultas;
            this.dataSource = new MatTableDataSource<Consulta>(
              this.elementData
            );
            this.dataSource.paginator = this.paginatorS;
            this.table.renderRows();

            //examen
            this.elementDataE = response.examenes;
            this.dataSourceE = new MatTableDataSource<Examene>(
              this.elementDataE
            );
            this.dataSourceE.paginator = this.paginatorE;
            this.tableE.renderRows();

            this.elementDataR = response.reservaciones;
            this.dataSourceR = new MatTableDataSource<Reservacione>(
              this.elementDataR
            );
            this.dataSourceR.paginator = this.paginatorR;
            this.tableR.renderRows();

            this.elementDataC = response.constancias;
            this.dataSourceC = new MatTableDataSource<Constancia>(
              this.elementDataC
            );
            this.dataSourceC.paginator = this.paginatorR;
            this.tableC.renderRows();

            this.elementDataS = response.servicios;
            this.dataSourceS = new MatTableDataSource<Servicio>(
              this.elementDataS
            );
            this.dataSourceS.paginator = this.paginatorSer;
            this.tableSer.renderRows();
          },
          (error) => {
            console.error('Error fetching data:', error);
          }
        );
    } catch (error) {
      return [];
    }
  }

  public async getpdf() {
    window.open(`${this.axiosService.urlApiPdf}${this.idClient}`, "_blank");
  }
}
