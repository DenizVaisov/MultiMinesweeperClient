<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col offset-md="1" md="6" class="mt-4"> 
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
      <b-col class="mt-4" md="4">
        <HelloWorld msg="Чат" />
        <div class="mt-4" id="inputForm">
          <b-form-input v-model="user" type="text" placeholder="Логин" ></b-form-input>
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
        <div id="chatroom" class="mt-4 panel-body" style="max-height: 400px; overflow-y: scroll;">
          <div v-for="(user, index) in listMessage" :item="user" :key="index" class="mb-4 max-w-sm mx-auto">
            <div class="card">
                <div class="contact-list">
                    <div class="contact-list-item">
                      <div class="contact-list-contact">
                         <img src="" class="contact-list-avatar" alt=""> 
                        <div>
                          <div id="username" class="contact-list-name">
                            {{ user.name }} 
                          </div>
                          <div id="usermessage" class="contact-list-email">
                            {{ user.data }} 
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
      <b-col md="12">
        <!-- <div v-for="(user, index) in listMessage" :item="user" :key="index" id="chatroom">
          <b-col offset-md="2" md="8">
            <div class="mt-4 max-w-sm mx-auto">
            <div class="card">
                <div class="contact-list">
                    <div class="contact-list-item">
                      <div class="contact-list-contact">
                         <img src="" class="contact-list-avatar" alt=""> 
                        <div>
                          <div id="username" class="contact-list-name">
                            {{ user.name }} 
                          </div>
                          <div id="usermessage" class="contact-list-email">
                            {{ user.data }} 
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </b-col>
        </div> -->
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
  name: 'Home',
  components: {
    HelloWorld
  },
  props: {
    
  },
  data() {
    return {
      mine: "",
      field: {},
      gameField: {},
      mines: [],
      postBody: {
        rows: "",
        cols: ""
      },
      cell: "",
      row: "",
      generatedMines: [],
      neighbourSquareNumbers: [],
      finished: false,
      won: false,
      user: "",
      message: "",
      listMessage: [],
      chatHubConnection: null,
      gameHubConnection: null
    }
  },
  methods: {
    chat: function () {
      if (this.chatHubConnection.state === signalR.HubConnectionState.Connected) {
        this.chatHubConnection.invoke('SendMessage', this.user, this.message)
      } else {
        this.chatHubConnection.start()
        .then(() => this.chatHubConnection.invoke('SendMessage', this.user, this.message))
      }
    },

    game: function() {
      if(this.gameHubConnection.state === signalR.HubConnection.Connected) {
       this.gameHubConnection.invoke('CellClick', this.row, this.cell)
      } 
      else {
        this.gameHubConnection.start()
        .then(() => this.gameHubConnection.invoke('CellClick', this.row, this.cell))
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
      let table = document.getElementById('gametable')
      table.rows[row-1].cells[cell-1].textContent = cell
      alert(row + '  ' + cell)

      this.row = row - 1
      this.cell = cell - 1
      
      this.game()

      let postBody = {
          Columns: cell,
          Rows: row
      }
      // this.generateMines(this.gameField, row, cell)
    
      // axios.post('https://localhost:5001/GameLogic/ClickedCell', postBody)
      // .then(function (response) {
      //   console.log(response);
      // })
      // .catch(function (error) {
      //   console.log(error);
      // });

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

    generateNeighbourBombsNumbers: function() {
      
    },

    displayBombs: function() {
      this.generatedBombs.sort(function(a,b){
        return a - b
      })
    }
  },

  created() {
    axios.get('https://localhost:5001/GameLogic/GameField').then((response) => 
        this.gameField = response.data,
      ).then((response) =>
        console.log(response))
  },
  watch: {
    
  },
  mounted: function () {
    // setInterval(() => this.generateField(), 10000);
    // this.generateBombs()
    // this.displayBombs()
    // this.generateNeighbourBombsNumbers()
    this.chatHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chat')
      .configureLogging(signalR.LogLevel.Information)
      .build()
      console.log("Connected", this.chatHubConnection)

    this.gameHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/game')
      .configureLogging(signalR.LogLevel.Information)
      .build()
      console.log("Connected", this.gameHubConnection)

    this.chatHubConnection.on('ReceiveMessage', (user, message) => {
      const insertdata = {name: user, data: message}
      this.listMessage.push(insertdata)
      console.log(this.listMessage, 'listMessage')
    })

    this.gameHubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 10

    this.gameHubConnection.on('CellClick', this.row, this.cell)
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