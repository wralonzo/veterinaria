import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SharedModule } from '../../layer.module';
import { ActivatedRoute } from '@angular/router';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { AxiosService } from '../../shared/axios.service';
import { ModalUpdateClientComponent } from '../modal-update/modal-update.component';
import { IPet } from './interface/pet';
import { ModalPetComponent } from './modal/modal.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet-add',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './pet.component.html',
  styleUrl: './pet.component.css',
})
export class PetComponent implements AfterViewInit, OnInit {
  elementData: IPet[] = [];
  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'gender',
    'race',
    'actions',
  ];
  clienteName: string = '';
  idClient: number = 0;

  dataSource = new MatTableDataSource<IPet>(this.elementData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private dialog: MatDialog,
    private axiosService: AxiosService,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    try {
      this.route.params.subscribe((params) => {
        this.clienteName = params['clienteName'];
        this.idClient = params['id'];
        this.getData();
      });
    } catch (error) {}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  async delete(id: number) {
    try {
      const data: any = await this.axiosService.delete(`pet/${id}`, true);
      if (data) {
        this.openSnackBar('Se eliminó la mascota', 'Cerrar');
        return;
      }
      this.openSnackBar('No se eliminó la mascota', 'Cerrar');
      return;
    } catch (error) {
      this.openSnackBar('No se eliminó la mascota', 'Cerrar');
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  openModal(idClient: number) {
    let findPet = this.elementData.find((item) => +item.client === +idClient);
    if (!findPet) {
      findPet = {
        client: this.idClient,
        id: 1,
        name: '',
        age: 1,
        gender: '',
        race: '',
      };
    }
    const dialogRef = this.dialog.open(ModalPetComponent, { data: findPet });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.elementData.splice(0, 0, result);
        this.dataSource = new MatTableDataSource<IPet>(this.elementData);
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
          this.dataSource = new MatTableDataSource<IPet>(this.elementData);
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        } else {
          this.elementData[findIndex] = result;
          this.dataSource = new MatTableDataSource<IPet>(this.elementData);
          this.dataSource.paginator = this.paginator;
          this.table.renderRows();
        }
      }
    });
  }

  getData() {
    try {
      return this.axiosService.getApi(`pet/client/${this.idClient}`).subscribe(
        (response) => {
          this.elementData = response;
          this.dataSource = new MatTableDataSource<IPet>(this.elementData);
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
