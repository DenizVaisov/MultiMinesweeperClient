<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col offset-md="1" class="mt-2 text-center" md="3">
        <b-card-group>
          <b-card bg-variant="primary" text-variant="white" :header="`${player1.name} VS ${player2.name}`" class="text-center">
            <b-card-text><h5>{{player1Points}} pts. VS {{player2Points}} pts.</h5></b-card-text>
          </b-card>
        </b-card-group>
      </b-col>
      <b-col class="text-center mt-2" md="4">
        <h3 id="timer">Таймер: {{ currentTime }}</h3>
        <h3>{{lifes}}</h3>
        <h3>{{minesPlaced}}</h3>
      </b-col>
      <b-col style="z-index: 100;" class="mt-2" md="4">
        <div class="d-flex">
          <b-button 
            @click="onShowChat()"
            v-bind:class="{ 'show-chat-btn': showChatButton, 'hide-chat-btn': hideChatButton }" 
            variant="success" 
            pill>Показать чат
          </b-button>
          <b-button
            @click="onHideChat()" 
            v-bind:class="{ 'show-chat-btn': hideChatButton, 'hide-chat-btn': showChatButton }" 
            variant="danger" 
            pill>Скрыть чат
          </b-button>
        </div>
        <div class="d-flex" style="margin-top: -39px; margin-left: 150px;">
          <b-button
           @click="onHideHelperField()"
            v-bind:class="{ 'show-help-field': showHelperField, 'hide-help-field': hideHelperField }"
            variant="danger" 
            pill>Скрыть поле 
          </b-button>
         <b-button
            @click="onShowHelperField()"
            v-bind:class="{ 'show-help-field': hideHelperField, 'hide-help-field': showHelperField }"
            variant="success" 
            pill>Показать поле 
          </b-button>
        </div>
        <transition name="fade">
        <div v-if="hideChat">
        <div id="inputForm">
          <b-input-group class="mt-2">
              <b-form-textarea v-model="message" type="text"
                id="textarea-default"
                placeholder="Сообщение"
              ></b-form-textarea>
              <b-input-group-append>
                <b-button variant="outline-primary" 
                  v-touch:tap="chat" 
                  type="button" 
                  id="sendBtn" 
                  value="Отправить">Отправить
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
        <b-col v-if="showHelperField" style="z-index: 10" class="mt-2"  md="5">
          <game-field 
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
  </b-container>
</div>
</template>

<script>
'use strict'
import * as signalR from '@aspnet/signalr';
import axios from 'axios'

import GameField from '../views/GameField';

export default {
  name: 'Game',
  components: {
    GameField
  },
  props: {
    
  },
  data() {
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
      showChatButton: true,
      hideChatButton: false,
      showChat: false,
      hideChat: true,
      showHelperField: true,
      hideHelperField: false,
      hideEnemyMines: false,
      hideOwnMines: true,
      hideFlags: true,
      showEnemyNeighbour: true,
      showOwnNeighbour: false,
      message: "",
      listMessage: [],
      gameHubConnection: null
    }
  },
  methods: {
    chat: function () {
      if (this.gameHubConnection.state === signalR.HubConnectionState.Connected) {
        this.gameHubConnection.invoke('SendMessage', this.message);
      } 
      
      else {
         this.gameHubConnection.start()
        .then(() => this.gameHubConnection.invoke('SendMessage', this.player, this.message));
      }
    },

    onShowChat: function() {
      console.log('show chat')
      this.hideChatButton = true;
      this.showChatButton = false;
      this.showChat = true;
      this.hideChat = true;
    },

    onHideChat: function() {
      console.log('hide chat')
      this.hideChatButton = false;
      this.showChatButton = true;
      this.showChat = false;
      this.hideChat = false;
    },

    onShowHelperField: function() {
      this.hideHelperField = false;
      this.showHelperField = true;
    },

    onHideHelperField: function() {
      this.hideHelperField = true;
      this.showHelperField = false;
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

    checkTimer: function(){
      this.gameHubConnection.invoke('CheckTime');
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
        // Use a shorter name for this.$createElement
        const h = this.$createElement;
        // Increment the toast count
        // Create the message
        const vNodesMsg = h(
          'p',
          { class: ['text-center', 'mb-0'] },
          [
            h('b-spinner', { props: { type: 'grow', small: true } }),
            ` ${text} `,
            h('b-spinner', { props: { type: 'grow', small: true } })
          ]
        );
        // Create the title
        const vNodesTitle = h(
          'div',
          { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
          [
            h('strong', { class: 'mr-2' },  `${title}`),
            h('small', { class: 'ml-auto text-italics' }, '')
          ]
        );
        // Pass the VNodes as an array for message and title
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
    axios.get('http://192.168.43.159:5000/Lobby/Identity', {withCredentials: true}).then((response) => {
      this.player = response.data.player;
      return response;
    });

    this.gameHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.43.159:5000/game')
      .configureLogging(signalR.LogLevel.Information)
      .build()
      console.log("Connected", this.gameHubConnection);

    this.gameHubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10;  

    this.gameHubConnection.start();

    // this.gameHubConnection.onclose(async () => {
    //     setTimeout(this.pushToLobby, 1000);
    // });

    this.gameHubConnection.on('Reconnect', (reconnectedPlayer, ownField, enemyField) => {
        console.log(`Attemp to reconnect ${reconnectedPlayer.name}`);

        this.ownField = ownField;
        this.enemyField = enemyField;
    });

    this.gameHubConnection.on('ToLobby', () => {
        this.$router.push({ name: 'Lobby' });
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
      var title = 'Оповещение';
      var text = 'Вы проиграли';
      var variant = 'danger';
      this.popToast(title, text, variant);
      setTimeout(this.pushToLobby, 6000);
      this.gameHubConnection.stop();
    });

    this.gameHubConnection.on('Mined', () => {
      var title = 'Оповещение';
      var text = 'Подрыв на мине -1 жизнь!';
      var variant = 'danger';
      this.popToast(title, text, variant);
    })

    this.gameHubConnection.on('GameOver', (winner, loser)=>{
      var title = 'Оповещение';
      var text = 'Победа';
      var variant = 'success';
      this.popToast(title, text, variant);
      axios.post('http://192.168.43.159:5000/GameLogic/GameResult', {
        points: 25,
        plusRating: 25 + winner.points,
        minusRating: -25 + loser.points,
        win: winner.name,
        lose: loser.name
      });
      setTimeout(this.pushToLobby, 6000);
      this.gameHubConnection.stop();
    });

    this.gameHubConnection.on('Status', player => {
        this.lifes = `ОСТАЛОСЬ ЖИЗНЕЙ: ${player.lifes}`;
    });

    this.gameHubConnection.on('MinesPlaced', minesPlaced => {
        this.minesPlaced = `Мин расставлено: ${minesPlaced} из 24`;
    });

    this.gameHubConnection.on('PrepareRound', () => {
      var title = 'Оповещение';
      var text = 'Подготовительный этап';
      var variant = 'info';
      this.popToast(title, text, variant);
    });

    this.gameHubConnection.on('CompetitiveStage', () => {
      var title = 'Оповещение';
      var text = 'Соревновательный этап';
      var variant = 'info';
      this.popToast(title, text, variant);
    });

    this.gameHubConnection.on('Timeout', () => {
      this.startTimer();

      if (this.currentTime === 0) {
        this.stopTimer();
      }
    });

    this.gameHubConnection.on('YourTurn', () => {
      var title = 'Оповещение';
      var text = 'Ваш ход';
      var variant = 'info';
      this.minesPlaced = "";
      this.popToast(title, text, variant);
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
      var title = 'Оповещение';
      var text = 'Сейчас не ваш ход';
      var variant = 'info';
      this.popToast(title, text, variant);
    });

    this.gameHubConnection.on(('Concede'), () => {
        var title = 'Оповещение';
        var text = 'Вы выйграли!';
        var variant = 'success';
        this.popToast(title, text, variant);
        setTimeout(this.pushToLobby, 6000);
        this.gameHubConnection.stop();
    });
  },
  
  destroyed: function(){
    this.stopTimer();
  }
}
</script>

<style scoped>
  .card, .modal {
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

  .show-chat-btn {
    display: block;
  }

  .hide-chat-btn {
    display: none;
  }

  .hide-chat {
    display: none;
  }

  .show-chat {
    display: block;
  }

  .show-help-field {
    display: block;
    opacity: 1;
    transition:all 0.4s;
  }

  .hide-help-field {
    display: none;
    opacity: 0;
    transition:all 1s;
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

<style src="../assets/css/app.css"/>