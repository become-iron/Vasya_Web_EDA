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
      this.keyHandler = null
    },

    computed: {
      editor: {
        get () {
          return this.$store.state.editor
        },
        set (editor) {
          this.$store.commit('setEditor', editor)
        }
      },
      graph: {
        get () {
          return this.$store.state.graph
        },
        set (graph) {
          this.$store.commit('setGraph', graph)
        }
      }
    },

    mounted () {
      let $container = this.$el
      $container.style.backgroundImage = `url(${window.mxBasePath}/images/grid.gif)`  // setup grid

      // mxgraph.mxGraphHandler.prototype.guidesEnabled = true
      // mxgraph.mxConstants.GUIDE_COLOR = '#FF0000'
      // mxgraph.mxConstants.GUIDE_STROKEWIDTH = 1
      // mxgraph.mxEdgeHandler.prototype.snapToTerminals = true
      // mxgraph.mxVertexHandler.prototype.rotationEnabled = true

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

      this.adjustGraphStyle()

      this.$el.focus()  // set focus on graph
    },

    methods: {
      setOverrides () {
        // custom value
        const convertValueToString = this.graph.convertValueToString
        this.graph.convertValueToString = function (cell) {
          return (cell != null && cell.value.name != null) ?
            cell.value.name :
            convertValueToString.apply(this, [cell])
        }

        const cellLabelChanged = this.graph.cellLabelChanged
        this.graph.cellLabelChanged = function(cell, newValue, autoSize) {
          if (cell != null && cell.value.name != null) {
            const name = newValue
            newValue = Object.assign({}, cell.value)
            newValue.name = name
          }

          cellLabelChanged.call(this, cell, newValue, autoSize)
        }

        // TODO: refactor
        // enables connect preview for the default edge style
        // source: anchors example
        this.graph.connectionHandler.createEdgeState = function(me) {
          const edge = this.graph.createEdge(null, null, null, null, null)
          return new mxgraph.mxCellState(this.graph.view, edge, this.graph.getCellStyle(edge))
        }

        // TODO: refactor
        // TODO: explore wires example
        // Makes sure non-relative cells can only be connected via constraints
        // source: wires example
        this.graph.connectionHandler.isConnectableCell = function(cell) {
          if (this.graph.getModel().isEdge(cell)) {
            return true
          } else {
            const geo = (cell != null) ? this.graph.getCellGeometry(cell) : null
            return (geo != null) ? geo.relative : false
          }
        }
        mxgraph.mxEdgeHandler.prototype.isConnectableCell = function(cell)
        {
          return this.graph.connectionHandler.isConnectableCell(cell)
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

        // rotate on Space
        this.keyHandler.handler.bindKey(keycode('space'), () => { this.rotateSelectedCells() })

        this.keyHandler.handler.bindKey(keycode('left'), () => { this.moveSelectedCells(-1, 0) })
        this.keyHandler.handler.bindKey(keycode('up'), () => { this.moveSelectedCells(0, -1) })
        this.keyHandler.handler.bindKey(keycode('right'), () => { this.moveSelectedCells(1, 0) })
        this.keyHandler.handler.bindKey(keycode('down'), () => { this.moveSelectedCells(0, 1) })

        // this.keyHandler.bindAction(keycode('n'), 'new', true) // Ctrl + N
        // this.keyHandler.bindAction(keycode('o'), 'open', true) // Ctrl + O

        // undo on Ctrl + Z
        this.keyHandler.bindAction(keycode('z'), 'undo', true)
        // redo on Ctrl + Shift + Z
        this.keyHandler.handler.bindControlShiftKey(keycode('z'), () => { this.editor.redo() })

        this.graph.getModel().addListener(
          mxgraph.mxEvent.CHANGE,
          () => { this.$store.dispatch('updateUndoManagerState') }
        )

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
          this.handleComponentsSelection(newSelection, previousSelection)
        })

        Bus.$on('load-library', library => { this.loadLibrary(library) })
        Bus.$on(
          'insert-shape',
          (shapeName, shapeValue, coordinates) => { this.addComponentByStencil(shapeName, shapeValue, coordinates) }
        )
      },

      adjustGraphStyle () {
        let style = this.graph.getStylesheet().getDefaultEdgeStyle()
        style[mxgraph.mxConstants.STYLE_EDGE] = mxgraph.mxEdgeStyle.OrthConnector
        style[mxgraph.mxConstants.STYLE_ENDARROW] = 'none'
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

      rotateSelectedCells () {
        // TODO: continuously increases 'rotation' in cell style
        const selectedCells = this.graph.getSelectionCells()

        this.graph.model.beginUpdate()
        selectedCells.forEach(cell => {
          mxgraph.mxVertexHandler.prototype.rotateCell.call(this.editor, cell, 90)
        })
        this.graph.model.endUpdate()
      },

      handleComponentsSelection (selected, deselected) {
        // TODO: consider edges selection
        const deselectedComponents = deselected.filter(cell => cell.vertex)

        // remove deselected components
        let selectedComponents = this.$store.state.selectedComponents.slice(0)  // shallow copy
        selectedComponents = selectedComponents
          .filter(component => !deselectedComponents.find(cell => cell.value.id === component.id))

        // add new selected components
        const components = selected
          .filter(cell => cell.vertex)
          .map(cell => cell.value)
        selectedComponents.push(...components)

        this.$store.commit('setSelectedComponents', selectedComponents)
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

        this.$store.commit('setLibraryComponents', { libraryID: library.id, components: components })
      },

      addComponentByStencil (stencilName, shapeValue='', coords) {
        const parent = this.graph.getDefaultParent()
        const model = this.graph.model
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
          this.graph.insertVertex(parent, cellID, shapeValue, ...coords, style)
        } finally {
          model.endUpdate()
        }
      }
    }
  }
</script>

<style scoped>
  #graph {
    overflow: auto;
  }
</style>
