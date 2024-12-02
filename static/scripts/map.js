
let current_floor = 0;
let max_floor = 3;
let min_floor = 0;

let map_image = document.getElementById('map_image');
let image_list = ["./static/images/l0.png", "./static/images/l1.png", "./static/images/l2.png", "./static/images/l3.png"];

let graph;


//          ЗАГРУЗКА ГРАФА ИЗ ФАЙЛА

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

class Node
{
    constructor(name, body, floor, x, y, connects)
    {
        this.name = name;           //  название ноды (номер кабинета, туалет, мед-кабинет и т.д.)
        this.body = body;           //  корпус
        this.foor = floor;          //  этаж текущего узла (будет использоваться для отрисовки линий маршрута)
        this.x = x;                 //  x и y позиции текущего узла на карте
        this.y = y;
        this.connects = connects;   //  список нод с которыми связана текущая и расстояние до них [{нода, расстояние}]  
        this.distance = 0;          //  дистанция до этого узла от начального
        this.route = [this.name];   //  путь от начального узла до текущего
    }
};

(async () => {
    let text = await load_file();
    for (let i = 0; i < text.length; i++)
    {
        let line = text[i].split(/\s+/);                    //  разделение строки на отдельные значения
        line = line.filter(item => item.trim() !== "");     //  удаление пустых элементов

        for (let j = 0; j < line.length; j++)
            console.log( "i = " + i + " j = " + j + " value = " + line[j]);
    }
})();



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



