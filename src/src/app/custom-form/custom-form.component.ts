import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './custom-form.component.html',
})
export class CustomFormComponent {
  name = new FormControl('');
}
