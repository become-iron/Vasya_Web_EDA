"use strict";

V.components.clone_element = function (type, parent_id) {
    /** Создаёт класс для компонента определённого типа */
    return class {
        static get type() { return type; } // название компонента (тип)
        static get parent_id() { return parent_id; }  // html id компонента, с которого "копируется" компонент-потомок

        constructor(id, params = {}, physical_params = {}) {
            this.id = id;  // html id для конечного компонента, размещенного на холсте
            this.params = params;
            this.physical_params = physical_params;

            // проверка координат компонента
            this.params.x = this.params.x || 0;
            this.params.y = this.params.y || 0;

            // размещение компонента на рабочей области
            let parent_node = $("#" + this.constructor.parent_id);
            this.$elem = V.core.clone_element(parent_node, this.id, this.params.x, this.params.y);
        }

        set_location(x=0, y=0) {
            /**  */
            V.core.set_component_location(x, y);
        }
    }
};
