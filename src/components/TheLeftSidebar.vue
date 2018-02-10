<template>
  <div class="d-flex flex-column h-100">
    <b-navbar toggleable="md" type="dark" variant="dark" class="px-1">
      <!--<b-navbar-brand href="/">VASILY</b-navbar-brand>-->
      <b-navbar-brand href="/" class="p-0">
        <img src="/static/logo.png" class="img-fluid main-menu__logo">
      </b-navbar-brand>

      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#">
          <span class="oi oi-document"></span>
        </b-nav-item>
        <b-nav-item href="#">
          <span class="oi oi-account-login"></span>
        </b-nav-item>
        <b-nav-item href="#">
          <span class="oi oi-cog"></span>
        </b-nav-item>
        <b-nav-item href="#">
          <span class="oi oi-info"></span>
        </b-nav-item>
      </b-navbar-nav>
    </b-navbar>

    <div class="components-panel overflow-y-scroll p-1">
      <div v-for="library of libraries" :key="library.id" class="mb-1">
        <b-btn class="w-100 mb-1" size="sm" variant="outline-secondary"
               v-b-toggle="'collapse-' + library.id"
               @click="selectLibrary(library)">
          {{ library.name }}
        </b-btn>

        <b-collapse class="w-100" :id="'collapse-' + library.id">
            <div class="row no-gutters">
              <div class="component-block col-4 p-1"
                   v-for="component of library.components">
                <div class="component-block__content"></div>
              </div>
            </div>
        </b-collapse>
      </div>
    </div>

    <div class="mt-auto w-100">
      <hr class="m-0">

      <div class="p-1">
        <b-btn class="w-100" size="sm" variant="outline-secondary"
               v-b-modal.libraries-selection-modal>
          <span class="oi oi-folder"></span>
          Select libraries
        </b-btn>

        <b-modal id="libraries-selection-modal" title="Component Libraries" hide-footer size="lg">
          <div class="row no-gutters">
            <b-list-group class="col-4">
              <b-list-group-item href="#">Awesome components library</b-list-group-item>
              <b-list-group-item href="#" active>Ordinary components library</b-list-group-item>
              <b-list-group-item href="#">Another components library</b-list-group-item>
              <b-list-group-item href="#">Little cat</b-list-group-item>
            </b-list-group>

            <div class="col-8 pl-1">
              <table class="table table-bordered">
                <thead>
                  <th>Some</th>
                  <td></td>
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
  export default {
    name: 'TheLeftSidebar',

    components: {
      TheLibrariesSelectModal
    },

    data () {
      return {
        libraries: [],
        // currentLibrary: null
      }
    },

    mounted () {
      this.loadLibrariesList()
    },

    methods: {
      loadLibrariesList: async function () {
        let libraries = Array(5).fill(null)
        libraries.forEach((l, i) => {
          libraries[i] = {
            id: i,
            name: `Components library #${i}`,
            components: []
          }
        })
        this.libraries = libraries
      },

      loadLibrary: async function (library) {
        let components = Array(12).fill(null)
        components.forEach((l, i) => {
          components[i] = {
            name: `Component #${i}`,
            imgURL: '',
            params: {}
          }
        })
        this.$set(library, 'components', components)
      },

      selectLibrary: function (library) {
        if (!library.components.length) {
          this.loadLibrary(library)
        }
      }
    }
  }
</script>

<style scoped>
  .main-menu__logo {
    height: 3rem;
  }

  .component-block {
  }

  .component-block__content {
    height: 4.5rem;
    background-color: #D0D0D0;
    border: solid 1px #8C8C8C;
  }

  /*>>> .dropdown-toggle {*/
    /*width: 100%;*/
  /*}*/

  .btn {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
  }
</style>
