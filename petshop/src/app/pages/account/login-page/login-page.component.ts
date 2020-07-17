import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/validators/custom.validator';
import { Security } from 'src/app/utils/security.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent implements OnInit {

  public formLogin: FormGroup;
  public processing = false;

  constructor(private service: DataService,
    private fb: FormBuilder,
    private router: Router) {

    this.formLogin = this.fb.group({
      username: ['', Validators.compose([
        Validators.minLength(14),
        Validators.maxLength(14),
        Validators.required,
        CustomValidator.isCpf()
      ])],
      password: ['', Validators.compose([
        Validators.minLength(6),
        Validators.maxLength(20),
        Validators.required
      ])]
    });
  }

  ngOnInit() {
    const token = Security.getToken();
    if (token) {
      this.processing = true;
      this.service.refreshToken()
        .subscribe(
          (data: any) => {
            this.processing = false;
            this.setUser(data.customer, data.token);
          },
          (err) => {
            Security.clear();
            this.processing = false;
          }
        );
    }
  }

  submit() {
    this.processing = true;
    this.service.authenticate(this.formLogin.value)
      .subscribe(
        (data: any) => {
          this.processing = false;
          this.setUser(data.customer, data.token);
        },
        (err) => {
          console.log(err);
          this.processing = false;
        }
      );
  }

  setUser(user, token) {
    Security.set(user, token);
    this.router.navigate(['/']);
  }

}
