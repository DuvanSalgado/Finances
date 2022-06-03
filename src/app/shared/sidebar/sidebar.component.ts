import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {

  public appPages = [
    { title: 'Credito', url: 'credit', icon: 'mail' },
    { title: 'Km/moto', url: 'moto', icon: 'paper-plane' }
  ];

  constructor(
    private afAuth: Auth
    ) { }

  public  signOut(): void {
    this.afAuth.signOut();
    localStorage.removeItem('userInfo');
  }
}
