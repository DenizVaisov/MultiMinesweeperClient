<template>
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand :to="{ name: 'Lobby' }" href="#">MultiMinesweeper</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
            <b-navbar-brand v-on:click="closeConnection" id="results" :to="{ name: 'Results' }" href="#">Результаты игр</b-navbar-brand>
        </b-navbar-nav>
        <b-navbar-nav>
            <b-navbar-brand v-on:click="closeConnection" id="records" :to="{ name: 'Records' }" href="#">Рекорды</b-navbar-brand>
        </b-navbar-nav>
        <b-navbar-nav class="ml-auto">
            <template v-if="player.player==undefined">
                <b-navbar-brand>Гость</b-navbar-brand>
            </template>
            <template v-else>
                <b-navbar-brand>{{player.player}}</b-navbar-brand>
                <b-navbar-brand>{{player.points}} pts.</b-navbar-brand>
            </template>
            <b-nav-item href="https://localhost:5001/Auth/SignIn">
                <p class="h4 mb-2"><b-icon id="logout-icon" icon="box-arrow-in-left"></b-icon></p>
            </b-nav-item>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
    </div>
</template>

<script>
import * as signalR from '@aspnet/signalr';
import axios from 'axios'
export default {
   props: ['closeConnection'],
   name: 'Navigation',
   data(){
       return {
           player: {},
           chatHubConnection: null
       }
   },
   methods: {
    
   },
   mounted: function(){
    axios.get('https://localhost:5001/Lobby/Identity', {withCredentials: true}).then((response) => {
        this.player = response.data;
        return response;
    }).then((response) => console.log(response.data));
   }
}
</script>

<style scoped>

</style>