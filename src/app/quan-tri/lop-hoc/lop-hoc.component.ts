import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service.service';

@Component({
  selector: 'app-lop-hoc',
  templateUrl: './lop-hoc.component.html',
  styleUrls: ['./lop-hoc.component.css']
})
export class LopHocComponent implements OnInit {
  
  constructor(private apiService: ApiService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  classrooms : any
  isLoading: boolean = false;
  search: string

  params = {
    filter: '',
    offSet: 0,
    pageSize: 2,
    totalRecord: 0
  }


  ngOnInit(): void {
    this.getClassRooms();
  }

  getClassRooms() {
    this.isLoading = true
    this.apiService.getClassroom(this.params.offSet, this.params.pageSize, this.params.filter).subscribe((responseData) => {
      console.log("Tat ca lop hoc", responseData.data.data);
      this.classrooms = responseData.data.data;
      this.params = {
        ...this.params,
        totalRecord: responseData.data.recordsTotal
      }
      this.isLoading = false
    })
  }

  onDeleteClassroom(id: string) {
    this.apiService.deleteClassroom(id).subscribe((responseData) => {
      console.log(responseData);
      this.classrooms = this.classrooms.filter((classroom) => {
        return classroom.id != id
      })
    })
  }

  onSearch() {
    this.params = {
      ...this.params,
      filter: this.search
    }
    this.getClassRooms()
  }

  paginate(event) {
    //event.first = Index of the first record
    console.log('first', event.first);
    //event.rows = Number of rows to display in new page
    console.log('rows', event.rows);

    //event.page = Index of the new page
    console.log('page', event.page);

    //event.pageCount = Total number of pages
    console.log('pageCount', event.pageCount);
    this.params = {
      ...this.params,
      offSet: event.page * event.rows,
      pageSize: event.rows
    }
    console.log(this.params);
    
    this.getClassRooms();
  }

  confirmDeleteClassroom(id: string) {
    this.confirmationService.confirm({
      message: 'B???n ch???c ch???n mu???n x??a l???p h???c n??y',
      accept: () => {
        this.onDeleteClassroom(id)
      }
    })
  }

}
