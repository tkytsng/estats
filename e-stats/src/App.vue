<template>
  <div id="estat" class="uk-container">
    <div class="search-box uk-section-small">
      <p>
        <span class="uk-margin-small-right" v-if="isSpinnerOn" uk-spinner="ratio:0.8"></span>
        {{log}}
      </p>
      <p>{{result}}</p>

      <SearchBox v-model="keyword" @send-keyword="getStatsList()"/>
    </div>

    <div v-if="tableInfo" class="table-info uk-section-small">
      <p class="stat-name">{{tableInfo.STATISTICS_NAME}}</p>
      <span class="stat-about uk-text-meta">{{tableInfo.TITLE.$}}</span>
      <!-- <p class="stat-about uk-text-meta">{{stats.TABLE_INF.TITLE.$}}</p> -->
    </div>
    <!-- 統計表情報 -->
    <ul v-if="dataList" class="uk-section uk-list-divider">
      <li v-for="item in dataList" :key="item.id" @click="setView(item)">
        <div class="uk-text-break uk-text-large">{{item.STATISTICS_NAME}}</div>
        <div class="uk-text-meta">{{item.TITLE_SPEC.TABLE_NAME}}</div>
        <div class="labels">
          <!-- <span class="uk-label">{{item.TITLE["$"]}}</span> -->
          <span class="uk-label">{{item.GOV_ORG["$"]}}</span>
          <span class="uk-label">{{item.MAIN_CATEGORY["$"]}}</span>
          <span class="uk-label">{{item.SUB_CATEGORY["$"]}}</span>
          <span class="uk-label">{{item.TITLE["$"]}}</span>
        </div>
      </li>
    </ul>
    <div v-if="statsListNextKey !== null">
      <button class="uk-button uk-button-default" @click="getStatsList()">Tsugitoru</button>
      <span class="uk-margin-small-left" v-if="isSpinnerOn" uk-spinner="ratio:0.8"></span>
    </div>

    <div v-if="classInfo" class="category uk-section-small">
      <ul class="uk-list uk-list-divider">
        <li v-for="clOBJ in classInfo.CLASS_OBJ" :key="clOBJ.id" class>
          <!-- <li v-for="clOBJ in classInfo.CLASS_OBJ" :key="clOBJ.id" class="uk-card uk-card-default uk-card-body"> -->
          <div uk-grid class="uk-flex">
            <div class="uk-width-1-5@m uk-width-1-4@s uk-margin-auto-vertical">
              {{clOBJ["@name"]}}
              <!-- <p class="uk-margin-auto-vertical"></p> -->
            </div>
            <div class="uk-button-group uk-inline uk-margin-auto-vertical">
              <button
                v-if="clOBJ['@id'] === colId"
                class="uk-button uk-button-small uk-button-primary"
                @click.stop="setRowCol([clOBJ,0])"
              >yoko</button>
              <button
                v-else-if="isColSet"
                class="uk-button uk-button-small uk-button-default uk-disabled"
              >yoko</button>
              <button
                v-else
                class="uk-button uk-button-small uk-button-default"
                @click.stop="setRowCol([clOBJ,0])"
              >yoko</button>
              
              <button
                v-if="clOBJ['@id'] === rowId"
                class="uk-button uk-button-small uk-button-primary"
                @click.stop="setRowCol([clOBJ,1])"
              >tate</button>
              <button
                v-else-if="isRowSet"
                class="uk-button uk-button-small uk-button-default uk-disabled"
              >tate</button>
              <button
                v-else
                class="uk-button uk-button-small uk-button-default"
                @click.stop="setRowCol([clOBJ,1])"
              >tate</button>
            </div>
            <div>
              <select
                class="uk-select uk-form-width-medium"
                @change="setDefault([clOBJ['@id'],$event.target.value])"
              >
                <option
                  v-for="c in clOBJ.CLASS"
                  :key="c.id"
                  :value="c['@code']"
                  class
                >{{c["@name"]}}</option>
              </select>
              <span class="uk-badge uk-margin-small-left">{{clOBJ.CLASS.length}}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- テーブル -->
    <div class="uk-container uk-section-small">
      <div id="table-container" class="uk-overflow-auto" style="max-height:80vh">
        <table v-if="tableData" class="uk-table uk-table-small uk-table-striped">
          <thead class="uk-background-default" v-if="col">
            <tr>
              <th></th>
              <th v-for="(c,index) in col" :key="index" @click="sortTable(index)">
                <span class="uk-text-emphasis uk-text-bold">{{c["@name"]}}</span>
              </th>
            </tr>
          </thead>
          <tbody v-if="col">
            <tr v-for="(cols, index) in tableData" :key="index" @click="setChart(cols)">
              <td v-for="(col, index) in cols" :key="index" :title="col.tooltip">{{col.value}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- テーブル -->
    <div id="chart" v-if="chartData" style="height:50vh; width:80vw;">
      <Chart :chartData="chartData" :height="400" :width="800"/>
    </div>
  </div>
</template>

<script>
import debounce from "lodash/debounce";

const urlEstatStatListJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getStatsList";
const urlEstatStatJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getStatsData";
const urlEstatMetaJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo";

const appId = "cc782ffaf5220d2bb34bab3562595c46c4b62843";

import SearchBox from "./components/SearchBox.vue";
import Log from "./components/Log.vue";
import Chart from "./components/Chart.vue";

export default {
  name: "estats",
  components: {
    SearchBox,
    Log,
    Chart
  },
  data() {
    return {
      keyword: "",
      oldKeyword: "",
      statid: "",
      log: "",
      result: null,
      dataList: null,
      tableInfo: null,
      classInfo: null,
      dataInfo: null,
      tableData: null,
      defaultCat: {},
      rowId: "",
      colId: "",
      row: null,
      col: null,
      isRowSet: false,
      isColSet: false,
      unit: null,
      isSpinnerOn: false,
      isLoadedTableData: false,
      statsListNextKey: null,
      chartData: null,
      sortColN: 0,
      sortAsc: true,
      currentChartColorHue: 0
    };
  },
  created: function() {
    // this.debouncedGetStats = debounce(() => {
    //   this.getStats();
    // }, 1000);
  },
  watch: {
    isLoadedTableData() {
      // console.log("data changed");
      // console.log("this.isLoadedTableData = %o", this.isLoadedTableData);
      if (this.isLoadedTableData) this.setTable();
    }
    // chartData() {
    //   console.log(this.chartData);
    // }
  },
  methods: {
    initData() {
      // this.log = "Searching...";
      this.oldKeyword = "";
      this.dataList = null;
      this.tableInfo = null;
      this.classInfo = null;
      this.dataInfo = null;
      this.tableData = null;
      this.isColSet = false;
      this.isRowSet = false;
      this.row = null;
      this.col = null;
      this.rowId = null;
      this.colId = null;
      this.defaultCat = {};
      this.unit = null;
      this.log = "";
      this.isSpinnerOn = false;
      this.isLoadedTableData = false;
      this.statsListNextKey = null;
      this.chartData = null;
      this.sortColN = 0;
      this.sortAsc = true;
      this.currentChartColorHue = 0;
    },
    getStatsList: function() {
      // this.keyword = keyword;
      if (!this.statsListNextKey || this.keyword != this.oldKeyword)
        this.initData();

      this.log = "検索中...";
      this.isSpinnerOn = true;

      const getStatList = async (startPosition = 1) => {
        const vm = this;
        const response = await axios.request({
          url: urlEstatStatListJson,
          params: {
            appId: appId,
            searchWord: this.keyword,
            limit: 20,
            startPosition: startPosition
          }
        });

        if (response) {
          if (!vm.dataList) {
            vm.dataList = response.data.GET_STATS_LIST.DATALIST_INF.TABLE_INF;
          } else {
            vm.dataList = [
              ...vm.dataList,
              ...response.data.GET_STATS_LIST.DATALIST_INF.TABLE_INF
            ];
          }
        }
        // this.log = "";
        vm.log = response.data.GET_STATS_LIST.RESULT.ERROR_MSG;
        vm.isSpinnerOn = false;

        return response.data.GET_STATS_LIST.DATALIST_INF.RESULT_INF.NEXT_KEY;
      };

      (async () => {
        const nextkey = await getStatList(this.statsListNextKey);
        if (nextkey) this.statsListNextKey = nextkey;
        else this.hasStatsListNextKey = null;
      })();
      this.oldKeyword = this.keyword;
    },
    setView: function(item, metaData) {
      this.initData();

      const statid = (this.statid = item["@id"]);

      this.log = "統計データ取得中";
      this.isSpinnerOn = true;

      const getStats = async () => {
        const response = await axios.request({
          url: urlEstatMetaJson,
          // url: urlEstatStatJson,
          params: {
            appId: appId,
            statsDataId: statid
          }
        });

        this.classInfo = response.data.GET_META_INFO.METADATA_INF.CLASS_INF;
        this.answer = "";
        this.log = "";
        this.isSpinnerOn = false;
        // console.log("this.classInfo.CLASS_OBJ=%o", this.classInfo.CLASS_OBJ);
        let defaultMap = new Map();

        for (let cl of this.classInfo.CLASS_OBJ) {
          !Array.isArray(cl.CLASS) && (cl.CLASS = [cl.CLASS]);
          // const code = cl.CLASS[0]["@code"];
          defaultMap.set(cl["@id"], cl.CLASS[0]["@code"]);
        }

        this.defaultCat = defaultMap;
      };

      getStats();
    },
    setRowCol: function(item) {
      const clOBJ = item[0];
      const colrow = item[1];

      if (colrow === 0) {
        if (this.isColSet) {
          this.colId = null;
          this.col = null;
          this.isColSet = false;
          // return
        } else {
          this.colId = clOBJ["@id"];
          this.col = Array.isArray(clOBJ.CLASS) ? clOBJ.CLASS : [clOBJ.CLASS];
          this.isColSet = true;
        }
      } else {
        if (this.isRowSet) {
          this.rowId = null;
          this.row = null;
          this.isRowSet = false;
          // return
        } else {
          this.rowId = clOBJ["@id"];
          this.row = Array.isArray(clOBJ.CLASS) ? clOBJ.CLASS : [clOBJ.CLASS];
          this.isRowSet = true;
        }
      }

      if (this.row && this.col) {
        if (!this.loadedAll) {
          (async () => {
            let next = 1;

            this.isSpinnerOn = true;
            this.log = "追加読み込み中";

            // while (next) {
            //   next = await this.reloadStats(this.defaultCat, this);
            // }
            await this.reloadStats(this.defaultCat, this);

            this.isSpinnerOn = false;
          })();
        }
        // else this.setTable();
      } else {
        this.tableData = null;
      }
    },
    reloadStats: async function(defaultCat) {
      let vm = this;
      vm.isLoadedTableData = false;
      let tableDatadataBuffer = null;
      let total = 0;

      const reload = async start => {
        const params = {
          appId: appId,
          statsDataId: this.statid,
        };

        if (start) params.startPosition = start;

        const props = ["Tab", "Time", "Area"];
        for (const prop of props) {
          const lower = prop.toLowerCase();
          if (
            defaultCat.has(lower) &&
            vm.rowId !== lower &&
            vm.colId !== lower
          ) {
            params[[`cd${prop}`]] = defaultCat.get(prop);
          }
        }

        let i = 1;
        let key;
        let hasKey;

        do {
          key = "cat" + (i++).toString().padStart(2, 0);
          let hasKey = vm.defaultCat.has(key);

          if (vm.rowId !== key && vm.colId !== key) {
            params[["cd" + key.replace("cat", "Cat")]] = defaultCat.get(key);
          }
        } while (hasKey);

        let response = await axios.request({
          url: urlEstatStatJson,
          params: params
        });

        if (response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF) {
          const value = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE;
          if (!tableDatadataBuffer)
            tableDatadataBuffer = value;
          else {
            Array.prototype.push.apply(tableDatadataBuffer,value);
          }
        }

        const next =
          response.data.GET_STATS_DATA.STATISTICAL_DATA.RESULT_INF.NEXT_KEY;
        total =
          response.data.GET_STATS_DATA.STATISTICAL_DATA.RESULT_INF.TOTAL_NUMBER;

        if (next) {
          response = void 0;
          // console.log(next);
          vm.log = await `残り:${total-next}件`
          await reload(next);
        }
      };

      await reload();

      if (tableDatadataBuffer) {
        // vm.dataInfo = await tableDatadataBuffer;
        vm.log = `${total}件読み込みました`;
        this.setTable(tableDatadataBuffer)
      } else {
        vm.log = "データが存在しません";
      }

      // vm.log = response.data.GET_STATS_LIST;
      vm.isSpinnerOn = await false;
      // vm.isLoadedTableData = await true;
    },
    setTable: function(datas) {
      const getValue = (ri, ci, tblmap) => {
        let retVal = tblmap.get(ri + ci);
        tblmap.delete(ri + ci);

        if (retVal) {
          retVal.value = retVal["$"];
          if (retVal["$"]) retVal.tooltip = retVal["$"];
          if (retVal["@unit"]) retVal.tooltip += retVal["@unit"];
          if (retVal["@time"])
            retVal.tooltip += `\n${new Date(
              retVal["@time"].substr(0, 4)
            ).getFullYear()}年`;
        } else retVal = { value: "n/a" };
        return retVal;
      };

      this.chartData = null;

      let tableMap = new Map();

      console.time("createMap");
      let defaultCat= this.defaultCat;

      if(!this.dataInfo) return;

      // let datas = this.dataInfo
      for(let data of datas){
        let isvalid = true;

        for (const [key, value] of this.defaultCat) {
          const d = data[["@" + key]];
          if (key !== this.rowId && key !== this.colId && d !== value) {
            isvalid = false;
            break;
          }
        }

        if(isvalid){
          let g = {}
          g["$"] = data["$"]
          g["@unit"] = data["@unit"]
          g["@time"] = data["@time"]

          tableMap.set(String(data["@" + this.rowId] + data["@" + this.colId]), g);
        }
        data = null;
      }
      console.timeEnd("createMap");

      // this.dataInfo = null;

      console.time("createTable");

      // テーブル表示用の配列を作成
      let tableData = [];
      for (const r of this.row) {
        let cols = [];
        cols.push({ value: r["@name"] });
        for (let c of this.col) {
          cols.push(getValue(r["@code"], c["@code"], tableMap));
          // console.log("r=%o/c=%o", r["@code"], c["@code"]);
        }
        tableData.push(cols);
      }
      console.timeEnd("createTable");

      this.tableData = tableData;
      this.currentChartColorHue = 0;
    },
    // テーブルをソート
    sortTable: function(colN) {
      let tableData = [...this.tableData];
      colN++;

      tableData.sort((a, b) => {
        // console.log(`${a[colN].value} / ${b[colN].value}`)
        if (this.sortAsc) {
          return a[colN].value - b[colN].value;
        } else {
          return b[colN].value - a[colN].value;
        }
      });

      if (this.colN != colN) {
        this.colN = colN;
      } else {
        this.sortAsc = !this.sortAsc;
      }

      this.tableData = tableData;
    },
    setDefault: function(item) {
      const old = this.defaultCat.get(item[0]);
      this.defaultCat.set(item[0], item[1]);
      if (this.row && this.col) {
        if (old !== item[0]) {
          (async () => {
            this.isSpinnerOn = true;
            this.log = "追加読み込み中";
            await this.reloadStats(this.defaultCat, this);
            this.isSpinnerOn = false;
            this.log = "追加読み込み完了";
          })();
        }
      }
    },

    // チャートを追加
    setChart: function(row) {
      let copyrow = [...row];
      const label = copyrow.splice(0, 1)[0].value;
      let datas = copyrow.map(r => r.value);
      let labels = this.col.map(c => c["@name"]);
      const color = `hsl(${this.currentChartColorHue}, 80%, 60%)`;
      this.currentChartColorHue += 43;
      const newDataset = {
        label: label,
        data: datas,
        borderColor: color,
        lineTension: 0,
        fill: false
      };

      // if(true){
      //   datas.splice(0,1)
      //   labels.splice(0,1)
      // }

      if (!this.chartData) {
        this.chartData = {
          data: {
            labels: labels,
            datasets: [newDataset]
          },
          options: {
            title: {
              display: true
            }
          }
        };
      } else {
        const datasets = [...this.chartData.data.datasets, newDataset];

        this.chartData = {
          data: {
            labels: labels,
            datasets: datasets
          }
        };
      }
    }
  }
};
</script>

<style>
table {
  position: relative;
}
/* thead {
  border-bottom: 1px solid #e5e5e5;
} */

tr,
td,
th {
  background-color: inherit;
  /* border: inherit; */
  /* border-bottom: inherit; */
}

th {
  position: sticky;
  top: 0px;
  z-index: 2;
  /* border-bottom: 1px solid #e5e5e5; */
}

th:first-of-type {
  left: 0;
  z-index: 3;
}

tbody tr td:first-of-type {
  /*最初の要素を固定する*/
  position: sticky;
  left: 0px;
  /* text-align: left; */
  font-size: 80%;
}
.uk-table-striped tbody tr:nth-of-type(even),
.uk-table-striped > tr:nth-of-type(even) {
  background-color: #fff;
}

.category button {
  height: 40px;
  width: 80px;
}
.labels > * {
  margin-top: 4px;
  margin-right: 4px;
}
</style>
