<template>
    <div>
        <navigation v-on:click="closeConnection"
        :closeConnection="closeConnection">
        </navigation>
        <b-container fluid>
            <b-row>
                <b-col offset-md="1" md="10" sm="12">
                  <div class="table-responsive">
                    <table style="overflow: scroll" class="mt-4 mb-4 table table-dark table-hover">
                        <thead class="text-size">
                            <tr>
                              <th scope="col">{{ $t('player') }}</th>
                              <th class="text-center" scope="col">VS</th>
                              <th scope="col">{{ $t('player') }}</th>
                              <th scope="col">{{ $t('rating') }}</th>
                              <th scope="col">{{ $t('rating') }}</th>
                              <th scope="col">{{ $t('rate') }}</th>
                              <th scope="col">{{ $t('win') }}</th>
                              <th scope="col">{{ $t('lose') }}</th>
                            </tr>
                        </thead>
                        <tbody class="text-size">
                            <tr v-for="player in players" :key="player.id">
                            <td>{{player.win}}</td>
                            <td class="text-center">VS</td>
                            <td>{{player.lose}}</td>
                            <td>+{{player.plusRating}}</td>
                            <td>{{player.minusRating}}</td>
                            <td>{{player.points}}</td>
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
    }
  },
  methods: {
    gameResults() {
      LobbyService.getGameResults().then(response => {
        if(response.status === 200 || response.status === 201) {
          this.players = response.data;
          return response;
        }
      })
    }
  },
  mounted: function() {
    this.gameResults();
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