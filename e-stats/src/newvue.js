const urlEstatStatListJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getStatsList";
const urlEstatStatJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getStatsData";
const urlEstatMetaJson =
  "http://api.e-stat.go.jp/rest/2.1/app/json/getMetaInfo";
const urlWakimizuSearch = "https://www.livlog.xyz/springwater/springWater?q=";

const appId = "cc782ffaf5220d2bb34bab3562595c46c4b62843";

const myconsole = new Vue({
  el: "#console",
  data: {
    message: "This is Vue test.",
    createdDate: "",
    rawHtml: "<p>This is raw 'p'element </p>",
    seen: true
  },
  created: function () {
    this.createdDate = "You loaded this page on " + new Date().toLocaleString();
  },
  computed: {
    showNow: function () {
      return new Date().toLocaleString();
    }
  }
});

Vue.component("driver-item", {
  props: ["driver"],
  template: "<li class ='driver'>{{driver.name}}</li>"
});

const raseResult = new Vue({
  el: "#Race-Result",
  data: {
    drivers: [{
        id: 1,
        name: "RAI"
      },
      {
        id: 2,
        name: "VER"
      },
      {
        id: 3,
        name: "HAM"
      },
      {
        id: 4,
        name: "VET"
      },
      {
        id: 5,
        name: "BOT"
      }
    ]
  }
});

const springwater = new Vue({
  el: "#springwater",
  data: {
    keyword: "",
    answer: null
  },
  watch: {
    keyword: function () {
      // this.answer = 'Waiting for you to stop typing...'
      // console.log(this.keyword.replace(/^[\s|　]+|[\s|　]+$/g,"").length)
      if (this.keyword.replace(/^[\s|　]+|[\s|　]+$/g, "").length !== 0)
        this.debouncedGetAnswer();
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 1000);
  },
  methods: {
    getAnswer: function () {
      // if (this.question.indexOf('?') === -1) {
      //   this.answer = 'Questions usually contain a question mark. ;-)'
      //   return
      // }
      // this.answer = 'Searching...'
      let vm = this;
      axios
        .get(urlWakimizuSearch + this.keyword)
        .then(function (response) {
          vm.answer = response.data.data;
          // console.log(vm.answer)
        })
        .catch(function (error) {
          vm.answer = "Error! Could not reach the API. " + error;
        });
    }
  }
});

const estat = new Vue({
  el: "#estat",
  data: {
    keyword: "",
    answer: null,
    metaData: null,
    stats: null,
    tableInfo: null,
    classInfo: null,
    dataInfo: null,
    // tmpData: null,
    defaultCat: {},
    rowId: "",
    colId: "",
    row: null,
    col: null,
    isRowSet: false,
    isColSet: false,
    unit: null,
    log: ""
  },
  watch: {
    keyword: function () {
      // this.answer = 'Waiting for you to stop typing...'
      // console.log(this.keyword.replace(/^[\s|　]+|[\s|　]+$/g,"").length)
      if (this.keyword.replace(/^[\s|　]+|[\s|　]+$/g, "").length !== 0) {
        this.debouncedGetAnswer();
      }
    }
  },
  created: function () {
    this.debouncedGetAnswer = _.debounce(this.getAnswer, 1000);
  },
  methods: {
    getAnswer: function () {
      // if (this.question.indexOf('?') === -1) {
      //   this.answer = 'Questions usually contain a question mark. ;-)'
      //   return
      // }
      // this.stats = null
      this.log = "Searching...";
      let vm = this;
      vm.tableInfo = null
      vm.classInfo = null
      vm.dataInfo = null

      axios
        .request({
          url: urlEstatStatListJson,
          params: {
            appId: appId,
            searchWord: vm.keyword,
            limit: 10
          },
          headers: {
            "Accept-Encoding": "gzip"
          }
        })
        .then(function (response) {
          vm.answer = response.data.GET_STATS_LIST.DATALIST_INF.TABLE_INF;
          vm.totalStatNum = response.data.GET_STATS_LIST.DATALIST_INF.NUMBER
          // console.log(response.data)
          vm.log = "";
        })
        .catch(function (error) {
          vm.answer = "Error! Could not reach the API. " + error;
        });
    },
    getMetaInfo: function (item) {
      const statid = item["@id"];
      let vm = this
      axios
        .request({
          url: urlEstatMetaJson,
          params: {
            appId: appId,
            statsDataId: statid
          },
          headers: {}
        })
        .then(function (response) {
          this.metaData = response.data.GET_META_INFO.METADATA_INF;
        })
        .catch(function (error) {
          vm.log = "Error! Could not reach the API.\n" + error;
        });
    },
    setView: function (item, metaData) {
      // estat.getMetaInfo(item)
      let vm = this;
      const statid = item["@id"];
      // let limit = 200000
      // let totalNumber = metaData.TABLE_INF.OVERALL_TOTAL_NUMBER
      // if (totalNumber < limit) limit = totalNumber

      vm.log = "統計データ取得中";
      axios
        .request({
          url: urlEstatStatJson,
          params: {
            appId: appId,
            statsDataId: statid,
            limit: 100000
          },
          headers: {
            "Accept-Encoding": "gzip"
          }
        })
        .then(function (response) {
          vm.result = response.data;
          vm.stats = response.data.GET_STATS_DATA.STATISTICAL_DATA;
          vm.tableInfo = response.data.GET_STATS_DATA.STATISTICAL_DATA.TABLE_INF;
          vm.classInfo = response.data.GET_STATS_DATA.STATISTICAL_DATA.CLASS_INF;
          vm.dataInfo = response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF;
          vm.answer = "";
          vm.log = "";

          for (let cl of vm.classInfo.CLASS_OBJ) {
            vm.defaultCat[[cl["@id"]]] = Array.isArray(cl.CLASS) ? cl.CLASS[0]["@code"] : cl.CLASS["@code"]
          }

          let next = response.data.GET_STATS_DATA.STATISTICAL_DATA.RESULT_INF.NEXT_KEY
          if (next) {
            estat.addData(statid, next)
          }
        })
        .catch(function (error) {
          vm.log = "Error! Could not reach the API.\n" + error;
        });
    },
    addData: function (statid, start) {
      this.log = "追加読み込み中";
      let vm = this
      // this.log = "統計データ取得中";
      let data = this.dataInfo.VALUE
      axios
        .request({
          url: urlEstatStatJson,
          params: {
            appId: appId,
            statsDataId: statid,
            startPosition: start
            // limit: limit
          }
        })
        .then(function (response) {
          vm.dataInfo.VALUE = data.concat(response.data.GET_STATS_DATA.STATISTICAL_DATA.DATA_INF.VALUE)
          let next = response.data.GET_STATS_DATA.STATISTICAL_DATA.RESULT_INF.NEXT_KEY
          if (next) {
            estat.addData(statid, next)
          } else vm.log = "読み込み完了"
        })
        .catch(function (error) {
          this.log = "Error! Could not reach the API.\n" + error;
        });
    },
    setRowCol: function (clOBJ) {
      let vm = this
      if (!this.isColSet) {
        vm.colId = clOBJ["@id"]
        vm.col = Array.isArray(clOBJ.CLASS) ? clOBJ.CLASS : [clOBJ.CLASS]
        vm.isColSet = true
        // console.log(vm.row)
      } else {
        vm.rowId = clOBJ["@id"]
        vm.row = Array.isArray(clOBJ.CLASS) ? clOBJ.CLASS : [clOBJ.CLASS]
        estat.tmpData = this.dataInfo.VALUE.filter(data => {
          return Object.keys(vm.defaultCat).every(ck => {
            let v = data[["@" + ck]]
            if (ck === vm.rowId) {
              return true
            } else if (ck === vm.colId) {
              return true
            } else {
              return v === vm.defaultCat[[ck]]
            }
          })
        })
      }
    },
    getCellValue: function (ri, ci) {
      let retVal = "N/A"
      let vm = this
      let foundIndex = this.tmpData.findIndex(data => {
        return Object.keys(vm.defaultCat).every(ck => {
          let v = data[["@" + ck]]
          if (ck === vm.rowId) {
            return v === ri
          } else if (ck === vm.colId) {
            return v === ci
          } else {
            return v === vm.defaultCat[[ck]]
          }
        })
      })

      if (foundIndex !== -1) {
        // let val = estat.tmpData.splice(foundIndex, 1)
        // if (!vm.unit) vm.unit = val[0]["@unit"]
        // retVal = val[0]["$"]
        // estat.tmpData.splice(foundIndex, 1)
        retVal = estat.tmpData[foundIndex]["$"]
      }

      // console.log("ri:%o | ci:%o | retVal:%o",ri,ci,retVal)
      return retVal
    }
  }
});

const viewstats = new Vue({
  el: "#viewStats",
  data: {
    stats: null,
    statsDataId: "",
    log: ""
  },
  methods: {
    setView: function (event) {
      this.log = "";
      let vm = this;
      console.log(`event=${event}`);
      axios
        .request({
          url: urlEstatStatJson,
          params: {
            appId: appId,
            statsDataId: vm.statsDataId,
            limit: 10
          },
          headers: {
            "Accept-Encoding": "gzip"
          }
        })
        .then(function (response) {
          vm.stats = response.data.GET_STATS_LIST.DATALIST_INF.TABLE_INF;
          // console.log(vm.answer)
        })
        .catch(function (error) {
          vm.log = "Error! Could not reach the API. " + error;
        });
    }
  }
});