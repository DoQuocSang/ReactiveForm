import { Component } from '@angular/core';

import { errorTailorImports } from '@ngneat/error-tailor';

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [errorTailorImports],
  templateUrl: './error.component.html',
})
export class ErrorComponent {}
