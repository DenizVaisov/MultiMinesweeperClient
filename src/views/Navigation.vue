<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand :to="{ name: 'Lobby' }" href="#">MultiMinesweeper</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-navbar-brand @click="closeConn" id="results" :to="{ name: 'Results' }" href="#">{{ $t('gameResults') }}</b-navbar-brand>
        </b-navbar-nav>
        <b-navbar-nav>
            <b-navbar-brand @click="closeConn" id="records" :to="{ name: 'Records' }" href="#">{{ $t('gameRecords') }}</b-navbar-brand>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
          <template v-if="player.player === undefined || isGuest === true">
              <b-navbar-brand><b-button pill variant="danger">{{ $t('guest') }}</b-button></b-navbar-brand>
          </template>
          <template v-else>
              <b-navbar-brand><b-button pill variant="danger">{{player.player}}</b-button></b-navbar-brand>
              <b-navbar-brand><b-button pill variant="info">{{player.points}} pts</b-button></b-navbar-brand>
          </template>
          <b-dropdown right no-caret variant="link">
              <template #button-content>
                  <flag style="font-size:40px;" :iso="flag" v-bind:squared="false" /><span class="sr-only"></span>
              </template>
              <b-dropdown-item  v-for="entry in languages" :key="entry.title" 
                  @click="changeLocale(entry.language, entry.flag)" href="#">
                  <flag :iso="entry.flag" v-bind:squared="false" /> {{entry.title}}
              </b-dropdown-item>
          </b-dropdown>
          <b-nav-item @click="logout()" title="Выйти" href="http://192.168.43.159:5000/Auth/SignIn">
              <span> <b-icon id="logout-icon" icon="box-arrow-in-left"></b-icon></span>
          </b-nav-item>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    </div>
</template>

<script>
import i18n from '../plugins/i18n';
import PlayerService from '../api-services/player.service';
export default {
   props: ['closeConn'],
   name: 'Navigation',
   data(){
    return {
      player: {},
      languages: [
        { flag: 'us', language: 'en', title: 'English' },
        { flag: 'ru', language: 'ru', title: 'Русский' }
      ],
      flag: "",
      isGuest: ""
    }
   },
   methods: {
    isAuthCookieAlive:function () {
      PlayerService.isIdentityCookieAlive().then(response => {
      if(response.status === 201 || response.status === 200) { 
        let isCookieAlive = response.data.isCookieAlive;
        if(!isCookieAlive) {
          localStorage.removeItem('playerData');
          this.isGuest = true;
          return response;
        }
      }
    });
    },

    setLocale: function() {
      let locale = localStorage.getItem('locale');
      let flag = localStorage.getItem('flag');
      if(locale != null && flag != null) {
        i18n.locale = locale;
        this.flag = flag;
        return;
      }
      i18n.locale = 'ru';
      this.flag = 'ru';
    },

    changeLocale: function(locale, flag) {
      localStorage.setItem('flag', flag);
      localStorage.setItem('locale', locale);
      this.setLocale();   
    },

    getPlayerData: function () {
        PlayerService.getPlayer().then(response => {
          if(response.status === 201 || response.status === 200) {
            localStorage.setItem('playerData', JSON.stringify(response.data));
            this.player = response.data;
            return response;
          }
        });
    },

    logout:function () {
      localStorage.removeItem('playerData');
    }
   },
   mounted: function() {
    this.setLocale(); 
    this.getPlayerData();
    this.isAuthCookieAlive();
   }
}
</script>

<style scoped>
.btn .b-icon.bi, .nav-link .b-icon.bi, .dropdown-toggle .b-icon.bi, .dropdown-item .b-icon.bi, .input-group-text .b-icon.bi {
    font-size: 230%;
    vertical-align: text-bottom;
}

.rounded-pill {
  border-radius: 50rem !important;
  font-size: 1.2rem;
}

.b-icon.bi {
    font-size: 230%;
    vertical-align: text-bottom;
}

.bg-info {
  background-color: #2d3985 !important;
}
</style>