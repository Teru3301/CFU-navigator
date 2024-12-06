
let where_body = document.getElementById(`where_body`);
let where_floor = document.getElementById(`where_floor`);
let where_auditory = document.getElementById(`where_auditory`);

let to_body = document.getElementById(`to_body`);
let to_floor = document.getElementById(`to_floor`);
let to_auditory = document.getElementById(`to_auditory`);

let current_floor = 0;
let max_floor = 3;
let min_floor = 0;

let map_image = document.getElementById('map_image');
let image_list = ["./static/images/l0.png", "./static/images/l1.png", "./static/images/l2.png", "./static/images/l3.png"];
let map_width = 700;
let map_height = 500;

let graph = [];

class connect
{
    constructor(id, distance)
    {
        this.id = id;
        this.distance = distance;
    }
}

class Node
{
    constructor(id, name, body, floor, x, y, connections)
    {
        this.id = id;
        this.name = name;           //  название ноды (номер кабинета, туалет, мед-кабинет и т.д.)
        this.body = body;           //  корпус
        this.floor = floor;          //  этаж текущего узла (будет использоваться для отрисовки линий маршрута)
        this.x = x;                 //  x и y позиции текущего узла на карте
        this.y = y;                     
        this.connect = connections; //  список нод с которыми связана текущая и расстояние до них [{нода, расстояние}]  
        this.distance = 0;          //  дистанция до этого узла от начального
        this.route = [this.name];   //  путь от начального узла до текущего
        this.calculated = false;
    }
};






//          ЗАГРУЗКА ГРАФА ИЗ ФАЙЛА В ГРАФ



async function load_file() {
    try {
        const response = await fetch('./static/scripts/list.txt'); // Ожидаем завершения запроса
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`); // Проверяем успешность запроса
        }
        const text = await response.text(); // Ожидаем чтения текста
        return text.split('\n'); // Возвращаем разделённый текст
    } catch (error) {
        console.error('Произошла ошибка:', error); // Обрабатываем ошибки
        return []; // Возвращаем пустой массив в случае ошибки
    }
}

(async () => {
    let text = await load_file();
    for (let i = 0; i < text.length; i++)
    {
        let line = text[i].split(/\s+/);                    //  разделение строки на отдельные значения
        line = line.filter(item => item.trim() !== "");     //  удаление пустых элементов
        if (line[0] == undefined) continue;                 //  пропуск пустых строк

        let connect_list = [];
        for (let j = 0; j < line[6]; j++)
        {
            let connection = new connect(parseInt(line[7 + j * 2]), parseInt(line[7 + j * 2 + 1]));
            connect_list.push(connection);
        }
       let node = new Node(parseInt(line[0]), line[1], line[2], parseInt(line[3]), line[4], line[5], connect_list);

        graph.push(node);
    }






//          ЗАПОЛНЕНИЕ ВЫПАДАЮЩЕГО СПИСКА



    for (let i = 0; i < graph.length; i++)
    {
        let cur_body = graph[i].body;
        let where_opt = document.createElement(`option`);
        let to_opt = document.createElement(`option`);
        
        if (where_body.innerHTML.indexOf(`value="` + cur_body + `"`) > -1) {
            console.log(`skip`);
        } else {
            where_opt.value = cur_body;
            where_opt.innerHTML = cur_body;
            where_body.appendChild(where_opt);

            to_opt.value = cur_body;
            to_opt.innerHTML = cur_body;
            to_body.appendChild(to_opt);
        }
    }

    refresh_list(where_body);
    refresh_list(to_body);

})();


//          ОБНОВЛЕНИЕ ЭЛЕМЕНТОВ ВЫПАДАЮЩЕГО СПИСКА

function refresh_list(element_)
{
    let parent = element_;
    let child;
    let preparent;

    switch (parent)
    {
        case where_body:
            child = where_floor;
            break;
        case where_floor:
            child = where_auditory;
            preparent = where_body;
            break;
        case to_body:
            child = to_floor;
            break;
        case to_floor:
            child = to_auditory;
            preparent = to_body;
    }


    while (child.length) {
        child.remove(0);
    }

    for (let i = 0; i < graph.length; i++)
    {
        if (child.innerHTML.indexOf(`value="` + graph[i].floor + `"`) > -1) {
            
        } else {
            let opt = document.createElement(`option`);
            
            if (parent == where_body || parent == to_body)
            {
                if (graph[i].body == parent.value) {        
                    opt.value = graph[i].floor;
                    opt.innerHTML = graph[i].floor;
                    child.appendChild(opt);
                }
            } else {
                if (graph[i].floor == parent.value)
                {
                    if (graph[i].body == preparent.value)
                    {
                        opt.value = graph[i].name;
                        opt.innerHTML = graph[i].name;
                        child.appendChild(opt);
                    }
                }
            }            
        }
    }

    if (preparent == undefined) {
        refresh_list(child);
    }
}


//          ОБРАБОТКА ИЗМЕНЕНИЯ ЭЛЕМЕНТОВ ВЫПАДАЮЩЕГО СПИСКА

where_body.addEventListener(`change`, (event) => {
    refresh_list(where_body);
    find_route();
});
where_floor.addEventListener(`change`, (event) => {
    refresh_list(where_floor);
    find_route();
});
to_body.addEventListener(`change`, (event) => {
    refresh_list(to_body);
    find_route();
});
to_floor.addEventListener(`change`, (event) => {
    refresh_list(to_floor);
    find_route();
});
where_auditory.addEventListener(`change`, (event) => {
    find_route();
});
to_auditory.addEventListener(`change`, (event) => {
    find_route();
});






//          РАСЧЕТ МАРШРУТА


function find_route ()
{
    let ind = 0;
    for (let i = 0; i < graph.length; i++)
    {
//          обнуление временных переменных узлов
        graph[i].distance = 100000000;
        graph[i].route = [];
        graph[i].route = [graph[i].name];
        graph[i].calculated = false;
//          определение текущего узла
        if (
            graph[i].body == where_body.options[where_body.selectedIndex].text &&
            graph[i].floor == where_floor.options[where_floor.selectedIndex].text &&
            graph[i].name == where_auditory.options[where_auditory.selectedIndex].text) 
        {
            graph[i].distance = 0;
        }

        if (
            graph[i].body == to_body.options[to_body.selectedIndex].text &&
            graph[i].floor == parseInt(to_floor.options[to_floor.selectedIndex].text) &&
            graph[i].name == to_auditory.options[to_auditory.selectedIndex].text )
        {
            ind = i;
        }
    }

//          сам расчет
    let min_node;
    while (graph[ind].calculated == false)
    {
//          поиск минимального значения расстояния
        let min_dist = 100000000;
        for (let i = 0; i < graph.length; i++)
            if (graph[i].calculated == false && graph[i].distance < min_dist)
                min_node = i;

//          обновление значений расстояния до узла
        for (let i = 0; i < graph[min_node].connect.length; i++)
        {
            if (graph[graph[min_node].connect[i].id].distance > graph[min_node].distance + graph[min_node].connect[i].distance)
            {
                graph[graph[min_node].connect[i].id].distance = graph[min_node].distance + graph[min_node].connect[i].distance;
                graph[graph[min_node].connect[i].id].route = [...graph[min_node].route];
                graph[graph[min_node].connect[i].id].route.push(graph[graph[min_node].connect[i].id].name);
            }
        }
        graph[min_node].calculated = true;
    }

    console.log(graph[ind].route);
}






//          ПЕРЕКЛЮЧЕНИЕ СЛОЯ КАРТЫ



function layer_up()
{
    if (current_floor < max_floor)
    {
        current_floor++;
        paint_map();
    }
}

function layer_down ()
{
    if (current_floor > min_floor)
    {
        current_floor--;
        paint_map();
    }
}






//          ОТРИСОВКА МАРШРУТА



function paint_map ()
{
//          определение канваса
    let canvas = document.getElementById('map_canvas');
    canvas.style[`background-image`] = "url(" + image_list[current_floor];
    let ctx = canvas.getContext(`2d`);
    canvas.width = map_width;
    canvas.height = map_height;

//          отрисовка по точкам
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    ctx.moveTo(0, 0);
    ctx.lineTo(200, 200);
    ctx.stroke();
}

paint_map();