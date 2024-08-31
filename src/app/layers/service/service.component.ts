import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { AxiosService } from '../shared/axios.service';
import { SharedModule } from '../layer.module';
import { IPetService } from './interface/pet-service.interface';
import { ModalServiceComponent } from './modal/modal.component';
import { ModalPetServiceNewComponent } from './modal-pet-service/modal-update-pet.component';

@Component({
  selector: 'app-service',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './service.component.html',
  styleUrl: './service.component.css',
})
export class ServiceComponent {
  elementData: IPetService[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'pet',
    'user',
    'service',
    'datecreated',
    'actions',
  ];

  dataSource = new MatTableDataSource<IPetService>(this.elementData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IPetService>;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private axiosService: AxiosService
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
    const dialogRef = this.dialog.open(ModalServiceComponent);
    dialogRef.afterClosed().subscribe((result) => {});
  }

  getData() {
    try {
      return this.axiosService.getApi('service/pet').subscribe(
        (response) => {
          this.elementData = response;
          this.dataSource = new MatTableDataSource<IPetService>(
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

  openModalEdit(idClient: string) {
    const findClient = this.elementData.find((item) => item.id === +idClient);
    const dialogRef = this.dialog.open(ModalPetServiceNewComponent, {
      width: '400px',
      data: findClient,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const findIndex = this.elementData.findIndex(
          (item) => item.id === +idClient
        );
        if (result.delete || result) {
          this.elementData.splice(findIndex, 1);
          this.dataSource = new MatTableDataSource<IPetService>(
            this.elementData
          );
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        } else {
          this.elementData[findIndex] = result;
          this.dataSource = new MatTableDataSource<IPetService>(
            this.elementData
          );
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        }
      }
    });
  }
}
