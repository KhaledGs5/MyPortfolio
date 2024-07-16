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
  walk: boolean = false;
  keyState: { [key: string]: boolean } = {}; 
  scale: number = 1;
  fly: boolean = false;
  flynflame : boolean = false;
  sprite: string = 'Idle.png';
  characterWidth: number = 300; 
  characterHeight: number = 300; 
  size : number = 88;
  flyTimeout : any;

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

    if (this.keyState['z'] && (this.keyState['q'] || this.keyState['d'])) {
      this.fly = true; 
      this.flyTimeout = setTimeout(() => {
        this.fly = false; 
        this.flynflame = true;
      }, 200); 
    }else{
      clearTimeout(this.flyTimeout); 
      this.fly = false; 
      this.flynflame = false;
    }
    this.walk = !this.fly && (this.keyState['q'] || this.keyState['d']);
    console.log(this.flynflame)
    window.requestAnimationFrame(() => this.updatePosition());
  }

  getAnimationClass() {
    if (this.flynflame) {
      this.sprite = 'Fly&FlameSeq.png';
      this.size = 1440;
      return 'FlynFlameAnimation';
    }else if(this.fly){
      this.sprite = 'FlySeq.png';
      this.size = 900;
      return 'FlyAnimation';
    } else if (this.walk) {
      this.sprite = 'WalkSeq.png';
      this.size = 4000;
      return 'WalkAnimation';
    } else {
      this.sprite = 'Idle.png';
      this.size = 88;
      return '';
    }
  }
}
