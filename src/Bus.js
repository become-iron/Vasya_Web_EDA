import Vue from 'vue'
export const Bus = new Vue({
  data () {
    return {
      canUndo: false,
      canRedo: false,

      zoom: 100,

      libraries: [],
      exportedGraph: null  // TEMP
    }
  }
})

window.bus = Bus
