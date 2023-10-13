// — Якщо час закінчився і ви не встигли скласти пазл має видати повідомлення в модальному вікні: “It's a pity, but you lost”. Кнопка Check result має заблокуватися

// — При кліку на кнопку Check result має видати повідомлення в модальному вікні: “You still have time, you sure?” з часом який залишився.

// — При кліку на кнопку Check перевіряється чи добре складений пазл, якщо так видає повідомлення: “Woohoo, well done, you did it!” в іншому варіанті “It's a pity, but you lost”. Кнопка Check result має заблокуватися.

// — При кліку на кнопку Close закриває модальне вікно.

// — При кліку на кнопку New game скидує час і заново рандомно розставляє пазли. Кнопка Start game має розблокуватися, а кнопка Check result має бути заблокована.

"use strict";

let timer;
let time = 60;
let chack = true;
let chose;

// Click on hiht button

$('.hiht').on('click', function(){
  $('.google-hiht').fadeToggle();
})



//
$(".img-together").sortable({
  connectWith: ".img-together",
  containment: $(".puzzle__container"),
  cursor: "move",
  scroll: false,
  delay: 300,

  start: function (e, ui) {
    if (chack) {
      $(".oclock__btn_start").prop("disabled", true);
      $(".oclock__btn_check").prop("disabled", false);
      $(".oclock__btn_newGame").prop("disabled", true);
      if (chack) {
        setInterval(timerStart, 1000);
        chack = false;
      }
    }
  },
  receive: function (event, ui) {
    if ($(this).attr("value") == "fill") {
      chose = 1;
    } else {
      $(this).attr("value", "fill");
      chose = 0;
    }
  },
  stop: function (event, ui) {
    if (chose) {
      $(this).sortable("cancel");
    } else {
      $(this).removeAttr("value");
    }
  },
});

// Start function puzzleFill
puzzleFill();

$(".oclock__btn_start").click(() => {
  time = 60;
  $(".oclock__btn_start").attr("disabled", true);
  $(".oclock__btn_newGame").attr("disabled", true);
  $(".oclock__btn_check").removeAttr("disabled");
  timer = setInterval(timerStart, 1000);
  chack = false;
});
$(".oclock__btn_check").click(() => {
  clearInterval(timer);
  $(".modal-time").text(time > 9 ? `00:${time}` : `00:0${time}`);
  modalOpen(1);
});
$(".oclock__btn_newGame").click(() => {
  $(".oclock__btn_start").removeAttr("disabled");
  $(".oclock__minuts").text("01:00");
  puzzleFill();
});
// button modal
$(".btn-closeSure").click(() => {
  timer = setInterval(timerStart, 1000);
  modalClose(1);
});
$(".btn-check").click(() => {
  $(".oclock__btn_newGame").removeAttr("disabled");
  if (gameCheck() == 16) {
    modalChange(1);
  } else {
    modalChange(0);
  }
});
$(".btn-closeLose").click(() => modalClose(2));
$(".btn-closeWin").click(() => modalClose(3));

// // timerStart()
function timerStart() {
  $(".oclock__minuts").text(--time > 9 ? `00:${time}` : `00:0${time}`);
  if (!time) {
    clearInterval(timer);
    if (gameCheck() == 16) {
      modalOpen(3);
    } else modalOpen(2);
  }
}

function puzzleFill() {
  let check = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let position;
  for (let i = 0; i < 16; i++) {
    $(".puzzle__first>.img-together").attr("value", "fill");
    $(".puzzle__second>.img-together").removeAttr("value");
    do {
      position = Math.round(Math.random() * 15);
    } while (check[position]);
    $(`.pzl:eq(${i})`).attr("value", `${position + 1}`);
    $(`.puzzle_first>.img-together:eq(${i})`).append($(`.pzl:eq(${i})`));
    check[position] = 1;
  }

  $(".img").css(
    "background-image",
    "url(images/google_icon-icons.com_62736.png)"
  );
}

// button puzzle
// $(".btn-start").click(() => {
//   time = 60;
//   $(".btn-start").attr("disabled", true);
//   $(".oclock__btn_check").removeAttr("disabled");
//   timer = setInterval(timerStart, 1000);
// });
$(".oclock__btn_check").click(() => {
  clearInterval(timer);
  $(".modal-time").text(time > 9 ? `00:${time}` : `00:0${time}`);
  modalOpen(1);
});
$(".oclock__btn_newGame").click(() => {
  $(".btn-start").removeAttr("disabled");
  $(".countTimer").text("01:00");

  puzzleFill();
});
// button modal
$(".btn-closeSure").click(() => {
  // timer = setInterval(timerStart, 1000);
  modalClose(1);
});
$(".btn-check").click(() => {
  if (gameCheck() == 16) {
    clearInterval(timer);
    modalChange(1);
  } else {
    clearInterval(timer);
    modalChange(0);
  }
});
$(".btn-closeLose").click(() => {
  clearInterval(timer);
  modalClose(2);
  window.location.reload(true);
});

$(".btn-closeWin").click(() => {
  clearInterval(timer);
  modalClose(3);
  window.location.reload(true);
});

// gameCheck()
function gameCheck() {
  time = 61;
  let checkResult = 0;
  for (let i = 0; i < 16; i++) {
    if (
      $(`.puzzle__second>.img-together:eq(${i})>.img`).attr("value") ==
      i + 1
    ) {
      checkResult++;
    }
  }
  $(".oclock__btn_check").attr("disabled", true);
  return checkResult;
}

// modal show & hide
function modalOpen(num) {
  let alert =
    num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
  $(".modal").fadeIn(300);
  $(`${alert}`).show();
  $(`${alert}`).animate(
    {
      marginTop: "50px",
    },
    300
  );
}
function modalChange(num) {
  $(".modal-sure").hide();
  num
    ? $(".modal-win").css("margin-top", "50px")
    : $(".modal-lose").css("margin-top", "50px");
  num ? $(".modal-win").show() : $(".modal-lose").show();
}
function modalClose(num) {
  let alert =
    num == 1 ? ".modal-sure" : num == 2 ? ".modal-lose" : ".modal-win";
  $(`${alert}`)
    .animate(
      {
        marginTop: "0px",
      },
      300
    )
    .fadeOut();
  $(".modal").fadeOut(300);
}
