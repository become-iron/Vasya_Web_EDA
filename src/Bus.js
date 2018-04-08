import Vue from 'vue'
export const Bus = new Vue({
  data () {
    return {
      canUndo: false,
      canRedo: false,

      zoom: 100,

      libraries: []
    }
  }
})

window.bus = Bus
