<template>
<div>
<navigation
  :closeConnection="closeConnection"
>
</navigation>
  <b-container>
    <b-row>
        <b-col offset-md="2" md="8">
        <div class="mt-4" id="inputForm">
          <b-row> 
            <b-col md="3">
              <b-button 
                id="play" 
                pill
                :disabled="playButtonDisabler"
                v-on:click="playersMathching()" 
                :variant="variant">ИГРАТЬ
              </b-button>
            </b-col>
            <b-col md="9">
              <h3 id="msg" ref="message">
                {{onlyOne}}
              </h3>
            </b-col>
          </b-row>
            <b-input-group class="mt-4">
                <b-form-textarea v-model="message" type="text"
                  id="textarea"
                  placeholder="Сообщение"
                ></b-form-textarea>
                <b-input-group-append>
                  <b-button 
                    :disabled="disabled"
                    variant="outline-primary" 
                    v-touch:tap="chat" 
                    type="button" 
                    id="sendBtn" 
                    value="Отправить">Отправить
                  </b-button>
                </b-input-group-append>
          </b-input-group>
        </div>
        <div class="mt-4">
          <span id="players-online">
            Игроков в лобби: {{players.length}}
          </span>
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
import Navigation from '../views/Navigation'
import axios from 'axios'

export default {
    name: 'Lobby',
    components: {
        HelloWorld,
        Navigation
    },
    data(){
        return {
            player: {},
            playButtonDisabler: false,
            variant: "primary",
            success: "success",
            waiting: "",
            chatHistoty:[],
            newPlayer: "",
            onlyOne: "",
            obj: {},
            disabled: false,
            message: "",
            listMessage: [],
            chatHubConnection: {},
            players: [],
        }
    },
    computed: {
     
    },
    methods: {
        playButton: function(){
            this.playButtonDisabler = false;
        },

        playersMathching: function() {
          if(this.chatHubConnection.state === signalR.HubConnectionState.Connected){
            this.variant = this.success;
            if(this.players.length > 1){
              this.playButtonDisabler = true;
              this.chatHubConnection.invoke('MatchPlayers');
            }
            else{
             this.onlyOne = "В лобби нет других игроков";
            }
          }
          else{
            this.chatHubConnection.start();
          }
        },

        
      closeConnection: function(){
        this.chatHubConnection.stop();
      },

        chat: function () {
             if (this.chatHubConnection.state === signalR.HubConnectionState.Connected) {
               if(this.message.length > 0) {
                this.chatHubConnection.invoke('SendMessage', this.player, this.message);
                this.chatHubConnection.invoke('CheckPlayers');
                this.message = "";
                return !this.disabled;
             }
          } 
        }
    },
    
    mounted: function() {
        axios.get('http://192.168.43.159:5000/Lobby/Identity', {withCredentials: true}).
        then((response) => {
            this.player = response.data.player;
            return response;
        });

        this.chatHubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://192.168.43.159:5000/chat')
            .configureLogging(signalR.LogLevel.Information)
            .build();
            console.log("Connected", this.chatHubConnection);
            

        this.chatHubConnection.start();

        this.chatHubConnection.on('PlayersOnline', (players) => {
          this.players = players;
          console.log(this.players);
        });

        this.chatHubConnection.on('ToTheGame', () =>{
          this.$router.push({ name: 'Game' });
          this.chatHubConnection.stop();
        });

        this.chatHubConnection.on('ReceiveMessage', (player, message) => {
            const insertdata = {name: player, data: message};
            this.listMessage.push(insertdata);
            console.log(this.listMessage, 'listMessage');
        });
    }
}
</script>