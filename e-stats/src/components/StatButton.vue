<template>
  <!-- 選択済み -->
  <button
    v-if="currentId === setId"
    class="uk-button uk-button-small uk-button-primary"
    @click.stop="$emit('setRowCol')"
  >{{btntext}}</button>
  <!-- 選択不可 -->
  <button
    v-else-if="isColSet"
    class="uk-button uk-button-small uk-button-default uk-disabled"
  >{{btntext}}</button>
  <!-- 選択可 -->
  <button
    v-else
    class="uk-button uk-button-small uk-button-default"
    @click.stop="$emit('setRowCol')"
  >{{btntext}}</button>
</template>

<script>
export default {
  name: "stat-button",
  props: {
    btntext: String,
    isColSet: Boolean,
    currentId: String,
    setId: String
  }
};
</script>