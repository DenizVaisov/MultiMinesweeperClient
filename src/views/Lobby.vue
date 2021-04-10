<template>
<div>
<navigation :closeConn="closeConnection"></navigation>
  <b-container>
    <b-row>
        <b-col offset-md="2" md="8">
        <div class="mt-4" id="inputForm">
          <b-row> 
            <b-col md="2">
              <b-button 
                id="play" 
                pill
                :disabled="playButtonDisabler"
                v-on:click="playersMathching()" 
                :variant="variant">{{ $t('playButtonText') }}
              </b-button>
            </b-col>
            <b-col md="9">
              <h3 id="msg" ref="message">
                {{onlyOne}}
              </h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9">
              <h3 class="mt-4">
                {{waiting}}
              </h3>
            </b-col>
          </b-row>
          <b-row>
            <b-col md="9">
              <h3>
                {{playersInRanking}}
              </h3>
            </b-col>
          </b-row>
        </div>
        <div>
          <h5 v-if="player != null" id="players-online">
            {{ $t('playersInLobby') }}: {{players.length}}
          </h5>
        </div>
        <div class="mt-4 panel panel-default">
          <div style="height: 400px">
            <div id="chatroom" class="panel-body">
              <div v-for="(player, index) in listMessage" :item="player" :key="index" class="mb-2 max-w-sm mx-auto">
                  <!-- <img src="" class="contact-list-avatar" alt="">  -->
                  <div class="ml-3">
                    <div class="contact-list-name">
                      <span> {{ player.time }} <span class="ml-1">{{ player.name }}:</span> <span class="ml-1"> {{ player.message }} </span>  </span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
          <div class="mt-3 mb-3">
            <b-input-group>
              <b-form-textarea v-model="message" type="text"
                rows="1"
                id="textarea"
                :placeholder="$t('textAreaPlaceholder')"
            ></b-form-textarea>
            <b-input-group-append>
              <b-button 
                :disabled="disabled"
                variant="outline-primary" 
                v-touch:tap="chat" 
                type="button" 
                id="sendBtn" 
                value="Отправить">{{ $t('textAreaButtonText') }}
              </b-button>
            </b-input-group-append>
            </b-input-group>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
  </div>
</template>


<style>
a.nav-link {
  display: block;
}

#chatroom {
  word-wrap: break-word;
  max-height: 400px; 
  overflow-y: auto;
}

.card {
    background-color: #fff;
    border-radius: 0.25rem;
    padding: 2rem;
    -webkit-box-shadow: 0 15px 30px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
    box-shadow: 0 15px 30px 0 rgb(0 0 0 / 11%), 0 5px 15px 0 rgb(0 0 0 / 8%);
}
.contact-list {
    border-top-width: 1px;
    border-color: #f1f5f8;
  }
  .contact-list-item {
    background-color: #fff;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 1rem;
    border-bottom-width: 1px;
    border-color: #f1f5f8;
  }
  .contact-list-item.draggable-source--is-dragging {
    background-color: #f1f5f8;
  }
  .contact-list-item.draggable-source--is-dragging > * {
    opacity: 0;
  }
  .contact-list-contact {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  .contact-list-avatar {
    height: 3rem;
    width: 3rem;
    border-radius: 9999px;
    display: block;
    margin-right: 0.5rem;
  }
  .contact-list-name {
    font-weight: 700;
  }
  .contact-list-email {
    color: #8795a1;
  }
  .contact-list-handle {
    margin-left: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
    cursor: move;
    color: #b8c2cc;
  }
  .contact-list-handle:hover {
    color: #3d4852;
  }

.btn-primary {
  color: #fff;
  background-color: #d21adb !important;
  border-color: #d21adb !important;
}
.btn-primary:hover {
  color: #fff;
  background-color: #9d1ca3 !important;
  border-color: #9d1ca3 !important;
}
.btn-outline-primary {
	color: #2a2287 !important;
  border-color: #2d3985 !important;
}
.btn-outline-primary:hover {
	color: #fff !important;
	background-color: #2d3985 !important;
  border-color: #2d3985 !important;
}
</style>

<script>
'use strict'
import * as signalR from '@aspnet/signalr'
import Navigation from '../views/Navigation'
import i18n from '../plugins/i18n';
export default {
name: 'Lobby',
components: {
  Navigation
},
  data(){
    return {
      player: {},
      playButtonDisabler: false,
      playersInRanking: "",
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
  methods: {
      getPlayerData: function() {
        let playerData = localStorage.getItem('playerData');
        if(playerData != null)
          this.player = JSON.parse(playerData).player;
        else
          this.player = null;
      },

      autoScrollChatMessages() {
        let chat = this.$el.querySelector('#chatroom');
        chat.scrollTop = chat.scrollHeight;
      },

      getChatMessages: function() {
        if(this.chatHubConnection.state === signalR.HubConnectionState.Connected) 
          this.chatHubConnection.invoke('SendAllMessages');
      },

      whiteBackGround: function() {
        document.body.style.backgroundColor = "#fff";
      },

      playersMathching: function() {
        if(this.player === null) {
          alert(i18n.t('authorizeToPlay'));
          return;
        }

        if(this.chatHubConnection.state === signalR.HubConnectionState.Connected) {
          this.variant = this.success;
          if(this.players.length > 1){
            this.playButtonDisabler = true;
            this.chatHubConnection.invoke('MatchPlayers');
          }
          else{
            this.onlyOne = i18n.t('noPlayers');
          }
        }
        else{
          this.chatHubConnection.start();
        }
      },

      closeConnection: function() {
        this.chatHubConnection.stop();
      },

      chat: function () {
        if(this.player === null) {
          alert(i18n.t('authorizeToChat'));
          return;
        }

        if (this.chatHubConnection.state === signalR.HubConnectionState.Connected) {
          if(this.message.length > 0) {
            let dateNow = new Date(Date.now());
            let time;

            if(dateNow.getMinutes() < 10) 
              time = `${dateNow.getHours()}:0${dateNow.getMinutes()}`;
            else 
              time = `${dateNow.getHours()}:${dateNow.getMinutes()}`;

            this.chatHubConnection.invoke('SendMessage', this.player, this.message, time);
            this.chatHubConnection.invoke('CheckPlayers');
            this.message = "";
            return !this.disabled;
        }
      } 
    }
  },
  
  mounted: function() {
    this.whiteBackGround();
    setTimeout(this.getPlayerData, 1000);

    this.chatHubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.43.159:5000/chat')
      .configureLogging(signalR.LogLevel.Information)
      .build();
      console.log("Connected", this.chatHubConnection);
        
    this.chatHubConnection.start();

    setTimeout(this.getChatMessages, 1000);
    setTimeout(this.autoScrollChatMessages, 1100);

    this.chatHubConnection.on('PlayersOnline', (players) => {
      this.players = players;
      console.log(this.players);
    });

    this.chatHubConnection.on('PlayersInRanking', (players) => {
      this.waiting = i18n.t('playersMatched');
      this.playersInRanking = `${i18n.t('playersIsAwait')}: ${players}`
    });

    this.chatHubConnection.on('ToTheGame', () =>{
      this.$router.push({ name: 'Game' });
      this.chatHubConnection.stop();
    });

    this.chatHubConnection.on('ReceiveAllMessages', (message) => {
      this.listMessage = message;
      console.log(this.listMessage);
    });

    this.chatHubConnection.on('ReceiveMessage', (player, message, time) => {
      const insertData = {name: player, message: message, time: time };
      this.listMessage.push(insertData);
      setTimeout(this.autoScrollChatMessages, 100);
      console.log(this.listMessage, 'listMessage');
    });
  }
}
</script>