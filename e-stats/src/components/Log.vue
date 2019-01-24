<template>
  <div class="log ">
    <p>{{msg}}</p>
  </div>
</template>

<script>
export default {
  name: 'log',
  props: {
    msg: String
  }
}
</script>