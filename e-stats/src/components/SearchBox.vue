<template>
  <div>
    <input class="uk-input uk-form-medium uk-form-width-medium" :value="keyword"
    @input="$emit('input', $event.target.value)" @keypress.enter="$emit('send-keyword')">
    <button class="uk-button uk-button-primary" @click="$emit('send-keyword')">{{btntext}}</button>
  </div>
</template>

<script>
export default {
  name: "search-box",
  props: {
    keyword: String,
    // btntext:String
  },
  data:function() {
    return{
      // keyword:"",
      btntext:"TokeToru"
    }

  }
};
</script>