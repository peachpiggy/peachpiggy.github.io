const pet = new Vue({
  el: '#petbox',
  data: {
    loadnone: [],
    startload: [],
    clock: moment(),
    gmTime: {
      clockDur: null,
      showGameTime: '',
      duration: null,
      gameTime: null,
      clockPaused: null,
      pausedDuration: null,
      savePau: null,
    },
    clockTimer: null,
    ageTimer: null,
    baseTimer: null,
    showModelTimeOut: null,
    pet: {
      name: '朱桃桃', age: 1, weight: 50, hunger: 60, happiness: 60, health: 100, milieu: 100, stage: '幼年期', isAlive: true, isSick: false, dieNum: 5, runNum: 8, img: './img/0.gif'
    },
    petActiveImg: '',
    activeMsg: '',
    foodSelect: 'feed',
    gameStart: false,
    gameOverBtn: false,
    openModel: false,
    notionModel: false,
    devModel: false,
    foodlists: [
      { id: 'feed', name: '飼料', hunger: 5, happiness: -1, weight: 1, health: 1, milieu: -1, feeling: '面無表情', img: './img/feed.gif', sec: 7000 },
      { id: 'cake', name: '蛋糕', hunger: 8, happiness: 8, weight: 4, health: -5, milieu: -5, feeling: '很開心', img: './img/cake.gif', sec: 8000 },
      { id: 'medicine', name: '感冒藥', hunger: 0, happiness: -5, weight: 0, health: 5, milieu: 5, feeling: '皺著眉頭', img: './img/medicine.gif', sec: 5000 }
    ],
    petStatus: [
      { id: 'healthy', name: '健康', class: 'healthy-color', active: true },
      { id: 'melancholy', name: '憂鬱', class: 'melancholy-color', active: false },
      { id: 'hungry', name: '飢餓', class: 'hungry-color', active: false },
      { id: 'weak', name: '虛弱', class: 'weak-color', active: false },
      { id: 'sick', name: '生病', class: 'sick-color', active: false },
      { id: 'fet', name: '肥胖', class: 'sick-color', active: false },
      { id: 'runaway', name: '離家出走', class: 'gameover-color', active: false },
      { id: 'gameover', name: '死亡', class: 'gameover-color', active: false },
    ],
    activeImg: [
      { id: 'play', img: './img/game.gif', sec: 3000 },
      { id: 'clear', img: './img/clear.gif', sec: 5000 },
    ],
    statusID: {
      healthy: 0,
      melancholy: 1,
      hungry: 2,
      weak: 3,
      sick: 4,
      fet: 5,
      runaway: 6,
      gameover: 7
    },
    magicNum: {
      min_happy: 30,
      min_hungry: 30,
      min_milieu: 40,
      max_weight: 80,
      max_die: 5,
      max_run: 8,
      die_health: 0,
      die_num: 1,
      die_health_num: 20,
      die_hungry_num: 10,
      die_milieu_num: 10,
      die_weight_num: 80,
      run_num: 1,
      run_milieu: 5,
      run_hungry: 5,
      run_happy_num: 30,
      run_hungry_num: 30,
      weak_health: 20,
      weak_hungry: 20
    },
    activeNum: {
      game_hungry: 10,
      game_milieu: 5,
      game_max_weight: 50,
      game_weight: 3,
      game_min_hungry: 30,
      gmae_happy: 10,
      game_add_happy: 5,
      clear_add_milieu: 10,
      clear_add_happy: 5,
      clear_max_hungry: 60,
      clear_hungry: 5,
      clear_happy: 5
    },
    userSetting: {
      autoSave: false,
      autoStop: false,
      skipSwitch: false,
      isNotNotify: false,
      isEating: false,
    },
    timeCtrl: {
      clock: 1000,
      age: 600000,
      base: 240000,
      startTimeOut: 400,
    },
    stopTime: false,
    notify: null,
    canNotify: false,
    canParSet: false,
    saveIng: false,
    getSave: null,
    haveSave: false,
    localKey: 'gamesavedata',
  },
  computed: {
    normalizedPet() {
      const pet = this.pet;
      pet.hunger = this.clamp(pet.hunger, 0, 100);
      pet.happiness = this.clamp(pet.happiness, 0, 100);
      pet.health = this.clamp(pet.health, 0, 100);
      pet.milieu = this.clamp(pet.milieu, 0, 100);
      pet.weight = this.clamp(pet.weight, 50, 100);
      return pet;
    },
    patStatus() {
      const status = this.petStatus;
      const statusID = this.statusID;
      const num = this.magicNum;

      let ishealthy = true;

      if (this.pet.happiness <= num.min_happy) {
        status[statusID.melancholy].active = true;
        ishealthy = false;
      } else {
        status[statusID.melancholy].active = false;
      }

      if (this.pet.hunger <= num.min_hungry) {
        status[statusID.hungry].active = true;
        ishealthy = false;
      } else {
        status[statusID.hungry].active = false;
      }

      if (this.pet.health <= num.weak_health || this.pet.hunger <= num.weak_hungry) {
        status[statusID.weak].active = true;
        ishealthy = false;
      } else {
        status[statusID.weak].active = false;
      }

      if (this.pet.milieu <= num.min_milieu) {
        status[statusID.sick].active = true;
        this.pet.issick = true;
        ishealthy = false;
      } else {
        status[statusID.sick].active = false;
      }

      if (this.pet.weight >= num.max_weight) {
        status[statusID.fet].active = true;
        ishealthy = false;
      } else {
        status[statusID.fet].active = false;
      }

      if (this.pet.happiness <= num.run_happy_num || this.pet.hunger <= num.run_hungry_num) {
        this.pet.runNum--;
        this.userSetting.autoSave = false;
        this.userSetting.autoStop ? this.stopTime = true : '';
        this.showNotify('run');
      } else {
        this.pet.runNum = num.max_run;
      }

      if (this.pet.health <= num.die_health_num || this.pet.hunger <= num.die_hungry_num || this.pet.milieu <= num.die_milieu_num || this.pet.weight >= num.die_weight_num) {
        this.pet.dieNum--;
        this.userSetting.autoSave = false;
        this.userSetting.autoStop ? this.stopTime = true : '';
        this.showNotify('die');
      } else {
        this.pet.dieNum = num.max_die;
      }

      if (this.pet.runNum < num.run_num) {
        status.forEach(s => s.active = false);
        status[statusID.runaway].active = true;
        this.gameOverActive();
        ishealthy = false;
      }

      if (this.pet.dieNum < num.die_num) {
        status.forEach(s => s.active = false);
        status[statusID.gameover].active = true;
        this.gameOverActive();
        ishealthy = false;
      }
      ishealthy ? status[statusID.healthy].active = true : status[statusID.healthy].active = false;
      return status;
    },
    petimg() {
      const pet = this.pet;
      if (pet.age >= 9) {
        pet.img = './img/3.gif';
        pet.stage = '完全體';
      } else if (pet.age >= 6) {
        pet.img = './img/2.gif';
        pet.stage = '成熟期';
      } else if (pet.age >= 3) {
        pet.img = './img/1.gif';
        pet.stage = '成長期';
      }

      return pet.img;
    },
  },
  created() {
    setTimeout(() => {
      this.loadnone = ['u-hidden'];
    }, 900);
    this.getGameData();
  },
  mounted() {
    if (Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          this.canNotify = true;
        }
      });
    } else if (Notification.permission === "granted") {
      this.canNotify = true;
    } else {
      this.canNotify = false;
    }
  },
  watch: {
    stopTime() {
      this.pausedClock();
    }
  },
  methods: {
    giveFood() {
      if (this.pet.isAlive) {
        const foodData = this.foodlists.find(food => food.id === this.foodSelect);
        if (this.pet.hunger < 100) {
          this.userSetting.isEating = true;
          this.pet.hunger += foodData.hunger;
          this.pet.happiness += foodData.happiness;
          this.pet.weight += foodData.weight;
          this.pet.health += foodData.health;
          this.pet.milieu += foodData.milieu;
          this.activeMsg = `餵食 ${foodData.name}，${this.pet.name} ${foodData.feeling}`;
          this.showModel(foodData.img, foodData.sec);
        } else if (this.pet.hunger >= 100) {
          this.pet.health -= 10;
          this.pet.happiness -= 10;
          this.activeMsg = `${this.pet.name} 已經吃不下了`;
        }

        if (this.foodSelect === 'medicine' && this.pet.isSick == true) {
          this.pet.health += 10;
          this.pet.isSick = false;
        } else if (this.foodSelect === 'medicine') {
          this.pet.health -= 15;
        }

      }
    },
    playGame() {
      const num = this.activeNum;
      this.pet.hunger -= num.game_hungry;
      this.pet.milieu -= num.game_milieu;
      if (this.pet.weight > num.game_max_weight) {
        this.pet.weight -= num.game_weight;
      }
      if (this.hunger <= num.game_min_hungry) {
        this.pet.happiness -= num.gmae_happy;
      } else {
        this.pet.happiness += num.game_add_happy;
      }
      this.activeMsg = `${this.pet.name} 玩得很開心`;
      this.showModel(this.activeImg[0].img, this.activeImg[0].sec);
    },
    clearRoom() {
      const num = this.activeNum;
      this.pet.milieu += num.clear_add_milieu;
      this.pet.hunger -= num.clear_hungry;
      if (this.pet.hunger >= num.clear_max_hungry) {
        this.pet.happiness += num.clear_add_happy;
      } else {
        this.pet.happiness -= num.clear_happy;
      }
      this.activeMsg = `${this.pet.name} 很努力打掃`;
      this.showModel(`${this.activeImg[1].img}`, this.activeImg[1].sec);
    },
    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    gameOverActive() {
      this.pet.isAlive = false;
      clearInterval(this.clockTimer);
      clearInterval(this.ageTimer);
      clearInterval(this.baseTimer);
      this.clockTimer = null;
      this.ageTimer = null;
      this.baseTimer = null;
    },
    startGame() {
      if (this.pet.name == '') {
        return false;
      }
      this.startload = ['ts-loading loading-box'];
      this.gameTimer();
      setTimeout(() => {
        this.gmTime.clockDur = moment();
      }, 800);
      this.gameStart = true;
      setTimeout(() => {
        this.startload = ['u-hidden'];
      }, this.timeCtrl.startTimeOut);
    },
    continueGame() {
      this.pet = this.getSave[0].pet;
      this.timeCtrl = this.getSave[0].timeCtrl;
      this.userSetting = this.getSave[0].userSetting;
      this.startGame();
    },
    gameTimer() {
      this.clockTimer = setInterval(() => {
        this.clock = moment();
        this.gmTime.duration = moment.duration(this.clock.diff(this.gmTime.clockDur));
        this.gmTime.gameTime = this.gmTime.duration.asSeconds();
        this.gmTime.showGameTime = moment.utc(this.gmTime.gameTime * 1000).format('HH:mm:ss');
      }, this.timeCtrl.clock);

      this.ageTimer = setInterval(() => {
        this.pet.age++;
        if (this.userSetting.autoSave) {
          this.saveGameData();
        }
      }, this.timeCtrl.age);

      this.baseTimer = setInterval(() => {
        this.pet.hunger -= 3;
        this.pet.happiness -= 3;
        this.pet.health -= 3;
        this.pet.milieu -= 3;
        if (this.userSetting.isEating) {
          this.pet.weight += 3;
        } else {
          this.pet.weight -= 3;
        }
        this.userSetting.isEating = false;
        if (this.userSetting.autoSave) {
          this.saveGameData();
        }
      }, this.timeCtrl.base);
    },
    resetGame() {
      localStorage.removeItem(this.localKey);
      location.reload();
    },
    showModel(img, sec) {
      if (!this.userSetting.skipSwitch) {
        this.petActiveImg = img;
        this.openModel = true;
        this.showModelTimeOut = setTimeout(() => {
          this.openModel = false;
          this.petActiveImg = '';
        }, sec);
      }
    },
    closeModel() {
      clearTimeout(this.showModelTimeOut);
      this.openModel = false;
      this.petActiveImg = '';
    },
    showNotify(type) {
      if (this.userSetting.isNotNotify) {
        return;
      }
      if (type == 'run') {
        let notifyTitle = '主人...';
        let notifyConfig = { body: '我好想離家出走...', icon: this.pet.img };
        this.notify = new Notification(notifyTitle, notifyConfig);
      } else if (type == 'die') {
        let notifyTitle = '嗚嗚嗚';
        let notifyConfig = { body: '好像快不行了...', icon: this.pet.img };
        this.notify = new Notification(notifyTitle, notifyConfig);
      } else {
        this.notify = new Notification('錯誤', { body: '噢不...好像有什麼壞了' })
      }
    },
    saveGameData() {
      let _json = [{
        pet: this.pet,
        timeCtrl: this.timeCtrl,
        userSetting: this.userSetting,
      }];
      this.uselocal(this.localKey, 'set', _json);
      if (this.userSetting.autoSave && !this.userSetting.isNotNotify) {
        this.saveIng = true;
        this.notify = new Notification('', { body: '存檔完成', icon: this.pet.img })
      }
      setTimeout(() => {
        this.saveIng = false;
      }, 1000);
    },
    pausedClock() {
      if (this.stopTime) {
        this.gmTime.clockPaused = moment();
        this.gmTime.savePau = this.gmTime.clockPaused.toJSON();
        clearInterval(this.clockTimer);
        clearInterval(this.ageTimer);
        clearInterval(this.baseTimer);
        this.ageTimer = null;
        this.baseTimer = null;
      } else {
        this.gmTime.pausedDuration = moment.duration(moment().diff(this.gmTime.clockPaused));
        this.gmTime.clockDur.add(this.gmTime.pausedDuration);
        this.gameTimer();
      }
    },
    getGameData() {
      this.getSave = this.uselocal(this.localKey, 'get');
      this.haveSave = false;
      if (this.getSave !== null) {
        this.haveSave = true;
      }
    },
    uselocal(key, type, data) {
      switch (type) {
        case 'set':
          return localStorage.setItem(key, JSON.stringify(data))
        case 'get':
          return JSON.parse(localStorage.getItem(key));
      }
    }
  }
})