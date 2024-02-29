import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ModalComponent } from './modal/modal.component';
import { AxiosService } from '../shared/axios.service';
import { IClient } from './interface/cliente-interface';
import { SharedModule } from '../layer.module';
import { ModalUpdateClientComponent } from './modal-update/modal-update.component';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements AfterViewInit, OnInit {
  elementData: IClient[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'surname',
    'email',
    'mobile',
    'address',
    'user',
    'passwordGenerate',
    'actions',
  ];

  dataSource = new MatTableDataSource<IClient>(this.elementData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

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
    const dialogRef = this.dialog.open(ModalComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.elementData.splice(0, 0, result);
        this.dataSource = new MatTableDataSource<IClient>(this.elementData);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
    });
  }

  openModalEdit(idClient: string) {
    const findClient = this.elementData.find((item) => item.id === +idClient);
    const dialogRef = this.dialog.open(ModalUpdateClientComponent, {
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
          this.dataSource = new MatTableDataSource<IClient>(this.elementData);
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        } else {
          this.elementData[findIndex] = result;
          this.dataSource = new MatTableDataSource<IClient>(this.elementData);
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        }
      }
    });
  }

  getData() {
    try {
      return this.axiosService.getApi('client').subscribe(
        (response) => {
          this.elementData = response;
          this.dataSource = new MatTableDataSource<IClient>(this.elementData);
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
