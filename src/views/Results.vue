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
                            <td>{{player.plusRating}}</td>
                            <td>{{player.minusRating}}</td>
                            <td>{{player.points}}</td>
                            <td>{{player.win}}</td>
                            <td>{{player.lose}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <!-- <b-table
                    :items="items"
                    :fields="fields"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    responsive="sm"
                    ></b-table> -->
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
        players: [],  
        sortBy: 'Points',
        sortDesc: false,
        fields: [
          { key: 'Login', sortable: true },
          { key: 'Points', sortable: true },
        ],
        items: this.player
      }
  },
  methods: {
      
  },

  mounted: function() {
      axios.get('https://localhost:5001/Lobby/HighScores', {withCredentials: true}).then((response) => {
      this.players = response.data;
      this.items = this.player;
      return response;
    }).then(response => console.log(response.data));
  }
}
</script>

<style scoped>

</style>