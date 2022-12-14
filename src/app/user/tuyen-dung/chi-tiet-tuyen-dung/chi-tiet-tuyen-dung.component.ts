import { ActivatedRoute, Params } from '@angular/router';
import { ApiService } from './../../../../services/api.service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { Recruit } from 'src/models/recruit.model';
import { EmailValidator } from '@angular/forms';
import { RecruitCandidate } from 'src/models/recruitCandidate.model';

@Component({
  selector: 'app-chi-tiet-tuyen-dung',
  templateUrl: './chi-tiet-tuyen-dung.component.html',
  styleUrls: ['./chi-tiet-tuyen-dung.component.css']
})
export class ChiTietTuyenDungComponent implements OnInit {

  recruitCandidate : RecruitCandidate = new RecruitCandidate()
  name: string
  email: string
  phone: string
  note: string

  id: string
  isDisplayDialog: boolean = false
  detailRecruit : Recruit = new Recruit()



  constructor(private spinner: NgxSpinnerService, private apiService: ApiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = params['id']
      this.getDetailRecruit()
    })
  }

  getDetailRecruit() {
    this.spinner.show()
    this.apiService.getRecruitById(this.id).subscribe((responseData) => {
      this.detailRecruit = responseData.data
      this.spinner.hide()
    })
  }

  onDisplayDialog() {
    this.isDisplayDialog = true
  }

  convertPhoneToString(phoneNumber: string) {
    return "0" + phoneNumber
  }

  onSubmit() {
    const data = {...this.recruitCandidate}
    
    data.recruitId = this.id,
    data.content = this.note,
    data.email = this.email,
    data.name = this.name,
    data.phone = this.convertPhoneToString(this.phone)
    
    console.log('Save', data);
    
    this.apiService.postRecruitCandidate(data).subscribe((response) => {
      console.log(response.message);
      this.isDisplayDialog = false
    })
  }
}
