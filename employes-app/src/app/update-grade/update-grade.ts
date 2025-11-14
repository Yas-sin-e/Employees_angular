import { Component, EventEmitter, Input, input, OnInit, Output, output } from '@angular/core';
import { Grade } from '../model/Grade.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-grade',
  imports: [FormsModule],
  templateUrl: './update-grade.html',
  styles: ``
})
export class UpdateGrade implements OnInit  {
  @Input()
  grade !: Grade
  @Output()
  gradeUpdated = new EventEmitter<Grade>();
  @Input()
  ajout!:boolean;
  constructor() {}
  ngOnInit(): void {
    console.log(this.grade);
  }
  saveGrade(){
    this.gradeUpdated.emit(this.grade);
  }

}
