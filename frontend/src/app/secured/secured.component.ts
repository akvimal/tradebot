import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  imports: [RouterModule],
  templateUrl: './secured.component.html'
})
export class SecuredComponent {

  time:string = '00:00:00';
  seconds:number = 0;
  minutes:number = 1;
  private audio = new Audio();;
  
  constructor(private authService: AuthService) {
    setInterval(() => this.getTime(), 1000);
    this.audio.src = 'assets/audio/ding-101492.mp3'; // Specify your audio file path
    this.audio.load();
  }

  playAudio() {
    // this.audio.play();
    console.log('Play audio');
    
  }

  pauseAudio() {
    this.audio.pause();
  }

  stopAudio() {
    this.audio.pause();
    this.audio.currentTime = 0; // Reset playback position
  }

  getTime() {
    const dt = new Date();
    // console.log(`${dt.getMinutes()} | ${dt.getSeconds()*dt.getMinutes()} : ${dt.getSeconds()*dt.getMinutes()%60}`);
    
    // if(this.minutes > 0 && dt.getMinutes()%this.minutes == this.minutes) this.playAudio();
    // if(this.seconds > 0 && dt.getSeconds()%this.seconds == 0) this.playAudio();
    
    this.time = dt.toLocaleTimeString();
  }

  logout() {
    this.authService.logout();
  }
}
