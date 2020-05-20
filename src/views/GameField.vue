<template>
<div>
    <table id="gametable" class="table table-bordered table-responsive table-hover-cells">
        <tbody>
        <tr v-for="(row, index1) in gameField" :key="index1">
          <td 
              v-on:click.left="clickedCell(index1, index2, $event)"
              v-on:click.right="addMine(index1, index2, $event)" 
              v-on:click.middle="addFlag(index1, index2, $event)"
              class="cell" v-for="(cell, index2) in row" :key="index2">
          <template v-if="!cell.clickedCell">
          </template>
          <template v-else-if="cell.clickedCell && cell.minedCell">
            <img v-show="hideMines" class="bomb" id="bomb" src="../assets/images/bomb.png"/>
          </template>
          <template v-else-if="cell.clickedCell && cell.merged">
            <b-icon icon="flag-fill" style="height:30px; width:30px" variant="danger"></b-icon>
          </template>
          <template v-else-if="cell.clickedCell && cell.kaboom">
            <img class="bomb" id="bomb" src="../assets/images/boom.png"/>  
          </template>
          <template v-else-if="cell.clickedCell && !cell.minedCell">
            <span v-show="hideNeighbour">{{cell.neighbourCells}}</span>
          </template>  
          </td>
        </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
export default {
    name: 'game-field',
    props: ['gameField', 'clickedCell', 'addMine', 'addFlag', 'handleClick', 'hideMines', 'hideNeighbour']
}
</script>

<style scoped>
.cell {
    width: 30px;
    height: 30px;
    border: 3px solid #b3b9be;
    padding: 0;
    text-align: center;
  }

  .table-bordered {
    border: 0px solid #dee2e6; 
  }

  .table-hover-cells > tbody > tr > th:hover,
  .table-hover-cells > tbody > tr > td:hover {
    background-color: #9999a8;
  }

  .table-hover-cells > tbody > tr > th.active:hover,
  .table-hover-cells > tbody > tr > td.active:hover,
  .table-hover-cells > tbody > tr.active > th:hover,
  .table-hover-cells > tbody > tr.active > td:hover {
    background-color: #9999a8;
  }

  .table-hover.table-hover-cells > tbody > tr:hover > th:hover,
  .table-hover.table-hover-cells > tbody > tr:hover > td:hover {
    background-color: #9999a8;
  }

  .table-hover.table-hover-cells > tbody > tr.active:hover > th:hover,
  .table-hover.table-hover-cells > tbody > tr.active:hover > td:hover {
    background-color: #9999a8;
}
</style>