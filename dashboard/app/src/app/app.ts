import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ServicesGrid } from './services-grid/services-grid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ServicesGrid],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
