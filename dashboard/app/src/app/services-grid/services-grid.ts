import { Component, OnInit, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';

export interface Service {
  name: string;
  status: 'running' | 'stopped' | 'error' | 'current';
  url?: string | null;
}

const MOCK_SERVICES: Service[] = [
  { name: 'gitlab',    status: 'running', url: 'gitlab.home.arpa' },
  { name: 'navidrome', status: 'running', url: 'navidrome.home.arpa' },
  { name: 'nextcloud', status: 'running', url: 'nextcloud.home.arpa' },
  { name: 'nginx',     status: 'running', url: null },
  { name: 'ytdlp',    status: 'stopped', url: null },
  { name: 'atlas',     status: 'current', url: null },
];

@Component({
  selector: 'app-services-grid',
  imports: [NgClass],
  templateUrl: './services-grid.html',
  styleUrl: './services-grid.css',
})
export class ServicesGrid implements OnInit {
  private http = inject(HttpClient);
  services = signal<Service[]>(MOCK_SERVICES);
  loading = signal(false);
  hasError = signal(false);

  ngOnInit() {
    // this.http.get<Service[]>('/api/services').subscribe({
    //   next: data => {
    //     this.services.set(data);
    //     this.loading.set(false);
    //   },
    //   error: () => {
    //     this.hasError.set(true);
    //     this.loading.set(false);
    //   },
    // });
  }
}
