import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete,
} from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { Observable, of } from "rxjs";
import {
  map,
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent {
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  issueCtrl = new FormControl();
  deviceTypesVal = "";
  filteredIssues: Observable<string[]>;
  issues: string[] = [];
  allIssues: string[] = ["Apple", "Lemon", "Lime", "Orange", "Strawberry"];

  @ViewChild("issueInput", { static: false }) issueInput: ElementRef<
    HTMLInputElement
  >;
  @ViewChild("auto", { static: false }) matAutocomplete: MatAutocomplete;

  constructor(private fb: FormBuilder) {
    this.filteredIssues = this.issueCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) =>
        fruit ? this._filter(fruit) : this.allIssues.slice()
      )
    );
  }

  deviceTypesValChange(val) {
    if(val && val.length >=3) this.fetchIssueTypes();
    else this.issues = [];
  }

  fetchIssueTypes(){
    this.issues = this.allIssues.slice()
  }

  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || "").trim()) {
        this.issues.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = "";
      }

      this.issueCtrl.setValue(null);
    }
  }

  remove(fruit: string): void {
    const index = this.issues.indexOf(fruit);

    if (index >= 0) {
      this.issues.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.issues.push(event.option.viewValue);
    this.issueInput.nativeElement.value = "";
    this.issueCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allIssues.filter(
      (fruit) => fruit.toLowerCase().indexOf(filterValue) === 0
    );
  }
}
