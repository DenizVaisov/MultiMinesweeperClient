<template>
    <div>
        <navigation v-on:click="closeConnection"
        :closeConnection="closeConnection">
        </navigation>
        <b-container fluid>
            <b-row>
                <b-col offset-md="1" md="10">
                    <table class="mt-4 mb-4 table table-dark table-hover">
                        <thead>
                            <tr>
                            <th scope="col">Игрок</th>
                            <th scope="col">VS</th>
                            <th scope="col">Игрок</th>
                            <th scope="col">Рейтинг</th>
                            <th scope="col">Рейтинг</th>
                            <th scope="col">Ставка</th>
                            <th scope="col">Победил</th>
                            <th scope="col">Проиграл</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="player in players" :key="player.id">
                            <td>{{player.win}}</td>
                            <td>VS</td>
                            <td>{{player.lose}}</td>
                            <td>+{{player.plusRating}}</td>
                            <td>{{player.minusRating}}</td>
                            <td>{{player.points}}</td>
                            <td>{{player.win}}</td>
                            <td>{{player.lose}}</td>
                            </tr>
                        </tbody>
                    </table>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Navigation from '../views/Navigation'
import axios from 'axios'
export default {
  name: 'Results',
  components: {
    Navigation
  },
  props: ['closeConnection'],
  data() {
      return {
        players: []
      }
  },
  methods: {
      
  },

  mounted: function() {
      axios.get('http://192.168.43.159:5000/Lobby/HighScores', {withCredentials: true}).then((response) => {
      this.players = response.data;
      return response;
    }).then(response => console.log(response.data));
  }
}
</script>

<style scoped>
  tbody {
      display:block;
      max-height:450px;
      overflow-y:auto;
  }
  thead, tbody tr {
      display:table;
      width:100%;
      table-layout:fixed;
  }
  thead {
      width: calc( 100% - 1em )
  } 
</style>