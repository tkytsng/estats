<template>
  <table v-if="tableInfo" class="uk-table uk-table-small uk-table-striped">
    <caption class="stat-about uk-text-meta">{{tableInfo.TITLE.$}}</caption>
    <thead v-if="col">
      <tr>
        <th></th>
        <th v-for="c in col" :key="c.id">{{c["@name"]}}<span v-if="unit">({{unit}})</span></th>
      </tr>
    </thead>
    <tbody v-if="col">
      <tr v-for="r in row" :key="r.id">
        <td>{{r["@name"]}}</td>
        <td v-for="c in col" :key="c.id">{{getCellValue(r["@code"],c["@code"])}}</td>
      </tr>
    </tbody>
  </table>
</template>
