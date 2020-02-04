import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BrowserStack } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private snackBar: MatSnackBar) { }


  private selectedRandomFrequency: string;
  private selectedEndDateOption: string;
  private selectedStartsFromDate = new Date();
  private selectedEndsByDate = new Date();
  private selectedEndsAfterOccurence = 10;
  private selectedWeeklyOffDays: string[] = [];
  private selectedWeeklyFrequencyDays: string[] = [];
  private selectedMonthlyFrequencyMonths: string[] = [];
  private resultantDueDates: string[] = [];
  private validationErrors: boolean;

  private dueDateFrequency = {
    daily: false,
    weekly: false,
    monthly: false,
    random: false
  };


  private weeklyOffDays = [
    { name: 'Mon', selected: false },
    { name: 'Tue', selected: false },
    { name: 'Wed', selected: false },
    { name: 'Thu', selected: false },
    { name: 'Fri', selected: false },
    { name: 'Sat', selected: true },
    { name: 'Sun', selected: true }
  ];

  private weeklyFrequencyDays = [
    { name: 'Mon', selected: false },
    { name: 'Tue', selected: false },
    { name: 'Wed', selected: false },
    { name: 'Thu', selected: false },
    { name: 'Fri', selected: false },
    { name: 'Sat', selected: false },
    { name: 'Sun', selected: false }
  ];

  private monthlyFrequencyMonths = [
    { name: 'Jan', selected: false },
    { name: 'Feb', selected: false },
    { name: 'Mar', selected: false },
    { name: 'Apr', selected: false },
    { name: 'May', selected: false },
    { name: 'Jun', selected: false },
    { name: 'Jul', selected: false },
    { name: 'Aug', selected: false },
    { name: 'Sep', selected: false },
    { name: 'Oct', selected: false },
    { name: 'Nov', selected: false },
    { name: 'Dec', selected: false }
  ];

  private listOfDays = [   // Required for mapping Date().getDay() function with names. Note 0 -> Sunday
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
  ];

  private listOfMonths = [  // Required for mapping Date().getMonth() function with names. Note 0 -> January
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];




  private clickedDailyFrequency() {
    this.dueDateFrequency.daily = !this.dueDateFrequency.daily;
    this.dueDateFrequency.weekly = false;
    this.dueDateFrequency.monthly = false;
    this.dueDateFrequency.random = false;
  }
  private clickedWeeklyFrequency() {
    this.dueDateFrequency.daily = false;
    this.dueDateFrequency.weekly = !this.dueDateFrequency.weekly;
    this.dueDateFrequency.monthly = false;
    this.dueDateFrequency.random = false;
  }
  private clickedMonthlyFrequency() {
    this.dueDateFrequency.daily = false;
    this.dueDateFrequency.weekly = false;
    this.dueDateFrequency.monthly = !this.dueDateFrequency.monthly;
    this.dueDateFrequency.random = false;
  }
  private clickedRandomFrequency() {
    this.dueDateFrequency.daily = false;
    this.dueDateFrequency.weekly = false;
    this.dueDateFrequency.monthly = false;
    this.dueDateFrequency.random = !this.dueDateFrequency.random;
  }

  private fetchWeeklyOffDays() {
    this.selectedWeeklyOffDays = [];
    this.weeklyOffDays.forEach(day => {
      if (day.selected) {
        this.selectedWeeklyOffDays.push(day.name);
      }
    });
    if (this.selectedWeeklyOffDays.length > 2) {
      this.openSnackBar('You can select only a maximum of 2 Weekly Off Days.');
      this.validationErrors = true;
    }
  }

  private validateFields() {
    this.validationErrors = false;
    this.resultantDueDates = [];
    this.fetchWeeklyOffDays();
    this.validateEndsAfterOccurance();
    this.validateEndsByDate();
  }

  private generateDailyDueDates() {
    this.validateFields();

    if (!this.validationErrors) {
      if (this.selectedEndDateOption === 'endsBy') {

        let dueDate = new Date(this.selectedStartsFromDate);

        while (dueDate <= this.selectedEndsByDate) {
          if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
            this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1]) {
            this.resultantDueDates.push(dueDate.toDateString());
          }
          dueDate.setDate(dueDate.getDate() + 1);
        }

      } else if (this.selectedEndDateOption === 'endsAfter') {

        let dueDate = new Date(this.selectedStartsFromDate);
        let counter = 1;

        while (counter <= this.selectedEndsAfterOccurence) {
          if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
            this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1]) {
            this.resultantDueDates.push(dueDate.toDateString());
            counter++;
          }
          dueDate.setDate(dueDate.getDate() + 1);
        }
      }
    }
  }

  private fetchWeeklyFrequencyDays() {
    this.selectedWeeklyFrequencyDays = [];
    this.weeklyFrequencyDays.forEach(day => {
      if (day.selected) {
        if (this.selectedWeeklyOffDays.includes(day.name)) {
          this.openSnackBar(`${day.name} is Weekly Off, so ignoring ${day.name}`);
        } else {
          this.selectedWeeklyFrequencyDays.push(day.name);
        }
      }
    });
  }

  private generateWeeklyDueDates() {
    this.validateFields();
    this.fetchWeeklyFrequencyDays();

    if (!this.validationErrors) {
      if (this.selectedEndDateOption === 'endsBy') {

        let dueDate = new Date(this.selectedStartsFromDate);

        while (dueDate <= this.selectedEndsByDate) {
          this.selectedWeeklyFrequencyDays.forEach(day => {
            if (this.listOfDays[dueDate.getDay()] === day) {
              this.resultantDueDates.push(dueDate.toDateString());
            }
          });
          dueDate.setDate(dueDate.getDate() + 1);
        }

      } else if (this.selectedEndDateOption === 'endsAfter') {

        let dueDate = new Date(this.selectedStartsFromDate);
        let counter = 1;

        while (counter <= this.selectedEndsAfterOccurence) {
          this.selectedWeeklyFrequencyDays.forEach(day => {
            if (this.listOfDays[dueDate.getDay()] === day) {
              this.resultantDueDates.push(dueDate.toDateString());
              counter++;
            }
          });
          dueDate.setDate(dueDate.getDate() + 1);
        }
      }
    }
  }

  private fetchMonthlyFrequencyMonths() {
    this.selectedMonthlyFrequencyMonths = [];
    this.monthlyFrequencyMonths.forEach(month => {
      if (month.selected) {
        this.selectedMonthlyFrequencyMonths.push(month.name);
      }
    });
  }

  private generateMonthlyDueDates() {
    this.validateFields();
    this.fetchMonthlyFrequencyMonths();

    if (!this.validationErrors) {
      if (this.selectedEndDateOption === 'endsBy') {

        let dueDate = new Date(this.selectedStartsFromDate);
        let dateInDD = dueDate.getDate();

        while (dueDate <= this.selectedEndsByDate) {
          this.selectedMonthlyFrequencyMonths.forEach(month => {
            if (this.listOfMonths[dueDate.getMonth()] === month && dueDate.getDate() === dateInDD) {
              if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
                this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1]) {
                this.resultantDueDates.push(dueDate.toDateString());
              }
            }
          });
          dueDate.setDate(dueDate.getDate() + 1);
        }

      } else if (this.selectedEndDateOption === 'endsAfter') {

        let dueDate = new Date(this.selectedStartsFromDate);
        let dateInDD = dueDate.getDate();
        let counter = 1;

        while (counter <= this.selectedEndsAfterOccurence) {
          this.selectedMonthlyFrequencyMonths.forEach(month => {
            if (this.listOfMonths[dueDate.getMonth()] === month && dueDate.getDate() === dateInDD) {
              if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
                this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1]) {
                this.resultantDueDates.push(dueDate.toDateString());
                counter++;
              }
            }
          });
          dueDate.setDate(dueDate.getDate() + 1);
        }
      }
    }
  }

  private generateRandomDueDates() {
    this.validateFields();

    if (!this.validationErrors) {
      if (this.selectedRandomFrequency === 'weekly') {

        let counter = 1;

        while (counter <= 2) {
          let dueDate = new Date(this.selectedStartsFromDate);
          let randomNumber = Math.floor(Math.random() * 7);
          dueDate.setDate(dueDate.getDate() + randomNumber);

          if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
            this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1] &&
            this.resultantDueDates[0] !== dueDate.toDateString()) {
            this.resultantDueDates.push(dueDate.toDateString());
            counter++;
          }
        }

      } else if (this.selectedRandomFrequency === 'monthly') {

        let counter = 1;
        let dueDateMonth = this.selectedStartsFromDate.getMonth() + 1;
        let dueDateYear = this.selectedStartsFromDate.getFullYear();
        let totalDaysInDueDateMonth = new Date(dueDateYear, dueDateMonth, 0).getDate();

        while (counter <= 6) {
          let dueDate = new Date(dueDateYear, dueDateMonth - 1, 1);
          let randomNumber = Math.floor(Math.random() * totalDaysInDueDateMonth);
          dueDate.setDate(dueDate.getDate() + randomNumber);

          if (this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[0] &&
            this.listOfDays[dueDate.getDay()] !== this.selectedWeeklyOffDays[1] &&
            this.resultantDueDates[0] !== dueDate.toDateString()) {
            this.resultantDueDates.push(dueDate.toDateString());
            counter++;
          }
        }
      }
    }
  }

  private validateEndsAfterOccurance() {
    if((this.selectedEndsAfterOccurence < 1 || !Number.isInteger(this.selectedEndsAfterOccurence)) 
      && this.selectedEndDateOption === 'endsAfter') {
      this.validationErrors = true;
      this.openSnackBar('Ends After should be a positive non-zero numeric value');
    }
  }

  private validateEndsByDate() {
    if (this.selectedEndsByDate < this.selectedStartsFromDate && this.selectedEndDateOption === 'endsBy') {
      this.validationErrors = true;
      this.openSnackBar('Ends By Date should be On or After Starts From Date');
    }
  }

  private openSnackBar(message) {
    this.snackBar.open(message, '', {
      duration: 3500,
    });
  }


}
