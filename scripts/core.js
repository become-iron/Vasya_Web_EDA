"use strict";

$( document ).ready(function() {

    V.core.setts = {
        step: 10,  // шаг размещение элементов
        // ряд масштабов (взят такой же, как у Firefox)
        scales: [0.3, 0.5, 0.67, 0.8, 1, 1.1, 1.2, 1.33, 1.5, 1.7, 2, 2.4, 3],
        // масштаб определяется номером в ряду
        scale: 4,  // текущий масштаб (коэффициент)
        max_scale: 12,
        min_scale: 0,
        current_scale: () => V.core.setts.scales[V.core.setts.scale],  // текущий масштаб (дробь)


        // размеры видимой рабочей области
        width: null,
        height: null,

        active_element_class: "active",  // класс, назначаемый выделенному компоненту

        // параметры viewBox (для отображения части холста)
        vb_origin_params: [],
    };

    // координаты рабочей области - в реальные координаты
    V.core.to_real_x = (x) => x + V.core.setts.width / 2;
    V.core.to_real_y = (y) => -y - V.core.setts.height / 2;
    // реальные координаты - в координаты рабочей области
    V.core.to_ws_x = (x) => x - V.core.setts.width / 2;
    V.core.to_ws_y = (y) => V.core.setts.height / 2 - y;


    V.core.active_element = null;  // id текущего выделенного элемента
    V.core.deactivate_element = () => {
        $(V.core.active_element).removeClass(V.core.setts.active_element_class);
        V.core.active_element = null;
        V.core.$element_info.css("visibility", "hidden");
    };

    V.core.$left_side = $("#left-side");
    V.core.$workspace_container = $("#workspace-side");
    V.core.$workspace = $("#workspace");
    V.core.$right_side = $("#right_side");
    V.core.$element_info = $("#element-info");


    V.core.setup_workspace = function () {
        /** Настройка рабочей области */
        // let $left_side = V.core.$left_side;
        let $workspace_container = V.core.$workspace_container;
        let $workspace = V.core.$workspace;
        // let $right_side = V.core.$right_side;
        // let $component_info = V.core.$component_info;

        // let setts = V.core.setts;

        // TODO или round?
        let step = V.core.setts.step;
        V.core.setts.width = Math.ceil($workspace_container.width() / step) * step;
        V.core.setts.height = Math.ceil($workspace_container.height() / step) * step;

        // let viewBox = [
        //     (wsSetts.width - workspace_w) / 2,
        //     (wsSetts.height - workspace_h) / 2,
        //     (wsSetts.width + workspace_w) / 2,
        //     (wsSetts.height + workspace_h) / 2,
        //     // workspace_w,
        //     // workspace_h
        // ];
        // wsSetts.vb_origin_params = viewBox;
        // viewBox = viewBox
        //     // .map((item) => {return item + 110;})  // TEMP TODO очередной костыль
        //     .join(" ");

        // установка размера и видимой области svg
        $workspace
            .attr("width", V.core.setts.width)
            .attr("height", V.core.setts.height)
        // .attr("viewBox", viewBox)  // TEMP
        ;

        V.core.set_axis();

        // рабочая область
        // TODO разобраться с эффективной выборкой элементов
        $workspace
        // отключение контекстного меню
            .contextmenu(function () {
                return false;
            })
            // .bind("mousedown", function (event) {
            //     // лкм
            //     if (event.which === 1) {
            //         // TODO выделение элементов мышью в область
            //     }
            //     // пкм
            //     else if (event.which === 3) {
            //         console.log("ПКМ");
            //     }
            // })
            // масштбирование рабочей области при скролле
            // .bind( "mousewheel DOMMouseScroll" , function(event) {
            //     let scale_d;
            //
            //     // увеличение
            //     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
            //         if (wsSetts.scale < wsSetts.max_scale) {scale_d = 1;}
            //         else {return;}
            //     }
            //     // уменьшение
            //     else {
            //         if (wsSetts.scale > wsSetts.min_scale) {scale_d = -1;}
            //         else {return;}
            //     }
            //
            //     wsSetts.scale += scale_d;
            //     $(this).attr(
            //         "viewBox",
            //         wsSetts.vb_origin_params
            //             .map((item) => {return item * wsSetts.scales[wsSetts.scale];})
            //             .join( " " )
            //     );
            // })
            // далее работа с компонентами на холсте
            .find(".component").each((i, item) => V.core.make_element_draggable(item));


        // по клику ЛКМ по пустой области скрыть описание компонента
        $("#background")
            .click(V.core.deactivate_element);

        // отлавливание нажатий клавиш
        // TODO разобраться, на что лучше вешать: window, document, html, что-то другое
        $(window)
            .keydown(function (event) {
                // console.log(event.which);

                let key_code = event.which;
                // Esc: снять выделение компонента
                if (key_code === 27) {
                    V.core.deactivate_element();
                }
                // Delete: удалить выделенный компонент
                else if (key_code === 46) {
                    if (V.core.active_element !== null) {
                        $(V.core.active_element).remove();
                        V.core.deactivate_element();
                    }
                }
                // TODO R: поворот компонента
                // else if (key_code === 82) {
                //     if (wsSetts.selected_component !== null) {
                //
                //     }
                // }
                // TODO: перемещение активного элемента с помощью стрелок
                // клавиша влево
                else if (key_code === 37) {
                    V.core.shift_element_location($(V.core.active_element), -V.core.setts.step, 0);
                }
                // клавиша вверх
                else if (key_code === 38) {
                    V.core.shift_element_location($(V.core.active_element), 0, V.core.setts.step);
                }
                // клавиша вправо
                else if (key_code === 39) {
                    V.core.shift_element_location($(V.core.active_element), V.core.setts.step, 0);
                }
                // клавиша вниз
                else if (key_code === 40) {
                    V.core.shift_element_location($(V.core.active_element), 0, -V.core.setts.step);
                }
            })
            // изменение размера окна
            .resize(function () {
                // TODO поправлять оси, центрировать рабочую область
                let [width, height] = [$workspace_container.width(), $workspace_container.height()];
                [V.core.setts.width, V.core.setts.height] = [width, height];
                $workspace
                // изменение размера рабочей области
                    .attr("width", width)
                    .attr("height", height);
                V.core.set_axis();
            });


        V.core.$workspace_container
            // ЛКМ, показать информацию о компоненте
            // TODO посмотреть, можно ли улучшить
            .on("mousedown", ".component", function () {
                // let $component_info = V.core.$element_info;
                // let setts = V.core.setts;

                // let [id, x, y, w, h] = ["id", "x", "y", "width", "height"].map( (p) => event.target.getAttribute(p) );
                let $target = $(this);
                let id = $target.attr("id");
                // TODO неверный отсчет координат
                let [x, y] = _.values($target.offset()).map(Math.round);
                let active_element = "#" + id;

                // проверка на повторный клик по компоненту
                if (V.core.active_element === active_element) return;

                if (V.core.active_element !== null) {
                    $(V.core.active_element).removeClass(V.core.setts.active_element_class);
                }
                V.core.active_element = active_element;

                $(V.core.active_element).addClass(V.core.setts.active_element_class);

                V.core.update_element_information({id: id, x: x, y: y});
            });
    };


    V.core.set_axis = function () {
        /** Set axis' location */
        $("#horizontal-axis")
            .attr("id", "horizontal-axis")
            .attr("x1", 0)
            .attr("y1", V.core.setts.height / 2)
            .attr("x2", V.core.setts.width)
            .attr("y2", V.core.setts.height / 2);
        $("#vertical-axis")
            .attr("id", "vertical-axis")
            .attr("x1", V.core.setts.width / 2)
            .attr("y1", 0)
            .attr("x2", V.core.setts.width / 2)
            .attr("y2", V.core.setts.height);
    };


    V.core.make_element_draggable = function (item) {
        /** Делает элемент перетаскиваемым */
        $(item)
            // перетаскивание
            .draggable({
                addClasses: false,
                containment: V.core.$workspace,
                start: function (event, ui) {
                    let $left_side = V.core.$left_side;
                    let setts = V.core.setts;

                    // текущие координаты
                    let x = (ui.offset.left - $left_side.width()) * setts.current_scale();
                    let y = ui.offset.top * setts.current_scale();
                    // сохранить текущие координаты
                    $(this).attr("start_offset", [x, y].join(","));
                },
                drag: function (event, ui) {
                    let $left_side = V.core.$left_side;
                    let setts = V.core.setts;

                    let $target = $(this);
                    // новые координаты
                    let x = (ui.offset.left - $left_side.width()) * setts.current_scale();
                    let y = ui.offset.top * setts.current_scale();
                    // ограничение передвижение элемента по холсту (по сетке)
                    [x, y] = [x, y].map((i) => Math.round(i / setts.step) * setts.step);
                    // расчёт произошедшего смещения
                    let [dx, dy] = _.zip(
                        [x, y],
                        $target.attr("start_offset").split(",").map(parseFloat))  // предыдущие координаты
                        .map((i) => i[0] - i[1])
                        .map(Math.round);  // TEMP
                    // сохранить текущие координаты
                    $target.attr("start_offset", [x, y].join(","));
                    // переместить компонент
                    V.core.shift_element_location(event.target, dx, -dy);
                    V.core.update_element_information({x: x, y: y});
                },
            });
    };

    V.core.update_element_information = function (ctx) {
        V.workspace.$element_info.css("visibility", "visible");
        if (ctx.id) {
            let id = ctx.id;
            $("#component-id").text(id);
        }
        let [x, y] = [V.core.to_ws_x(ctx.x), V.core.to_ws_y(ctx.y)];
        $("#component-x").text(x);
        $("#component-y").text(y);

    };


    V.core.shift_element_location = function (component, dx=0, dy=0) {
        /** Смещает компонент */
        dy = -dy;  // для совместимости между системой отсчёта рабочей области и SVG (ось y отражена)

        $(component).children().each(function (i, element) {
            element = $(element);
            let name = element.prop("tagName");
            if (name === "rect") {
                let [x, y] = [+element.attr("x") || 0, +element.attr("y") || 0];
                element.attr("x", x + dx);
                element.attr("y", y + dy);
            }
            else if (name === "circle") {
                let [x, y] = [+element.attr("cx") || 0, +element.attr("cy") || 0];
                element.attr("cx", x + dx);
                element.attr("cy", y + dy);
            }
            else if (name === "line") {
                ["x1", "x2"].forEach( (attr) => element.attr(attr, +element.attr(attr) + dx) );
                ["y1", "y2"].forEach( (attr) => element.attr(attr, +element.attr(attr) + dy) );
            }
            // TODO
            // else if (name === "path") {
            //     let d = element.attr("d").split(" ")
            //         .map((v) => $.isNumeric(v) ? parseFloat(v): v);
            // }
            // TEMP
            else {
                console.error(component, element);
            }
        })
    };


    V.core.set_component_location = function (component, x=0, y=0) {
        // TODO
    };


    V.core.clone_element = function (parent_node, new_id, x=0, y=0) {
        /** Клонировать компонент из переданного */
        // console.log("clone_element: ", parent_node, new_id, x, y);
        // parent_node = $(parent_node);
        // let new_id = parent_node.attr("id") + "-" + Math.trunc(Math.random() * 100);  // TEMP
        let $new_component = parent_node
            .clone()
            .attr("id", new_id)
            .removeClass(V.core.setts.active_element_class)
            .appendTo(V.core.$workspace)
            .each((i, item) => V.core.make_element_draggable(item));
        // разместить компонент в начале координат
        // TODO заменить на set_component_location
        V.core.shift_element_location($new_component, x, y);
        return $new_component;
    };


    V.core.setup_workspace();

});