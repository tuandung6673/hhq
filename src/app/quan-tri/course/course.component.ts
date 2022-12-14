import { Course } from 'src/models/course.model';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/services/api.service.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  teacherName: string
  courses: Course[] = [];
  isLoading: boolean = false
  search: string
  params = {
    offSet: 0,
    pageSize: 5,
    filter : '',
    status: -1,
    isPayment: -1,
    teacherId : '',
    subjectId : '' ,
    accountId : '',
    classId : '',
    totalRecord: 0
  }

  constructor(private apiService: ApiService, private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.getCourses()
  }

  getCourses() {
    this.isLoading = true
    this.apiService.getCourse(this.params.teacherId, this.params.classId, this.params.offSet, this.params.pageSize, this.params.filter, this.params.status, this.params.isPayment, this.params.accountId, this.params.subjectId).subscribe((responseData) => {
      console.log(responseData.data.data);
      this.courses = responseData.data.data

      this.courses.map((course) => {
        course.teacherName = course.teachers.map((teacher) => {
          return teacher.fullName
        })
      })
      
      this.params = {
        ...this.params,
        totalRecord: responseData.data.recordsTotal
      }
      this.isLoading = false
    })
  }

  onSearch() {
    this.params = {
      ...this.params,
      filter: this.search
    }
    this.getCourses()
  }

  paginate(event) {
    this.params = {
      ...this.params,
      offSet: event.page * event.rows,
      pageSize: event.rows
    }
    this.getCourses();
  }

  onDeleteCourse(id: string) {
    this.apiService.deleteCourse(id).subscribe((responseData) => {
      this.courses = this.courses.filter(course => course.id != id)
      // console.log('Delete Course', responseData);
    })
  }

  confirmDeleteCourse(id: string) {
    this.confirmationService.confirm({
        message: 'B???n c?? mu???n x??a love n??y ?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.messageService.add({severity:'info', summary:'Confirmed', detail:'You have accepted'});
            this.onDeleteCourse(id)
        },
        reject: (type) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                break;
                default: 
                  return
            }
        }
    });
  }

}
