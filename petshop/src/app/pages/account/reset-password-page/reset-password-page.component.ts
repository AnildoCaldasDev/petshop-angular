import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-reset-password-page',
  templateUrl: './reset-password-page.component.html'
})
export class ResetPasswordPageComponent implements OnInit {

  public form: FormGroup;
  public processing = false;
  constructor(
    private router: Router,
    private service: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      document: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])]
    });

  }

  ngOnInit() { }

  submit() {
    this.processing = true;
    this.service
      .resetPassword(this.form.value)
      .subscribe(
        (data: any) => {
          this.processing = false;
          this.toastr.success(data.message, 'Senha Restaurada');
          this.router.navigate(['/login']);
        },
        (err) => {
          this.processing = false;
          this.toastr.error(err, 'Algo deu errado');
        }
      );
  }

}