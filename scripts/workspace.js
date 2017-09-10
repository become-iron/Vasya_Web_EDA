"use strict";

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
        ws_x_to_real: (x) => x + wsSetts.width / 2,
        ws_y_to_real: (y) => y + wsSetts.height / 2,
        // реальные координаты - в координаты рабочей области
        real_x_to_ws: (x) => x - wsSetts.width / 2,
        real_y_to_ws: (y) => wsSetts.height / 2 - y,

        // размеры видимой рабочей области
        width: null,
        height: null,

        selected_component: null,  // id выделенного компонента
        // снять выделение компонента
        deselect_component: () => {
            $(wsSetts.selected_component).removeClass("selected");
            wsSetts.selected_component = null;
            $("#component-info").css("visibility","hidden");
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
            let x = Math.round(wsSetts.real_x_to_ws(event.pageX - $left_side.width()));
            let y = Math.round(wsSetts.real_y_to_ws(event.pageY));
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
            // Esc: снять выделение компонента
            if (event.which === 27) {
                wsSetts.deselect_component();
            }
            // Delete: удалить выделенный компонент
            else if (event.which === 46) {
                if (wsSetts.selected_component !== null) {
                    $(wsSetts.selected_component).remove();
                    wsSetts.deselect_component();
                }
            }
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
                let [id, x, y, w, h] = ["id", "x", "y", "width", "height"].map( (p) => event.target.getAttribute(p) );

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
                $("#component-width").text(w);
                $("#component-height").text(h);
            })
            // перетаскивание
            .draggable()
            // https://stackoverflow.com/a/6166850/4729582
            // вынести элемент на передний слой
            // .bind("mousedown", function(event, ui){
            //     $(event.target.parentElement).append( event.target );
            // })
            .bind("drag", function(event, ui){
                // update coordinates manually, since top/left style props don"t work on SVG
                let left_side_width = $( "#left-side" ).width();
                let x = (ui.position.left - left_side_width) * wsSetts.current_scale();
                let y = ui.position.top * wsSetts.current_scale();

                // ограничение передвижение элемента по холсту (по сетке)
                [x, y] = [x, y].map( (i) => Math.round( i / wsSetts.step) * wsSetts.step );

                // TODO проверка выхода компонента за границы поля
                // let [w, h] = ["width", "height"].map((p) => +event.target.getAttribute(p));

                event.target.setAttribute("x", x);
                event.target.setAttribute("y", y);

                $("#component-x").text(wsSetts.real_x_to_ws(x));
                $("#component-y").text(wsSetts.real_y_to_ws(y));
            });
    }


    function create_component(parent_node) {
        /** Клонировать компонент из переданного */
        parent_node = $(parent_node);
        let new_id = parent_node.attr("id") + "-" + Math.trunc(Math.random() * 100);  // TEMP
        return $(parent_node)
            .clone()
            .attr("id", new_id)
            .attr("x", wsSetts.ws_x_to_real(0))
            .attr("y", wsSetts.ws_y_to_real(0))
            .removeClass("selected")
            .appendTo($workspace)
            .each(bind_events_to_components);
    }

    setupWorkSpace();


    // TEMP
    (function test () {
        create_component("#blue-rect");

        $("#clone_component_btn").click(function () {
            if (wsSetts.selected_component !== null) {
                create_component(wsSetts.selected_component);
            }
        })
    })();

});
