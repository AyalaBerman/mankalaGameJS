
let board = [];
let players = [];
let level;
players.push(localStorage.getItem("user1"));
players.push(localStorage.getItem("user2"));
let currentplayer = players[0];
document.getElementById("levela").addEventListener("click", init_level_a);
document.getElementById("levelb").addEventListener("click", init_level_b);
document.getElementById("score1").innerHTML = players[0] + " 0";
document.getElementById("score2").innerHTML = players[1] + " 0";
document.getElementById("restart").addEventListener("click", restart);
for (let i = 0; i < 14; i++) {
    document.getElementById(i).style.backgroundImage = "url('images/hole.jpg')";
}



function init_level_a() {
    console.log("init_level_a")
    for (let i = 0; i < 14; i++) {
        if (i == 0 || i == 7)
            board[i] = 0;
        else
            board[i] = 4;
    }
    init(4);
    document.getElementById("levels").style.display = "none";
    document.getElementById("levela").removeEventListener("click", init_level_a);
    document.getElementById("levelb").removeEventListener("click", init_level_b);
    document.getElementById("high_score").innerHTML = "השיא " + localStorage.getItem('high_score_a');
    level = 1;



}

function init_level_b() {
    console.log("init_level_b")
    for (let i = 0; i < 14; i++) {
        if (i == 0 || i == 7)
            board[i] = 0;
        else
            board[i] = 6;
    }
    init(6);
    document.getElementById("levels").style.display = "none";
    document.getElementById("levela").removeEventListener("click", init_level_a);
    document.getElementById("levelb").removeEventListener("click", init_level_b);
    document.getElementById("high_score").innerHTML = "השיא " + localStorage.getItem('high_score_b');
    level = 2;

}

//אתחולים
function init(amount) {
    for (let i = 0; i < board.length; i++) {
        if (board[i] != 0) {
            document.getElementById("value" + i).innerHTML = amount;
            document.getElementById(i).style.backgroundImage = "url('images/pic.jpg')";;
        }


        //הוספת מאזינים
        document.getElementById("value" + i).style.opacity = "0%";
        document.getElementById(i).addEventListener("click", choose);
        document.getElementById(i).addEventListener("mouseover", addclassanimation);
        document.getElementById(i).addEventListener("mouseout", removeclassanimation);
        console.log("init");
    }
}

//פונקציה שמחליפה בין השחקנים
function change_player() {
    if (currentplayer == players[0])
        currentplayer = players[1];
    else
        currentplayer = players[0];

}

//פונקציה שמרוקנת את התא שעליו לחץ המשתמש ושולחת לפונקציה שמוסיפה אבן לתאים הבאים בהתאמה
function choose() {
    console.log(currentplayer);
    let place = parseInt(event.currentTarget.getAttribute("id"));
    let loop = board[place];
    let i = 1;
    let index;
    if (belongs_to_currentPlayer(place) && !check_bighole(place) && !check_empty_hole(place)) {
        board[place] = 0;
        document.getElementById("value" + place).innerHTML = 0;
        document.getElementById(event.currentTarget.getAttribute("id")).style.backgroundImage = "url('images/hole.jpg')";
        let interval_id = setInterval(function () {
            if (i <= loop) {
                if (belongs_to_currentPlayer((place + i) % board.length) || !check_bighole((place + i) % board.length)) {
                    add_stone((place + i) % board.length)
                }
                else {
                    loop++;
                }

                i++;
            }
            else {
                clearInterval(interval_id);
            }
        }, 600)

        setTimeout(() => {
            after_add_stone((place + i - 1) % board.length);
        }, 600 * (loop + 1));

    }
    console.log("i " + i);
    console.log("place " + place);
    console.log("choose " + (place + i - 1));
}

//פונקציה שמראה כמה אבנים יש בתא שעליו עבר המשתמש
function addclassanimation() {
    let index = event.target.getAttribute("id");
    document.getElementById("value" + index).classList.add("animation");

}

function removeclassanimation() {
    let index = event.currentTarget.getAttribute("id");
    document.getElementById("value" + index).classList.remove("animation");

}

//פונקציה המקבלת אינדקס של תא בודד ומוסיפה לו אבן אחת
function add_stone(index) {
    board[index]++;
    document.getElementById("value" + index).innerHTML = board[index];
    document.getElementById(index).style.backgroundImage = "url('images/pic.jpg')";
    //פעולה ויזואלית של אבן נזרקת לתוך תא
    var image = document.createElement('img');
    image.setAttribute("src", "images/pic2.png");
    image.setAttribute("id", "addstone");
    document.getElementById(index).appendChild(image);
    setTimeout(remove_class_add_stone, 580);
    console.log("now " + index);
    let audio = document.getElementById("audio");
    audio1.play();

}
// פונקציה המסירה את האבן שנפלה וגורמת לה להתפוגג
function remove_class_add_stone() {
    document.getElementById("addstone").remove();
}

//פונקציה המתבצעת לאחר הוספת האבנים ובודקת האם יש לקחת את האבנים ממול והאם יש לתת לשחקן תור נוסף
function after_add_stone(index) {
    document.getElementById("score" + indexOf_currentPlayer()).innerHTML = currentplayer + " " + board[mankala_hole()];

    if (check_was_empty_hole(index) && belongs_to_currentPlayer(index))
        add_opposite_hole(index);

    if (game_is_finish() != 0) {
        winner();
    }

    if (!check_bighole(index) || !belongs_to_currentPlayer(index))
        change_player();

    if (game_is_finish() != 0) {
        winner();
    }


}

//פונקציה שמחזירה את האינדקס של השחקן הנוכחי
function indexOf_currentPlayer() {
    for (let i = 0; i < players.length; i++) {
        if (players[i] == currentplayer)
            return i + 1;
    }
}

// פונקציה שמקבלת אינדקס של תא ומחזירה אמת אם הוא שייך לשחקן הנוכחי 
function belongs_to_currentPlayer(index) {
    let class_list = document.getElementById(index).classList;
    let class_for_check = "player" + indexOf_currentPlayer();
    for (let i = 0; i < class_list.length; i++) {
        if (document.getElementById(index).classList[i] == class_for_check)
            return true;
    }
    return false;
}

//פונקציה שמקבלת אינדקס של תא בודד ובודקת האם התא שהתקבל  ריק
function check_empty_hole(index) {
    if (board[index] == 0)
        return true;
    return false;
}
//פונקציה שמקבלת אינדקס של תא בודד ובודק האם כעת יש בו אבן אחת
function check_was_empty_hole(index) {
    if (board[index] == 1)
        return true;
    return false;
}

//פונקציה שמקבלת אינדקס של תא ריק ומעבירה את כל האיברים בתא מולו לבור המנקלה של השחקן הנוכחי
function add_opposite_hole(index) {
    let classes = document.getElementById(index).classList;
    let theclass = "." + classes[2];
    let pair = document.querySelectorAll(theclass);
    if (board[parseInt(pair[1].getAttribute("id"))] + board[parseInt(pair[0].getAttribute("id"))] > 1) {
        board[mankala_hole()] += board[parseInt(pair[0].getAttribute("id"))];
        board[mankala_hole()] += board[parseInt(pair[1].getAttribute("id"))];
        document.getElementById("score" + indexOf_currentPlayer()).innerHTML = currentplayer + " " + board[mankala_hole()];
        document.getElementById("value" + mankala_hole()).innerHTML = board[mankala_hole()];

        // הריקון הלוגי
        board[parseInt(pair[0].getAttribute("id"))] = 0;
        board[parseInt(pair[1].getAttribute("id"))] = 0;
        document.getElementById("value" + pair[0].getAttribute("id")).innerHTML = 0;
        document.getElementById("value" + pair[1].getAttribute("id")).innerHTML = 0;
        // הריקון הויזואלי
        document.getElementById(pair[0].getAttribute("id")).style.backgroundImage = "url('images/hole.jpg')";
        document.getElementById(pair[1].getAttribute("id")).style.backgroundImage = "url('images/hole.jpg')";

    }
}

//פונקציה שמקבלת אינדקס של תא בודד ובודקת האם התא שהתקבל הוא בור מנקלה
function check_bighole(index) {
    if (index == 7 || index == 0)
        return true;
    return false;
}

//פונקציה שמחזיר את בור המנקלה של השחקן הנוכחי
function mankala_hole() {
    if (indexOf_currentPlayer() == 1)
        return 7;
    else
        return 0;
}

//פונקציה שבודקת האם המשחק הסתיים
function game_is_finish() {
    let holes_of_player = document.querySelectorAll(".player1");
    let count = 0;
    for (let i = 0; i < holes_of_player.length; i++) {
        if (board[parseInt(holes_of_player[i].getAttribute("id"))] != 0)
            count++;
    }

    if (count == 1) {
        add_finish(1);
        return 1;
    }


    holes_of_player = document.querySelectorAll(".player2");
    count = 0;
    for (let i = 0; i < holes_of_player.length; i++) {
        if (board[parseInt(holes_of_player[i].getAttribute("id"))] != 0)
            count++;
    }

    if (count == 1) {
        add_finish(2);
        return 2;
    }

    return 0;

}

//פונקציה המדפיסה את שם השחקן המנצח
function winner() {
    if (board[0] > board[7]) {
        document.getElementById("winner_name").innerHTML = players[1];
        document.getElementById("winner").style.display = "flex";
        document.getElementById("instruction").style.display = "none";
        audio2.play();
        if (level == 1) {
            if (board[0] > localStorage.getItem('high_score_a'))
                localStorage.setItem('high_score_a', board[0]);
        }
        else {
            if (board[0] > localStorage.getItem('high_score_b'))
                localStorage.setItem('high_score_b', board[0]);
        }



    }

    else {
        document.getElementById("winner_name").innerHTML = players[0];
        document.getElementById("winner").style.display = "flex";
        document.getElementById("instruction").style.display = "none";
        audio2.play();

        if (level == 1) {
            if (board[7] > localStorage.getItem('high_score_a'))
                localStorage.setItem('high_score_a', board[7]);
        }
        else {
            if (board[7] > localStorage.getItem('high_score_b'))
                localStorage.setItem('high_score_b', board[7]);
        }
        
    }



}

//פונקציה המוסיפה את כל האבנים של היריב לבור המנקלה של מי שסיים את כל האבנים שלו
function add_finish(num_of_player) {
    let big_hole;
    if (num_of_player == 1)
        big_hole = 7;
    else
        big_hole = 0;
    for (let i = 1; i < board.length; i++) {
        if (i != 7) {
            board[big_hole] += board[i];
            document.getElementById(i).style.backgroundImage = "url('images/hole.jpg')";
            document.getElementById("value" + i).innerHTML = 0;
            board[i] = 0;
            document.getElementById("score" + (num_of_player)).innerHTML = players[num_of_player - 1] + " " + board[big_hole];
        }
    }
    document.getElementById("value" + big_hole).innerHTML = board[big_hole];
}

function restart() {
    location.reload();
}





