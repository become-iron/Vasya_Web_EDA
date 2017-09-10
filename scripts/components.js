"use strict";

// namespace для приложения
let V = {

    create_component: function (type, svg_id) {
        return class {
            static get type() { return type; } // название компонента (тип)
            static get svg_id() { return svg_id; }  // html id компонента, с которого "копируется" компонент-потомок
            // TODO возможно, лучше не указывать id для родителя-элемента, а хранить описание элемента

            constructor(id, params = {}, physical_params = {}) {
                this.id = id;  // html id для конечного компонента, размещенного на холсте
                this.params = params;
                this.physical_params = physical_params;
            }
        }
    },


};

// создание классов для элементов
[
    ['Diode', '#lib-test-diod'],
    ['Ground', '#lib-test-gnd'],
    ['Resistor', '#lib-test-resistor'],
    ['Wire', '#lib-wire'],

    ["Rectangle", "#rect-parent"],
].map( (i) => { V[i[0]] = V.create_component(i[0], i[1]) } );
