"use strict";

let V = {
    core: {}
};

$( document ).ready(function() {


    let wsSetts = {
        step: 10,  // шаг размещение элементов
        // ряд масштабов (взят такой же, как у Firefox)
        scales: [0.3, 0.5, 0.67, 0.8, 1, 1.1, 1.2, 1.33, 1.5, 1.7, 2, 2.4, 3],
        // масштаб определяется номером в ряду
        scale: 4,  // текущий масштаб (коэффициент)
        max_scale: 12,
        min_scale: 0,
        current_scale: () => wsSetts.scales[wsSetts.scale],  // текущий масштаб (дробь)

        // координаты рабочей области - в реальные координаты
        to_real_x: (x) => x + wsSetts.width / 2,
        to_real_y: (y) => y + wsSetts.height / 2,
        // реальные координаты - в координаты рабочей области
        to_ws_x: (x) => x - wsSetts.width / 2,
        to_ws_y: (y) => wsSetts.height / 2 - y,

        // размеры видимой рабочей области
        width: null,
        height: null,

        selected_component: null,  // id выделенного компонента
        // снять выделение компонента
        deselect_component: () => {
            $(wsSetts.selected_component).removeClass("selected");
            wsSetts.selected_component = null;
            $("#component-info").css("visibility", "hidden");
        },

        // параметры viewBox (для отображения части холста)
        vb_origin_params: [],
    };

    let $left_side = $( "#left-side" );
    let $workspace_side = $( "#workspace-side" );
    let $workspace = $( "#workspace" );
    let $right_side = $( "#right_side" );
    let $component_info = $( "#component-info" );


    function setupWorkSpace() {
        /** Настройка рабочей области */
        wsSetts.width = Math.ceil($workspace_side.width() / wsSetts.step) * wsSetts.step;
        wsSetts.height = Math.ceil($workspace_side.height() / wsSetts.step) * wsSetts.step;

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
            .attr("width", wsSetts.width)
            .attr("height", wsSetts.height)
            // .attr("viewBox", viewBox)  // TEMP
        ;

        // установка осей
        // TEMP
        d3.select("#workspace")
            .insert("line", ":first-child")  // на задний фон
            .attr("id", "vertical-axis")
            .attr("x1", wsSetts.width / 2)
            .attr("y1", 0)
            .attr("x2", wsSetts.width / 2)
            .attr("y2", wsSetts.height);
        // <line id="vertical-axis" x1="1500" y1="0" x2="1500" y2="3000" />
        d3.select("#workspace")
            .insert("line", ":first-child")
            .attr("id", "horizontal-axis")
            .attr("x1", 0)
            .attr("y1", wsSetts.height / 2)
            .attr("x2", wsSetts.width)
            .attr("y2", wsSetts.height / 2);
        // <line id="horizontal-axis" x1="0" y1="1500" x2="3000" y2="1500" />

    }

    // рабочая область
    // TODO разобраться с эффективной выборкой элементов
    $workspace
        // отключение контекстного меню
        .contextmenu(function () { return false; })
        // отображение положения курсора в координатах холста
        .mousemove(function (event) {
            let x = Math.round(wsSetts.to_ws_x(event.pageX - $left_side.width()));
            let y = Math.round(wsSetts.to_ws_y(event.pageY));
            $("#mouse-x").text(x);
            $("#mouse-y").text(y);
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
        .find(".component").each(bind_events_to_components);

    // отлавливание нажатий клавиш
    $(window)
        // TODO разобраться, на что лучше вешать: window, document, html, что-то другое
        .keydown(function (event) {
            let key_code = event.which;
            // Esc: снять выделение компонента
            if (key_code === 27) {
                wsSetts.deselect_component();
            }
            // Delete: удалить выделенный компонент
            else if (key_code === 46) {
                if (wsSetts.selected_component !== null) {
                    $(wsSetts.selected_component).remove();
                    wsSetts.deselect_component();
                }
            }
            // TODO R: поворот компонента
            // else if (key_code === 82) {
            //     if (wsSetts.selected_component !== null) {
            //
            //     }
            // }
            // else {
            //     console.log(event.which);
            // }
        })
        // изменение размера окна
        .resize(function () {
            // TODO поправлять оси, центрировать рабочую область
            $workspace
                // изменение размера рабочей области
                .attr("width", $workspace_side.width())
                .attr("height", $workspace_side.height());
        });

    // по клику ЛКМ по пустой области скрыть описание компонента
    $("#background")
        .click(wsSetts.deselect_component);


    function bind_events_to_components(i, item) {
        /** Привязывает события к компонентам */
        $(item)
            // ЛКМ, показать информацию о компоненте
            // TODO посмотреть, можно ли улучшить
            .mousedown(function (event) {
                $component_info.css("visibility", "visible");
                // let [id, x, y, w, h] = ["id", "x", "y", "width", "height"].map( (p) => event.target.getAttribute(p) );
                let $target = $(this);
                let id = $target.attr("id");
                // TODO неверный отсчет координат
                let [x, y] = _.values($target.offset()).map(Math.round);
                x = wsSetts.to_ws_x(x);
                y = wsSetts.to_ws_x(y);
                let selected_component = "#" + id;

                // проверка на повторный клик по компоненту
                if (wsSetts.selected_component === selected_component) {return;}


                if (wsSetts.selected_component !== null) {
                    $(wsSetts.selected_component).removeClass("selected");
                }
                wsSetts.selected_component = selected_component;

                $(wsSetts.selected_component).addClass("selected");

                $("#component-id").text(id);
                $("#component-x").text(x);
                $("#component-y").text(y);
                // $("#component-width").text(w);
                // $("#component-height").text(h);
            })
            // перетаскивание
            .draggable({
                addClasses: false,
                containment: $workspace,
                start: function (event, ui) {
                    // текущие координаты
                    let x = (ui.offset.left - $left_side.width()) * wsSetts.current_scale();
                    let y = ui.offset.top * wsSetts.current_scale();
                    // сохранить текущие координаты
                    $(this).attr("start_offset", [x, y].join(","));
                },
                drag: function(event, ui) {
                    let $target = $(this);
                    // текущие координаты
                    let x = (ui.offset.left - $left_side.width()) * wsSetts.current_scale();
                    let y = ui.offset.top * wsSetts.current_scale();
                    // ограничение передвижение элемента по холсту (по сетке)
                    [x, y] = [x, y].map( (i) => Math.round(i / wsSetts.step) * wsSetts.step );
                    // расчёт произошедшего смещения
                    let [dx, dy] = _.zip(
                            [x, y],
                            $target.attr("start_offset").split(",").map(parseFloat))  // предыдущие координаты
                        .map((i) => i[0] - i[1])
                        .map(Math.round);  // TEMP
                    // сохранить текущие координаты
                    $target.attr("start_offset", [x, y].join(","));
                    // переместить компонент
                    set_component_location(event.target, dx, dy);

                    // отобразить новые координаты
                    $("#component-x").text(wsSetts.to_ws_x(x));
                    $("#component-y").text(wsSetts.to_ws_y(y));
                },
            });
    }


    function set_component_location(comp, dx, dy) {
        $(comp).children().each(function (i, element) {
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
                // let [x1, y1, x2, y2] = ["x1", "y1", "x2", "y2"].map(  );
                // [x1, x2] = [x1, x2].map( (attr) => attr + dx );
                // [y1, y2] = [y1, y2].map( (attr) => attr + dy );
                // element.attr()

                ["x1", "x2"].map( (attr) => element.attr(attr, +element.attr(attr) + dx) );
                ["y1", "y2"].map( (attr) => element.attr(attr, +element.attr(attr) + dy) );
            }
            // TEMP
            else {
                console.error(comp, element);
            }
        })
    }


    function create_component(parent_node) {
        /** Клонировать компонент из переданного */
        parent_node = $(parent_node);
        let new_id = parent_node.attr("id") + "-" + Math.trunc(Math.random() * 100);  // TEMP
        let $new_component = parent_node
            .clone()
            .attr("id", new_id)
            .removeClass("selected")
            .appendTo($workspace)
            .each(bind_events_to_components);
        // разместить компонент в начале координат
        set_component_location($new_component, wsSetts.to_real_x(0), wsSetts.to_real_y(0));
        return $new_component;
    }

    setupWorkSpace();


    // TEMP
    (function test() {
        create_component("#blue-rect");

        $("#clone_component_btn").click(function () {
            if (wsSetts.selected_component !== null) {
                create_component(wsSetts.selected_component);
            }
        });

        let test_comps = V.components.libs.test;  // тестовая библиотека компонентов
        $("#component_selector").append(
            _.values(test_comps).map( (comp) => `<option value="${comp.type}">${comp.type}</option>` ).join("")
        );
        $("#create-component_btn")
            .click(function (event) {
                let component = $("#component_selector").find("option:selected").val();
                create_component(test_comps[component].svg_id);
            });
    })();

});
