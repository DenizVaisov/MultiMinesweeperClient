<template>
<div id="text">
  <b-container fluid>
    <b-row>
      <b-col md="9">
        <b-table :items="items" :fields="fields" bordered hover>
           <b-tbody>
              <b-tr>
                <b-td>112312312312</b-td>
              </b-tr>
           </b-tbody>
        </b-table>
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
import * as signalR from '@aspnet/signalr'
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
    return {
      user: "", 
      message: "",
      listMessage: [],
      connection: null,
      fields: ['', '', ''],
      items: [
        { isActive: "", age: "", first_name: '', last_name: '' },
        { isActive: "", age: "", first_name: '', last_name: '' },
        { isActive: "", age: "", first_name: '', last_name: '' },
        { isActive: "", age: "", first_name: '', last_name: '' },
        { isActive: "", age: "", first_name: '', last_name: '' },
        { isActive: "", age: "", first_name: '', last_name: '' }
      ]
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
    }
  },
  mounted: function () {
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

<style src="../assets/css/app.css"/>