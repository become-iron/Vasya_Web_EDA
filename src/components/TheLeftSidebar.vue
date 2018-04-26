<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex menu w-100">
      <div class="menu-title " title="Basil EDA">
        Basil EDA
      </div>

      <!--<div class="m-1 mt-3">-->
        <!--<img src="static/logo.png" class="img-fluid main-menu__logo">-->
      <!--</div>-->

      <div class="ml-auto">
        <div class="menu-item"
             title="New">
          <span class="oi oi-document"></span>
        </div>

        <div class="menu-item"
             title="Save"
             @click="exportGraph()">
          <span class="oi oi-box"></span>
        </div>

        <div class="menu-item"
             title="Settings">
          <span class="oi oi-cog"></span>
        </div>
      </div>
    </div>


    <div class="components-panel overflow-y-scroll p-1">
      <div v-for="library of selectedLibraries"
           :key="library.id"
           class="mb-1">
        <b-btn class="w-100 mb-1"
               size="sm"
               variant="outline-secondary"
               v-b-toggle="'collapse-' + library.id"
               :title="library.description">
          {{ library.name }}
        </b-btn>

        <b-collapse class="w-100"
                    :id="'collapse-' + library.id"
                    @show="selectLibrary(library)">
          <div class="d-flex flex-wrap">
            <div class="component-block"
                 v-for="component of library.components"
                 :title="component.name"
                 v-html="component.el"
                 @click="addComponent(library, component)">
            </div>
          </div>
        </b-collapse>
      </div>
    </div>

    <div class="bottom-block mt-auto w-100">
      <div class="p-1">
        <b-btn class="w-100"
               size="sm"
               variant="outline-secondary"
               v-b-modal.libraries-selection-modal>
          <span class="oi oi-folder"></span>
          Select Libraries
        </b-btn>
      </div>
    </div>

    <TheLibrariesModal></TheLibrariesModal>
  </div>
</template>

<script>
  import uuid from 'uuid/v4'

  import TheLibrariesModal from './TheLibrariesModal'
  import { Bus } from '../Bus'

  export default {
    name: 'TheLeftSidebar',
    components: { TheLibrariesModal },

    data () {
      return {}
    },

    computed: {
      libraries () {
          return this.$store.state.libraries
      },

      selectedLibraries () {
        return this.$store.getters.selectedLibraries
      }
    },

    methods: {
      selectLibrary (library) {
        const componentsNotLoaded = !library.components.length

        if (componentsNotLoaded) {
          Bus.$emit('load-library', library)
        }
      },

      addComponent (library, component) {
        const componentData = {
          id: `${library.name}:${component.name}:${uuid()}`,
          componentName: component.name,
          libraryName: library.name,
          name: ''
        }
        Bus.$emit('insert-shape', component.name, componentData)
      },

      async exportGraph () {
        // TODO
        const xml = await this.$store.dispatch('graphToXML')
        const selectedLibrariesIDs = Object.keys(this.selectedLibraries)
        const exp = {
          date: Date.now(),
          author: null,
          title: null,
          libraries: selectedLibrariesIDs,
          scheme: xml
        }

        // create graph description file
        // https://stackoverflow.com/a/30800715/4729582
        let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exp))
        let downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute('href', dataStr)
        downloadAnchorNode.setAttribute('download', 'export.json')
        downloadAnchorNode.style.display = 'none'
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        document.body.removeChild(downloadAnchorNode)
      }
    }
  }
</script>

<style scoped>
  /*.main-menu__logo {*/
    /*height: 2rem;*/
  /*}*/

  .bottom-block {
    border-top: 2px solid #343a40;
  }

  .component-block {
    height: 3.8rem;
    width: 3.8rem;
    margin: 0.1rem;
    border: solid 1px #8C8C8C;
    cursor: pointer;
    overflow: hidden;
    user-select: none;
  }

  .component-block:hover {
    background-color: #D0D0D0;
  }

  /*>>> .dropdown-toggle {*/
  /*width: 100%;*/
  /*}*/

  .menu {
    background-color: #343a40;
    user-select: none;
  }

  .menu .menu-item {
    display: inline-block;
    padding: 0.8rem 0.5rem;
    font-size: 1.2rem;
    color: rgba(255,255,255,.5);
  }

  .menu .menu-item:hover {
    cursor: pointer;
    color: rgba(255,255,255,.75);
    background-color: #464f55;
  }

  .menu .menu-title {
    display: inline-block;
    padding: 0.8rem 0.5rem;
    font-size: 1.2rem;
    font-weight: bold;
    color: rgba(255,255,255,.80);
  }
</style>
