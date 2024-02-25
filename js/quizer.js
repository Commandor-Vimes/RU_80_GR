let sec_per_turn = 30;

let sec = 0;
let song_count = 0;
let poster_count = 1;
let answers;
let correct = 0;
let score = 0;
let f_packages = 1;
let m_packages = 1;
let gr_packages = 1;
let hardcore_level = 1;
let options;
let skill = '';
let rate = '';
let lang = '';
let year = '';
let genre = '';
let artist_type = '';
let audioPath = 'audio/ru/';
let imgPath = 'img/';
let finalMessage = '';
let modeToggle;
let setMedia;
let rightAnswer;
let toggleFlag = false;
let withoutAnswers = false;
let isSingle = true;
let audio;
let start_count_down = false;
let rating = [];
let songs_backup;
let overall;

function mirror(txt, speed = 20, color){
$('#mirror_txt').replaceWith( '<marquee id="mirror_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function mirror_eval(txt, speed = 20, color){
$('#eval_txt').replaceWith( '<marquee id="eval_txt" class="font text-center align-middle ' + color + '" direction="up" scrolldelay="1" scrollamount="' + speed + '" behavior="slide"><font id="road_text">' + txt + '</font></marquee>' );
}

function choose(num){
	$('#pause').show();
	let answer = '';
	if(num){
		answer = options[num-1];
	} else {
		answer = $('#answer_input').val();
	}
	start_count_down = false;
	if(audio && audio.paused){
		audio.play();
	}
	modeToggle();
	let group = songs[song_count].group;
	let song = songs[song_count].song;
	let song_year = songs[song_count].year;
	if(!song_year) {
		song_year = '';
	} else {
		song_year = ' (' + song_year + ')';
	}
	if(answer.toUpperCase() == songs[song_count].group.toUpperCase()){
		mirror_eval(rightAnswer(song_year), 20, "green");
		$("#option_" + num).addClass("green");
		correct++;
		if (!~rate.indexOf('+ ' + group)){
			$('#rate').html(rate = '<br/>+ ' + group + rate);
		}
		$('#score').html(++score);
	} else {
		mirror_eval(rightAnswer(song_year), 20, "red");
		$("#option_" + num).addClass("red");
		$('#skill').html(skill = '<br/>- ' + group + '<br/>"' + song + '"' + song_year + skill);
	}
		toggleGameButton();
		next();
}

function rightAnswer_EN(){
	return songs[song_count].song;
}

function rightAnswer_RU(year){
	return songs[song_count].group + ' "' + songs[song_count].song + '"' + year;
}

function next(){
	if(song_count==songs.length-1){
		$('#song_count').html(song_count+1);
		$('#song').css("visibility", "hidden");
		$('#mirror').show();
		let overall = songs.length
		let percent = calculatePercent(correct,overall);
		let msg = 'Верно: ' + percent + '%('
		+ correct + '/' + overall + ').';
		let color = 'red';
		if(percent>=65){
			color = 'green';
			msg+=finalMessage; 
		} else{
			msg+=' Послушайте ещё песенок и попробуйте снова.'
		}
		mirror(msg, 20, color);
		emptyOptions();
		song_count=0;
		shuffle(songs);
	} else {
		$('#song_count').html(++song_count);
		toggleLearn();
	}
}

function calculatePercent(correct,overall){
	let num = correct/overall*100;
	return parseFloat(num).toFixed(0);
}

function toggle(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
		$('.game_button').prop('disabled', true);
	} else {
		$('#learn').prop('disabled', true);
		$('.game_button').prop('disabled', false);
	}
}

function toggleLearn(){
	if($('#learn').is('[disabled]')){
		$('#learn').prop('disabled', false);
	} else {
		$('#learn').prop('disabled', true);
	}
}

function toggleGameButton(){
	if($('.game_button').is('[disabled]')){
		$('.game_button').prop('disabled', false);
	} else {
		$('.game_button').prop('disabled', true);
	}
}

let lang_letter;

function learn(){
	hide_navi_icons();
	if(withoutAnswers){
		$('.without_answers').show();
	} else {
		$('.answer').show();
	}
	$('#pause').hide();
	$('#back').hide();
	$('#package_content').hide();
	$('#answer_input').val('');
	decolorOptions();
	modeToggle();
	toggleLearn();
	toggleGameButton();
	randomAnswers();
	setMedia();
	count_down(sec_per_turn);
	$('#mirror').hide();
}

async function sec_15(){
	if(audio.paused){
		audio.play();
		count_down(15);
	} else {
		audio.currentTime += 15;
		if(time_left < 15){
			time_left = 15;
		}
	}
}

function song_pause() {
	if(audio.paused){
		audio.play();
	} else {
		audio.pause();
	}
}

let time_left = 0;
async function count_down(end){
	start_count_down = true;
	time_left = end;
	while(start_count_down && time_left-- > 0){
		await sleep(1000);
		if(isSingle){	
			$('#sec').html(new Intl.NumberFormat().format(sec+=1));
		} else if(isP1Turn) {
			$('#p1_sec').html(new Intl.NumberFormat().format(p1_sec+=1));
		} else {
			$('#p2_sec').html(new Intl.NumberFormat().format(p2_sec+=1));
		}
	}
	if(start_count_down){
		audio.pause();
	}
}

let time_min = 0;
async function count_time(){
	while(true){
		await sleep(60000);
		$('#min').html(++time_min);
	}
}

function time_toggle() {
	$('#sec_h2').toggle();
	$('#min_h2').toggle();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function decolorOptions(){
	for(let i = 1; i <= 4; i++){
		$("#option_" + i).removeClass("red");
		$("#option_" + i).removeClass("green");
	}
}

function setAudio(){
	if(audio){
		audio.pause();
	}
	if(!songs[song_count].audioPath){
		audio = new Audio(audioPath + songs[song_count].id + '.mp3');
	} else {
		audio = new Audio(songs[song_count].audioPath + '.mp3');
	}
	audio.play();
}

function randomAnswers(){
	options = [];
	let current_answers = answers;
	current_answers = removeDuplicates(current_answers);
	let correctAnswer = songs[song_count].group;
	options.push(correctAnswer);
	removeItemOnce(current_answers,correctAnswer);
	if(current_answers.length > 4){
		removeItemOnce(answers,correctAnswer);
	} else {
		current_answers = removeItemOnce(removeDuplicates(songs.map(item=>item.group)),correctAnswer);
	}
	shuffle(current_answers);
	options.push(current_answers[0]);
	options.push(current_answers[1]);
	options.push(current_answers[2]);
	shuffle(options);
	$('#option_1').html(options[0]);
	$('#option_2').html(options[1]);
	$('#option_3').html(options[2]);
	$('#option_4').html(options[3]);
}

function skipGroup(flag, group){
	group = group.replace("#", "'");
	if(!flag.checked){
		songs = jQuery.grep(songs, function(value) {
		  return value.group != group;
		});
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	} else {
		$('.group_item').prop('checked', true);
		songs = songs_backup;
		answers = songs.map(item=>item.group);
		$('#total').html(songs.length);
	}
}

function emptyOptions(){
	$('#option_1').html('');
	$('#option_2').html('');
	$('#option_3').html('');
	$('#option_4').html('');
}

function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function removeDuplicates(arr) {
	var uniqueValues = [];
	$.each(arr, function(i, el){
		if($.inArray(el, uniqueValues) === -1) uniqueValues.push(el);
	});
	return uniqueValues;
}

function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function play_pause() {
   var mediaVideo = $("#song").get(0);
   if (mediaVideo.paused) {
       mediaVideo.play();
   } else {
       mediaVideo.pause();
  }
}

function toggleArtist(){
	if(toggleFlag){
		$('#artist').attr("src",  songs[song_count].imgPath + ".jpg");
		$('#artist').toggle();
	} else {
		toggleFlag = true;
	}
}

function load(){
	$('#answer_input').keypress(function (e) {
	  if (e.which == 13) {
		choose();
		return false;
	  }
	});	
	setup();
}

// RU songs
const ru_1980_gr_icon = [
	'ru_pop',
	'ru_via',
	'ru_rock_1',
	'ru_rock_2'
];

const RU_1980_GR_PACK_1 = 1;
const RU_1980_GR_PACK_2 = 2;
const RU_1980_GR_PACK_3 = 3;
const RU_1980_GR_PACK_4 = 4;

let ru_1980_gr = [
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Ласковый май',
		song : "Пусть будет ночь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Браво',
		song : "Жёлтые ботинки"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Форум',
		song : "Островок"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Форум',
		song : "Улетели листья"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Мираж',
		song : "Солнечное лето"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Зодиак',
		song : "Провинциальное диско"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Зодиак',
		song : "Рок на льду"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Динамик',
		song : "Ещё вчера"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Круг',
		song : "Кара-кум"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Сёстры Базыкины',
		song : "О чём ты думаешь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Маленький принц',
		song : "Мы встретимся снова"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Браво',
		song : "Ленинградский рок-н-ролл"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Игра',
		song : "Неспелая вишня"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Трио Меридиан',
		song : "Прекрасное далёко"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Тёмная лошадка"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Кони в яблоках"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Электроклуб',
		song : "Ты замуж за него не выходи"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Фристайл',
		song : "Прощай навеки, последняя любовь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Фристайл',
		song : "Принцесса"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Атас"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Не губите, мужики"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Любэ',
		song : "Клетки"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Сёстры Базыкины',
		song : "Moscow Nights"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Бродячие артисты"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Трава у дома"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Поверь в мечту"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Синий иней"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Белый снег (Завируха)"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Малиновка"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Сябры',
		song : "Вы шумите, берёзы"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Я иду тебе навстречу"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Не повторяется такое никогда"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Не надо печалиться"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "На острове Буяне"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "Каждый день твой"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Мы желаем счастья вам"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Богатырская сила"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Добры Молодцы',
		song : "Песенка о снежинке"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Коробейники',
		song : "Первый снег"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Красные маки',
		song : "Если не расстанемся"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Лейся, песня',
		song : "Я так и знал"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Напиши мне письмо"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Весёлые ребята',
		song : "Люди встречаются"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Земляне',
		song : "Каскадёры"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Не обещай"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Здравствуй, песня',
		song : "Птица счастья"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Верасы',
		song : "Я у бабушки живу"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Так вот какая ты"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Синяя птица',
		song : "Белый теплоход"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Цветы',
		song : "Звездочка моя ясная"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Пламя',
		song : "Снег кружится"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ариэль',
		song : "В краю магнолий"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ялла',
		song : "Три колодца"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Ялла',
		song : "Канатоходцы"
	},
	{
		pack : RU_1980_GR_PACK_2,
		group : 'ВИА Лейся, песня',
		song : "Обручальное кольцо"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Вольный ветер"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Никто не услышит (Ой-йо)"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чайф',
		song : "Всему своё время"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Крутится волчок"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Не позволяй душе лениться"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Круиз',
		song : "Виза для Круиза"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Церквушки"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Красное на чёрном"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Моё поколение"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Алиса',
		song : "Воздух"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Карнавал',
		song : "Аэропорт"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Карнавал',
		song : "Запасной игрок"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "На заре"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "Дайте огня"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Альянс',
		song : "Фальстарт"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Головокруженье"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Ирландия. Ольстер"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Автограф',
		song : "Корабль"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Кто виноват"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Воскресение"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Воскресение',
		song : "Мчится поезд"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Привет"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Алиса"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Секрет',
		song : "Ленинградское время"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Улица роз"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Позади Америка"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Ария',
		song : "Воля и разум"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Аквариум',
		song : "Поезд в огне"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Бригада С',
		song : "Бродяга"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'ДДТ',
		song : "Родина"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Чёрный кофе"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Чёрный кофе',
		song : "Вольному воля"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Nautilus Pompilius',
		song : "Гудбай, Америка"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Nautilus Pompilius',
		song : "Я Хочу Быть С Тобой"
	},
	{
		pack : RU_1980_GR_PACK_3,
		group : 'Агата Кристи',
		song : "Пантера"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Маленькая девочка"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Мусорный ветер"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Крематорий',
		song : "Клубника со льдом"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Иероглиф"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Остров"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Пикник',
		song : "Пикник"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Бутылка водки"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Серый голубь"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Звуки Му',
		song : "Досуги-буги"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Нэпман"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Волчица"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'АукцЫон',
		song : "Дорога"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Всё идёт по плану"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "Зоопарк"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Гражданская оборона',
		song : "На наших глазах"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Буги-вуги каждый день"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Пригородный блюз"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Зоопарк',
		song : "Песня простого человека"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Ветер перемен"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Вот так вота!"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'ДК',
		song : "Заберите вашу жизнь"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Рок-Ателье',
		song : "Замыкая круг"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Анонс',
		song : "Оля и СПИД"
	},
	{
		pack : RU_1980_GR_PACK_1,
		group : 'Анонс',
		song : "Зина — продавец из магазина"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Центр',
		song : "Навсегда"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Центр',
		song : "Алексеев"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Центр',
		song : "Тургеневские женщины"
	},
	{
		pack : RU_1980_GR_PACK_4,
		group : 'Чёрный Лукич',
		song : "Мы идём в тишине (ft Егор Летов)"
	}
];

let ru_1980_gr_1 =	ru_1980_gr.filter(item => item.pack == 1);
let ru_1980_gr_2 =	ru_1980_gr.filter(item => item.pack == 2);
let ru_1980_gr_3 =	ru_1980_gr.filter(item => item.pack == 3);
let ru_1980_gr_4 =	ru_1980_gr.filter(item => item.pack == 4);


let music = [
	{
		arr: ru_1980_gr,
		lang: 'ru',
		year: '1980',
		type: 'gr',
		packs: [
				{
					arr: ru_1980_gr_1,
					name: 'RU 1980s Groups: Pop',
				},
				{
					arr: ru_1980_gr_2,
					name: 'RU 1980s Groups: VIA',
				},
				{
					arr: ru_1980_gr_3,
					name: 'RU 1980s Groups: Rock#1',
				},
				{
					arr: ru_1980_gr_4,
					name: 'RU 1980s Groups: Rock#2',
				}
			]
	}
]

let songs_to_map;
let mapping_result;
function map_songs(){
	back = back_to_current_pack;
	$('.package').hide();
	$('#mirror').hide();
	$('#map').hide();
	$('#package_content').hide();
	$('#mapping_content').show();
	toggleLearn();
	for(var j=0; j < music.length; j++){
		music[j].arr = generateSongIdsWithPrefix(music[j].arr, music[j].lang, 
												music[j].year, music[j].type);
	}
	showMapping(0, "en_2000_gr", "gr");
}

function select_mapping_button(suffix, type){
	$('.gr').attr('src', 'img/chart/gr.png');
	$('.m').attr('src', 'img/chart/m.png');
	$('.f').attr('src', 'img/chart/f.png');
	let selected = 'img/chart/' + type + '_selected.png';
	$('#btn_' + suffix).attr('src', selected);
}

function showMapping(index, suffix, type){
	select_mapping_button(suffix, type);
	mapping_result = '';
	let h1_start = `<h1>`;
	let h1_end = `</h1>`;
	let br = `<br/>`;
	let hr = `<hr/>`;
	for(var j=0; j < music[index].packs.length; j++){
		mapping_result += h1_start + music[index].packs[j].name + h1_end;
		mapping_result += map_songs_format(music[index].packs[j].arr);
		mapping_result += br + hr;
	}
	$('#mapping_content').html(mapping_result);
}

function generateSongIdsWithPrefix(arr, lang, year, type){
	let prefix = lang + '_' + year + '_' + type + '_';
	let audioPath = 'audio/' + lang + '/' + year + '/' + type + '/';
	let imgPath = 'img/' + lang + '/' + year + '/' + type + '/';
	let id;
	for(var i=1; i <= arr.length; i++){
		id = 'Song (' + i + ')';
		arr[i-1].id = prefix + id;
		arr[i-1].audioPath = audioPath + id;
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generateSongIdsByPaths(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function generateSongIdsImgGroup(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
		arr[i-1].audioPath = audioPath + 'Song (' + i + ')';
		arr[i-1].imgPath = imgPath + arr[i-1].group;
	}
	return arr;
}

function generatePathsBySongName(arr, audioPath, imgPath){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].audioPath = audioPath + arr[i-1].group;
		arr[i-1].imgPath = imgPath + arr[i-1].song;
	}
	return arr;
}

function map_songs_format(arr){
	arr = arr.filter(song => !song.ignore);
	let h2_start = `<h2 style='margin-bottom: -20px;'>`;
	let h2_end = `</h2>`;
	let h3_start = `<h3 style='font-family: serif; margin-left: 30px;' >`;
	let h3_end = `</h3>`;
	let div_start = `<div>`;
	let div_end = `</div>`;
	let br = `<br/>`;
	//let img_start = `<img width="300" height="300" src="`;
	let img_end = `.jpg" />`;
	let img_play_start = `<img class='pointer onhover' width="30" height="30" src="img/navi/play.png" onclick="playSong('`;
	let img_play_middle = `')" id='`;
	let img_play_end = `'" />`;
	let space = '&nbsp;';
	songs_to_map = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let curr_group = songs_to_map[0].group;
	//let result = img_start + songs_to_map[0].imgPath + img_end + br
	let result = h2_start + curr_group + ':' + h2_end + h3_start;
	let id;
	for(let i = 0; i < songs_to_map.length; i++){
		id = songs_to_map[i].id.replace(' ', '_').replace('(', '').replace(')', '');
		if(curr_group != songs_to_map[i].group){
			curr_group = songs_to_map[i].group;
			result += h3_end + h2_start + songs_to_map[i].group + ':' + h2_end 
			+ h3_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id
			+ img_play_middle + id + img_play_end + div_end;
		} else {
			result += div_start + songs_to_map[i].song + space
			+ img_play_start + songs_to_map[i].audioPath + "', '" + id 
			+ img_play_middle + id + img_play_end
			+ div_end;
		}
	}
	result += h3_end;
	return result;
}

let last_song_id;
let is_playing = false;
function playSong(audioPath, id){
	if(id == last_song_id){
		if(is_playing){
			audio.pause();
			$('#' + id).attr('src', 'img/navi/play.png');
			is_playing = false;
		} else {
			audio.play();
			$('#' + id).attr('src', 'img/navi/pause.png');
			is_playing = true;
		}
	} else {
		if(audio){
			audio.pause();
		}
		$('#' + last_song_id).attr('src', 'img/navi/play.png');
		last_song_id = id;
		is_playing = true;
		$('#' + id).attr('src', 'img/navi/pause.png');
		audio = new Audio(audioPath + '.mp3');
		audio.play();
	}
}

function getGroupNamesSorted(){
	let group_names = removeDuplicates(songs.map(item=>item.group)).sort();
	return group_names;
}

function showGroupNames(){
	songs_backup = songs;
	let group_names = getGroupNamesSorted();
	
	let tag_1 = `<h3><label class='checkbox-google'><input class='group_item' checked id='group_`;
	let tag_2 = `' type='checkbox' onchange='skipGroup(this,"`;
	let tag_3 = `");'><span class='checkbox-google-switch'></span></label> `;
	let tag_4 =	`</h3>`;
	let result = '';
	for(let i = 0; i < group_names.length; i++){
		result += tag_1 + i + tag_2 + group_names[i].replace("'", "#") + tag_3 + group_names[i] + tag_4;
	}
	$('#package_content').html(result);
	$('#package_content').show();
	toggleLearn();
}

function hide_navi_icons(){
	$('#map').hide();
	$('#mirror').hide();
	$('.settings').hide();
	
	$('#sec_15').show();
	$('#back').show();
}

let gr_package_names = [];
let package_names;

function show_packages(num){
	for(var i=1; i <= num; i++){
		if(package_names[i-1]){
			$('#package_' + i).attr("src", 'img/package/' + package_names[i-1] + ".png");
		} else {
			$('#package_' + i).attr("src", 'img/package/' + i + ".png");
		}
		$('#package_' + i).show();
	}
}

function package_num(num){
	$('#current_pack').show();
	$('#current_pack').attr('src', $('#package_' + num).attr('src'));
	$('.package').hide();
	setPathsByPack(num);
	showGroupNames();
}

function setPaths(artist_type, package_num, genre){
		let songs_str = lang + '_' + year;
			audioPath = 'audio/' + lang + '/' + year + '/';
			imgPath = 'img/' + lang + '/' + year + '/';
		if(genre){
			songs_str += '_' + genre;
			audioPath += genre + '/';
			imgPath += genre + '/';
		}
		if(artist_type){
			songs_str += '_' + artist_type;
			audioPath += artist_type + '/';
			imgPath += artist_type + '/';
		}
		if(package_num){
			songs_str += '_' + package_num;
			audioPath += package_num + '/';
			imgPath += package_num + '/';
		}
		songs = generateSongIds(eval(songs_str));
		answers = songs.map(item=>item.group);
		finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
		$('#total').html(songs.length);
		shuffle(songs);
}

function setPathsByPack(num){
	let arr = generateSongIds(eval(lang + '_' + year + '_' + artist_type));
	songs = arr.filter(song => song.pack == num && !song.ignore);
	songs.forEach(song => {
		song.audioPath = 'audio/' + lang + '/' + year + '/' + artist_type + '/' + song.id;
		song.imgPath = 'img/' + lang + '/' + year + '/' + artist_type + '/' + song.group;
	});
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	shuffle(songs);
}
	
function setMusicalAlphabet(){
	let result = [];
	let arr = generateSongIds(eval(lang + '_' + year + '_gr'));
	let arr_pack;
	audioPath = 'audio/' + lang + '/' + year + '/gr/';
	imgPath = 'img/' + lang + '/' + year + '/gr/';
	for(let i = 1; i <= gr_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Группа', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_m'));
	audioPath = 'audio/' + lang + '/' + year + '/m/';
	imgPath = 'img/' + lang + '/' + year + '/m/';
	for(let i = 1; i <= m_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнитель', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	arr = generateSongIds(eval(lang + '_' + year + '_f'));
	audioPath = 'audio/' + lang + '/' + year + '/f/';
	imgPath = 'img/' + lang + '/' + year + '/f/';
	for(let i = 1; i <= f_packages; i++){
		arr_pack = arr.filter(song => song.pack == i);
		arr_pack = setMusicalAlphabetPack(arr_pack, 'Исполнительница', audioPath, imgPath);
		shuffle(arr_pack);
		result.push(arr_pack.slice(0, 7));
	}
	result = result.flat();
	shuffle(result);
	songs = result.slice(0, 20);
	answers = songs.map(item=>item.group);
	finalMessage = ' Ура! Вы освоили "Дискотеку ' + year + '-х"!';
	$('#total').html(songs.length);
	showGroupNames();
}
	
function setMusicalAlphabetPack(arr, type, audioPath, imgPath){
	shuffle(arr);
	arr = arr.sort((a,b) => (a.group > b.group) ? 1 : ((b.group > a.group) ? -1 : 0));
	let group = arr[0].group;
	let result = [];
	result.push(arr[0]);
	for(let i = 1; i < arr.length; i++){
		if(group == arr[i].group){
			continue;
		} else {
			group = arr[i].group;
			result.push(arr[i]);
		}
	}
	result.forEach(song => {
		song.letter = Array.from(song.group)[0];
		song.type = type;
		song.audioPath = audioPath + song.id;
		song.imgPath = imgPath + song.group;
	});
	return result;
}

function generateSongIds(arr){
	for(var i=1; i <= arr.length; i++){
		arr[i-1].id = 'Song (' + i + ')';
	}
	return arr;
}

let back;
let expressMode = false;
let generateSongs;
let generateArr;
let generateAudioPath;
let generateImgPath;

function setup(){
	lang = 'ru';
	year = '1980';
	artist_type = 'gr';
	modeToggle = toggleArtist;
	setMedia = setAudio;
	rightAnswer = rightAnswer_RU;
	count_time();
	package_names = ru_1980_gr_icon;
	show_packages(package_names.length);
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	useUrlParam();
}

let pack_num;
let year_url = 'https://sunquiz.netlify.app/1980';

function useUrlParam() {
	var url_string = window.location.href; 
	var url = new URL(url_string);
	pack_num = url.searchParams.get("pack");
	if(pack_num){
		package_num(pack_num);
	}
	back = back_to_browser;
}

function back_to_browser(){
	window.location.href = year_url;
}

function back_to_current_pack(){
	back = back_to_browser;
	$('#mapping_content').hide();
	$('#map').show();
	package_num(pack_num);
}