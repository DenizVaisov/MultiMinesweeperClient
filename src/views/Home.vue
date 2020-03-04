<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col md="9" class="mt-4"> 
        <!-- <b-form-input type="number" v-model="fieldSize" placeholder="Размер поля" ></b-form-input> -->
        <table id="gametable" class="table table-bordered table-responsive table-hover-cells">
          <tbody>
            <tr v-for="row in field.rows" :key="row">
              <td v-on:click="clickedCell(row, cell)" class="cell" v-for="cell in field.columns" :key="cell">
                <!-- <img class="bomb" id="bomb" style="opacity: 0;" src="../assets/images/9-512.png"/> -->
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-row>
      <b-col offset-md="9" md="3">
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
      </b-col>
      <b-col md="12">
        <div v-for="(user, index) in listMessage" :item="user" :key="index" id="chatroom">
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
      mines: [],
      postBody: {
        rows: "",
        cols: ""
      },
      generatedMines: [],
      neighbourSquareNumbers: [],
      finished: false,
      won: false,
      user: "",
      message: "",
      listMessage: [],
      connection: null
    }
  },
  methods: {
    chat: function () {
      if (this.connection.state === signalR.HubConnectionState.Connected) {
        this.connection.invoke('SendMessage', this.user, this.message)
      } else {
        this.connection.start()
        .then(() => this.connection.invoke('SendMessage', this.user, this.message))
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

    clickedRow: function(row){
      alert(row)
    },

    clickedCell: function(row, cell) {
      let table = document.getElementById('gametable')
      table.rows[row-1].cells[cell-1].textContent = cell
      alert(row + '  ' + cell)
      
      let postBody = {
          Columns: cell,
          Rows: row
      }
	  
      axios.post('https://localhost:5001/GameLogic/ClickedCell', postBody)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    generateMines: function() {
      let mines = this.mines


      // for (let index = 0; index < this.fieldSize * this.fieldSize; index++) {
      //   let randomCell = Math.ceil(Math.random() * this.fieldSize * this.fieldSize - 
      //   Math.random() * this.fieldSize * this.fieldSize*2)
      //   this.bombs.push(randomCell)
      // }
    },

    generateNeighbourBombsNumbers: function() {
      let generatedBombs = this.generatedBombs
      var cellNumbers = document.getElementsByTagName('td')
      var rowNumbers = document.getElementsByTagName('tr')
      var table = document.getElementById("gametable")
      let minesCounter = 0
      var bombs = document.getElementsByClassName('bomb')

      let gridMatrix = []
      for (let index = 0; index < this.fieldSize*this.fieldSize; index++) {
        if(!generatedBombs.includes(index))
          this.neighbourSquareNumbers.push(index)
      }

      for (let j = 0; j < this.fieldSize * this.fieldSize; j++) {
          gridMatrix[j] = j
      }

      const chunkArray = (arr, cnt) => arr.reduce((prev, cur, i, a) => !(i % cnt) ? prev.concat([a.slice(i, i + cnt)]) : prev, []);

      gridMatrix = chunkArray(gridMatrix, this.fieldSize)

      for (var i = 0, row; row = table.rows[i]; i++) {
        if (i < 0 || i >= row) continue;
      //iterate through rows
      //rows would be accessed using the "row" variable assigned in the for loop
        for (var j = 0, col; col = row.cells[j]; j++) {
          if (j < 0 || j >= col) continue;
          //iterate through columns
          //columns would be accessed using the "col" variable assigned in the for loop
          if(bombs[j].style.cssText == 'opacity: 1;') {
            
          }
        }  
      }
      // for (let index = 0; index < this.fieldSize*this.fieldSize; index++) {
      //   cellNumbers[this.neighbourSquareNumbers[index]].textContent = this.neighbourSquareNumbers[index] + 1
      // }
    },

    displayBombs: function() {
      // var bomb = document.createAttribute('data-bomb')
      // bomb.value = "false"

      var bombs = document.getElementsByClassName('bomb')
      for (let index = 0; index < this.fieldSize * this.fieldSize; index++) {
        if(this.bombs[index] <= 0){ 
          continue
        }

        if(this.generatedBombs.includes(this.bombs[index])){
          continue
        }

        this.generatedBombs.push(this.bombs[index])
        let element = bombs[this.bombs[index]]
        var imgStyle = element.style.cssText = 'opacity: 1;'
      }

      this.generatedBombs.sort(function(a,b){
        return a - b
      })
    }
  },

  created() {
    
  },
  watch: {
    
  },
  mounted: function () {
    this.generateField()

    
    // this.generateBombs()
    // this.displayBombs()
    // this.generateNeighbourBombsNumbers()
    
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5001/chat')
      .configureLogging(signalR.LogLevel.Information)
      .build()
      console.log("Connected", this.connection)

    this.connection.on('ReceiveMessage', (user, message) => {
      const insertdata = {name: user, data: message}
      this.listMessage.push(insertdata)
      console.log(this.listMessage, 'listMessage')
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