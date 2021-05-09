<template>
    <div>
        <navigation v-on:click="closeConnection"
        :closeConnection="closeConnection">
        </navigation>
        <b-container fluid>
          <b-row>
            <b-col class="mt-4" offset-md="1" md="10" sm="12">
              <b-form-input size="lg" 
                type="text" 
                placeholder="Поиск по нику игрока, времени, дате"  
                v-model="filter" autofocus>
              </b-form-input>
            </b-col>
          </b-row>
            <b-row>
                <b-col offset-md="1" md="10" sm="12">
                  <div class="table-responsive">
                    <table style="overflow: scroll" class="mt-4 mb-4 table table-dark table-hover">
                        <thead class="text-size">
                            <tr>
                              <th class="text-center" scope="col">{{ $t('player') }} 1</th>
                              <th class="text-center" scope="col">VS</th>
                              <th class="text-center" scope="col">{{ $t('player') }} 2</th>
                              <th scope="col">{{ $t('rating') }} 1</th>
                              <th scope="col">{{ $t('rating') }} 2</th>
                              <th scope="col">{{ $t('rate') }}</th>
                              <th scope="col">Дата завершения игры</th>
                              <th scope="col">{{ $t('win') }}</th>
                              <th scope="col">{{ $t('lose') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-size">
                            <tr v-for="player in filteredRecords.reverse().slice()" :key="player.id">
                            <td class="text-center">{{player.firstPlayer}}</td>
                            <td class="text-center red">VS</td>
                            <td class="text-center">{{player.secondPlayer}}</td>
                            <td class="lime">+{{player.plusRating}}</td>
                            <td class="lime" v-if="player.minusRating > 0">+{{player.minusRating}}</td>
                            <td class="red" v-else>{{player.minusRating}}</td>
                            <td class="text-info">{{player.points}}</td>
                            <td>
                              {{ new Date(player.date).toLocaleDateString("en-US") }}
                              {{ new Date(player.date).toLocaleTimeString([], localTimeOptions) }}
                            </td>
                            <td>{{player.win}}</td>
                            <td>{{player.lose}}</td>
                            </tr>
                        </tbody>
                    </table>
                  </div>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Navigation from '../views/Navigation';
import LobbyService from '../api-services/lobby.service';
export default {
  name: 'Results',
  components: {
    Navigation
  },
  props: ['closeConnection'],
  data() {
    return {
      players: [],
      filter: "",
      localTimeOptions: { hour: '2-digit', minute:'2-digit' }
    }
  },
  methods: {
    gameResults: function() {
      LobbyService.getGameResults().then(response => {
         console.log(response.data);
        if(response.status === 200 || response.status === 201) {
          this.players = response.data;
          console.log(response.data);
          return response;
        }
      })
    }
  },
  computed: {
    filteredRecords: function() {
      var self = this;
      const filtered = this.players.filter(player => {
        let byWinnerName = player.win.indexOf(self.filter) > -1;
        let byLoseName = player.lose.indexOf(self.filter) > -1;
        let byDate = new Date(player.date)
          .toLocaleDateString("en-US").indexOf(self.filter) > -1;
        let byTime = new Date(player.date)
          .toLocaleTimeString([], this.localTimeOptions).indexOf(self.filter) > -1;
        
        if(byWinnerName === true) 
          return byWinnerName;

        if(byLoseName === true) 
          return byLoseName;

        if(byDate === true)
          return byDate;  

        if(byTime === true)
          return byTime;  
      });
      return filtered;
    }
  },
  mounted: function() {
    this.gameResults();
  }
}
</script>

<style scoped>
  .lime{
    color: #00FF00;
  }

  .red{
    color: #FF0000;
  }

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

  @media screen and (max-width: 660px) {
    .table thead th {
      vertical-align: bottom;
      border-bottom: 2px solid #dee2e6;
      width: 70px !important;
    }

    .text-size {
      font-size: 12px;
    }
  }
</style>