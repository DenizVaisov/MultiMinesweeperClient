<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col offset-md="1" md="6" class="mt-4">
        <h3>ОСТАЛОСЬ ЖИЗНЕЙ: 3</h3> 
        <table id="gametable" class="table table-bordered table-responsive table-hover-cells">
          <tbody>
            <tr v-for="row in gameField.length" :key="row">
              <td v-on:click="clickedCell(row, cell)" class="cell" v-for="cell in gameField.length" :key="cell">
                <!-- <img class="bomb" id="bomb" style="opacity: 0;" src="../assets/images/9-512.png"/> -->
              </td>
            </tr>
          </tbody>
        </table>
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
import * as signalR from '@aspnet/signalr'
import HelloWorld from '../components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'Game',
  components: {
    HelloWorld
  },
  props: {
    
  },
  data() {
    return {
      mine: "",
      gameField: {},
      mines: [],
      postBody: {
        rows: "",
        cols: ""
      },
      cell: "",
      player: {},
      currentPlayer: {},
      player1: {},
      player2: {},
      yourTurn: false,
      row: "",
      generatedMines: [],
      neighbourSquareNumbers: [],
      finished: false,
      won: false,
      message: "",
      listMessage: [],
      gameHubConnection: null
    }
  },
  methods: {
    chat: function () {
      if (this.gameHubConnection.state === signalR.HubConnectionState.Connected) {
        // console.log('connection status', signalR.HubConnectionState.Connected);
        this.gameHubConnection.invoke('SendMessage', this.player, this.message);
      } 
      
      else {
        // console.log('Connection started', signalR.HubConnectionState.Connected)
         this.gameHubConnection.start()
        .then(() => this.gameHubConnection.invoke('SendMessage', this.player, this.message));
      }
    },

    game: function() {
      if(this.gameHubConnection.state === signalR.HubConnectionState.Connected) {
      //  console.log('connection status: ', this.gameHubConnection.state);
        this.gameHubConnection.invoke('CellClick', this.row, this.cell).catch(err => console.error(err.toString()));
        this.gameHubConnection.invoke('UpdateUser');
      }
      
      else {
        // console.log('Connection started')
        this.gameHubConnection.start()
        .then(() => this.gameHubConnection.invoke('CellClick', this.row, this.cell).catch(err => console.error(err.toString())))
        // console.log('connection status: ', signalR.HubConnection.Connected);
      }
    },

    clear: function() {
      this.listMessage = []
    },

    generateField: function() {
      axios.get('https://localhost:5001/GameLogic/FieldSize').then((response) => 
        this.field = response.data
      )
    },

    clickedCell: function(row, cell) {
      let table = document.getElementById('gametable');
      // table.rows[row-1].cells[cell-1].textContent = cell;
      // alert(row + '  ' + cell);

      this.row = row - 1
      this.cell = cell - 1
      
      this.game()

      let postBody = {
          Columns: cell,
          Rows: row
      }
    
      axios.post('https://localhost:5001/GameLogic/ClickedCell', postBody)
      .then(function (response) {
        console.log();
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    generateMines: function(row, cell) {
      let postBody = {
        clickedCell: this.gameField[row][cell].clickedCell = true
      }

      // axios.post('https://localhost:5001/GameLogic/PlaceMines', postBody)
      // .then(function (response) {
      //   console.log(response);
      // })
    },

    generateNeighbourMinesNumbers: function() {
      
    },

    displayMines: function() {
      this.generatedMines.sort(function(a,b){
        return a - b
      })
    }
  },

  watch: {
    
  },
  mounted: function () {
    // setInterval(() => this.generateField(), 10000);
    
    axios.get('https://localhost:5001/Lobby/Identity', {withCredentials: true}).then((response) => {
      this.player = response.data.player;
      return response;
    });

    axios.get('https://localhost:5001/GameLogic/GameField').then((response) => 
    this.gameField = response.data
    ).then((response) =>console.log())

    this.gameHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/game')
      .configureLogging(signalR.LogLevel.Information)
      .build()
      console.log("Connected", this.gameHubConnection);

    // this.gameHubConnection.start();

    this.gameHubConnection.on('ReceiveMessage', (player, message) => {
      const insertdata = {name: player, data: message};
      this.listMessage.push(insertdata);
      console.log(this.listMessage, 'listMessage');
    })

    this.gameHubConnection.on(('RollCall'), (player1, player2) => {
      this.player1 = player1;
      this.player2 = player2;
      // console.log(this.player1.name, this.player2.name);
    })

    this.gameHubConnection.on(('PlayerTurn'), (player) => {
      this.currentPlayer = player;
      console.log(`Current players is ${this.currentPlayer.name}`);
    })

    this.gameHubConnection.on('GenerateGameField', (gameField) => {
      // console.log(gameField);
    })

    // this.gameHubConnection.on('MakeTurn', (player) => {
    //   console.log(player)
    // })

    this.gameHubConnection.on(('Concede'), () => {
        alert('You win');
        console.log('You win');
        this.gameHubConnection.stop();
    })
  }
}
</script>

<style scoped>
  .cell {
    width: 30px;
    height: 30px;
    border: 3px solid #b3b9be;
    padding: 0;
    text-align: center;
  }

  .table-bordered {
    border: 0px solid #dee2e6; 
  }

  .table-hover-cells > tbody > tr > th:hover,
  .table-hover-cells > tbody > tr > td:hover {
    background-color: #9999a8;
  }

  .table-hover-cells > tbody > tr > th.active:hover,
  .table-hover-cells > tbody > tr > td.active:hover,
  .table-hover-cells > tbody > tr.active > th:hover,
  .table-hover-cells > tbody > tr.active > td:hover {
    background-color: #9999a8;
  }

  .table-hover.table-hover-cells > tbody > tr:hover > th:hover,
  .table-hover.table-hover-cells > tbody > tr:hover > td:hover {
    background-color: #9999a8;
  }

  .table-hover.table-hover-cells > tbody > tr.active:hover > th:hover,
  .table-hover.table-hover-cells > tbody > tr.active:hover > td:hover {
    background-color: #9999a8;
}
</style>

<style src="../assets/css/app.css"/>