<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col class="mt-2" md="3">
        <h5>{{player1.name}} VS {{player2.name}}</h5>
        <h5>{{player1.name}} : {{player1Points}} pts.</h5>
        <h5>{{player2.name}} : {{player2Points}} pts.</h5>
      </b-col>
      <b-col md="5" class="mt-2">
        <h3 id="timer">Таймер: {{ currentTime }}</h3>
        <h3>{{lifes}}</h3>
        <h3>{{minesPlaced}}</h3>
        <game-field 
          v-show="showComponent"
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
      <b-col md="4">
        <div id="inputForm">
            <b-input-group class="mt-4">
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
        <div class="panel panel-default">
        <div class="panel-heading">
            <h3 style="color: black;" class="text-center"></h3>
        </div>
        <div id="chatroom" class="mt-4 panel-body" style="max-height: 500px; overflow-y: scroll;">
          <div v-for="(player, index) in listMessage" :item="player" :key="index" class="mb-4 max-w-sm mx-auto">
            <div class="card">
                <div class="contact-list">
                    <div class="contact-list-item">
                      <div class="contact-list-contact">
                         <img src="" class="contact-list-avatar" alt=""> 
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
      </b-col>
    </b-row>
  </b-container>
</div>
</template>

<script>
'use strict'
import * as signalR from '@aspnet/signalr';
import axios from 'axios'

import HelloWorld from '../components/HelloWorld.vue';
import GameField from '../views/GameField';
import Lobby from '../views/Lobby';

export default {
  name: 'Game',
  components: {
    HelloWorld,
    GameField,
    Lobby
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

    clear: function() {
      this.listMessage = []
    },

    startTimer: function() {
      this.timer = setInterval(() => {
        this.currentTime--
      }, 1000)
    },
    stopTimer: function() {
      clearTimeout(this.timer)
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
        const h = this.$createElement
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
        )
        // Create the title
        const vNodesTitle = h(
          'div',
          { class: ['d-flex', 'flex-grow-1', 'align-items-baseline', 'mr-2'] },
          [
            h('strong', { class: 'mr-2' },  `${title}`),
            h('small', { class: 'ml-auto text-italics' }, '')
          ]
        )
        // Pass the VNodes as an array for message and title
        this.$bvToast.toast([vNodesMsg], {
          title: [vNodesTitle],
          solid: true,
          variant: variant
      })
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
    axios.get('https://localhost:5001/Lobby/Identity', {withCredentials: true}).then((response) => {
      this.player = response.data.player;
      return response;
    });

    this.gameHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/game')
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
      axios.post('https://localhost:5001/GameLogic/GameResult', {
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
  updated: function(){
    
  },
  destroyed: function(){
    this.stopTimer();
  }
}
</script>

<style scoped>
  .blocked {
    pointer-events: none;
  }
</style>

<style src="../assets/css/app.css"/>