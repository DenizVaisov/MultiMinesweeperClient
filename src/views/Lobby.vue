<template>
<div>
  <b-container>
    <b-row>
      <b-col offset-md="3">
      </b-col>
    </b-row>
    <b-row>
        <b-col offset-md="2" md="8">
        <div class="mt-4" id="inputForm">
          <b-button pill :to="{ name: 'Game' }" variant="primary">ИГРАТЬ</b-button>
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
        </div>
          <div class="panel panel-default">
        <div class="panel-heading">
            <h3 style="color: black;" class="text-center"></h3>
        </div>
        <div id="chatroom" class="mt-4 panel-body" style="max-height: 400px; overflow-y: scroll;">
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

<style>

</style>

<script>
'use strict'
import * as signalR from '@aspnet/signalr'
import HelloWorld from '../components/HelloWorld.vue'
import axios from 'axios'

export default {
    name: 'Lobby',
    components: {
        HelloWorld
    },
    data(){
        return {
            player: {},
            chatHistoty:[],
            newPlayer: "",
            obj: {},
            message: "",
            listMessage: [],
            chatHubConnection: {},
            players: [],
        }
    },
    methods: {
        isEmpty : function(obj) {
            for(var key in obj) {
                if(obj.hasOwnProperty(key))
                    return false;
            }
            return true;
        },

        chat: function () {
            console.log(this)
             if (this.chatHubConnection.state === signalR.HubConnectionState.Connected) {
                this.chatHubConnection.invoke('SendMessage', this.player, this.message)
            } 
        }
    },
    
    mounted: function() {
        axios.get('https://localhost:5001/Lobby/Identity', {withCredentials: true}).then((response) => {
            this.player = response.data.player;
            return response;
        });

        this.chatHubConnection = new signalR.HubConnectionBuilder()
            .withUrl('https://localhost:5001/chat')
            .configureLogging(signalR.LogLevel.Information)
            .build();
            console.log("Connected", this.chatHubConnection);

        this.chatHubConnection.start()

        this.chatHubConnection.on('ReceiveMessage', (player, message) => {
            const insertdata = {name: player, data: message};
            this.listMessage.push(insertdata);
            console.log(this.listMessage, 'listMessage');
        })
    }
}
</script>