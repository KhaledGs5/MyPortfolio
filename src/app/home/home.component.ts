import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  xpos: number = 50;
  ypos: number = 50;
  step: number = 0.3;
  greetinganime: boolean = false;
  keyState: { [key: string]: boolean } = {}; 
  scale: number = 1;
  fly: boolean = false;

  ngOnInit(): void {
    this.updatePosition();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.keyState[event.key] = true;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.keyState[event.key] = false;
  }

  updatePosition() {
    if (this.keyState['z']) {
      this.ypos = Math.max(this.ypos - this.step - 1, 0);
    }
    if (this.keyState['s']) {
      this.ypos = Math.min(this.ypos + this.step + 1, 100);
    }
    if (this.keyState['q']) {
      this.xpos = Math.max(this.xpos - this.step, 0);
      this.scale = 1;
    }
    if (this.keyState['d']) {
      this.xpos = Math.min(this.xpos + this.step, 100);
      this.scale = -1;
    }
    this.fly = this.keyState['z'] && (this.keyState['q'] || this.keyState['d']);
    this.greetinganime = ((this.keyState['q'] || this.keyState['d']) && !(this.fly));
    window.requestAnimationFrame(() => this.updatePosition());
  }
}
