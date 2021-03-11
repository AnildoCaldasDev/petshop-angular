import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';
import { ToastrService } from 'ngx-toastr';
import { CustomValidator } from 'src/app/validators/custom.validator';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html'
})
export class SignupPageComponent implements OnInit {
  public form: FormGroup;
  public processing = false;

  constructor(private router: Router,
    private service: DataService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.form = this.fb.group({
      name: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(80),
        Validators.required
      ])],
      document: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])],
      email: ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(120),
        Validators.required,
        CustomValidator.EmailValidator
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  ngOnInit() {

  }

  submit() {
    this.processing = true;
    this.service
      .create(this.form.value)
      .subscribe(
        (data: any) => {
          this.processing = false;
          this.toastr.success(data.message, 'Bem-vindo!');
          this.router.navigate(['/login']);
        },
        (err) => {
          this.processing = false;
          this.toastr.error(err, 'Algo deu errado');
        }
      );
  }
}