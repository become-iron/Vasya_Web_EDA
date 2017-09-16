"use strict";
$( document ).ready(function() {

    function random() {
        return Math.trunc(Math.random() * 1000);
    }


    V.workspace.libs.test = {};
    // TEMP создание классов для элементов
    [
        ['Diode', 'diode'],
        ['Capacitor', 'capacitor'],
        // ['Wire', '#test_wire'],
        // ['Ground', '#test_gnd'],
        // ['Resistor', '#test_resistor'],
    ].forEach( (v) => {
        let [name, id] = [v[0], v[1]];
        V.workspace.libs.test[name] = V.components.clone_element(name, id);
    });


    V.core.clone_element($("#blue-rect"), "blue-rect-" + random(), V.core.to_real_x(0), V.core.to_real_y(0));

    // клонирование активного элемента
    $("#clone_component_btn").click(function (event) {
        let active_component = V.core.setts.active_element;
        if (active_component !== null) {
            let new_id = active_component.slice(1) + "-" + random();
            V.core.clone_element($(active_component), new_id, 10, 10);
        }
    });

    // добавление компонентов в выпадающий список
    $("#component_selector").append(
        _.values(V.workspace.libs.test)
            .map( (comp) => `<option value="${comp.type}">${comp.type}</option>` )
            .join("")
    );

    // создание нового компонента
    $("#create-component_btn")
        .click(function (event) {

            let component_name = $("#component_selector").find("option:selected").val();
            let Component = V.workspace.libs.test[component_name];
            let new_id = Component.parent_id + "-" + random();
            V.workspace.elements[new_id] = new Component(new_id);
            // console.log(V.workspace.elements);
        });



});