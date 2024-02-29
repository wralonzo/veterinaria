import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import {
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { AxiosService } from '../shared/axios.service';
import { IUser } from './interface/user-interface';
import { ModalComponentUser } from './modal/modal.component';
import { ModalComponent } from '../client/modal/modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatPaginatorModule,
    MatSortModule,
    MatIcon,
    MatButtonModule,
    ModalComponent,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  elementData: IUser[] = [];
  displayedColumns: string[] = [
    'idUser',
    'name',
    'surname',
    'email',
    'mobile',
    'type',
    'apps',
    'rols',
    'user',
    'passwordGenerate',
  ];

  dataSource = new MatTableDataSource<IUser>(this.elementData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IUser>;

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
    const dialogRef = this.dialog.open(ModalComponentUser);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        result.apps = [];
        result.rols = [];
        this.elementData.splice(0, 0, result);
        this.dataSource = new MatTableDataSource<IUser>(this.elementData);
        this.dataSource.paginator = this.paginator;
        this.table.renderRows();
      }
    });
  }

  getData() {
    try {
      return this.axiosService.getApi('user/all').subscribe(
        (response) => {
          response.forEach(
            (element: { apps: any; rols: { key: string }[] }) => {
              element.rols = element.rols.map((item: { key: any }) => item.key);

              element.apps = element.apps.map(
                (item: { name: string }) => item.name
              );
            }
          );
          this.elementData = response;
          this.dataSource = new MatTableDataSource<IUser>(this.elementData);
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
