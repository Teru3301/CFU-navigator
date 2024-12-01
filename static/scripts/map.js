
var current_floor = 0;
var max_floor = 3;
var min_floor = 0;


function layer_up(map_image)
{
    if (current_floor < max_floor)
    {
        switch (current_floor)
        {
            case 0:
                map_image.src = "./static/images/l1.png";
                break;
            case 1:
                map_image.src = "./static/images/l2.png";
                break;
            case 2:
                map_image.src = "./static/images/l3.png";
                break;
        }
        current_floor++;
    }
}

function layer_down (map_image)
{
    if (current_floor > min_floor)
        {
            switch (current_floor)
            {
                case 1:
                    map_image.src = "./static/images/l0.png";
                    break;
                case 2:
                    map_image.src = "./static/images/l1.png";
                    break;
                case 3:
                    map_image.src = "./static/images/l2.png";
                    break;
            }
            current_floor--;
        }
}