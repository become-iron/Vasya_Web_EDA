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
             v-b-modal.export-scheme-modal
             @click="exportGraph()">
          <span class="oi oi-box"></span>
        </div>

        <!--<div class="menu-item" title="Login">-->
          <!--<span class="oi oi-account-login"></span>-->
        <!--</div>-->

        <div class="menu-item" title="Settings">
          <span class="oi oi-cog"></span>
        </div>
      </div>
    </div>



    <div class="components-panel overflow-y-scroll p-1">
      <div v-for="library of selectedLibraries" :key="library.id" class="mb-1">
        <b-btn class="w-100 mb-1"
               size="sm"
               variant="outline-secondary"
               v-b-toggle="'collapse-' + library.id"
               :title="library.description"
               @click="selectLibrary(library)">
          {{ library.name }}
        </b-btn>

        <b-collapse class="w-100" :id="'collapse-' + library.id">
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
        <b-btn class="w-100" size="sm" variant="outline-secondary"
               v-b-modal.libraries-selection-modal>
          <span class="oi oi-folder"></span>
          Select Libraries
        </b-btn>
      </div>
    </div>

    <TheLibrariesModal></TheLibrariesModal>

    <b-modal id="export-scheme-modal"
             title="Export Scheme"
             hide-footer
             size="lg">
      {{ bus.exportedGraph }}
    </b-modal>
  </div>
</template>

<script>
  import TheLibrariesModal from './TheLibrariesModal'
  import { Bus } from '../Bus'

  const uuid = require('uuid/v4')
  let commonLibraries = require('../common-libraries.json')

  export default {
    name: 'TheLeftSidebar',
    components: { TheLibrariesModal },

    data () {
      return {
        bus: Bus,
        libraries: Bus.libraries
      }
    },

    computed: {
      selectedLibraries () {
        return this.bus.libraries.filter(library => library.selected)
      }
    },

    mounted () {
      this.loadLibrariesList()
    },

    methods: {
      async loadLibrariesList () {
        // TODO: load user libs
        // TODO: exclude excluded libs
        // commonLibraries = commonLibraries.splice(0, 5)
        commonLibraries.forEach(library => {
          library.components = []
          library.selected = false
        })
        this.libraries.push(...commonLibraries)

        // TEMP
        this.bus.$emit('select-library', this.bus.libraries[0])
        this.bus.$emit('select-library', this.bus.libraries[1])
        this.bus.$emit('select-library', this.bus.libraries[2])
      },

      selectLibrary (library) {
        const componentsNotLoaded = !library.components.length
        if (componentsNotLoaded) {
          this.bus.$emit('load-library', library)
        }
      },

      addComponent (library, component) {
        const componentData = {
          label: '',
          id: `${library.name}:${component.name}:${uuid()}`,
          componentName: component.name,
          libraryName: library.name,
          params: {}
        }
        this.bus.$emit('insert-shape', component.name, componentData)
      },

      exportGraph () {
        this.bus.$emit('graph-to-xml')
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

  .btn {
    border-radius: 0;
  }

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
