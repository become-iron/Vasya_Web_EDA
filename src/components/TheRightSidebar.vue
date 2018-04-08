<template>
  <div class="d-flex flex-column">
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

    <div>
      <h6 class="text-center w-100 bg-dark text-light py-1">
        Component parameters
      </h6>

      <div class="px-1">
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Component
          </span>
          <span class="col-7">
            Resistor
          </span>
        </div>
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Resistance (Om)
          </span>
          <span class="col-7">
            <input type="text" class="form-control" value="5">
          </span>
        </div>
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Another parameter
          </span>
          <span class="col-7">
            <input type="text" class="form-control" value="Meow">
          </span>
        </div>
        <div class="row no-gutters mb-1">
          <span class="col-5 font-weight-bold">
            Yet another parameter
          </span>
          <span class="col-7">
            <input type="text" class="form-control" value="Woof">
          </span>
        </div>
      </div>

      <!--<form class="p-1">-->
        <!--<div class="form-group row">-->
          <!--<label class="col-sm-4 col-form-label">Email</label>-->
          <!--<div class="col-sm-8">-->
            <!--<input type="text" class="form-control" value="email@example.com">-->
          <!--</div>-->
        <!--</div>-->
        <!--<div class="form-group row">-->
          <!--<label class="col-sm-4 col-form-label">Password</label>-->
          <!--<div class="col-sm-8">-->
            <!--<input type="password" class="form-control" placeholder="Password">-->
          <!--</div>-->
        <!--</div>-->
      <!--</form>-->
    </div>
  </div>
</template>

<script>
  import { Bus } from '../Bus'

  export default {
    name: 'TheRightSidebar',

    data () {
      return {
        bus: Bus,
        selectedCell: null
      }
    },

    created () {
      this.bus.$on('select-component', this.selectComponentHandler)
    },

    methods: {
      selectComponentHandler (cell) {
        this.selectedCell = cell
      }
    }
  }
</script>

<style scoped>

</style>
