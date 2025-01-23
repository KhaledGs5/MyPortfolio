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
  land: boolean = false;
  greet: boolean = true;
  welcMessage: boolean = false;
  controlMessage: boolean = false;
  seeInfoMessage: boolean = false;
  showEmail: boolean = false;
  isGrounded: boolean = true;
  inSkillsPlanet: boolean = false;
  inEductPlanet: boolean = false;
  inExpPlanet : boolean = false;
  inProjectPlanet : boolean = false;
  inPlanet: boolean = false;
  isFloating: boolean = false;
  discoverSkillsPlanet: boolean = false;
  discoverEductPlanet: boolean = false;
  discoverExpPlanet: boolean = false;
  discoverProjectPlanet: boolean = false;
  showDesc: boolean = false;

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
  ExpPlanetIndex: number = 1;
  PrjPlanetIndex: number = 1;
  SkillsPlanetIndex: number = 1;
  XDescPos: number = 200;
  YDescPos: number = 200;
  DescFontSize: number = 10;

  keyState: { [key: string]: boolean } = {}; 

  sprite: string = 'Idle.png';
  messageimg: string = 'WelcomingMessage.png';
  infoselected: string = 'Linkedin';
  planetname: string = 'Skills';
  desc: string = 'Developed automated test cases for Ingenico terminals using Robot Framework, Python, and multithreading for seamless communication.';
  prjgit: string = 'Unavailable';

  infolist: string[] = ['Linkedin', 'Facebook', 'CodeForces', 'Github', 'Gmail'];

  MissionEndTime: number = 0; 

  flyTimeout: any; 


  // Planets Content --------------------------------

  MySkills = [
    { name: 'Programming Languages', image: '../../assets/PrgLang.png', sel:1},
    { name: 'WebDev', image: '../../assets/WebDev.png', sel:2},
    { name: 'Dev', image: '../../assets/Dev.png', sel:3},
    { name: 'DB', image: '../../assets/DB.png', sel:4},
    { name: 'DevOps', image: '../../assets/DevOps.png', sel:5},
    { name: 'Design', image: '../../assets/Design.png', sel:6},
  ];

  MyEducation = [
    { name: 'ENSI', image: '../../assets/ENSI.png'},
    { name: 'IPEIS', image: '../../assets/IPEIS.png'},
  ];

  MyExperience = [
    { name: 'TELNET', image: '../../assets/TELNET.png', desc: 'Summer Internship June-July 2024', sel:1},
    { name: 'Primatec', image: '../../assets/Primatec.png', desc: 'Summer Internship July-August 2024', sel:2},
    { name: 'ENSI', image: '../../assets/ENSICristal.png', desc: 'Summer Internship At Cristal Laboratory July-August 2023', sel:3},
  ];

  MyProjects = [
    { name: 'Fixprostho', image: '../../assets/FixProstho.png', radius : 340, angle: 258, index: 1, sel:1},
    { name: 'Secure CI/CD Pipeline', image: '../../assets/Jenkins.png', radius : 280, angle: 316, index: 1, sel:2},
    { name: 'Ninga', image: '../../assets/Ninga.png', radius : 300, angle: 172, index: 1, sel:3},
  ]

  // Planet Kids --------------------------------
  calculatePosition(angle: number, radius: number, centerX: number, centerY: number, index: number) {
    const angleInRadians = (index*angle * Math.PI) / 180; 
    const x = centerX + radius * Math.cos(angleInRadians);
    const y = centerY + radius * Math.sin(angleInRadians);
    return { x, y };
  }


  // HTML Varibales ----------------------------

  character!: HTMLElement;
  ground!: HTMLElement;
  ground1!: HTMLElement;
  ground2!: HTMLElement;
  skills!: HTMLElement;
  education!: HTMLElement;
  experience!: HTMLElement;
  project!: HTMLElement;

  // Sounds

  BackgroundAudio = new Audio();
  Walking = new Audio();
  Flying = new Audio();
  Landing = new Audio();
  Discover = new Audio();
  Change = new Audio();

  PlayWalkingSound(): void {
    if (this.Walking.paused) {
      this.Walking.src = '../../assets/WalkingAudio.mp3';
      this.Walking.load();
      this.Walking.play();
      this.Walking.playbackRate = 1.8;
    }
  }
  
  StopWalkingSound(): void {
    this.Walking.pause();
  }

  PlayFlyingSound(): void {
    if (this.Flying.paused) {
      this.Flying.src = '../../assets/FlyingAudio.mp3';
      this.Flying.load();
      this.Flying.play();
      this.Flying.playbackRate = 1.8;
      this.Flying.loop = true;
    }
  }
  
  StopFlyingSound(): void {
    this.Flying.pause();
    this.Flying.currentTime = 0;
  }

  PlayLandingSound(): void {
    if (this.Landing.paused) {
      this.Landing.src = '../../assets/LandingAudio.mp3';
      this.Landing.load();
      this.Landing.play();
      this.Landing.playbackRate = 1.8;
      this.Landing.loop = true;
    }
  }
  
  StopLandingSound(): void {
    this.Landing.pause();
    this.Landing.currentTime = 0;
  }

  PlayDiscoverSound(): void {
    if (this.Discover.paused) {
      this.Discover.src = '../../assets/Discover.mp3';
      this.Discover.load();
      this.Discover.play();
      this.Discover.playbackRate = 1.8;
      this.Discover.volume = 0.5;
    }
  }

  PlayChangeSound(): void {
      this.Change.src = '../../assets/Change.mp3';
      this.Change.load();
      this.Change.play();
      this.Change.volume = 0.2;
  }
  
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
    this.project = document.querySelector('#ProjectAnimation') as HTMLElement;

    setInterval(() => this.checkCollision(), 50);
  }

  // isColliding --------------------------------

  isColliding(elem1: HTMLElement, elem2: HTMLElement): boolean {
    const rect1 = elem1.getBoundingClientRect();
    const rect2 = elem2.getBoundingClientRect();

    return !(rect1.right-100 < rect2.left+50 || 
             rect1.left+100 > rect2.right-50 || 
             rect1.bottom-50 < rect2.top+50 || 
             rect1.top+50 > rect2.bottom-50);
  }

  // Collisionsss --------------------------------

  checkCollision() {
    if (this.isColliding(this.character, this.skills) || this.isColliding(this.character, this.education) || this.isColliding(this.character, this.experience) || this.isColliding(this.character, this.project)) {
      this.Gravity = 0;
      this.isGrounded = true;
      this.isFloating = true;
      if(this.isColliding(this.character, this.skills)){
        this.skills.innerHTML = 'Click Enter <br>To See My Skills';
        this.planetname = 'Skills';
        this.inSkillsPlanet = true;
        if(this.discoverSkillsPlanet){
            this.skills.innerHTML = 'Use Arrows To Navigate Between Planets<br><br>Click Enter To<br> Hide';
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
            this.experience.innerHTML = 'Use Arrows To Navigate Between Planets<br><br>Click Enter <br>To Hide';
        }
      }else if(this.isColliding(this.character, this.project)){
        this.project.innerHTML = 'Click Enter <br> to see <br>My Projects';
        this.planetname = 'Projects';
        this.inProjectPlanet = true;
        if(this.discoverProjectPlanet){
            this.project.innerHTML = 'Click Enter <br>To Hide';
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
        this.inProjectPlanet = false;
        this.isFloating = false;
        this.Gravity = 6;
        this.Xoffset = 3;
        this.skills.textContent = 'Skills';
        this.education.textContent = 'Education';
        this.experience.textContent = 'Experience';
        this.project.textContent = 'Projects';
        this.showDesc = false;
    }
  }

  // Inputss --------------------------------

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if(event.key === 'f' && !this.keyState['f']){
        this.PlayDiscoverSound();
    }
    this.keyState[event.key] = true;
    if (event.key === 'ArrowDown') {
        this.PlayChangeSound();
        this.showDesc = false;
        if(this.isColliding(this.character, this.experience)){
            this.ExpPlanetIndex++;
            if (this.ExpPlanetIndex > 3){
                this.ExpPlanetIndex = 1;
            }
        }else if(this.isColliding(this.character, this.project)){
            this.PrjPlanetIndex++;
            if (this.PrjPlanetIndex > 3){
                this.PrjPlanetIndex = 1;
            }
        }else if(this.isColliding(this.character, this.skills)){
            this.SkillsPlanetIndex++;
            if (this.SkillsPlanetIndex > 6){
                this.SkillsPlanetIndex = 1;
            }
        }else{
            this.InfoIndex++;
            if (this.InfoIndex > 4){
                this.InfoIndex = 0;
            }
            this.infoselected = this.infolist[this.InfoIndex];
        }
    }

    if (event.key === 'ArrowUp') {
        this.PlayChangeSound();
        this.showDesc = false;
        if(this.isColliding(this.character, this.experience)){
            this.ExpPlanetIndex--;
            if (this.ExpPlanetIndex < 1){
                this.ExpPlanetIndex = 3;
            }
        }else if(this.isColliding(this.character, this.project)){
            this.PrjPlanetIndex--;
            if (this.PrjPlanetIndex < 1){
                this.PrjPlanetIndex = 3;
            }
        }else if(this.isColliding(this.character, this.skills)){
            this.SkillsPlanetIndex--;
            if (this.SkillsPlanetIndex < 1){
                this.SkillsPlanetIndex = 6;
            }
        }else{
            this.InfoIndex--;
            if (this.InfoIndex < 0){
                this.InfoIndex = 4
            }
            this.infoselected = this.infolist[this.InfoIndex];
        }
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
    this.inPlanet = this.inSkillsPlanet || this.inEductPlanet || this.inExpPlanet || this.inProjectPlanet;
    if (this.keyState['Enter']){
        this.showDesc = false;
        if(this.inSkillsPlanet){
            this.PlayDiscoverSound();
            this.discoverSkillsPlanet =!this.discoverSkillsPlanet;
        }else if (this.inEductPlanet){
            this.PlayDiscoverSound();
            this.discoverEductPlanet =!this.discoverEductPlanet;
        }else if (this.inExpPlanet){
            this.PlayDiscoverSound();
            this.discoverExpPlanet =!this.discoverExpPlanet;
        }else if (this.inProjectPlanet) {
            this.PlayDiscoverSound();
            this.discoverProjectPlanet =!this.discoverProjectPlanet;
        }
    }else if(!this.inPlanet){
        this.discoverSkillsPlanet = false;
        this.discoverEductPlanet = false;
        this.discoverExpPlanet = false;
        this.discoverProjectPlanet = false;
    }

    if (this.keyState['e']){
        this.PlayDiscoverSound();
        if(this.isColliding(this.character, this.experience) && this.discoverExpPlanet){
            this.showDesc = !this.showDesc;
            this.DescFontSize = 12;
            if(this.ExpPlanetIndex == 1){
                this.XDescPos = 1180;
                this.YDescPos = 250;
                this.prjgit = 'Unavailable';
                this.desc = 'Developed automated test cases for Ingenico terminals using Robot Framework, Python, and multithreading for seamless communication.';
            }else if(this.ExpPlanetIndex == 2){
                this.XDescPos = 1005;
                this.YDescPos = 553;
                this.prjgit = 'Click G'
                this.desc = 'Developed a real-time car dashboard testing web application using React, Django, and WebSocket protocol.';
            }else if(this.ExpPlanetIndex == 3){
                this.XDescPos = 245;
                this.YDescPos = 553;
                this.prjgit = 'Click G'
                this.desc = 'Developed CarMarket, an e-commerce web application for buying and selling cars using React, CSS, and PHP.';
            }
        }else if(this.isColliding(this.character, this.project)  && this.discoverProjectPlanet){
            this.showDesc = !this.showDesc;
            this.DescFontSize = 10;
            if(this.PrjPlanetIndex == 1){
                this.XDescPos = 1740;
                this.YDescPos = 807;
                this.prjgit = 'Click G';
                this.desc = 'Developed Fixprostho, a Windows and Android application for managing dental students tests using Flutter, with data stored locally in CSV files for each teacher.';
            }else if(this.PrjPlanetIndex == 2){
                this.XDescPos = 2370;
                this.YDescPos = 945;
                this.prjgit = 'Click G'
                this.desc = 'Implemented a secure CI/CD pipeline for deploying containerized applications using Docker, Jenkins, SonarQube, Trivy, Kubernetes, and GitOps.';
            }else if(this.PrjPlanetIndex == 3){
                this.XDescPos = 1512;
                this.YDescPos = 1181;
                this.prjgit = 'Click G'
                this.desc = 'Developed Ninga, a Unity-based video game using C# and Python (cv2) for camera-based finger tracking.';
            }
        }else if(this.isColliding(this.character, this.skills)  && this.discoverSkillsPlanet){
            this.showDesc = !this.showDesc;
            this.DescFontSize = 15;
            this.prjgit = 'Unavailable';
            if(this.SkillsPlanetIndex == 1){
                this.XDescPos = 1075;
                this.YDescPos = 1065;
                this.desc = 'Python, C#\nC++, C\nPHP, JavaScript\nTypeScript, Dart\nJava.';
            }else if(this.SkillsPlanetIndex == 2){
                this.XDescPos = 935;
                this.YDescPos = 1308;
                this.desc = 'React, Django\nAngular, Tailwind\nHTML5, CSS3\nNode.js, Express.js';
            }else if(this.SkillsPlanetIndex == 3){
                this.XDescPos = 295;
                this.YDescPos = 1308;
                this.desc = 'Flutter, Windows\nApplications, Unity';
            }else if(this.SkillsPlanetIndex == 4){
                this.XDescPos = 155;
                this.YDescPos = 1065;
                this.desc = 'PostgreSQL, MySQL\nMongoDB';
            }else if(this.SkillsPlanetIndex == 5){
                this.XDescPos = 295;
                this.YDescPos = 822;
                this.desc = 'Docker, Kubernetes\nJenkins, Gitlab\nSonarQube\nGit, Github\nTrivy\nGitOps\nAWS, Microsoft Azure';
            }else if(this.SkillsPlanetIndex == 6){
                this.XDescPos = 935;
                this.YDescPos = 822;
                this.desc = 'Photoshop, Adobe Illustrator\nPremiere Pro, Adobe Animate';
            }
        }
    }

    if(event.key === 'g' && this.showDesc){
        if(this.prjgit == 'Click G'){
            if(this.isColliding(this.character, this.experience) && this.discoverExpPlanet){
                if(this.ExpPlanetIndex == 2){
                    window.open('https://github.com/KhaledGs5/Dashboard', '_blank');
                }else if(this.ExpPlanetIndex == 3){
                    window.open('https://github.com/KhaledGs5/CarMarket', '_blank');
                }
            }else if (this.isColliding(this.character, this.project) && this.discoverProjectPlanet){
                if(this.PrjPlanetIndex == 1){
                    window.open('https://github.com/KhaledGs5/Fixprostho', '_blank');
                }else if(this.PrjPlanetIndex == 2){
                    window.open('https://github.com/KhaledGs5/Secure-CI-CD-Pipeline', '_blank');
                }else if(this.PrjPlanetIndex == 3){
                    window.open('https://github.com/KhaledGs5/Ninga', '_blank');
                }
            }
        }
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
        this.isGrounded = false;
        this.PlayFlyingSound();
        this.StopWalkingSound();
    }else{
        this.StopFlyingSound();
    }
    if (this.keyState['s']) {
        this.ypos = Math.min(this.ypos + this.step + 2, 1760);
        this.isGrounded = false;
    }
    if (this.keyState['q']) {
        this.xpos = Math.max(this.xpos - this.step - this.Xoffset, 0);
        this.scale = 1;
        if(this.isGrounded && !this.isFloating){
            this.PlayWalkingSound();
        }
    }
    if (this.keyState['d']) {
        this.xpos = Math.min(this.xpos + this.step + this.Xoffset, 2800);
        this.scale = -1;
        if(this.isGrounded && !this.isFloating){
            this.PlayWalkingSound();
        }
    }else if(!this.keyState['d'] && !this.keyState['q']){
        this.StopWalkingSound();
    }
    if(!this.isFloating && !this.isGrounded){
        this.PlayLandingSound();
    }else{
        this.StopLandingSound();
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
    this.land = !this.fly && !this.isGrounded && !this.keyState['s'];
    
    window.requestAnimationFrame(() => {
        this.updatePosition();
        this.updateScreenPosition();
    });
  }

  // Update Screen Position --------------------------------

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



// Animations  --------------------------------
  

  getAnimationClass() {
    if (this.flynflame) {
        this.sprite = 'Fly&FlameSeq.png';
        return 'FlynFlameAnimation';
    } else if (this.fly) {
        this.sprite = 'FlySeq.png';
        return 'FlyAnimation';
    } else if (this.land) {
        this.sprite = 'Fly&LandSeq.png';
        return 'LandAnimation';
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
