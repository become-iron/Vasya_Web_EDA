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
        // bus: Bus
      }
    },

    created () {
      // defined not in data because to make them non-reactive
      this.editor = null
      this.graph = null
      this.keyHandler = null
    },

    mounted () {
      let $container = this.$el
      $container.style.backgroundImage = `url(${window.mxBasePath}/images/grid.gif)`  // setup grid

      this.editor = new mxgraph.mxEditor()
      this.editor.setGraphContainer($container)
      this.graph = this.editor.graph
      this.keyHandler = this.editor.keyHandler

      this.setOverrides()
      this.setListeners()

      this.graph.container.focus()  // focus on graph

      console.log(this.editor)
      this.setTestState()

      // let toolbar = new mxgraph.mxDefaultToolbar(document.getElementById('toolbar'), this.editor);
      // toolbar.addItem('Copy', null, 'copy');
      // let combo = toolbar.addActionCombo('More actions...');
      // toolbar.addActionOption(combo, 'Paste', 'paste');
    },

    methods: {
      setTestState () {
        let parent = this.graph.getDefaultParent();
        this.graph.getModel().beginUpdate();
        try {
          let v1 = this.graph.insertVertex(parent, null, { label: 'Hello,', data: 1234 }, 20, 20, 80, 30);
          let v2 = this.graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30);
          let e1 = this.graph.insertEdge(parent, null, '', v1, v2);
        } finally {
          this.graph.getModel().endUpdate();
        }

        this.updateUndoManagerState()  // TODO
      },

      setOverrides () {
        const convertValueToString = this.graph.convertValueToString
        this.graph.convertValueToString = function (cell) {
          return (cell != null && cell.value.label != null) ?
            cell.value.label :
            convertValueToString.apply(this, [cell])
        }

        // TODO
        // const cellLabelChanged = this.graph.cellLabelChanged;
        // this.graph.cellLabelChanged = function(cell, newValue, autoSize) {
        //   console.log(newValue)
        //   if (cell != null && cell.value.label != null) {
        //     newValue = Object.assign({}, cell.value)
        //     newValue.label = newValue
        //   }
        //
        //   cellLabelChanged.apply(this, [cell, newValue, autoSize])
        // }
      },

      setListeners () {
        // console.log(this.keyHandler)
        // console.log(this.keyHandler.handler)
        this.keyHandler.bindAction(keycode('c'), 'copy', true)  // copy on Ctrl + C
        this.keyHandler.bindAction(keycode('v'), 'paste', true)  // paste on Ctrl + V
        this.keyHandler.bindAction(keycode('x'), 'cut', true)  // cut on Ctrl + X
        this.keyHandler.bindAction(keycode('delete'), 'delete')  // delete on Delete
        this.keyHandler.bindAction(keycode('a'), 'selectAll', true)  // select all on Ctrl + A
        this.editor.addListener(mxgraph.mxEvent.ESCAPE, () => { this.graph.clearSelection() })  // deselect on Esc

        // move cells with arrow keys
        this.keyHandler.handler.bindKey(keycode('left'), () => { this.moveSelectedCells(-1, 0) })
        this.keyHandler.handler.bindKey(keycode('up'), () => { this.moveSelectedCells(0, -1) })
        this.keyHandler.handler.bindKey(keycode('right'), () => { this.moveSelectedCells(1, 0) })
        this.keyHandler.handler.bindKey(keycode('down'), () => { this.moveSelectedCells(0, 1) })

        // undo on Ctrl + Z
        this.keyHandler.bindAction(keycode('z'), 'undo', true)
        // redo on Ctrl + Shift + Z
        this.keyHandler.handler.bindControlShiftKey(keycode('z'), () => { this.editor.redo() })

        this.graph.getModel().addListener(mxgraph.mxEvent.CHANGE, () => { this.updateUndoManagerState() })

        // this.graph.fireMouseEvent = function (evtName, me, sender) {
        //   console.log(evtName)
        //   console.log(me)
        //   console.log(sender)
        // }

        // cells selection
        // https://jgraph.github.io/mxgraph/docs/js-api/files/view/mxGraphSelectionModel-js.html#mxGraphSelectionModel.mxEvent.CHANGE
        this.graph.selectionModel.addListener(mxgraph.mxEvent.CHANGE, (sender, evt) => {
          let newSelection = evt.properties.removed != null ? evt.properties.removed: []
          let previousSelection = evt.properties.added != null ? evt.properties.added: []
          Bus.$emit('cells-selection', newSelection, previousSelection)
        })

        Bus.$on('zoom-in', () => {
          this.graph.zoomIn()
          this.updateZoomState()
        })
        Bus.$on('zoom-out', () => {
          this.graph.zoomOut()
          this.updateZoomState()
        })
        Bus.$on('zoom-reset', () => {
          this.graph.zoomActual()
          this.updateZoomState()
        })
        Bus.$on('undo', () => { this.editor.undo() })
        Bus.$on('redo', () => { this.editor.redo() })
      },

      updateZoomState () {
        Bus.zoom = Math.floor(this.graph.view.scale * 100)
      },

      updateUndoManagerState () {
        Bus.canUndo = this.editor.undoManager.canUndo()
        Bus.canRedo = this.editor.undoManager.canRedo()
      },

      moveSelectedCells (dx=0, dy=0, byStep=true) {
        if (byStep) {
          let step = 10
          dx = dx * step
          dy = dy * step
        }

        this.graph.moveCells(this.graph.getSelectionCells(), dx, dy)
      }
    }
  }
</script>

<style scoped>
  #graph {
    overflow: hidden;
  }
</style>
