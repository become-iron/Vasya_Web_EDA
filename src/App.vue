<template>
  <div class="row no-gutters h-100">
    <TheLeftSidebar id="left-sidebar"
                    class="col-2 h-100">
    </TheLeftSidebar>

    <div id="graph-container"
         class="col-8 h-100">
      <TheGraph></TheGraph>
    </div>

    <div id="right-sidebar"
         class="col-2 h-100">
      <TheRightSidebar></TheRightSidebar>
    </div>
  </div>
</template>

<script>
  import TheLeftSidebar from './components/TheLeftSidebar'
  import TheGraph from './components/TheGraph'
  import TheRightSidebar from './components/TheRightSidebar'

  import commonLibraries from './common-libraries.json'

  export default {
    name: 'App',

    components: { TheLeftSidebar, TheGraph, TheRightSidebar },

    computed: {
      libraries: {
        get () {
          return this.$store.state.libraries
        },
        set (libraries) {
          this.$store.commit('setLibraries', libraries)
        }
      }
    },

    created () {
      this.loadLibrariesList()
    },

    methods: {
      async loadLibrariesList () {
        // TODO: load user libs
        let libs = {}
        commonLibraries.forEach(library => {
          library.thumbnails = false  // whether the thumbnails is created
          libs[library.id] = library
        })
        this.libraries = libs

        // TEMP: select first 3 libs
        Object.keys(this.libraries)
          .slice(0, 3)
          .forEach(libraryID => {
            this.$store.commit('selectLibrary', libraryID)
          })
      }
    }
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
