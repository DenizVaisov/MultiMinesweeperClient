<template>
<div id="text">
  <b-container fluid>
    <navigation style="display:none;"></navigation>
    <b-row>
      <b-col offset-md="1" class="mt-2 text-center" md="3">
        <b-card-group id="points-table">
          <b-card bg-variant="primary" text-variant="white" :header="`${player1.name} VS ${player2.name}`" class="text-center">
            <b-card-text><h5>{{player1Points}} pts. VS {{player2Points}} pts.</h5></b-card-text>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col id="middleTopUI" class="text-center mt-2" md="4">
        <h3>{{ $t('timer') }}: {{ currentTime }}</h3>
        <h3>{{lifes}}</h3>
        <h3>{{minesPlaced}}</h3>
      </b-col>
      <b-col style="z-index: 100;" class="mt-2" md="4">
        <div class="d-flex">
          <b-button
            id="show-chat-btn" 
            @click="onShowChat()"
            variant="success" 
            pill>{{ $t('showChat') }}
          </b-button>
          <b-button
            id="hide-chat-btn"
            class="hide-element"
            @click="onHideChat()" 
            variant="danger" 
            pill>{{ $t('hideChat') }}
          </b-button>
        </div>
        <div class="d-flex" style="margin-top: -39px; margin-left: 150px;">
          <b-button
            id="hide-field-btn"
            @click="onHideHelperField()"
            variant="danger" 
            pill>{{ $t('hideField') }}
          </b-button>
         <b-button
            id="show-field-btn"
            class="hide-element"
            @click="onShowHelperField()"
            variant="success" 
            pill>{{ $t('showField') }}
          </b-button>
        </div>
        <transition name="fade">
        <div v-if="showChat">
        <div id="inputForm">
          <b-input-group style="margin-top: 30px;">
              <b-form-textarea v-model="message" type="text"
                id="textarea-default"
                :placeholder="$t('textAreaPlaceholder')"
              ></b-form-textarea>
              <b-input-group-append>
                <b-button variant="outline-primary" 
                  v-touch:tap="chat" 
                  type="button" 
                  id="sendBtn" 
                  value="Отправить"> {{ $t('textAreaButtonText') }}
                </b-button>
              </b-input-group-append>
          </b-input-group>
        </div>
        <div 
          class="hide-chat panel panel-default">
        <div class="panel-heading">
            <h3 style="color: black;" class="text-center"></h3>
        </div>
        <div id="chatroom" class="mt-2 panel-body" style="max-height: 500px; overflow-y: scroll;">
          <div v-for="(player, index) in listMessage" :item="player" :key="index" class="mb-4 max-w-sm mx-auto">
            <div class="card">
                <div class="contact-list">
                    <div class="contact-list-item">
                      <div class="contact-list-contact">
                         <img src="" class="contact-list-avatar"> 
                        <div>
                          <div id="username" class="contact-list-name">
                            {{ player.name }} 
                          </div>
                          <div id="usermessage" class="contact-list-email">
                            {{ player.data }} 
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        </transition>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center mx-auto">
        <b-col v-show="showComponent" style="z-index: 10" class="mt-2"  md="5">
          <game-field 
            :gameField="enemyField"
            :clickedCell="clickedCell"
            :addMine="addMine"
            :addFlag="addFlag"
            :hideNeighbour="true"
            :hideFlags="true"
            :hideMines="hideEnemyMines"
            @contextmenu.prevent="addFlag"
          >
          </game-field>
        </b-col>
        <transition
          name="fade"
        >
        <b-col style="z-index: 10" class="mt-2"  md="5">
          <game-field
            id="helper-field" 
            v-bind:class="{ blocked: isActive }"
            :gameField="ownField"
            :clickedCell="clickedCell"
            :addMine="addMine"
            :addFlag="addFlag"
            :hideNeighbour="false"
            :hideMines="hideOwnMines"
            @contextmenu.prevent="addFlag"
          >
          </game-field>
        </b-col>
        </transition>
    </b-row>
    <div>
      <b-modal size="lg" id="modal-cheat" hide-footer hide-header no-close-on-backdrop no-close-on-esc centered title="">
        <div class="text-center">
          <h1 class="my-4 text-center">{{ $t('cheat') }}</h1>
          <h3 class="my-4 text-center">{{ $t('wumpus') }}</h3>
          <img style="height: 300px;" src="../assets/images/wumpus-cheat.png" />
          <p><b-button variant="primary" class="mt-3 btn-lg" :to="{ name: 'Lobby' }">
            {{ $t('toLobby') }}
            </b-button></p>
        </div>
      </b-modal>
      <b-modal size="lg" id="modal-win" centered hide-header hide-footer hide-header-close title="">
        <div class="text-center">
          <h3 class="my-4">{{ $t('youWin') }}</h3>
          <template v-if="getRandomInt(1)==0">
            <img style="height: 350px;" src="../assets/images/rocket.png" />
          </template>
          <template v-else-if="getRandomInt(3)==1">
            <img style="height: 300px;" src="../assets/images/winner.png" />
          </template>
          <template v-else-if="getRandomInt(3)==2">
            <img style="height: 300px;" src="../assets/images/win.png" />
          </template>
          <p><b-button variant="primary" class="mt-4 btn-lg" :to="{ name: 'Lobby' }">
            {{ $t('toLobby') }}
          </b-button></p>
        </div>
      </b-modal>
      <b-modal size="lg" id="modal-lose" hide-footer hide-header no-close-on-backdrop no-close-on-esc centered title="">
        <div class="text-center">
          <h3 class="my-4 text-center">{{ $t('youLose') }}</h3>
          <template v-if="getRandomInt(1)==0">
            <img style="height: 350px;" src="../assets/images/nuclear.png" />
          </template>
          <p><b-button variant="primary" class="mt-4 btn-lg" :to="{ name: 'Lobby' }">
            {{ $t('toLobby') }}
            </b-button></p>
        </div>
      </b-modal>
    </div>
  </b-container>
</div>
</template>

<script>
'use strict'
import * as signalR from '@aspnet/signalr';
import Navigation from '../views/Navigation';
import GameField from '../views/GameField';
import i18n from '../plugins/i18n';

export default {
  name: 'Game',
  components: {
    GameField, Navigation
  },
  data() {
    Navigation
    return {
      mine: "",
      ownField: [],
      enemyField: [],
      mines: [],
      cell: "",
      player: {},
      player1Points: +"",
      player2Points: +"",
      currentPlayer: {},
      lifes: "",
      minesPlaced: "",
      currentTime: 20,
      timer: null,
      player1: {},
      player2: {},
      showComponent: false,
      row: "",
      isActive: false,
      showChatButtonGreen: true,
      hideChatButtonGreen: false,
      showChatButtonRed: false,
      hideChatButtonRed: true,
      showChat: false,
      hideChat: false,
      showHelperField: true,
      hideHelperField: false,
      hideEnemyMines: false,
      hideOwnMines: true,
      hideFlags: true,
      showEnemyNeighbour: true,
      showOwnNeighbour: false,
      message: "",
      listMessage: [],
      gameHubConnection: null,
    }
  },
  methods: {
    chat: function () {
      if (this.gameHubConnection.state === signalR.HubConnectionState.Connected) {
        this.gameHubConnection.invoke('SendMessage', this.message);
      } 
      
      else {
        this.gameHubConnection.start()
        .then(() => this.gameHubConnection.invoke('SendMessage', this.message));
      }
    },

    hideUIElements: function() {
      document.getElementById("points-table").style.display = "none";
      document.getElementById("show-chat-btn").style.display = "none";
      document.getElementById("helper-field").style.display = "none";
      document.getElementById("middleTopUI").style.display = "none";
    },

    showUIElements: function () {
      document.body.style.backgroundColor = "#fff";
      document.getElementById("points-table").style.display = "block";
      document.getElementById("show-chat-btn").style.display = "block";
      document.getElementById("helper-field").style.display = "block";
      document.getElementById("middleTopUI").style.display = "block";
    },

    doNotCheat: function() {
      this.$router.push({ name: 'Lobby' });
    },

    getRandomInt: function(max) {
      return Math.floor(Math.random() * max);
    },

    onShowChat: function() {
      console.log('show chat')
      document.getElementById('show-chat-btn').style = "display:none;";
      document.getElementById('hide-chat-btn').style = "display:block;";
      this.showChat = true;
    },

    onHideChat: function() {
      console.log('hide chat')
      document.getElementById('show-chat-btn').style = "display:block;";
      document.getElementById('hide-chat-btn').style = "display:none;";
      this.showChat = false;
    },

    onShowHelperField: function() {
      document.getElementById('show-field-btn').style = "display:none;";
      document.getElementById('hide-field-btn').style = "display:block;";
      document.getElementById('show-helper-field').style = "display:block;";
    },

    onHideHelperField: function() {
      document.getElementById('show-field-btn').style = "display:block;";
      document.getElementById('hide-field-btn').style = "display:none;";
      document.getElementById('show-helper-field').style = "display:none;";
    },

    clear: function() {
      this.listMessage = [];
    },

    startTimer: function() {
      this.timer = setInterval(() => {
        this.currentTime--;
      }, 1000)
    },
    stopTimer: function() {
      clearTimeout(this.timer);
    },

    addMine: function(row, cell, e){
      if(this.gameHubConnection.state === signalR.HubConnectionState.Connected){
      this.gameHubConnection.invoke('PrepareToBattle', row, cell);
      e.preventDefault();
      }
      else{
        this.gameHubConnection.start();
      }
    },

    addFlag: function(row, cell, e){
        this.gameHubConnection.invoke('PlaceFlag', row, cell);
        e.preventDefault();
    },

    clickedCell: function(row, cell) {
      this.gameHubConnection.invoke('OpenCell', row, cell);
    },

    start: async function()  {
      try {
        await this.gameHubConnection.start();
        console.log("connected");
      } catch (err) {
        console.log(err);
        setTimeout(() => this.start(), 5000);
      }
    },

    delay: function(f, ms) {
      return function() {
        setTimeout(() => f.apply(this, arguments), ms);
      };
    },

    pushToLobby: function(){
      this.$router.push({ name: 'Lobby' });
    },

    popToast: function (title, text, variant) {
      const h = this.$createElement;
      const vNodesMsg = h(
        'p',
        { class: ['text-center', 'mb-0'] },
        [
          h('b-spinner', { props: { type: 'grow', small: true } }),
          ` ${text} `,
          h('b-spinner', { props: { type: 'grow', small: true } })
        ]
      );
      const vNodesTitle = h(
        'div',
        { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
        [
          h('strong', { class: 'mr-2' },  `${title}`),
          h('small', { class: 'ml-auto text-italics' }, '')
        ]
      );
      this.$bvToast.toast([vNodesMsg], {
        title: [vNodesTitle],
        solid: true,
        variant: variant
      });
    }
  },

  watch: {
    currentTime: function() {
      if (this.currentTime === 0) {
        this.stopTimer();
        this.currentTime = 20;
        this.gameHubConnection.invoke('CheckTime');
      }
    }
  },
  mounted: function () {
    this.hideUIElements();

    this.gameHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.43.159:5000/game')
      .configureLogging(signalR.LogLevel.Information)
      .build();

    console.log("Connected", this.gameHubConnection);

    this.gameHubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10;  
    this.gameHubConnection.start();

    this.gameHubConnection.on('Reconnect', (reconnectedPlayer, ownField, enemyField) => {
      console.log(`Attemp to reconnect ${reconnectedPlayer.name}`);
      this.ownField = ownField;
      this.enemyField = enemyField;
    });

    this.gameHubConnection.on('showGame', () => { 
      this.showUIElements();
    });

    this.gameHubConnection.on('ToLobby', () => {
      this.hideUIElements();
      document.body.style.backgroundColor = "#000";
      this.$bvModal.show('modal-cheat');
    });

    this.gameHubConnection.on('HideEnemyMines', () => {
      this.hideEnemyMines = false;
    });

    this.gameHubConnection.on('ShowField', (ownField) => {
      this.showComponent = true;
      this.hideEnemyMines = false;
      this.isActive = true;
      this.ownField = ownField;
    });
    
    this.gameHubConnection.on('OwnField', (ownField) => {
      this.ownField = ownField;
      this.enemyField = ownField;
    });

    this.gameHubConnection.on('HintField', (ownField) =>{
      this.ownField = ownField;
    });

    this.gameHubConnection.on('EnemyField', (enemyField) => {
        this.enemyField = enemyField;
        console.log(this.enemyField);
    });

    this.gameHubConnection.on('ReceiveMessage', (player, message) => {
      const insertdata = {name: player, data: message};
      this.listMessage.push(insertdata);
    });

    this.gameHubConnection.on('Players', (player1, player2) => {
      this.player1 = player1;
      this.player2 = player2;
    });

    this.gameHubConnection.on('Lose', () => {
      this.hideUIElements();
      this.$bvModal.show('modal-lose');
    });

    this.gameHubConnection.on('Win', () => {
      this.hideUIElements();
      this.$bvModal.show('modal-win');
    });

    this.gameHubConnection.on('Mined', () => {
      var title = i18n.t('notification');
      var text = i18n.t('kaboom');
      var variant = 'danger';
      this.popToast(title, text, variant);
    })

    this.gameHubConnection.on('GameOver', () => {
        this.gameHubConnection.stop();
    });

    this.gameHubConnection.on('Status', player => {
        this.lifes = `${i18n.t('livesLeft')}: ${player.lifes}`;
    });

    this.gameHubConnection.on('MinesPlaced', minesPlaced => {
        this.minesPlaced = `${i18n.t('minesPlaced')}: ${minesPlaced} / 24`;
    });

    this.gameHubConnection.on('PrepareRound', () => {
      var title = i18n.t('notification');
      var text = i18n.t('prepareStage');
      var variant = 'info';
      this.popToast(title, text, variant);
    });

    this.gameHubConnection.on('CompetitiveStage', () => {
      var title = i18n.t('notification');
      var text = i18n.t('competitiveStage');
      var variant = 'info';
      this.popToast(title, text, variant);
    });

    this.gameHubConnection.on('Timeout', () => {
      this.startTimer();
      if (this.currentTime === 0) 
        this.stopTimer();
    });

    this.gameHubConnection.on('YourTurn', () => {
      // var title = 'Оповещение';
      // var text = 'Ваш ход';
      // var variant = 'info';
      // this.minesPlaced = "";
      // this.popToast(title, text, variant);
    });

    this.gameHubConnection.on(('PlayerTurn'), (player) => {
      this.currentPlayer = player;
      console.log(`Now is ${this.currentPlayer.name} turn`);
    });

    this.gameHubConnection.on('Points', (player1, player2) => {
      this.player1Points = player1;
      this.player2Points = player2;
    });

    this.gameHubConnection.on('TimeIsRacing', () => {
      this.currentTime = 20;
      this.startTimer();
    });

    this.gameHubConnection.on('StopTimer', () => {
      this.stopTimer();
      this.currentTime = 20;
    });

    this.gameHubConnection.on('NotYourTurn', () => {
      var title = i18n.t('notification');
      var text = i18n.t('notYourTurn');
      var variant = 'info';
      this.popToast(title, text, variant);
    });
  },
  
  destroyed: function(){
    this.stopTimer();
  }
}
</script>

<style scoped>
  body.hide {
    display: none;
  }

  .hide-element {
    display: none;
  }

  .card {
    background-color: #fff;
    border-radius: 0.25rem;
    padding: 0;
    -webkit-box-shadow: 0 15px 30px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
    box-shadow: 0 15px 30px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
  }

  .card-body {
    -ms-flex: 1 1 auto;
    -webkit-box-flex: 1;
    flex: 1 1 auto;
    min-height: 1px;
    padding: 0;
  }
  .card-header {
    font-size: 20px;
  }
  .blocked {
    pointer-events: none;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
    opacity: 0;
  }

  .bounce-enter-active {
    animation: bounce-in 0.1s;
  }
  
  .bounce-leave-active {
    animation: bounce-in 0.1s reverse;
  }

  @keyframes bounce-in {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>