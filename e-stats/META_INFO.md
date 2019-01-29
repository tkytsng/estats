# META_INFO

## JSON構造

+ GET_META_INFO
  + METADATA_INF
    + CLASS_INF
      + CLASS_OBJ[N]
        + [N]{ @id:string ,@name:string ,CLASS[N] }
          + CLASS[N]{ @code:string ,@level:string ,@name:string ,@unit:string }
    + TABLE_INF
      + @id:string
      + CYCLE:string
      + GOV_ORG:{$,@code}
      + MAIN_CATEGORY:{$,@code}
      + OPEN_DATE:string
      + OVERALL_TOTALL_NUMBER:number
      + SMALL_AREA:number
      + STATISTICS_NAME:string
      + STATISTICS_NAME_SPEC:{TABULATION_CATEGORY:string}
      + STAT_NAME:{$:string,@code:string}
      + SUB_CATEGORY:{$:string,@code:string}
      + SURVEY_DATE:string
      + TITLE:string
      + TITLE_SPEC{TABLE_NAME:string}
      + UPDATED_DATE:string
  + PARAMETER
    + DATA_FORMAT:string
    + LANG:string
    + STATS_DATA_ID:string
  + RESULT
    + DATE:string
    + ERROR_MSG:string
    + STATUS:number

## サンプル

+ GET_META_INFO: {RESULT: {STATUS: 0, ERROR_MSG: "正常に終了しました。", DATE: "2019-01-29T13:18:56.589+09:00"},…}
  + METADATA_INF: {,…}
    + CLASS_INF: {CLASS_OBJ: [{@id: "cat01", @name: "認知・検挙件数・検挙人員",…},…]}
      + CLASS_OBJ: [{@id: "cat01", @name: "認知・検挙件数・検挙人員",…},…]
        + 0: {@id: "cat01", @name: "認知・検挙件数・検挙人員",…}
          + @id: "cat01"
          + @name: "認知・検挙件数・検挙人員"
          + CLASS: [{@code: "100", @name: "認知件数", @level: "1", @unit: "件"},…]
            + 0: {@code: "100", @name: "認知件数", @level: "1", @unit: "件"}
              + @code: "100"
              + @level: "1"
              + @name: "認知件数"
              + @unit: "件"
    + TABLE_INF: {@id: "0003191360", STAT_NAME: {@code: "00130001", $: "犯罪統計"}, GOV_ORG: {@code: "00130", $: "警察庁"},…}
    + @id: "0003191360"
    + CYCLE: "年次"
    + GOV_ORG: {@code: "00130", $: "警察庁"}
      + $: "警察庁"
      + @code: "00130"
    + MAIN_CATEGORY: {@code: "14", $: "司法・安全・環境"}
      + $: "司法・安全・環境"
      + @code: "14"
    + OPEN_DATE: "2017-12-11"
    + OVERALL_TOTAL_NUMBER: 924
    + SMALL_AREA: 0
    + STATISTICS_NAME: "犯罪統計"
    + STATISTICS_NAME_SPEC: {TABULATION_CATEGORY: "犯罪統計"}
      + TABULATION_CATEGORY: "犯罪統計"
    + STAT_NAME: {@code: "00130001", $: "犯罪統計"}
      + $: "犯罪統計"
      + @code: "00130001"
    + SUB_CATEGORY: {@code: "02", $: "犯罪"}
      + $: "犯罪"
      + @code: "02"
    + SURVEY_DATE: "201601-201612"
    + TITLE: "第５表　重要犯罪・重要窃盗犯　認知・検挙件数・検挙人員"
    + TITLE_SPEC: {TABLE_NAME: "第５表　重要犯罪・重要窃盗犯　認知・検挙件数・検挙人員"}
      + TABLE_NAME: "第５表　重要犯罪・重要窃盗犯　認知・検挙件数・検挙人員"
    + UPDATED_DATE: "2017-10-26"
  + PARAMETER: {LANG: "J", STATS_DATA_ID: "0003191360", DATA_FORMAT: "J"}
    + DATA_FORMAT: "J"
    + LANG: "J"
    + STATS_DATA_ID: "0003191360"
  + RESULT: {STATUS: 0, ERROR_MSG: "正常に終了しました。", DATE: "2019-01-29T13:18:56.589+09:00"}
    + DATE: "2019-01-29T13:18:56.589+09:00"
    + ERROR_MSG: "正常に終了しました。"
    + STATUS: 0