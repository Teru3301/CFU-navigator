
var current_floor = 0;
var max_floor = 3;
var min_floor = 0;

var map_image = document.getElementById('map_image');
var image_list = ["./static/images/l0.png", "./static/images/l1.png", "./static/images/l2.png", "./static/images/l3.png"];


let lines;
async function load_file() {
    try {
        const response = await fetch('./static/scripts/list.txt'); // Ожидаем завершения запроса
        if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`); // Проверяем успешность запроса
        }
        const text = await response.text(); // Ожидаем чтения текста
        lines = text.split('\n'); // Разделяем текст по строкам
    } catch (error) {
        console.error('Произошла ошибка:', error); // Обрабатываем ошибки
    }
}
(async () => {
    await load_file();
    for (var i = 0; i < lines.length; i++)
        console.log(lines[i]);
})();


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



