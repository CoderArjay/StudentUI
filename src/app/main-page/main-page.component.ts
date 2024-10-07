import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
// import { Router,  } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  constructor(private router: Router) {}

  ngOnInit(): void {
     this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Logic when navigation ends
        const fragment = this.router.routerState.snapshot.root.fragment;
        if (fragment) {
          const element = document.getElementById(fragment);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
  }



}
