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

    <h6 class="text-center w-100 bg-dark text-light mb-0 py-1">
      Selected components
    </h6>

    <div class="overflow-y-scroll">
      <div v-for="component of selectedComponents"
              :key="component.id"
              class="component-card mx-1 mt-1">
         <!-- TODO -->
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Name
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
            ID
          </span>
          <span class="col-7">
            {{ component.id }}
          </span>
        </div>


        <!--<div v-for="parameter of component.parameters"-->
             <!--:key="parameter.title"-->
             <!--class="row no-gutters mb-1">-->
          <!--<span class="col-5 font-weight-bold">-->
            <!--{{ parameter.title }}-->
          <!--</span>-->
          <!--<span class="col-7">-->
            <!--<input type="text"-->
                   <!--class="form-control"-->
                   <!--:value="parameter.value">-->
          <!--</span>-->
        <!--</div>-->


        <!--<div class="row no-gutters mb-1">-->
          <!--<span class="col-5 font-weight-bold">-->
            <!--Resistance (Om)-->
          <!--</span>-->
          <!--<span class="col-7">-->
            <!--<input type="text" class="form-control" value="5">-->
          <!--</span>-->
        <!--</div>-->
        <!--<div class="row no-gutters mb-1">-->
          <!--<span class="col-5 font-weight-bold">-->
            <!--Another parameter-->
          <!--</span>-->
          <!--<span class="col-7">-->
            <!--<input type="text" class="form-control" value="Meow">-->
          <!--</span>-->
        <!--</div>-->
        <!--<div class="row no-gutters mb-1">-->
          <!--<span class="col-5 font-weight-bold">-->
            <!--Yet another parameter-->
          <!--</span>-->
          <!--<span class="col-7">-->
            <!--<input type="text" class="form-control" value="Woof">-->
          <!--</span>-->
        <!--</div>-->
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
