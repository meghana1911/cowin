import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
//https://github.com/meghana1911/cowin.git
@Component({
  selector: 'app-find-center',
  templateUrl: './find-center.component.html',
  styleUrls: ['./find-center.component.scss']
})
export class FindCenterComponent implements OnInit {
  states = [] as any[];
  districts = [] as any[];
  pin: string = "600042";
  state: string = "";
  district: string = "";
  dates = [] as string[];
  selectedDate: string = "";
  tabIndex: number = 0;
  vaccineType = [] as string [];

  matches = [] as any[];
  filteredMatches = [] as any[];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.populateDate();
    this.findByPin();
    this.getStates();

    //-H "accept: application/json" -H "Accept-Language: hi_IN"
  }

  private populateDate() {
    const date = new Date();
    for (var i = 0; i < 5; i++) {
      var nextDate = new Date();
      nextDate.setDate(date.getDate() + i);
      let d = nextDate.getDate();
      let m = nextDate.getMonth() + 1;
      var str = (d > 9 ? '' : '0') + d + "-" + (m > 9 ? '' : '0') + m + "-" + nextDate.getFullYear();
      this.dates.push(str);
    }
    this.selectedDate = this.dates[0];
  }

  private findByPin() {
    this.http.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${this.pin}&date=${this.selectedDate}`).subscribe((result) => {
      let r = result as any;
      console.log(result);
      this.matches = r.sessions;
      this.filter();
    });
  }

  private findByDistrict() {
    this.http.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.district}&date=${this.selectedDate}`).subscribe((result) => {
      let r = result as any;
      console.log(result);
      this.matches = r.sessions;
      this.filter();
    });
  }

  pinChange($event: any) {
    this.findByPin();
  }

  private getStates() {
    this.http.get(`https://cdn-api.co-vin.in/api/v2/admin/location/states`).subscribe((result) => {
      let r = result as any;
      console.log(result);
      this.states = r.states;
      this.state = this.states[0].state_id;
      this.getDistricts();
    });

  }

  private getDistricts() {
    this.http.get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${this.state}`).subscribe((result) => {
      let r = result as any;
      console.log(result);
      this.districts = r.districts;
      this.district = this.districts[0].district_id;
    });
  }

  stateChanged() {
    this.getDistricts();
  }

  districtChanged() {
    this.findByDistrict();
  }

  dateChanged() {
    if (this.tabIndex == 0)
      this.findByPin();
    if (this.tabIndex == 1)
      this.findByDistrict();


  }

  vaccineTypeChanged() {
    console.log(this.vaccineType);
    this.filter();
  }

  filter() {
    this.filteredMatches = [];
    for (var m of this.matches) {
      var toAdd = true;
      if (m.vaccine) {
        if (this.vaccineType.length > 0 && this.vaccineType.indexOf(m.vaccine) == -1) {
          toAdd = false;
        }
      }
      if (toAdd) {
        this.filteredMatches.push(m);
      }
    }
  }
}
