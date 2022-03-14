const cardsArray = document.querySelectorAll(".game__card");  //! получаю массив всех карт
let amountCards = cardsArray.length;

//! получаем случайное число и записываем его в свойство "order" флекс-элементов (карточек) для их перемешивания:
function shuffleCards() {
	cardsArray.forEach((card) => {
		card.style.order = Math.floor(Math.random() * amountCards);
	});
};

shuffleCards();

//! преобразование даты в формат год-месяц-день:
function dateToYMD(date) {
	let d = date.getDate();
	let m = date.getMonth() + 1; //! месяцы от 0 до 11
	let y = date.getFullYear();
	return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
};

function saveScore(steps) {

	let current = localStorage.getItem('score');

	if (current) {
		current = JSON.parse(current);
	} else {
		current = [];
	};

	current.unshift({ resultSteps: steps, date: dateToYMD(new Date()) });  //! делаем массив объектов
	current.length = Math.min(current.length, 10);
	localStorage.setItem('score', JSON.stringify(current));
};

function showResults() {

	let scoreList = JSON.parse(localStorage.getItem('score') || "[]");
	let content = "";

	scoreList.forEach((obj) => {
		content += `
			<div class="score__item">
				<p class="score__date">${obj.date}</p>
				<p class="score__value">${obj.resultSteps}</p>
			</div>
		`;
	});

	let results = document.querySelector(".results");
	let scoreBox = document.querySelector(".score");
	scoreBox.innerHTML = content;
	results.style.display = "block";  //! делаем блок с результатами видимым

	let stepsBox = document.querySelector(".results__steps");
	stepsBox.innerHTML = `${steps}`;
};

let isFirstOpened = true;
let firstCard;
let secondCard;
let isFreeze = false;
let steps = 0;
let guessedCount = 0;


function flipCard() {

	if (!isFreeze) {

		//! проверка клика по уже открытой карте:
		if (this.classList.contains("flip")) {
			return;  //! если карта, по которой кликнули, уже открыта, то эта функция оборвётся, ничего не произойдёт
		} else {
			this.classList.add("flip");
		};

		if (isFirstOpened) {
			firstCard = this;  //! в firstCard записывается та карта, которую кликнули первой (определяем это благодаря isFirstOpened)
			isFirstOpened = false;

		} else {
			secondCard = this;  //! в secondCard записывается та карта, которую кликнули второй (определяем это благодаря isFirstOpened)
			isFirstOpened = true;

			steps += 1;

			checkCards();  //! вызываем функцию проверки, если открыта уже вторая карта
		};

	} else {
		return;
	};
};


function checkCards() {

	if (firstCard.dataset.content === secondCard.dataset.content) {
		firstCard.removeEventListener("click", flipCard);  //! удаляем обработчик, чтобы карта больше не реагировала на клики
		secondCard.removeEventListener("click", flipCard);  //! удаляем обработчик, чтобы карта больше не реагировала на клики
		guessedCount += 2;

		if (guessedCount === amountCards) {
			saveScore(steps);
			showResults();
		};

	} else {
		isFreeze = true;  //! замораживаем карты - блокируем возможность открывать другие карты, пока не закроются две выбранные
		setTimeout(() => {
			firstCard.classList.remove("flip");  //! несовпадающие карты снова переворачиваем рубашкой вверх через 1 секунду
			secondCard.classList.remove("flip");
			isFreeze = false;  //! размораживаем карты, ведь две выбранные уже закрылись
		}, 1000);
	};
};


cardsArray.forEach((card) => card.addEventListener("click", flipCard));

//! при клике происходит "rotateY(180deg)" обоих изображений: и рубашки, и картинки
//! т.к. они смотрят в противоположные стороны, то при этом видно либо одно изображение, либо другое


let buttonPlay = document.querySelector(".results__playButton");

buttonPlay.addEventListener("click", function (event) {
	if (event.target.classList.contains("results__playButton")) {
		location.reload();
	};
});


