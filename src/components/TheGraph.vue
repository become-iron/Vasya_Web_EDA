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
        bus: Bus
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

      // mxgraph.mxGraphHandler.prototype.guidesEnabled = true
      // mxgraph.mxConstants.GUIDE_COLOR = '#FF0000';
      // mxgraph.mxConstants.GUIDE_STROKEWIDTH = 1;
      // mxgraph.mxEdgeHandler.prototype.snapToTerminals = true;

      this.editor = new mxgraph.mxEditor()
      this.editor.setGraphContainer($container)
      this.graph = this.editor.graph
      this.keyHandler = this.editor.keyHandler

      this.setOverrides()
      this.setListeners()

      this.graph.setConnectable(true)
      this.graph.setConnectableEdges(true)
      this.graph.setCellsResizable(false)
      this.graph.setPanning(true)

      // style adjusting
      let style = this.graph.getStylesheet().getDefaultEdgeStyle()
      style[mxgraph.mxConstants.STYLE_EDGE] = mxgraph.mxEdgeStyle.OrthConnector
      style[mxgraph.mxConstants.STYLE_ENDARROW] = 'none'


      this.graph.container.focus()  // set focus on graph

      // console.log(this.editor)
      // this.setTestState()

      // let toolbar = new mxgraph.mxDefaultToolbar(document.getElementById('toolbar'), this.editor);
      // toolbar.addItem('Copy', null, 'copy');
      // let combo = toolbar.addActionCombo('More actions...');
      // toolbar.addActionOption(combo, 'Paste', 'paste');
    },

    methods: {
      setTestState () {
        // const shapes = this.registerLibrary('/static/components/electrical/resistors.xml')
        // shapes.forEach(shapeName => this.insertShape(shapeName))

        let parent = this.graph.getDefaultParent()
        this.graph.getModel().beginUpdate()
        try {
          let v1 = this.graph.insertVertex(parent, null, { label: 'Hello,', data: 1234 }, 20, 20, 80, 30)
          let v2 = this.graph.insertVertex(parent, null, 'World!', 200, 150, 80, 30)
          let e1 = this.graph.insertEdge(parent, null, '', v1, v2)

          // let v3 = this.graph.insertVertex(parent, null, '', 300, 200, 80, 30, 'shape=Attenuator')

        } finally {
          this.graph.getModel().endUpdate()
        }


        this.updateUndoManagerState()  // TODO
      },

      setOverrides () {
        // custom value
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

        // TODO: refactor
        // enables connect preview for the default edge style
        // source: anchors example
        this.graph.connectionHandler.createEdgeState = function(me) {
          const edge = this.graph.createEdge(null, null, null, null, null)
          return new mxgraph.mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge))
        }

        // TODO: refactor
        // TODO: explore wires example6
        // Makes sure non-relative cells can only be connected via constraints
        // source: wires example
        this.graph.connectionHandler.isConnectableCell = function(cell) {
          if (this.graph.getModel().isEdge(cell)) {
            return true;
          } else {
            const geo = (cell != null) ? this.graph.getCellGeometry(cell) : null;
            return (geo != null) ? geo.relative : false;
          }
        }
        mxgraph.mxEdgeHandler.prototype.isConnectableCell = function(cell)
        {
          return this.graph.connectionHandler.isConnectableCell(cell);
        }
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


        // this.keyHandler.bindAction(keycode('n'), 'new', true); // Ctrl+N
        // this.keyHandler.bindAction(keycode('o'), 'open', true); // Ctrl+O

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
          this.graph.center()
          this.updateZoomState()
        })
        Bus.$on('undo', () => { this.editor.undo() })
        Bus.$on('redo', () => { this.editor.redo() })

        Bus.$on('load-library', library => { this.loadLibrary(library) })
        Bus.$on(
          'insert-shape',
          (shapeName, shapeValue, coordinates) => { this.addComponentByStencil(shapeName, shapeValue, coordinates) }
        )
        Bus.$on('graph-to-xml', () => { this.graphModelToXML() })
      },

      /** Stores in the bus actual zoom in percents */
      updateZoomState () {
        Bus.zoom = Math.floor(this.graph.view.scale * 100)
      },

      updateUndoManagerState () {
        Bus.canUndo = this.editor.undoManager.canUndo()
        Bus.canRedo = this.editor.undoManager.canRedo()
      },

      moveSelectedCells (dx=0, dy=0, byStep=true) {
        if (byStep) {
          const step = 10
          dx *= step
          dy *= step
        }

        const selectedCells = this.graph.getSelectionCells()
        this.graph.moveCells(selectedCells, dx, dy)
      },

      loadLibrary (library) {
        const req = mxgraph.mxUtils.load(library.url)
        const root = req.getDocumentElement()

        let components = []

        root.childNodes.forEach(shape => {
          if (shape.nodeType === mxgraph.mxConstants.NODETYPE_ELEMENT) {
            const stencilName = shape.getAttribute('name')
            const stencil = new mxgraph.mxStencil(shape)
            mxgraph.mxStencilRegistry.addStencil(stencilName, stencil)

            let graph = new mxgraph.mxGraph(document.createElement('div'))
            const parent = graph.getDefaultParent()
            // TEMP: prettify it
            const containerSize = 48  // TODO: not quite container size
            const baseOffset = 2
            const scale = containerSize / Math.max(stencil.w0, stencil.h0)
            const width = Math.trunc(stencil.w0 * scale)
            const height = Math.trunc(stencil.h0 * scale)
            const topOffset = Math.trunc((containerSize - height) / 2) + baseOffset
            const leftOffset = Math.trunc((containerSize - width) / 2) + baseOffset
            graph.insertVertex(parent, null, '', leftOffset, topOffset, width, height, `shape=${stencilName};`)

            components.push({
              name: stencilName,
              // stencil: shape.outerHTML,
              // stencil: mxgraph.mxUtils.getTextContent(shape),
              el: graph.container.innerHTML
            })
          }
        })

        library.components.push(...components)
      },

      addComponentByStencil (stencilName, shapeValue='', coords) {
        const parent = this.editor.graph.getDefaultParent()
        const model = this.editor.graph.model
        const style = `shape=${stencilName};`

        const stencil = mxgraph.mxStencilRegistry.getStencil(stencilName)

        // TEMP: random coords
        if (coords == null) {
          const gridStep = 10
          coords = [
            Math.trunc(Math.random() * (this.$el.clientWidth - stencil.w0) / gridStep) * gridStep,
            Math.trunc(Math.random() * (this.$el.clientHeight - stencil.h0) / gridStep) * gridStep,
            stencil.w0,
            stencil.h0
          ]
        }
        const cellID = shapeValue.id != null ? shapeValue.id : null

        model.beginUpdate()
        try {
          this.editor.graph.insertVertex(parent, cellID, shapeValue, ...coords, style)
        } finally {
          model.endUpdate()
        }
      },

      graphModelToXML () {
        const encoder = new mxgraph.mxCodec()
        const result = encoder.encode(this.graph.getModel())
        console.log(mxgraph.mxUtils.getXml(result))
      }
    }
  }
</script>

<style scoped>
  #graph {
    overflow: auto;
  }
</style>
