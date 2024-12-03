
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

let graph = [];

class connect
{
    constructor(name, distance)
    {
        this.name = name;
        this.distance = distance;
    }
}

class Node
{
    constructor(name, body, floor, x, y, connections)
    {
        this.name = name;           //  название ноды (номер кабинета, туалет, мед-кабинет и т.д.)
        this.body = body;           //  корпус
        this.floor = floor;          //  этаж текущего узла (будет использоваться для отрисовки линий маршрута)
        this.x = x;                 //  x и y позиции текущего узла на карте
        this.y = y;                     
        this.connect = connections; //  список нод с которыми связана текущая и расстояние до них [{нода, расстояние}]  
        this.distance = 0;          //  дистанция до этого узла от начального
        this.route = [this.name];   //  путь от начального узла до текущего
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
        for (let j = 0; j < line[5]; j++)
        {
            let connection = new connect(line[5 + j * 2], line[5 + j * 2 + 1]);
            connect_list.push(connection);
        }
       let node = new Node(line[0], line[1], parseInt(line[2]), line[3], line[4], connect_list);

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
            console.log(`skip`);
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
});
where_floor.addEventListener(`change`, (event) => {
    refresh_list(where_floor);
});

to_body.addEventListener(`change`, (event) => {
    refresh_list(to_body);
});
to_floor.addEventListener(`change`, (event) => {
    refresh_list(to_floor);
});






//          ПЕРЕКЛЮЧЕНИЕ СЛОЯ КАРТЫ



function layer_up()
{
    if (current_floor < max_floor)
    {
        current_floor++;
        map_image.src = image_list[current_floor];
    }
}

function layer_down ()
{
    if (current_floor > min_floor)
    {
        current_floor--;
        map_image.src = image_list[current_floor];
    }
}

