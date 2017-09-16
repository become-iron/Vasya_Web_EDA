"use strict";

// namespace для приложения
V.components = {

    _create_component: function (type, svg_id) {
        /** Создаёт класс для компонента определённого типа */
        return class {
            static get type() { return type; } // название компонента (тип)
            static get svg_id() { return svg_id; }  // html id компонента, с которого "копируется" компонент-потомок

            constructor(id, params = {}, physical_params = {}) {
                this.id = id;  // html id для конечного компонента, размещенного на холсте
                this.params = params;
                this.physical_params = physical_params;
            }
        }
    },

    // библиотеки компонентов
    libs: {
        test: {},
    },
};


// TEMP создание классов для элементов
[
    ['Diode', '#diode'],
    ['Capacitor', '#capacitor'],
    // ['Wire', '#test_wire'],
    // ['Ground', '#test_gnd'],
    // ['Resistor', '#test_resistor'],
].forEach( (v) => {
    let [name, id] = [v[0], v[1]];
    V.components.libs.test[name] = V.components._create_component(name, id);
});
