webpackJsonp([1],{"/RJm":function(t,e){},"1/oy":function(t,e){},"3hHo":function(t,e){},DwKh:function(t,e){},E82V:function(t,e){},Id91:function(t,e){},NHnr:function(t,e,s){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a=s("7+uW"),n=s("e6fC"),i=s("Xxa5"),o=s.n(i),r=s("exGp"),l=s.n(r),c={render:function(){var t=this.$createElement,e=this._self._c||t;return e("b-modal",{attrs:{id:"libraries-selection-modal",title:"Component Libraries"}},[e("p",{staticClass:"my-4"},[this._v("Hello from modal!")])])},staticRenderFns:[]};var d={name:"TheLeftSidebar",components:{TheLibrariesSelectModal:s("VU/8")({name:"TheLibrariesSelectModal"},c,!1,function(t){s("/RJm")},"data-v-51a2dda8",null).exports},data:function(){return{libraries:[]}},mounted:function(){this.loadLibrariesList()},methods:{loadLibrariesList:function(){var t=l()(o.a.mark(function t(){var e;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:(e=Array(5).fill(null)).forEach(function(t,s){e[s]={id:s,name:"Components library #"+s,components:[]}}),this.libraries=e;case 3:case"end":return t.stop()}},t,this)}));return function(){return t.apply(this,arguments)}}(),loadLibrary:function(){var t=l()(o.a.mark(function t(e){var s;return o.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:(s=Array(12).fill(null)).forEach(function(t,e){s[e]={name:"Component #"+e,imgURL:"",params:{}}}),this.$set(e,"components",s);case 3:case"end":return t.stop()}},t,this)}));return function(e){return t.apply(this,arguments)}}(),selectLibrary:function(t){t.components.length||this.loadLibrary(t)}}},u={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"d-flex flex-column h-100"},[s("b-navbar",{staticClass:"px-1",attrs:{toggleable:"md",type:"dark",variant:"dark"}},[s("b-navbar-brand",{staticClass:"p-0",attrs:{href:"#"}},[s("img",{staticClass:"img-fluid main-menu__logo",attrs:{src:"static/logo.png"}})]),t._v(" "),s("b-navbar-nav",{staticClass:"ml-auto"},[s("b-nav-item",{attrs:{href:"#"}},[s("span",{staticClass:"oi oi-document"})]),t._v(" "),s("b-nav-item",{attrs:{href:"#"}},[s("span",{staticClass:"oi oi-account-login"})]),t._v(" "),s("b-nav-item",{attrs:{href:"#"}},[s("span",{staticClass:"oi oi-cog"})]),t._v(" "),s("b-nav-item",{attrs:{href:"#"}},[s("span",{staticClass:"oi oi-info"})])],1)],1),t._v(" "),s("div",{staticClass:"components-panel overflow-y-scroll p-1"},t._l(t.libraries,function(e){return s("div",{key:e.id,staticClass:"mb-1"},[s("b-btn",{directives:[{name:"b-toggle",rawName:"v-b-toggle",value:"collapse-"+e.id,expression:"'collapse-' + library.id"}],staticClass:"w-100 mb-1",attrs:{size:"sm",variant:"outline-secondary"},on:{click:function(s){t.selectLibrary(e)}}},[t._v("\n        "+t._s(e.name)+"\n      ")]),t._v(" "),s("b-collapse",{staticClass:"w-100",attrs:{id:"collapse-"+e.id}},[s("div",{staticClass:"row no-gutters"},t._l(e.components,function(t){return s("div",{staticClass:"component-block col-4 p-1"},[s("div",{staticClass:"component-block__content"})])}))])],1)})),t._v(" "),s("div",{staticClass:"mt-auto w-100"},[s("hr",{staticClass:"m-0"}),t._v(" "),s("div",{staticClass:"p-1"},[s("b-btn",{directives:[{name:"b-modal",rawName:"v-b-modal.libraries-selection-modal",modifiers:{"libraries-selection-modal":!0}}],staticClass:"w-100",attrs:{size:"sm",variant:"outline-secondary"}},[s("span",{staticClass:"oi oi-folder"}),t._v("\n        Select libraries\n      ")]),t._v(" "),s("b-modal",{attrs:{id:"libraries-selection-modal",title:"Component Libraries","hide-footer":"",size:"lg"}},[s("div",{staticClass:"row no-gutters"},[s("b-list-group",{staticClass:"col-4"},[s("b-list-group-item",{attrs:{href:"#"}},[t._v("Awesome components library")]),t._v(" "),s("b-list-group-item",{attrs:{href:"#",active:""}},[t._v("Ordinary components library")]),t._v(" "),s("b-list-group-item",{attrs:{href:"#"}},[t._v("Another components library")]),t._v(" "),s("b-list-group-item",{attrs:{href:"#"}},[t._v("Little cat")])],1),t._v(" "),s("div",{staticClass:"col-8 pl-1"},[s("table",{staticClass:"table table-bordered"},[s("thead",[s("th",[t._v("Some")]),t._v(" "),s("td")]),t._v(" "),s("tr",[s("td"),t._v(" "),s("td",[t._v("library")])]),t._v(" "),s("tr",[s("td",[t._v("description")]),t._v(" "),s("td")])])])],1)])],1)])],1)},staticRenderFns:[]};var m=s("VU/8")(d,u,!1,function(t){s("sIGX")},"data-v-a3d37be2",null).exports,v=s("RjPN"),p=s("ljAp"),h={name:"TheGraph",data:function(){return{actualZoom:100}},mounted:function(){var t=document.getElementById("graph");t.style.backgroundImage="url("+window.mxBasePath+"/images/grid.gif)",this.graph=new v.mxGraph(t),v.mxEvent.disableContextMenu(t),new v.mxRubberband(this.graph),this.graph.container.focus(),this.setTestState(),this.setListeners()},methods:{moveSelectedCells:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;if(!(arguments.length>2&&void 0!==arguments[2])||arguments[2]){t*=10,e*=10}this.graph.moveCells(this.graph.getSelectionCells(),t,e)},setTestState:function(){var t=this.graph.getDefaultParent();this.graph.getModel().beginUpdate();try{var e=this.graph.insertVertex(t,null,"Hello,",20,20,80,30),s=this.graph.insertVertex(t,null,"World!",200,150,80,30);this.graph.insertEdge(t,null,"",e,s)}finally{this.graph.getModel().endUpdate()}},setListeners:function(){var t=this,e=new v.mxKeyHandler(this.graph);e.bindKey(p("left"),function(){t.moveSelectedCells(-1,0)}),e.bindKey(p("up"),function(){t.moveSelectedCells(0,-1)}),e.bindKey(p("right"),function(){t.moveSelectedCells(1,0)}),e.bindKey(p("down"),function(){t.moveSelectedCells(0,1)}),this.graph.addListener(v.mxEvent.SELECT,function(t,e){var s=e.getProperty("event"),a=e.getProperty("cell");console.log(s),console.log(a),null!=a&&e.consume()})}}},f={render:function(){var t=this.$createElement;return(this._self._c||t)("div",{staticClass:"w-100 h-100",attrs:{id:"graph"}})},staticRenderFns:[]};var b=s("VU/8")(h,f,!1,function(t){s("dcgJ")},"data-v-c202ff2c",null).exports,g={name:"TheRightSidebar",props:{zoom:{type:Number,default:100}},data:function(){return{}},methods:{zoomIn:function(){this.$emit("zoom-in")},zoomOut:function(){this.$emit("zoom-out")},zoomReset:function(){this.$emit("zoom-reset")}}},_={render:function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"d-flex flex-column"},[s("div",{staticClass:"d-flex justify-content-center p-1"},[s("b-button-group",{attrs:{size:"sm"}},[s("b-button",{on:{click:t.zoomOut}},[s("span",{staticClass:"oi oi-zoom-out"})]),t._v(" "),s("b-button",{on:{click:t.zoomReset}},[t._v("\n        "+t._s(t.zoom)+"%\n      ")]),t._v(" "),s("b-button",{on:{click:t.zoomIn}},[s("span",{staticClass:"oi oi-zoom-in"})])],1)],1),t._v(" "),t._m(0)])},staticRenderFns:[function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",[s("h6",{staticClass:"text-center w-100 bg-dark text-light py-1"},[t._v("\n      Component parameters\n    ")]),t._v(" "),s("div",{staticClass:"px-1"},[s("div",{staticClass:"row no-gutters mb-1"},[s("span",{staticClass:"col-5 font-weight-bold"},[t._v("\n          Component\n        ")]),t._v(" "),s("span",{staticClass:"col-7"},[t._v("\n          Resistor\n        ")])]),t._v(" "),s("div",{staticClass:"row no-gutters mb-1"},[s("span",{staticClass:"col-5 font-weight-bold"},[t._v("\n          Resistance (Om)\n        ")]),t._v(" "),s("span",{staticClass:"col-7"},[s("input",{staticClass:"form-control",attrs:{type:"text",value:"5"}})])]),t._v(" "),s("div",{staticClass:"row no-gutters mb-1"},[s("span",{staticClass:"col-5 font-weight-bold"},[t._v("\n          Another parameter\n        ")]),t._v(" "),s("span",{staticClass:"col-7"},[s("input",{staticClass:"form-control",attrs:{type:"text",value:"Meow"}})])]),t._v(" "),s("div",{staticClass:"row no-gutters mb-1"},[s("span",{staticClass:"col-5 font-weight-bold"},[t._v("\n          Yet another parameter\n        ")]),t._v(" "),s("span",{staticClass:"col-7"},[s("input",{staticClass:"form-control",attrs:{type:"text",value:"Woof"}})])])])])}]};var C={name:"App",components:{TheLeftSidebar:m,TheGraph:b,TheRightSidebar:s("VU/8")(g,_,!1,function(t){s("rp+1")},"data-v-5ac9df2e",null).exports}},y={render:function(){var t=this.$createElement,e=this._self._c||t;return e("div",{staticClass:"row no-gutters h-100"},[e("TheLeftSidebar",{staticClass:"col-2 h-100",attrs:{id:"left-sidebar"}}),this._v(" "),e("div",{staticClass:"col-8 h-100",attrs:{id:"graph-container"}},[e("TheGraph",{ref:"graph"})],1),this._v(" "),e("div",{staticClass:"col-2 h-100",attrs:{id:"right-sidebar"}},[e("TheRightSidebar")],1)],1)},staticRenderFns:[]};var w=s("VU/8")(C,y,!1,function(t){s("3hHo")},null,null).exports;s("qb6w"),s("qwyH"),s("DwKh"),s("E82V");a.a.config.productionTip=!1,a.a.use(n.a),new a.a({el:"#app",components:{App:w},template:"<App/>"})},dcgJ:function(t,e){},qb6w:function(t,e){},qwyH:function(t,e){},"rp+1":function(t,e){},sIGX:function(t,e){},zj2Q:function(t,e){}},["NHnr"]);
//# sourceMappingURL=app.d0a30a1b2a865b1217ab.js.map