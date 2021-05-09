<template>
    <div>
        <navigation v-on:click="closeConnection"
        :closeConnection="closeConnection">
        </navigation>
        <b-container fluid>
            <b-row>
                <b-col offset-md="1" md="10">
                  <div class="table-responsive">
                      <table style="overflow: scroll" class="mt-4 mb-4 table table-dark table-hover">
                        <thead>
                          <tr>
                            <th scope="col">{{ $t('place') }}</th>
                            <th scope="col">{{ $t('player') }}</th>
                            <th scope="col">{{ $t('rating') }}</th>
                            <th scope="col">{{ $t('win') }}</th>
                            <th scope="col">{{ $t('lose') }}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(player, index) in players" :key="player.id">
                            <td>{{index + 1}}</td>
                            <td>{{player.login}}</td>
                            <td>{{player.points}}</td>
                            <td class="lime">{{player.win}} {{ $t('times') }}</td>
                            <td class="red">{{player.lose}} {{ $t('times') }}</td>
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
    playerRecords: function() {
      LobbyService.getPlayerRecords().then(response => {
      if(response.status === 200 || response.status === 201) {
        this.players = response.data;
        console.log(response.data);
        return response;
      }
    });
    }
  },
  mounted: function() {
    this.playerRecords();
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
      width: 100px !important;
    }

    .text-size {
      font-size: 12px;
    }
  }
</style>