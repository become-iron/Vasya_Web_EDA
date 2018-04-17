<template>
  <div class="d-flex flex-column h-100">
    <!--<b-navbar toggleable="md" type="dark" variant="dark" class="px-1">-->
      <!--&lt;!&ndash;<b-navbar-brand href="/">VASILY</b-navbar-brand>&ndash;&gt;-->
      <!--&lt;!&ndash;<b-navbar-brand href="#" class="p-0">&ndash;&gt;-->
        <!--&lt;!&ndash;<img src="static/logo.png" class="img-fluid main-menu__logo">&ndash;&gt;-->
      <!--&lt;!&ndash;</b-navbar-brand>&ndash;&gt;-->

      <!--<b-navbar-nav class="ml-auto">-->
        <!--<b-nav-item href="#">-->

        <!--</b-nav-item>-->
        <!--<b-nav-item href="#">-->
          <!--<span class="oi oi-account-login"></span>-->
        <!--</b-nav-item>-->
        <!--<b-nav-item href="#">-->
          <!--<span class="oi oi-cog"></span>-->
        <!--</b-nav-item>-->
        <!--<b-nav-item href="#">-->
          <!--<span class="oi oi-info"></span>-->
        <!--</b-nav-item>-->
      <!--</b-navbar-nav>-->
    <!--</b-navbar>-->

    <div class="d-flex menu w-100">
      <div class="menu-title " title="Basil EDA">
        Basil EDA
      </div>

      <div class="ml-auto">
        <div class="menu-item" title="New">
          <span class="oi oi-document"></span>
        </div>

        <div class="menu-item" title="New" @click="exportGraph()">
          <span class="oi oi-document"></span>
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
      <div v-for="library of libraries" :key="library.id" class="mb-1">
        <b-btn class="w-100 mb-1"
               size="sm"
               variant="outline-secondary"
               v-b-toggle="'collapse-' + library.id"
               :title="library.description"
               @click="selectLibrary(library)">
          {{ library.name }}
        </b-btn>

        <b-collapse class="w-100" :id="'collapse-' + library.id">
          <!--<div class="row no-gutters">-->
          <div class="component-block"
               v-for="component of library.components"
               :title="component.name"
               v-html="component.el"
               @click="addComponent(library, component)">
          </div>
          <!--</div>-->
        </b-collapse>
      </div>
    </div>

    <div class="bottom-block mt-auto w-100">
      <!--<hr class="m-0">-->

      <div class="p-1">
        <b-btn class="w-100" size="sm" variant="outline-secondary"
               v-b-modal.libraries-selection-modal>
          <span class="oi oi-folder"></span>
          Select libraries
        </b-btn>

        <b-modal id="libraries-selection-modal" title="Component Libraries" hide-footer size="lg">
          <b-nav justified tabs class="mb-2">
            <b-nav-item active>
              Common libraries
            </b-nav-item>
            <b-nav-item>
              User libraries
            </b-nav-item>
          </b-nav>

          <div class="row no-gutters">
            <b-list-group class="overflow-y-scroll col-4 pr-2" style="max-height: 40rem;">
              <b-list-group-item v-for="library of libraries"
                                 :key="library.id"
                                 href="#">
                {{ library.name }}
              </b-list-group-item>
              <!--<b-list-group-item href="#" active>Ordinary components library</b-list-group-item>-->
              <!--<b-list-group-item href="#">Another components library</b-list-group-item>-->
              <!--<b-list-group-item href="#">Little cat</b-list-group-item>-->
            </b-list-group>

            <div class="col-8 pl-2">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>Some</th>
                    <th></th>
                  </tr>
                </thead>
                <tr>
                  <td></td>
                  <td>library</td>
                </tr>
                <tr>
                  <td>description</td>
                  <td></td>
                </tr>
              </table>
            </div>
          </div>
        </b-modal>
      </div>
    </div>

  </div>
</template>

<script>
  import TheLibrariesSelectModal from './TheLibrariesSelectModal'
  import { Bus } from '../Bus'

  const uuid = require('uuid/v4')
  let commonLibraries = require('../common-libraries.json')

  export default {
    name: 'TheLeftSidebar',
    components: { TheLibrariesSelectModal },

    data () {
      return {
        bus: Bus,
        libraries: Bus.libraries,
        // currentLibrary: null
      }
    },

    created () {
      this.loadLibrariesList()
    },

    methods: {
      async loadLibrariesList () {
        // TODO: load user libs
        // TODO: exclude excluded libs
        commonLibraries.forEach(library => {
          library.components = []
        })
        this.libraries.push(...commonLibraries)
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
    /*height: 3rem;*/
  /*}*/

  .bottom-block {
    border-top: 2px solid #343a40;
  }

  .component-block {
    display: inline-block;
    height: 3.8rem;
    width: 3.8rem;
    margin: 0.1rem;
    /*padding: 0.25rem;*/
    border: solid 1px #8C8C8C;
    cursor: pointer;
    overflow: hidden;
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
