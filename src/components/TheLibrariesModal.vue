<template>
  <b-modal id="libraries-selection-modal"
           title="Component Libraries"
           hide-footer
           size="lg">
    <b-nav class="mb-2"
           justified
           tabs>
      <b-nav-item active>
        Common Libraries
      </b-nav-item>

      <b-nav-item>
        User Libraries
      </b-nav-item>
    </b-nav>

    <div class="row no-gutters">
      <div class="libraries-list d-flex flex-column overflow-y-scroll col-4 pr-2">
        <b-button-group v-for="library of libraries"
                        :key="library.id"
                        class="libraries-list__item d-flex">
          <b-button class="libraries-list__item__title"
                    :pressed="activeLibrary && library.id === activeLibrary.id"
                    @click="showLibraryDescription(library)">
            {{ library.name }}
          </b-button>

          <b-button class="libraries-list__item__checkbox"
                    @click="toggleLibrary(library)">
            <span :class="librariesSelectionStatus[library.id] ? 'oi oi-check checked' : 'oi oi-x'"></span>
          </b-button>
        </b-button-group>
      </div>


      <div class="library-description overflow-y-scroll col-8 pl-2">
        <template v-if="activeLibrary">
          <table class="table table-bordered">
            <tr>
              <th>Name</th>
              <td>{{ activeLibrary.name }}</td>
            </tr>

            <tr>
              <th>ID</th>
              <td>{{ activeLibrary.id }}</td>
            </tr>

            <tr>
              <th>Description</th>
              <td>{{ activeLibrary.description }}</td>
            </tr>
          </table>

          <div class="d-flex flex-wrap">
            <div v-for="component of activeLibrary.components"
                 :key="component.name"
                 class="component-block"
                 :title="component.name"
                 v-html="component.el">
            </div>
          </div>
        </template>
      </div>
    </div>
  </b-modal>
</template>

<script>
  import { Bus } from '../Bus'

  export default {
    name: 'TheLibrariesModal',

    data () {
      return {
        activeLibrary: null
      }
    },

    computed: {
      libraries () {
        return this.$store.state.libraries
      },

      librariesSelectionStatus () {
        const result = {}
        this.$store.state.selectedLibrariesIDs.forEach(libraryID => {
          result[libraryID] = true
        })
        Object.keys(this.libraries).forEach(libraryID => {
          result[libraryID] = libraryID in result
        })
        return result
      }
    },

    methods: {
      showLibraryDescription (library) {
        this.activeLibrary = library

        if (!library.thumbnails) {
          Bus.$emit('prepare-thumbnails', library)
        }
      },

      toggleLibrary (library) {
        const deselect = this.librariesSelectionStatus[library.id]

        if (deselect) {
          this.$store.commit('deselectLibrary', library.id)
        } else {
          this.$store.commit('selectLibrary', library.id)
        }
      }
    }
  }
</script>

<style scoped>
  .libraries-list, .library-description {
    max-height: 75vh;
  }

  .libraries-list__item {
     min-height: 2.5rem;  /* Chrome fix */
   }

  .libraries-list__item:not(:first-child) {
    border-top: 1px solid #343a40;
  }

  .libraries-list__item .libraries-list__item__title {
    flex-grow: 1;
    overflow: hidden;
    text-align: left;
    border-right: 1px solid #343a40;
  }

  .libraries-list__item .libraries-list__item__checkbox {
    border-left: 1px solid #343a40;
  }

  .libraries-list__item .libraries-list__item__checkbox .checked {
    color: #a8ffa5;
  }

  .component-block {
    height: 3.8rem;
    width: 3.8rem;
    margin: 0.2rem;
    border: solid 1px #8C8C8C;
    overflow: hidden;
    user-select: none;
  }
</style>
