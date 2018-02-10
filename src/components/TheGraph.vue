<!--suppress JSPotentiallyInvalidConstructorUsage -->
<template>
  <div id="graph" class="w-100 h-100"></div>
</template>

<script>
  // import { Bus } from '../Bus'

  import * as mxgraph from 'jjgraph'
  let keycode = require('keycode')

  export default {
    name: 'TheGraph',

    data: function () {
      return {
        // graph: null,
        actualZoom: 100
      }
    },

    mounted: function () {
      let $container = document.getElementById('graph')
      $container.style.backgroundImage = `url(${window.mxBasePath}/images/grid.gif)`

      this.graph = new mxgraph.mxGraph($container)
      mxgraph.mxEvent.disableContextMenu($container)
      new mxgraph.mxRubberband(this.graph)
      this.graph.container.focus();

      this.setTestState()
      this.setListeners()

      // Bus.$on('zoom-in', this.zoomIn)
      // Bus.$on('zoom-out', this.zoomOut)
      // Bus.$on('zoom-reset', this.zoomReset)
    },

    methods: {
      moveSelectedCells: function (dx=0, dy=0, byStep=true) {
        if (byStep) {
          let step = 10
          dx = dx * step
          dy = dy * step
        }
        this.graph.moveCells(this.graph.getSelectionCells(), dx, dy)
      },

      setTestState: function () {
        let parent = this.graph.getDefaultParent();
        this.graph.getModel().beginUpdate();
        try {
          let v1 = this.graph.insertVertex(parent, null,
            'Hello,', 20, 20, 80, 30);
          let v2 = this.graph.insertVertex(parent, null,
            'World!', 200, 150, 80, 30);
          let e1 = this.graph.insertEdge(parent, null, '', v1, v2);
        } finally {
          this.graph.getModel().endUpdate();
        }
      },

      setListeners: function () {
        let keyHandler = new mxgraph.mxKeyHandler(this.graph);

        keyHandler.bindKey(keycode('left'), () => {this.moveSelectedCells(-1, 0)});
        keyHandler.bindKey(keycode('up'), () => {this.moveSelectedCells(0, -1)});
        keyHandler.bindKey(keycode('right'), () => {this.moveSelectedCells(1, 0)});
        keyHandler.bindKey(keycode('down'), () => {this.moveSelectedCells(0, 1)});

        // this.graph.fireMouseEvent = function (evtName, me, sender) {
        //   console.log(evtName)
        //   console.log(me)
        //   console.log(sender)
        // }
        this.graph.addListener(mxgraph.mxEvent.SELECT, (sender, evt) => {
          let e = evt.getProperty('event'); // mouse event
          let cell = evt.getProperty('cell'); // cell may be null
          console.log(e)
          console.log(cell)
          // console.log(this.graph.getSelectionCells())

          if (cell != null) {
            // Do something useful with cell and consume the event
            evt.consume();
          }
        })
      },

      // zoomIn: function () {
      //   this.graph.zoomIn()
      //   this.actualZoom = Math.floor(this.graph.view.scale * 100)
      // },
      //
      //
      // zoomOut: function () {
      //   this.graph.zoomOut()
      //   this.actualZoom = Math.floor(this.graph.view.scale * 100)
      // },
      //
      //
      // zoomReset: function () {
      //   this.graph.zoomOut()
      //   this.actualZoom = Math.floor(this.graph.view.scale * 100)
      // },
    }
  }
</script>

<style scoped>
  #graph {
    overflow: hidden;
  }
</style>
