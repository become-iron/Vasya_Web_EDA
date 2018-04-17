<template>
  <div class="d-flex flex-column h-100">
    <div class="d-flex justify-content-around p-1">
      <b-button-group size="sm">
        <b-button title="Undo" :disabled="!bus.canUndo" @click="bus.$emit('undo')">
          <span class="oi oi-action-undo"></span>
        </b-button>

        <b-button title="Redo" :disabled="!bus.canRedo" @click="bus.$emit('redo')">
          <span class="oi oi-action-redo"></span>
        </b-button>
      </b-button-group>

      <b-button-group size="sm">
        <b-button title="Zoom out" @click="bus.$emit('zoom-out')">
          <span class="oi oi-zoom-out"></span>
        </b-button>

        <b-button title="Reset zoom and center the graph" @click="bus.$emit('zoom-reset')">
          {{ bus.zoom }}%
        </b-button>

        <b-button title="Zoom in" @click="bus.$emit('zoom-in')">
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
        <div v-for="parameter of component.parameters"
             :key="parameter.title"
             class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            {{ parameter.title }}
          </span>
          <span class="col-7">
            <input type="text"
                   class="form-control"
                   :value="parameter.value">
          </span>
        </div>
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
  import { cloneObject } from "../utils";
  import { Bus } from '../Bus'

  export default {
    name: 'TheRightSidebar',

    data () {
      return {
        bus: Bus,
        selectedComponents: []
      }
    },

    created () {
      this.bus.$on('cells-selection', this.selectComponentHandler)
    },

    methods: {
      selectComponentHandler (selected, deselected) {
        // TODO: consider edges selection
        const deselectedComponents = deselected.filter(cell => cell.vertex)
        // remove deselected components
        this.selectedComponents = this.selectedComponents
          .filter(component => !deselectedComponents.find(cell => cell.value.id === component.id))

        // add new selected components
        const components = selected.filter(cell => cell.vertex).map(cell => cell.value)
        // clone object in order to not make it reactive
        this.selectedComponents.push(...cloneObject(components))
        console.log(JSON.parse(JSON.stringify(this.selectedComponents)))
      }
    }
  }
</script>

<style scoped>
  .component-card {
    /*display: flex;*/
    /*flex-direction: column;*/
    background: white;
    border-radius: 0.2rem;
    padding: 1rem;
    word-wrap: break-word;
  }
</style>
