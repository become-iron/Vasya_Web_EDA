import Vue from 'vue'
export const Bus = new Vue({
  data () {
    return {
      canUndo: false,
      canRedo: true,
      zoom: 100
    }
  }
})
