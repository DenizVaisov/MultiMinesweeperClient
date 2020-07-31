<template>
    <div>
        <navigation v-on:click="closeConnection"
        :closeConnection="closeConnection">
        </navigation>
        <b-container fluid>
            <b-row>
                <b-col offset-md="1" md="10">
                    <table style="overflow: scroll" class="mt-4 mb-4 table table-dark table-hover">
                        <thead>
                            <tr>
                                <th scope="col">Место</th>
                                <th scope="col">Игрок</th>
                                <th scope="col">Рейтинг</th>
                                <th scope="col">Победил</th>
                                <th scope="col">Проиграл</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(player, index) in players" :key="player.id">
                                <td>{{index + 1}}</td>
                                <td>{{player.login}}</td>
                                <td>{{player.points}}</td>
                                <td>{{player.win}} раз(а)</td>
                                <td>{{player.lose}} раз(а)</td>
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
  name: 'Records',
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
      axios.get('https://localhost:5001/Lobby/Records', {withCredentials: true}).then((response) => {
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