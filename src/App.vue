<template>
  <div class="row no-gutters h-100">
    <TheLeftSidebar id="left-sidebar" class="col-2 h-100"></TheLeftSidebar>

    <div id="graph-container" class="col-8 h-100">
      <TheGraph ref="graph"></TheGraph>
    </div>

    <div id="right-sidebar" class="col-2 h-100">
      <TheRightSidebar></TheRightSidebar>
    </div>
  </div>
</template>

<script>
  import TheLeftSidebar from './components/TheLeftSidebar'
  import TheGraph from './components/TheGraph'
  import TheRightSidebar from './components/TheRightSidebar'

  export default {
    name: 'App',

    components: {
      TheLeftSidebar,
      TheGraph,
      TheRightSidebar
    },

    // data () {
    //   return {
    //     actualZoom: 100,
    //   }
    // },
    //
    // methods: {
    //   zoomIn: function () {
    //     this.$refs.graph.zoomIn()
    //     this.actualZoom = this.$refs.graph.actualZoom
    //   },
    //
    //   zoomOut: function () {
    //     this.$refs.graph.zoomOut()
    //     this.actualZoom = this.$refs.graph.actualZoom
    //   },
    // }
  }
</script>

<style>
  #left-sidebar, #right-sidebar {
    background: #e5e9f2;
  }

  #left-sidebar {
    border-right: 2px solid #343a40;
  }

  #right-sidebar {
    border-left: 2px solid #343a40;
  }
</style>
