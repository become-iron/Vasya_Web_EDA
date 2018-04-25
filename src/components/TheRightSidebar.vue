<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex justify-content-around p-1">
      <b-button-group size="sm">
        <b-button title="Undo" :disabled="!canUndo" @click="undo()">
          <span class="oi oi-action-undo"></span>
        </b-button>

        <b-button title="Redo" :disabled="!canRedo" @click="redo()">
          <span class="oi oi-action-redo"></span>
        </b-button>
      </b-button-group>

      <b-button-group size="sm">
        <b-button title="Zoom out" @click="zoomOut()">
          <span class="oi oi-zoom-out"></span>
        </b-button>

        <b-button title="Reset zoom and center the graph" @click="zoomReset()">
          {{ zoom }}%
        </b-button>

        <b-button title="Zoom in" @click="zoomIn()">
          <span class="oi oi-zoom-in"></span>
        </b-button>
      </b-button-group>
    </div>

    <span class="bg-dark text-center text-light mb-0 py-1">
      Selected components
    </span>

    <div class="overflow-y-scroll">
      <div v-for="component of selectedComponents"
              :key="component.id"
              class="component-card mx-1 mt-1">
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Component
          </span>
          <span class="col-7">
            {{ component.componentName }}
          </span>
        </div>

        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Library
          </span>
          <span class="col-7">
            {{ component.libraryName }}
          </span>
        </div>

        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Name
          </span>
          <span class="col-7">
            <b-form-input type="text"
                          size="sm"
                          :value="component.name"
                          @change="setComponentName(component, $event)">
            </b-form-input>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Bus } from '../Bus'

  export default {
    name: 'TheRightSidebar',

    data () {
      return {
        bus: Bus
      }
    },

    computed: {
      graph () {
        return this.$store.state.graph
      },

      zoom () {
        return this.$store.state.zoom
      },

      canUndo () {
        return this.$store.state.canUndo
      },

      canRedo () {
        return this.$store.state.canRedo
      },

      selectedComponents () {
        return this.$store.state.selectedComponents
      }
    },

    methods: {
      undo () {
        this.$store.dispatch('undo')
      },

      redo () {
        this.$store.dispatch('redo')
      },

      zoomIn () {
        this.$store.dispatch('zoomIn')
      },

      zoomOut () {
        this.$store.dispatch('zoomOut')
      },

      zoomReset () {
        this.$store.dispatch('zoomReset')
      },

      setComponentName (component, newValue) {
        const cell = this.graph.model.getCell(component.id)
        this.graph.cellLabelChanged(cell, newValue)
      }
    }
  }
</script>

<style scoped>
  .component-card {
    background: white;
    padding: 1rem;
    word-wrap: break-word;
  }
</style>
