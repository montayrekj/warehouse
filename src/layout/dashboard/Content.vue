<template>
  <div class="content">
    <fade-transition :duration="100" mode="out-in">
      <!-- your content here -->
      <router-view :sample="sample" @changeSample="changeSample"></router-view>
    </fade-transition>
  </div>
</template>
<script>
  import {FadeTransition} from 'vue2-transitions';
  export default {
    props: {
      sample: Boolean
    },
    components: {
      FadeTransition
    }, methods: {
      changeSample(event) {
        this.$emit("changeSample2", event)
      }
    }
  };
</script>
