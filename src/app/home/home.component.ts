import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  fly: boolean = false;
  flynflame: boolean = false;
  seeinfo: boolean = false;
  afterseeinfo: boolean = false;
  walk: boolean = false;
  greet: boolean = true;
  welcMessage: boolean = false;
  controlMessage: boolean = false;
  seeInfoMessage: boolean = false;
  showEmail: boolean = false;
  isGrounded: boolean = true;
  inSkillsPlanet: boolean = false;
  inEductPlanet: boolean = false;
  inExpPlanet : boolean = false;
  inPlanet: boolean = false;
  isFloating: boolean = false;
  discoverSkillsPlanet: boolean = false;
  discoverEductPlanet: boolean = false;
  discoverExpPlanet: boolean = false;

  xpos: number = 45;
  ypos: number = 1760;
  step: number = 5;
  scale: number = -1;
  rotangle: number = 0;
  MessageWidth: number = 0;
  InfoWidth: number = 0;
  InfoHeight: number = 0;
  WelcomingMessageDelay: number = 2000;
  ControlMessageDelay: number = 3000;
  SeeInfoMessageDelay: number = 2500;
  InfoIndex: number = 0;
  Xoffset: number = 0;
  Gravity: number = 6;


  keyState: { [key: string]: boolean } = {}; 

  sprite: string = 'Idle.png';
  messageimg: string = 'WelcomingMessage.png';
  infoselected: string = 'Linkedin';
  planetname: string = 'Skills';

  infolist: string[] = ['Linkedin', 'Facebook', 'CodeForces', 'Github', 'Gmail'];

  MissionEndTime: number = 0; 

  flyTimeout: any; 

  MySkills = [
    { name: 'React', image: '../../assets/React.png' },
    { name: 'Django', image: '../../assets/Django.png' },
    { name: 'Angular', image: '../../assets/Angular.png' },
    { name: 'Python', image: '../../assets/Python.png' },
  ];

  MyEducation = [
    { name: 'ENSI', image: '../../assets/ENSI.png'},
    { name: 'IPEIS', image: '../../assets/IPEIS.png'},
  ];

  MyExperience = [
    { name: 'TELNET', image: '../../assets/TELNET.png', desc: 'Summer Internship June-July 2024'},
    { name: 'Primatec', image: '../../assets/Primatec.png', desc: 'Summer Internship July-August 2024'},
    { name: 'ENSI', image: '../../assets/ENSICristal.png', desc: 'Summer Internship At Cristal Laboratory July-August 2023'},
  ];
  calculatePosition(angle: number, radius: number, centerX: number, centerY: number, index: number) {
    const angleInRadians = (index*angle * Math.PI) / 180; 
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    return { x, y };
  }

  character!: HTMLElement;
  ground!: HTMLElement;
  ground1!: HTMLElement;
  ground2!: HTMLElement;
  skills!: HTMLElement;
  education!: HTMLElement;
  experience!: HTMLElement;

  ngOnInit(): void {
    this.greet = true; 
    this.MissionEndTime = performance.now() + 990; 
    this.updatePosition();
    this.getAnimationClass();

    this.character = document.querySelector('#Character') as HTMLElement;
    this.ground = document.querySelector('.Ground') as HTMLElement;
    this.ground1 = document.querySelector('#Grd1') as HTMLElement;
    this.ground2 = document.querySelector('#Grd2') as HTMLElement;
    this.skills = document.querySelector('#Skills') as HTMLElement;
    this.education = document.querySelector('#Education') as HTMLElement;
    this.experience = document.querySelector('#Experience') as HTMLElement;

    setInterval(() => this.checkCollision(), 50);
  }

  isColliding(elem1: HTMLElement, elem2: HTMLElement): boolean {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    return !(rect1.right-100 < rect2.left+50 || 
             rect1.left+100 > rect2.right-50 || 
             rect1.bottom-50 < rect2.top+50 || 
             rect1.top+50 > rect2.bottom-50);
  }

  checkCollision() {
    if (this.isColliding(this.character, this.skills) || this.isColliding(this.character, this.education) || this.isColliding(this.character, this.experience)) {
      this.Gravity = 0;
      this.isGrounded = true;
      this.isFloating = true;
      if(this.isColliding(this.character, this.skills)){
        this.skills.innerHTML = 'Click Enter <br>To See My Skills';
        this.planetname = 'Skills';
        this.inSkillsPlanet = true;
        if(this.discoverSkillsPlanet){
            this.skills.innerHTML = 'Click Enter To<br> Hide';
        }
      }else if(this.isColliding(this.character, this.education)){
        this.education.innerHTML = 'Click Enter <br> to see the <br>universities <br>attended';
        this.planetname = 'Education';
        this.inEductPlanet = true;
        if(this.discoverEductPlanet){
            this.education.innerHTML = 'Click Enter <br>To Hide';
        }
      }else if(this.isColliding(this.character, this.experience)){
        this.experience.innerHTML = 'Click Enter <br> to see <br>My Experience ';
        this.planetname = 'Experience';
        this.inExpPlanet = true;
        if(this.discoverExpPlanet){
            this.experience.innerHTML = 'Click Enter <br>To Hide';
        }
      }
    }else if ((this.isColliding(this.character, this.ground)) || (this.isColliding(this.character, this.ground1)) || (this.isColliding(this.character, this.ground2))) {
        this.isGrounded = true;
        this.Xoffset = 0;
    }else{
        this.isGrounded = false;
        this.inEductPlanet = false;
        this.inExpPlanet = false;
        this.inSkillsPlanet = false;
        this.isFloating = false;
        this.Gravity = 6;
        this.Xoffset = 3;
        this.skills.textContent = 'Skills';
        this.education.textContent = 'Education';
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.keyState[event.key] = true;
    if (event.key === 'ArrowDown') {
        this.InfoIndex++;
        if (this.InfoIndex > 4){
            this.InfoIndex = 0;
        }
        this.infoselected = this.infolist[this.InfoIndex];
    }

    if (event.key === 'ArrowUp') {
        this.InfoIndex--;
        if (this.InfoIndex < 0){
            this.InfoIndex = 4
        }
        this.infoselected = this.infolist[this.InfoIndex];
    }
    let GmailElement: HTMLElement | null = null;
    this.showEmail = false;
    if (this.infoselected === 'Gmail') {
        GmailElement = document.querySelector('div[id="Gmail"]');
    }
    if (GmailElement) {
        this.showEmail = true;
        setTimeout(() => {
            GmailElement.textContent = 'khaled.gassara@ensi-uma.tn'
        }, 5000);
    }
    if (event.key === 'Enter' && this.seeinfo) {
        this.seeinfo = false;
        this.selectLink();
        if (this.infoselected === 'Gmail'){
            if(GmailElement){
                navigator.clipboard.writeText(GmailElement.textContent || GmailElement.innerHTML);
                GmailElement.textContent = 'Gmail Copied to clipboard.';
            }
        }
    }
    this.inPlanet = this.inSkillsPlanet || this.inEductPlanet || this.inExpPlanet;
    if (this.keyState['Enter']){
        if(this.inSkillsPlanet){
            this.discoverSkillsPlanet =!this.discoverSkillsPlanet;
        }else if (this.inEductPlanet){
            this.discoverEductPlanet =!this.discoverEductPlanet;
        }else if (this.inExpPlanet){
            this.discoverExpPlanet =!this.discoverExpPlanet;
        }
    }else if(!this.inPlanet){
        this.discoverSkillsPlanet = false;
        this.discoverEductPlanet = false;
        this.discoverExpPlanet = false;
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.keyState[event.key] = false;
  }

  selectLink() {
    let linkElement: HTMLElement | null = null;

    if (this.infoselected === 'Linkedin') {
        linkElement = document.querySelector('a[href="https://www.linkedin.com/in/khaled-gassara/"]');
    } else if (this.infoselected === 'Facebook') {
        linkElement = document.querySelector('a[href="https://www.facebook.com/khaledgassara55"]');
    } else if (this.infoselected === 'CodeForces') {
        linkElement = document.querySelector('a[href="https://codeforces.com/profile/KhaledGs"]');
    } else if (this.infoselected === 'Github') {
        linkElement = document.querySelector('a[href="https://github.com/KhaledGs5"]');
    }

    if (linkElement) {
        linkElement.click();
    }
}

  updatePosition() {
    const now = performance.now();
    
    if (this.greet && now >= this.MissionEndTime) {
        this.greet = false;
        this.welcMessage = true;
        this.MessageWidth = 300;
        this.messageimg = 'WelcomingMessage.png';
        this.MissionEndTime = now + this.WelcomingMessageDelay;
    }

    if (this.welcMessage && now >= this.MissionEndTime) {
        this.MessageWidth = 0;
        if(now >= this.MissionEndTime + 500){
            this.welcMessage = false;
            this.MessageWidth = 300;
            this.controlMessage = true;
            this.messageimg = 'ControlMessage.png';
            this.MissionEndTime = now + this.ControlMessageDelay;
        }
    }

    if(this.controlMessage && now >= this.MissionEndTime) {
        this.MessageWidth = 0;
        if(now >= this.MissionEndTime + 500){
            this.controlMessage = false;
            this.MessageWidth = 300;
            this.seeInfoMessage = true;
            this.messageimg = 'SeeInfoMessage.png';
            this.MissionEndTime = now + this.SeeInfoMessageDelay;
        }
    }

    if (this.seeInfoMessage && now >= this.MissionEndTime) {
        this.MessageWidth = 0;
        this.seeInfoMessage = false;
    }

    if(!this.isGrounded && this.ypos < 1760 && !this.keyState['z']){
        this.ypos += this.Gravity;
    }

    if (this.keyState['z']) {
        this.ypos = Math.max(this.ypos - this.step - 2, 0);
    }
    if (this.keyState['s']) {
        this.ypos = Math.min(this.ypos + this.step + 2, 1760);
    }
    if (this.keyState['q']) {
        this.xpos = Math.max(this.xpos - this.step - this.Xoffset, 0);
        this.scale = 1;
    }
    if (this.keyState['d']) {
        this.xpos = Math.min(this.xpos + this.step + this.Xoffset, 2800);
        this.scale = -1;
    }

    if (this.keyState['f']) {
        this.seeinfo = true;
        this.InfoWidth = 50;
        this.InfoHeight = 50;
        if (this.xpos > 2340) {
            this.scale = 1;
        }else if (this.xpos < 600) {
            this.scale = -1;
        }
    } else {
        if(this.seeinfo){
            this.afterseeinfo = true;
            this.seeinfo = false;
            setTimeout(() => {
                this.afterseeinfo = false;
            }, 150); 
        }
        this.InfoWidth = 0;
        this.InfoHeight = 0;
    }


    if (this.keyState['z']) {
        if((this.keyState['q'] || this.keyState['d'])){
            this.rotangle = 25;
        }else{
            this.rotangle = 0;
        }
        this.fly = true; 
        this.flyTimeout = setTimeout(() => {
            this.fly = false; 
            this.flynflame = true;
        }, 200); 
    } else {
        this.rotangle = 0;
        clearTimeout(this.flyTimeout); 
        this.fly = false; 
        this.flynflame = false;
    }


    this.walk = !this.fly && (this.keyState['q'] || this.keyState['d']) && this.isGrounded;
    
    window.requestAnimationFrame(() => {
        this.updatePosition();
        this.updateScreenPosition();
    });
  }

  updateScreenPosition() {
    this.smoothScrollTo(this.xpos - window.innerWidth / 2 + 150, 
                this.ypos - window.innerHeight / 2 + 150);
  }

  smoothScrollTo(TargetX: number, TargetY: number) {
    const currentX = window.scrollX;
    const currentY = window.scrollY;
    const duration = 130;
    const startTime = performance.now();

    const maxScrollX = 1500;
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;


    const finalTargetX = Math.min(TargetX, maxScrollX);
    const finalTargetY = Math.min(TargetY, maxScrollY);

    function scrollStep(timestamp: number) {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easeProgress = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(
            currentX + easeProgress * (finalTargetX - currentX),
            currentY + easeProgress * (finalTargetY - currentY)
        );

        if (progress < 1) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}

  

  getAnimationClass() {
    if (this.flynflame) {
        this.sprite = 'Fly&FlameSeq.png';
        return 'FlynFlameAnimation';
    } else if (this.fly) {
        this.sprite = 'FlySeq.png';
        return 'FlyAnimation';
    } else if (this.walk) {
        this.sprite = 'WalkSeq.png';
        return 'WalkAnimation';
    } else if (this.greet) {
        this.sprite = 'GreetingSeq.png';
        return 'GreetingAnimation';
    } else if (this.seeinfo) {
        this.sprite = 'SeeInfoSeq.png';
        return 'SeeInfoAnimation';
    } else if (this.afterseeinfo) {
        this.sprite = 'SeeInfoSeq.png';
        return 'DontSeeInfoAnimation';
    } else if (this.isFloating){
        this.sprite = 'Idle.png'; 
        return 'Floating'; 
    }else {
        this.sprite = 'Idle.png';
        return '';
    }
  }
}
