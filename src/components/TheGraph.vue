<!--suppress JSPotentiallyInvalidConstructorUsage -->
<template>
  <div id="graph" class="w-100 h-100"></div>
</template>

<script>
  import * as mxgraph from 'jjgraph'
  import keycode from 'keycode'

  import { Bus } from '../Bus'

  export default {
    name: 'TheGraph',

    data: function () {
      return {
        // graph
        // keyHandler
        // undoManager

        // bus: Bus
      }
    },

    mounted () {
      let $container = document.getElementById('graph')
      $container.style.backgroundImage = `url(${window.mxBasePath}/images/grid.gif)`  // setup grid

      this.graph = new mxgraph.mxGraph($container)
      mxgraph.mxEvent.disableContextMenu($container)
      new mxgraph.mxRubberband(this.graph)
      this.graph.container.focus()


      this.keyHandler = new mxgraph.mxKeyHandler(this.graph)

      this.setupUndoManager()

      this.setTestState()
      this.setListeners()
    },

    methods: {
      moveSelectedCells (dx=0, dy=0, byStep=true) {
        if (byStep) {
          let step = 10
          dx = dx * step
          dy = dy * step
        }

        this.graph.moveCells(this.graph.getSelectionCells(), dx, dy)
      },

      setTestState () {
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

      setupUndoManager () {
        // https://jgraph.github.io/mxgraph/docs/js-api/files/util/mxUndoManager-js.html#mxUndoManager.history
        this.undoManager = new mxgraph.mxUndoManager()
        let listener = (sender, evt) => {
          this.undoManager.undoableEditHappened(evt.getProperty('edit'))
          this.updateUndoManagerState()
        }
        this.graph.getModel().addListener(mxgraph.mxEvent.UNDO, listener)
        this.graph.getView().addListener(mxgraph.mxEvent.UNDO, listener)

        // undo on Ctrl + Z
        this.keyHandler.bindControlKey(keycode('z'), (evt) => { this.undo() })

        // redo on Ctrl + Shift + Z
        this.keyHandler.bindControlShiftKey(keycode('z'), (evt) => { this.redo() })
      },

      setListeners () {
        this.keyHandler.bindKey(keycode('left'), () => { this.moveSelectedCells(-1, 0) })
        this.keyHandler.bindKey(keycode('up'), () => { this.moveSelectedCells(0, -1) })
        this.keyHandler.bindKey(keycode('right'), () => { this.moveSelectedCells(1, 0) })
        this.keyHandler.bindKey(keycode('down'), () => { this.moveSelectedCells(0, 1) })

        // delete selected cells
        this.keyHandler.bindKey(keycode('delete'), () => { this.graph.removeCells() })

        // this.graph.fireMouseEvent = function (evtName, me, sender) {
        //   console.log(evtName)
        //   console.log(me)
        //   console.log(sender)
        // }
        // this.graph.addListener(mxgraph.mxEvent.SELECT, (sender, evt) => {
        //   let e = evt.getProperty('event'); // mouse event
        //   let cell = evt.getProperty('cell'); // cell may be null
        //   console.log(e)
        //   console.log(cell)
        //   // console.log(this.graph.getSelectionCells())
        //
        //   if (cell != null) {
        //     // Do something useful with cell and consume the event
        //     evt.consume();
        //   }
        // })

        Bus.$on('zoom-in', this.zoomIn)
        Bus.$on('zoom-out', this.zoomOut)
        Bus.$on('zoom-reset', this.zoomReset)
        Bus.$on('undo', this.undo)
        Bus.$on('redo', this.redo)
      },

      updateZoomState () {
        Bus.zoom = Math.floor(this.graph.view.scale * 100)
      },

      zoomIn () {
        this.graph.zoomIn()
        this.updateZoomState()
      },

      zoomOut () {
        this.graph.zoomOut()
        this.updateZoomState()
      },

      zoomReset () {
        this.graph.zoomActual()
        this.updateZoomState()
      },

      updateUndoManagerState () {
        Bus.canUndo = this.undoManager.canUndo()
        Bus.canRedo = this.undoManager.canRedo()
      },

      undo () {
        this.undoManager.undo()
        this.updateUndoManagerState()
      },

      redo () {
        this.undoManager.redo()
        this.updateUndoManagerState()
      }
    }
  }
</script>

<style scoped>
  #graph {
    overflow: hidden;
  }
</style>
