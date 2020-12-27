import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  constructor(private route:ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe( (params:Params) => {
      let routeState:string|null = params.state;
      if (!routeState) {
        alert("no state");
        return;//We also need to display an error, probably. Later though. Somebody tried to MITM
      }
      if (routeState != localStorage.getItem("state")) {
        alert("state mismatch");
        return;//We also need to display an error, probably. Later though. Somebody tried to MITM
      }
      let token:string|null = params.code;
      if (token) {
        localStorage.setItem("token",token);
        window.location.href="/";
      }
    });
  }

}
