import { Component, ViewChild } from '@angular/core';
import { IReservation } from './interface/reservation.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AxiosService } from '../shared/axios.service';
import { ModalReservationComponent } from './modal/modal.component';
import { ModalUpdateReservationComponent } from './modal-update/modal-update.component';
import { SharedModule } from '../layer.module';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
})
export class ReservationComponent {
  elementData: IReservation[] = [];
  displayedColumns: string[] = [
    'inicio',
    'fin',
    'fecha',
    'comentario',
    'estado',
    'pet',
    'dateCreated',
    'actions',
  ];

  dataSource = new MatTableDataSource<IReservation>(this.elementData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private axiosService: AxiosService,
    private router: Router
  ) {}

  ngOnInit() {
    try {
      this.getData();
    } catch (error) {}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openModal() {
    const dialogRef = this.dialog.open(ModalReservationComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.elementData.splice(0, 0, result);
        this.dataSource = new MatTableDataSource<IReservation>(
          this.elementData
        );
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
    });
  }

  openModalEdit(idClient: string) {
    const findClient = this.elementData.find((item) => item.id === +idClient);
    const dialogRef = this.dialog.open(ModalUpdateReservationComponent, {
      width: '400px',
      data: findClient,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const findIndex = this.elementData.findIndex(
          (item) => item.id === +idClient
        );
        if (result.delete) {
          this.elementData.splice(findIndex, 1);
          this.dataSource = new MatTableDataSource<IReservation>(
            this.elementData
          );
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        } else {
          this.elementData[findIndex] = result;
          this.dataSource = new MatTableDataSource<IReservation>(
            this.elementData
          );
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        }
      }
    });
  }

  getData() {
    try {
      return this.axiosService.getApi('reservation').subscribe(
        (response) => {
          this.elementData = response;
          this.dataSource = new MatTableDataSource<IReservation>(
            this.elementData
          );
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
    } catch (error) {
      return [];
    }
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
