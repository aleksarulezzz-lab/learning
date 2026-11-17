/* Английский «Звездочёта»: банк тем по методике Ольги Фокиной (начальная школа, 2–4 класс).
   Лексика: w = [слово, картинка, перевод]; tpl = фразы, куда ученик вставляет слово (___).
   Грамматика: rule = короткое правило, ex = примеры, q = [предложение с ___, верно, неверно, неверно?, перевод],
   ord = предложения, которые ученик собирает из слов.
   id старых тем (animals, colors, numbers, food, family, school, body, nature, home, transport, clothes, actions)
   не менять: по ним хранится прогресс в zv-english-v1. */

const EN_GRADES=[[2,'2 класс'],[3,'3 класс'],[4,'4 класс']];

const EN_LEX=[
 /* ---------- 2 класс ---------- */
 {id:'hello',g:2,e:'👋',ru:'Знакомство и приветствия',tpl:[['___, Sam!','…, Сэм!']],w:[
  ['hello','👋','привет'],['goodbye','🚪','до свидания'],['good morning','🌅','доброе утро'],['good night','🌙','спокойной ночи'],
  ['yes','👍','да'],['no','👎','нет'],['please','🙏','пожалуйста'],['thank you','💐','спасибо']]},
 {id:'abc',g:2,e:'🔤',ru:'Алфавит и звуки',spellOut:true,tpl:[['___ — spell it, please!','… — скажи по буквам!']],w:[
  ['cat','🐱','кот'],['dog','🐶','собака'],['sun','☀️','солнце'],['box','📦','коробка'],
  ['hat','🎩','шляпа'],['pen','🖊️','ручка'],['bus','🚌','автобус'],['egg','🥚','яйцо']]},
 {id:'numbers',g:2,e:'🔢',ru:'Числа 1–10',tpl:[['I am ___.','Мне … лет.'],['I can count to ___!','Я умею считать до …!']],w:[
  ['one','1','один'],['two','2','два'],['three','3','три'],['four','4','четыре'],
  ['five','5','пять'],['six','6','шесть'],['seven','7','семь'],['eight','8','восемь'],['nine','9','девять'],['ten','10','десять']]},
 {id:'colors',g:2,e:'🎨',ru:'Цвета',tpl:[['The ball is ___.','Мяч …'],['My favourite colour is ___.','Мой любимый цвет …']],w:[
  ['red','🔴','красный'],['blue','🔵','синий'],['green','🟢','зелёный'],['yellow','🟡','жёлтый'],
  ['orange','🟠','оранжевый'],['purple','🟣','фиолетовый'],['black','⚫','чёрный'],['white','⚪','белый'],['pink','🩷','розовый'],['brown','🟤','коричневый']]},
 {id:'family',g:2,e:'👨‍👩‍👧',ru:'Моя семья',tpl:[['This is my ___.','Это мой / моя …'],['I love my ___.','Я люблю своего / свою …']],w:[
  ['mother','👩','мама'],['father','👨','папа'],['sister','👧','сестра'],['brother','👦','брат'],
  ['baby','👶','малыш'],['grandma','👵','бабушка'],['grandpa','👴','дедушка'],['family','👨‍👩‍👧','семья']]},
 {id:'toys',g:2,e:'🧸',ru:'Игрушки и игры',tpl:[['I have got a ___.','У меня есть …'],['Let\'s play with the ___!','Давай поиграем с …!']],w:[
  ['ball','⚽','мяч'],['doll','🪆','кукла'],['teddy bear','🧸','плюшевый мишка'],['kite','🪁','воздушный змей'],
  ['robot','🤖','робот'],['car','🚗','машинка'],['puzzle','🧩','пазл'],['yo-yo','🪀','йо-йо']]},
 {id:'animals',g:2,e:'🐱',ru:'Животные',tpl:[['I have got a ___.','У меня есть …'],['Look at the ___!','Посмотри на …!']],w:[
  ['cat','🐱','кошка'],['dog','🐶','собака'],['fox','🦊','лиса'],['bear','🐻','медведь'],
  ['rabbit','🐰','кролик'],['frog','🐸','лягушка'],['lion','🦁','лев'],['mouse','🐭','мышь'],['bird','🐦','птица'],['fish','🐟','рыба']]},
 {id:'body',g:2,e:'🙂',ru:'Части тела',tpl:[['This is my ___.','Это мой / моя …'],['Touch your ___!','Дотронься до …!']],w:[
  ['head','🙂','голова'],['eye','👁️','глаз'],['ear','👂','ухо'],['nose','👃','нос'],
  ['mouth','👄','рот'],['hand','✋','рука (кисть)'],['leg','🦵','нога'],['foot','🦶','стопа']]},
 {id:'food',g:2,e:'🍎',ru:'Еда и напитки',tpl:[['Look at the ___!','Посмотри на …!'],['The ___ is tasty.','… — вкусно!']],w:[
  ['apple','🍎','яблоко'],['banana','🍌','банан'],['milk','🥛','молоко'],['bread','🍞','хлеб'],
  ['cake','🍰','торт'],['cheese','🧀','сыр'],['juice','🧃','сок'],['pizza','🍕','пицца'],['soup','🍲','суп'],['water','💧','вода']]},
 {id:'clothes',g:2,e:'👕',ru:'Одежда и обувь',tpl:[['I put on my ___.','Я надеваю …']],w:[
  ['cap','🧢','кепка'],['dress','👗','платье'],['T-shirt','👕','футболка'],['shoes','👟','ботинки, кроссовки'],
  ['socks','🧦','носки'],['coat','🧥','пальто'],['scarf','🧣','шарф'],['gloves','🧤','перчатки'],['jeans','👖','джинсы'],['boots','🥾','сапоги']]},
 {id:'home',g:2,e:'🏠',ru:'Дом и мебель',tpl:[['There is a ___ in my room.','В моей комнате есть …'],['This is my ___.','Это мой / моя …']],w:[
  ['bed','🛏️','кровать'],['sofa','🛋️','диван'],['chair','🪑','стул'],['table','🍽️','стол'],
  ['lamp','💡','лампа'],['door','🚪','дверь'],['window','🪟','окно'],['bath','🛁','ванна']]},
 {id:'rooms',g:2,e:'🏡',ru:'Комнаты',tpl:[['Mum is in the ___.','Мама в …'],['I am in the ___.','Я в …']],w:[
  ['kitchen','🍳','кухня'],['bedroom','🛏️','спальня'],['bathroom','🛁','ванная'],['living room','🛋️','гостиная'],
  ['garden','🌷','сад'],['hall','🚪','прихожая'],['garage','🚗','гараж'],['house','🏠','дом']]},

 /* ---------- 3 класс ---------- */
 {id:'school',g:3,e:'🎒',ru:'Школьные принадлежности',tpl:[['I have got a ___.','У меня есть …'],['Can I have your ___, please?','Дай, пожалуйста, свой / свою …']],w:[
  ['book','📕','книга'],['pen','🖊️','ручка'],['pencil','✏️','карандаш'],['bag','🎒','рюкзак'],
  ['ruler','📏','линейка'],['rubber','🧽','ластик'],['pencil case','👝','пенал'],['notebook','📓','тетрадь'],['crayon','🖍️','мелок'],['desk','🪑','парта']]},
 {id:'subjects',g:3,e:'📚',ru:'Учебные предметы и команды учителя',tpl:[['My favourite subject is ___.','Мой любимый предмет …']],w:[
  ['maths','➗','математика'],['English','🇬🇧','английский'],['art','🎨','рисование'],['music','🎵','музыка'],
  ['PE','🤸','физкультура'],['reading','📖','чтение'],['science','🔬','окружающий мир'],['IT','💻','информатика']]},
 {id:'commands',g:3,e:'🧑‍🏫',ru:'Команды учителя',tpl:[['Please, ___!','Пожалуйста, …!']],w:[
  ['stand up','🧍','встаньте'],['sit down','🪑','садитесь'],['listen','👂','слушайте'],['look','👀','посмотрите'],
  ['write','✍️','пишите'],['read','📖','читайте'],['open your book','📖','откройте книгу'],['be quiet','🤫','тише']]},
 {id:'myday',g:3,e:'⏰',ru:'Мой день',tpl:[['Every day I ___.','Каждый день я …']],w:[
  ['get up','🛌','вставать'],['wash','🚿','умываться'],['have breakfast','🥣','завтракать'],['go to school','🏫','идти в школу'],
  ['do homework','📝','делать уроки'],['play','🎲','играть'],['have dinner','🍽️','ужинать'],['go to bed','😴','ложиться спать']]},
 {id:'days',g:3,e:'📅',ru:'Дни недели',tpl:[['Today is ___.','Сегодня …'],['I go swimming on ___.','Я хожу плавать в …']],w:[
  ['Monday','Пн','понедельник'],['Tuesday','Вт','вторник'],['Wednesday','Ср','среда'],['Thursday','Чт','четверг'],
  ['Friday','Пт','пятница'],['Saturday','Сб','суббота'],['Sunday','Вс','воскресенье'],['weekend','🎉','выходные']]},
 {id:'months',g:3,e:'🎂',ru:'Месяцы и дни рождения',tpl:[['My birthday is in ___.','Мой день рождения в …']],w:[
  ['January','❄️1','январь'],['February','❄️2','февраль'],['March','🌷3','март'],['April','🌷4','апрель'],
  ['May','🌷5','май'],['June','☀️6','июнь'],['July','☀️7','июль'],['August','☀️8','август'],
  ['September','🍂9','сентябрь'],['October','🍂10','октябрь'],['November','🍂11','ноябрь'],['December','❄️12','декабрь']]},
 {id:'nature',g:3,e:'🌤️',ru:'Погода',tpl:[['It is ___ today.','Сегодня …']],w:[
  ['sunny','☀️','солнечно'],['rainy','🌧️','дождливо'],['snowy','❄️','снежно'],['windy','🌬️','ветрено'],
  ['cloudy','☁️','облачно'],['cold','🥶','холодно'],['hot','🥵','жарко'],['warm','🌤️','тепло']]},
 {id:'seasons',g:3,e:'🍂',ru:'Времена года',tpl:[['I like ___.','Я люблю …']],w:[
  ['winter','⛄','зима'],['spring','🌷','весна'],['summer','🏖️','лето'],['autumn','🍂','осень'],
  ['snow','❄️','снег'],['rain','🌧️','дождь'],['sun','☀️','солнце'],['leaves','🍁','листья']]},
 {id:'actions',g:3,e:'🏃',ru:'Спорт и умения',tpl:[['I can ___.','Я умею …'],['Can you ___?','Ты умеешь …?']],w:[
  ['run','🏃','бегать'],['swim','🏊','плавать'],['jump','🤸','прыгать'],['skate','⛸️','кататься на коньках'],
  ['ski','⛷️','кататься на лыжах'],['ride a bike','🚴','кататься на велосипеде'],['play football','⚽','играть в футбол'],['climb','🧗','лазать']]},
 {id:'hobbies',g:3,e:'🎨',ru:'Хобби и свободное время',tpl:[['I like ___.','Я люблю …'],['In my free time I like ___.','В свободное время я люблю …']],w:[
  ['reading','📚','читать'],['drawing','🖍️','рисовать'],['singing','🎤','петь'],['dancing','💃','танцевать'],
  ['playing chess','♟️','играть в шахматы'],['cooking','🧁','готовить'],['taking photos','📷','фотографировать'],['playing the piano','🎹','играть на пианино']]},
 {id:'transport',g:3,e:'🚀',ru:'Транспорт',tpl:[['I go to school by ___.','Я езжу в школу на …']],w:[
  ['car','🚗','машина'],['bus','🚌','автобус'],['train','🚆','поезд'],['plane','✈️','самолёт'],
  ['ship','🚢','корабль'],['bike','🚲','велосипед'],['taxi','🚕','такси'],['tram','🚋','трамвай'],['underground','🚇','метро'],['rocket','🚀','ракета']]},
 {id:'emotions',g:3,e:'😊',ru:'Эмоции и самочувствие',tpl:[['I am ___.','Я …'],['Are you ___?','Ты …?']],w:[
  ['happy','😊','весёлый, счастливый'],['sad','😢','грустный'],['angry','😠','сердитый'],['tired','🥱','уставший'],
  ['scared','😨','испуганный'],['hungry','😋','голодный'],['ill','🤒','больной'],['surprised','😲','удивлённый']]},
 {id:'numbers100',g:3,e:'💯',ru:'Числа до 100',tpl:[['My grandma is ___.','Моей бабушке … лет.'],['I have got ___ stickers.','У меня … наклеек.']],w:[
  ['eleven','11','одиннадцать'],['twelve','12','двенадцать'],['fifteen','15','пятнадцать'],['twenty','20','двадцать'],
  ['thirty','30','тридцать'],['forty','40','сорок'],['fifty','50','пятьдесят'],['sixty','60','шестьдесят'],['ninety','90','девяносто'],['one hundred','100','сто']]},

 /* ---------- 4 класс ---------- */
 {id:'appearance',g:4,e:'🧑',ru:'Внешность и характер',tpl:[['My friend is ___.','Мой друг …'],['She is very ___.','Она очень …']],w:[
  ['tall','🦒','высокий'],['short','🐭','невысокий'],['kind','🤗','добрый'],['funny','🤪','смешной'],
  ['clever','🧠','умный'],['brave','🦸','смелый'],['friendly','😃','дружелюбный'],['shy','🙈','застенчивый'],['strong','💪','сильный'],['lazy','🦥','ленивый']]},
 {id:'city',g:4,e:'🏙️',ru:'Город и деревня',tpl:[['Let\'s go to the ___.','Пойдём в …'],['Where is the ___?','Где …?']],w:[
  ['park','🌳','парк'],['shop','🏪','магазин'],['school','🏫','школа'],['hospital','🏥','больница'],
  ['library','📚','библиотека'],['zoo','🦓','зоопарк'],['cinema','🎬','кинотеатр'],['cafe','☕','кафе'],['farm','🐄','ферма'],['bank','🏦','банк']]},
 {id:'jobs',g:4,e:'👩‍⚕️',ru:'Профессии',tpl:[['I want to be a ___.','Я хочу быть …'],['My mum is a ___.','Моя мама …']],w:[
  ['doctor','🧑‍⚕️','врач'],['teacher','🧑‍🏫','учитель'],['cook','🧑‍🍳','повар'],['pilot','🧑‍✈️','пилот'],
  ['farmer','🧑‍🌾','фермер'],['driver','🚕','водитель'],['police officer','👮','полицейский'],['vet','🐾','ветеринар'],['firefighter','🧑‍🚒','пожарный'],['builder','👷','строитель']]},
 {id:'countries',g:4,e:'🌍',ru:'Страны и национальности',tpl:[['I am from ___.','Я из …']],w:[
  ['Russia','🇷🇺','Россия'],['Great Britain','🇬🇧','Великобритания'],['the USA','🇺🇸','США'],['China','🇨🇳','Китай'],
  ['France','🇫🇷','Франция'],['Spain','🇪🇸','Испания'],['Italy','🇮🇹','Италия'],['Germany','🇩🇪','Германия']]},
 {id:'languages',g:4,e:'🗣️',ru:'Языки',tpl:[['I speak ___.','Я говорю по-…']],w:[
  ['Russian','🇷🇺','русский язык'],['English','🇬🇧','английский язык'],['Chinese','🇨🇳','китайский язык'],['French','🇫🇷','французский язык'],
  ['Spanish','🇪🇸','испанский язык'],['German','🇩🇪','немецкий язык'],['Italian','🇮🇹','итальянский язык'],['Japanese','🇯🇵','японский язык']]},
 {id:'capitals',g:4,e:'🏛️',ru:'Столицы и символы',tpl:[['___ is a capital city.','… — столица.']],w:[
  ['Moscow','🏰','Москва'],['London','💂','Лондон'],['Washington','🗽','Вашингтон'],['Beijing','🏯','Пекин'],
  ['Paris','🗼','Париж'],['Rome','🏟️','Рим'],['Madrid','💃','Мадрид'],['Berlin','🐻','Берлин']]},
 {id:'holidays',g:4,e:'🎄',ru:'Праздники и традиции',tpl:[['Happy ___!','С праздником: …!']],w:[
  ['birthday','🎂','день рождения'],['New Year','🎆','Новый год'],['Christmas','🎄','Рождество'],['Easter','🥚','Пасха'],
  ['Halloween','🎃','Хэллоуин'],['Mother\'s Day','💐','День матери'],['Victory Day','🎖️','День Победы'],['Valentine\'s Day','💝','День святого Валентина']]},
 {id:'travel',g:4,e:'🧳',ru:'Путешествия и каникулы',tpl:[['In summer I go to the ___.','Летом я езжу на / в …']],w:[
  ['sea','🌊','море'],['beach','🏖️','пляж'],['mountains','⛰️','горы'],['camp','⛺','лагерь'],
  ['village','🏘️','деревня'],['lake','🏞️','озеро'],['forest','🌲','лес'],['river','🛶','река']]},
 {id:'shopping',g:4,e:'🛒',ru:'Покупки',tpl:[['Where is the ___?','Где …?']],w:[
  ['money','💰','деньги'],['price','🏷️','цена'],['trolley','🛒','тележка'],['toy shop','🧸','магазин игрушек'],
  ['bakery','🥐','пекарня'],['market','🍉','рынок'],['shop assistant','🧑‍💼','продавец'],['cash desk','🧾','касса']]},
 {id:'numbers1000',g:4,e:'🔟',ru:'Числа до 1000',tpl:[['There are ___ pupils in our school.','В нашей школе … учеников.']],w:[
  ['one hundred','100','сто'],['two hundred','200','двести'],['three hundred','300','триста'],['five hundred','500','пятьсот'],
  ['seven hundred','700','семьсот'],['nine hundred','900','девятьсот'],['one thousand','1000','тысяча'],['one hundred and twenty','120','сто двадцать']]},
 {id:'ordinals',g:4,e:'🥇',ru:'Порядковые числительные',tpl:[['My birthday is on the ___ of May.','Мой день рождения … мая.']],w:[
  ['first','1st','первый'],['second','2nd','второй'],['third','3rd','третий'],['fourth','4th','четвёртый'],
  ['fifth','5th','пятый'],['tenth','10th','десятый'],['twelfth','12th','двенадцатый'],['twentieth','20th','двадцатый']]}
];

const EN_GRAM=[
 /* ---------- 2 класс ---------- */
 {id:'g-order',g:2,e:'🧱',ru:'Порядок слов',rule:['В английском предложении порядок строгий: <b>кто → что делает → что / где</b>.','Сначала подлежащее, потом глагол.'],
  ex:[['I like apples.','Я люблю яблоки.'],['Tom has got a dog.','У Тома есть собака.']],
  q:[['I ___ apples.','like','apples like','I','Я люблю яблоки.'],['___ like cats.','We','Like','Cats','Мы любим кошек.'],['She ___ milk.','likes','milk','she','Она любит молоко.'],['They ___ football.','play','football','they','Они играют в футбол.'],['___ can swim.','I','Swim','Can','Я умею плавать.'],['My cat ___ fish.','likes','fish','cat','Мой кот любит рыбу.']],
  ord:[['I like apples','Я люблю яблоки'],['We play football','Мы играем в футбол'],['My dog can run','Моя собака умеет бегать'],['Kate likes cats','Катя любит кошек']]},
 {id:'g-pron',g:2,e:'🙋',ru:'Личные местоимения',rule:['<b>I</b> — я, <b>you</b> — ты / вы, <b>he</b> — он, <b>she</b> — она, <b>it</b> — оно (про предмет или животное).','<b>we</b> — мы, <b>they</b> — они. <b>I</b> всегда пишем с большой буквы.'],
  ex:[['He is my brother.','Он мой брат.'],['It is a cat.','Это кошка.']],
  q:[['Tom is my friend. ___ is nine.','He','She','It','Том мой друг. Ему девять.'],['Ann is my sister. ___ is seven.','She','He','They','Аня моя сестра. Ей семь.'],['This is a ball. ___ is red.','It','He','She','Это мяч. Он красный.'],['Mum and Dad are at home. ___ are happy.','They','We','He','Мама и папа дома. Они счастливы.'],['My friend and I are in the park. ___ are happy.','We','They','I','Мы с другом в парке. Мы счастливы.'],['___ am a pupil.','I','You','He','Я ученик.']],
  ord:[['She is my sister','Она моя сестра'],['We are friends','Мы друзья'],['It is a dog','Это собака']]},
 {id:'g-be',g:2,e:'🌟',ru:'Глагол to be: am, is, are',rule:['<b>I am</b>. <b>He / she / it is</b>. <b>We / you / they are</b>.','Вопрос: глагол вперёд — <b>Are you happy?</b> Отрицание: <b>not</b> — <b>I am not tired.</b>'],
  ex:[['I am eight.','Мне восемь.'],['Is it a cat? — Yes, it is.','Это кошка? — Да.'],['They are not at school.','Их нет в школе.']],
  q:[['I ___ a pupil.','am','is','are','Я ученик.'],['She ___ my mum.','is','am','are','Она моя мама.'],['We ___ friends.','are','is','am','Мы друзья.'],['___ you happy?','Are','Is','Am','Ты счастлив?'],['It ___ not a dog.','is','are','am','Это не собака.'],['___ he your brother?','Is','Are','Am','Он твой брат?'],['They ___ at home.','are','is','am','Они дома.'],['I ___ not tired.','am','is','are','Я не устал.']],
  ord:[['I am happy','Я счастлив'],['Is she your sister','Она твоя сестра?'],['We are not at school','Нас нет в школе']]},
 {id:'g-art',g:2,e:'🅰️',ru:'Артикли a / an / the',rule:['<b>a</b> — один какой-то предмет: a cat. Перед гласным звуком — <b>an</b>: an apple, an egg.','<b>the</b> — тот самый, о котором уже говорили: I have got a dog. <b>The</b> dog is black.'],
  ex:[['an orange','апельсин'],['a big ball','большой мяч'],['The sun is hot.','Солнце жаркое.']],
  q:[['I have got ___ apple.','an','a','—','У меня есть яблоко.'],['This is ___ dog.','a','an','—','Это собака.'],['It is ___ egg.','an','a','—','Это яйцо.'],['Look at ___ sun!','the','a','an','Посмотри на солнце!'],['I see ___ elephant.','an','a','—','Я вижу слона.'],['She has got ___ red bag.','a','an','—','У неё красная сумка.'],['I have got a cat. ___ cat is grey.','The','A','An','У меня есть кошка. Кошка серая.']],
  ord:[['I have got an apple','У меня есть яблоко'],['The dog is black','Собака чёрная'],['It is a big ball','Это большой мяч']]},
 {id:'g-plural',g:2,e:'🐱🐱',ru:'Множественное число',rule:['Обычно добавляем <b>-s</b>: cat → cats. После s, x, sh, ch — <b>-es</b>: box → boxes.','Исключения: man → <b>men</b>, woman → <b>women</b>, child → <b>children</b>, foot → <b>feet</b>, tooth → <b>teeth</b>, mouse → <b>mice</b>.'],
  ex:[['two dogs','две собаки'],['three boxes','три коробки'],['five children','пять детей']],
  q:[['one cat — two ___','cats','cat','cates','одна кошка — две кошки'],['one box — three ___','boxes','boxs','box','коробки'],['one child — four ___','children','childs','childes','дети'],['one foot — two ___','feet','foots','footes','ступни'],['one mouse — five ___','mice','mouses','mices','мыши'],['one bus — two ___','buses','buss','bus','автобусы'],['one man — two ___','men','mans','mens','мужчины'],['one tooth — many ___','teeth','tooths','toothes','зубы']],
  ord:[['I have got two cats','У меня две кошки'],['Three children play','Трое детей играют'],['I can see five boxes','Я вижу пять коробок']]},
 {id:'g-this',g:2,e:'👉',ru:'This, that, these, those',rule:['Рядом: <b>this</b> (один) — <b>these</b> (много).','Далеко: <b>that</b> (один) — <b>those</b> (много).'],
  ex:[['This is my book.','Это (вот) моя книга.'],['Those are birds.','Вон там птицы.']],
  q:[['___ is my pen. (рядом)','This','These','Those','Это моя ручка.'],['___ are my toys. (рядом)','These','This','That','Это мои игрушки.'],['___ is a plane. (далеко)','That','Those','These','Вон там самолёт.'],['___ are stars. (далеко)','Those','That','This','Вон там звёзды.'],['Look at ___ apples! (рядом)','these','this','that','Посмотри на эти яблоки!'],['Is ___ your house? (далеко)','that','those','these','Вон тот дом — твой?']],
  ord:[['This is my cat','Это моя кошка'],['These are my books','Это мои книги'],['That is a big tree','Вон то большое дерево']]},
 {id:'g-have',g:2,e:'🎁',ru:'Have got / has got',rule:['<b>I / you / we / they have got</b>. <b>He / she / it has got</b>.','Вопрос: <b>Have you got a pet?</b> — Yes, I have. Отрицание: <b>haven\'t got / hasn\'t got</b>.'],
  ex:[['I have got a kite.','У меня есть воздушный змей.'],['She hasn\'t got a cat.','У неё нет кошки.']],
  q:[['I ___ got a dog.','have','has','am','У меня есть собака.'],['She ___ got a doll.','has','have','is','У неё есть кукла.'],['___ you got a bike?','Have','Has','Are','У тебя есть велосипед?'],['He ___ got a cat. He has got a dog.','hasn\'t','haven\'t','isn\'t','У него нет кошки.'],['We ___ got a big house.','have','has','are','У нас большой дом.'],['___ she got a sister? — Yes, she has.','Has','Have','Is','У неё есть сестра?'],['The cat ___ got green eyes.','has','have','is','У кошки зелёные глаза.']],
  ord:[['I have got a robot','У меня есть робот'],['Has he got a pet','У него есть питомец?'],['She has got two sisters','У неё две сестры']]},
 {id:'g-can',g:2,e:'💪',ru:'Модальный глагол can',rule:['<b>can</b> = умею / могу. Одинаково для всех: I can, she can.','Нет: <b>can\'t</b>. Вопрос: <b>Can you swim?</b> — Yes, I can. / No, I can\'t. Просьба: <b>Can I have a pen, please?</b>'],
  ex:[['A fish can swim.','Рыба умеет плавать.'],['A fish can\'t fly.','Рыба не умеет летать.'],['Can I go out, please?','Можно выйти?']],
  q:[['A bird ___ fly.','can','can\'t','cans','Птица умеет летать.'],['A cat ___ fly.','can\'t','can','cans','Кошка не умеет летать.'],['She ___ swim very well.','can','cans','can to','Она очень хорошо плавает.'],['___ you ski? — Yes, I can.','Can','Do','Are','Ты умеешь кататься на лыжах?'],['Can a frog jump? — Yes, it ___.','can','can\'t','does','Лягушка умеет прыгать? — Да.'],['A fish ___ run.','can\'t','can','is','Рыба не умеет бегать.'],['___ I have some water, please?','Can','Am','Have','Можно мне воды?']],
  ord:[['I can ride a bike','Я умею кататься на велосипеде'],['A fish can swim','Рыба умеет плавать'],['Can you sing','Ты умеешь петь?']]},
 {id:'g-imp',g:2,e:'📣',ru:'Повелительное наклонение',rule:['Просьба или команда начинается с глагола: <b>Open</b> your book. <b>Sit</b> down.','Запрет: <b>Don\'t</b> + глагол: <b>Don\'t</b> run!'],
  ex:[['Close the door, please.','Закрой дверь, пожалуйста.'],['Don\'t shout!','Не кричи!']],
  q:[['___ your book!','Open','Opens','Opening','Откройте книгу!'],['___ run in the classroom!','Don\'t','Not','No','Не бегай в классе!'],['___ down, please.','Sit','Sits','Sitting','Садитесь, пожалуйста.'],['___ to the music.','Listen','Listens','Don\'t listening','Слушайте музыку.'],['Don\'t ___ the cat!','touch','touches','touching','Не трогай кошку!'],['___ at the board.','Look','Looks','Not look','Посмотрите на доску.']],
  ord:[['Open your book','Откройте книгу'],['Don\'t run','Не бегай'],['Close the window please','Закрой окно, пожалуйста']]},
 {id:'g-place',g:2,e:'📦',ru:'Предлоги места',rule:['<b>in</b> — в, <b>on</b> — на, <b>under</b> — под.','<b>next to</b> — рядом с, <b>behind</b> — за, <b>between</b> — между.'],
  ex:[['The cat is under the table.','Кошка под столом.'],['The ball is between the boxes.','Мяч между коробками.']],
  q:[['The cat is ___ the box. (внутри)','in','on','under','Кошка в коробке.'],['The book is ___ the table. (сверху)','on','in','under','Книга на столе.'],['The dog is ___ the bed. (снизу)','under','on','in','Собака под кроватью.'],['The lamp is ___ the sofa. (рядом)','next to','in','under','Лампа рядом с диваном.'],['The ball is ___ the chair. (сзади)','behind','on','in','Мяч за стулом.'],['The mouse is ___ the cat and the dog.','between','behind','in','Мышь между кошкой и собакой.']],
  ord:[['The cat is on the bed','Кошка на кровати'],['My bag is under the desk','Мой рюкзак под партой'],['The ball is in the box','Мяч в коробке']]},

 /* ---------- 3 класс ---------- */
 {id:'g-poss',g:3,e:'🎒',ru:'Притяжательные местоимения',rule:['Чей? <b>my</b> — мой, <b>your</b> — твой, <b>his</b> — его, <b>her</b> — её, <b>its</b> — его (о предмете), <b>our</b> — наш, <b>their</b> — их.','Без существительного: <b>mine</b> — мой, <b>yours</b> — твой: This book is <b>mine</b>.'],
  ex:[['This is her bag.','Это её рюкзак.'],['Is this pen yours?','Эта ручка твоя?']],
  q:[['I have got a cat. ___ cat is white.','My','I','Me','Моя кошка белая.'],['Tom has got a bike. ___ bike is new.','His','Her','He','Его велосипед новый.'],['Ann has got a doll. ___ doll is pretty.','Her','His','She','Её кукла красивая.'],['We live here. This is ___ house.','our','we','their','Это наш дом.'],['They have got a dog. ___ dog is big.','Their','They','Our','Их собака большая.'],['This pen is not yours. It is ___.','mine','my','me','Эта ручка не твоя, а моя.'],['The dog wags ___ tail.','its','it\'s','his','Собака виляет хвостом.']],
  ord:[['This is my book','Это моя книга'],['Her dress is pink','Её платье розовое'],['Is this bag yours','Этот рюкзак твой?']]},
 {id:'g-sgen',g:3,e:'🏷️',ru:'Притяжательный падеж (Tom\'s book)',rule:['Чтобы сказать, чьё это, добавляем <b>\'s</b>: <b>Tom\'s</b> book — книга Тома.','Если слово во множественном числе на -s, ставим только апостроф: my <b>parents\'</b> car.'],
  ex:[['Kate\'s cat','кошка Кати'],['my sister\'s room','комната моей сестры']],
  q:[['This is ___ ball. (мяч Тома)','Tom\'s','Toms','Tom','Это мяч Тома.'],['It is ___ bag. (рюкзак Ани)','Ann\'s','Anns','Ann','Это рюкзак Ани.'],['My ___ name is Max. (имя брата)','brother\'s','brothers','brother','Моего брата зовут Макс.'],['These are my ___ toys. (игрушки сестры)','sister\'s','sisters','sister','Это игрушки моей сестры.'],['This is the ___ bowl. (миска собаки)','dog\'s','dogs','dog','Это миска собаки.']],
  ord:[['This is Tom\'s book','Это книга Тома'],['My mum\'s car is red','Мамина машина красная'],['Where is Kate\'s cat','Где Катина кошка?']]},
 {id:'g-adj',g:3,e:'🐘',ru:'Прилагательные',rule:['Прилагательное стоит <b>перед</b> существительным: a <b>big</b> house.','Или после глагола to be: The house <b>is big</b>. Окончание не меняется: big cats.'],
  ex:[['a small red car','маленькая красная машина'],['The elephant is big.','Слон большой.']],
  q:[['It is a ___ .','big dog','dog big','dogs big','Это большая собака.'],['The apple is ___ .','green','greens','a green','Яблоко зелёное.'],['I have got two ___ .','red balls','reds balls','balls red','У меня два красных мяча.'],['She has got a ___ .','new dress','dress new','news dress','У неё новое платье.'],['My cat ___ .','is small','small','is smalls','Моя кошка маленькая.']],
  ord:[['I have got a big dog','У меня большая собака'],['The sky is blue','Небо голубое'],['This is a nice house','Это красивый дом']]},
 {id:'g-there',g:3,e:'🏠',ru:'There is / there are',rule:['Есть, находится: <b>there is</b> + один предмет, <b>there are</b> + много.','Вопрос: <b>Is there</b> a cat? — Yes, there is. / No, there isn\'t. <b>Are there</b> any books? — Yes, there are.'],
  ex:[['There is a bed in my room.','В моей комнате есть кровать.'],['There are two windows.','Там два окна.']],
  q:[['There ___ a sofa in the room.','is','are','am','В комнате есть диван.'],['There ___ three chairs.','are','is','am','Там три стула.'],['___ there a lamp? — Yes, there is.','Is','Are','Am','Там есть лампа?'],['___ there any toys? — Yes, there are.','Are','Is','Have','Там есть игрушки?'],['Is there a TV? — No, there ___.','isn\'t','aren\'t','is','Там есть телевизор? — Нет.'],['There ___ a cat and two dogs.','is','are','am','Там кошка и две собаки.']],
  ord:[['There is a cat on the sofa','На диване кошка'],['There are two beds in the room','В комнате две кровати'],['Is there a park in your town','В твоём городе есть парк?']]},
 {id:'g-ps',g:3,e:'🔁',ru:'Present Simple',rule:['Обычные, повторяющиеся действия: I <b>play</b> every day.','С <b>he / she / it</b> добавляем <b>-s</b>: she play<b>s</b>, he watch<b>es</b>, it go<b>es</b>.'],
  ex:[['I get up at seven.','Я встаю в семь.'],['My dad works in a hospital.','Мой папа работает в больнице.']],
  q:[['I ___ to school every day.','go','goes','going','Я хожу в школу каждый день.'],['She ___ milk every morning.','drinks','drink','drinking','Она пьёт молоко каждое утро.'],['He ___ TV in the evening.','watches','watch','watchs','Он смотрит телевизор вечером.'],['We ___ football on Sunday.','play','plays','playing','Мы играем в футбол в воскресенье.'],['My cat ___ a lot.','sleeps','sleep','sleeping','Мой кот много спит.'],['They ___ English.','speak','speaks','speaking','Они говорят по-английски.'],['Tom ___ his teeth.','brushes','brush','brushs','Том чистит зубы.']],
  ord:[['I get up at seven','Я встаю в семь'],['She likes ice cream','Она любит мороженое'],['My dad goes to work','Мой папа идёт на работу']]},
 {id:'g-psq',g:3,e:'❓',ru:'Present Simple: вопросы и отрицания',rule:['Вопрос с <b>do</b> (I, you, we, they) и <b>does</b> (he, she, it): <b>Do</b> you like cats? <b>Does</b> she swim?','Отрицание: <b>don\'t / doesn\'t</b>. После does глагол без -s: She <b>doesn\'t like</b> soup.'],
  ex:[['Do you like pizza? — Yes, I do.','Ты любишь пиццу? — Да.'],['He doesn\'t play chess.','Он не играет в шахматы.']],
  q:[['___ you like apples?','Do','Does','Are','Ты любишь яблоки?'],['___ she play the piano?','Does','Do','Is','Она играет на пианино?'],['I ___ like soup.','don\'t','doesn\'t','not','Я не люблю суп.'],['He ___ eat fish.','doesn\'t','don\'t','isn\'t','Он не ест рыбу.'],['Does he ___ football?','play','plays','playing','Он играет в футбол?'],['Do they live here? — Yes, they ___.','do','does','are','Они живут здесь? — Да.'],['Does your cat like milk? — No, it ___.','doesn\'t','don\'t','isn\'t','Твоя кошка любит молоко? — Нет.']],
  ord:[['Do you like cats','Ты любишь кошек?'],['She doesn\'t like soup','Она не любит суп'],['Does he play tennis','Он играет в теннис?']]},
 {id:'g-wh',g:3,e:'🔍',ru:'Вопросительные слова',rule:['<b>what</b> — что, <b>who</b> — кто, <b>where</b> — где, <b>when</b> — когда, <b>how</b> — как.','<b>how old</b> — сколько лет, <b>what colour</b> — какого цвета.'],
  ex:[['How old are you? — I am nine.','Сколько тебе лет? — Девять.'],['Where is my bag?','Где мой рюкзак?']],
  q:[['___ old are you? — I am eight.','How','What','Who','Сколько тебе лет?'],['___ is your name? — Kate.','What','Who','Where','Как тебя зовут?'],['___ is your cat? — It is under the bed.','Where','When','Who','Где твоя кошка?'],['___ is that boy? — He is my brother.','Who','What','How','Кто тот мальчик?'],['___ is your birthday? — In May.','When','Where','Who','Когда твой день рождения?'],['What ___ is your bag? — It is red.','colour','old','how','Какого цвета твой рюкзак?'],['___ are you? — I am fine, thank you.','How','Who','What','Как дела?']],
  ord:[['How old are you','Сколько тебе лет?'],['Where is my pen','Где моя ручка?'],['What colour is your cat','Какого цвета твоя кошка?']]},
 {id:'g-freq',g:3,e:'📆',ru:'Наречия частотности',rule:['<b>always</b> — всегда, <b>usually</b> — обычно, <b>sometimes</b> — иногда, <b>never</b> — никогда.','Ставим <b>перед</b> глаголом: I <b>always</b> get up at seven. Но <b>после</b> am / is / are: She <b>is never</b> late.'],
  ex:[['I usually walk to school.','Я обычно хожу в школу пешком.'],['He is always happy.','Он всегда весёлый.']],
  q:[['I ___ brush my teeth. (каждый день)','always','never','sometimes','Я всегда чищу зубы.'],['Cats ___ fly. (никогда)','never','always','usually','Кошки никогда не летают.'],['We ___ go to the cinema. (иногда)','sometimes','always','never','Мы иногда ходим в кино.'],['She ___ late.','is never','never is','never','Она никогда не опаздывает.'],['I ___ have porridge for breakfast. (обычно)','usually','never','always','Я обычно ем кашу на завтрак.']],
  ord:[['I always get up at seven','Я всегда встаю в семь'],['She never eats meat','Она никогда не ест мясо'],['We sometimes play chess','Мы иногда играем в шахматы']]},
 {id:'g-time',g:3,e:'⏰',ru:'Предлоги времени in, on, at',rule:['<b>at</b> — время на часах и праздники: at 7 o\'clock, at night.','<b>on</b> — дни: on Monday, on my birthday. <b>in</b> — месяцы, времена года, годы, части дня: in May, in winter, in the morning.'],
  ex:[['I get up at 7 o\'clock.','Я встаю в 7 часов.'],['We have English on Tuesday.','У нас английский во вторник.']],
  q:[['School starts ___ 8 o\'clock.','at','on','in','Школа начинается в 8.'],['My birthday is ___ June.','in','on','at','Мой день рождения в июне.'],['I go swimming ___ Friday.','on','in','at','Я плаваю по пятницам.'],['It is cold ___ winter.','in','on','at','Зимой холодно.'],['I read books ___ the evening.','in','on','at','Я читаю по вечерам.'],['Owls hunt ___ night.','at','in','on','Совы охотятся ночью.']],
  ord:[['I get up at seven o\'clock','Я встаю в семь часов'],['We go to the park on Sunday','Мы ходим в парк в воскресенье'],['It snows in winter','Зимой идёт снег']]},
 {id:'g-pc',g:3,e:'🎬',ru:'Present Continuous',rule:['Действие идёт <b>прямо сейчас</b>: am / is / are + глагол с <b>-ing</b>.','I <b>am reading</b>. She <b>is dancing</b>. They <b>are playing</b>. Слова-подсказки: <b>now, look!, listen!</b>'],
  ex:[['Look! The cat is sleeping.','Смотри! Кошка спит.'],['We are having lunch now.','Мы сейчас обедаем.']],
  q:[['I ___ reading now.','am','is','are','Я сейчас читаю.'],['She is ___ now.','dancing','dance','dances','Она сейчас танцует.'],['They ___ playing football.','are','is','am','Они играют в футбол.'],['Look! The dog ___ running.','is','are','am','Смотри! Собака бежит.'],['We are ___ a cake.','making','make','makes','Мы печём торт.'],['Listen! Mum ___ singing.','is','are','am','Послушай! Мама поёт.']],
  ord:[['I am reading a book','Я читаю книгу'],['The cat is sleeping now','Кошка сейчас спит'],['They are playing in the park','Они играют в парке']]},

 /* ---------- 4 класс ---------- */
 {id:'g-psvspc',g:4,e:'⚖️',ru:'Present Simple или Continuous',rule:['<b>Present Simple</b> — обычно, всегда, каждый день: I <b>play</b> chess every Sunday.','<b>Present Continuous</b> — сейчас, в эту минуту: I <b>am playing</b> chess now.'],
  ex:[['He usually walks to school, but today he is going by bus.','Обычно он ходит пешком, но сегодня едет на автобусе.']],
  q:[['I ___ to school every day.','go','am going','goes','Я хожу в школу каждый день.'],['Look! She ___ .','is dancing','dances','dance','Смотри! Она танцует.'],['We ___ breakfast now.','are having','have','has','Мы сейчас завтракаем.'],['My dad usually ___ coffee.','drinks','is drinking','drink','Папа обычно пьёт кофе.'],['Listen! Somebody ___ the piano.','is playing','plays','play','Слушай! Кто-то играет на пианино.'],['It often ___ in autumn.','rains','is raining','rain','Осенью часто идёт дождь.'],['Be quiet! The baby ___ .','is sleeping','sleeps','sleep','Тише! Малыш спит.']],
  ord:[['I usually get up at seven','Я обычно встаю в семь'],['Look the boy is running','Смотри, мальчик бежит'],['She is reading now','Она сейчас читает']]},
 {id:'g-count',g:4,e:'🍎💧',ru:'Исчисляемые и неисчисляемые',rule:['Исчисляемые можно посчитать: an apple, two apples.','Неисчисляемые не считаем и не ставим a / -s: <b>milk, water, bread, cheese, juice, money</b>. Говорим: some milk, a glass of milk.'],
  ex:[['three eggs','три яйца'],['some bread','немного хлеба']],
  q:[['I want ___ apple.','an','some','two','Я хочу яблоко.'],['Can I have some ___?','water','waters','a water','Можно мне воды?'],['There are three ___ in the fridge.','eggs','egg','an egg','В холодильнике три яйца.'],['She drinks ___ every day.','milk','a milk','milks','Она пьёт молоко каждый день.'],['Buy a loaf of ___, please.','bread','breads','a bread','Купи буханку хлеба.'],['I have got two ___ .','bananas','banana','a banana','У меня два банана.']],
  ord:[['I want some juice','Я хочу сока'],['There are two apples','Там два яблока'],['Can I have a glass of milk','Можно стакан молока?']]},
 {id:'g-some',g:4,e:'🧺',ru:'Some, any, much, many, a lot of',rule:['<b>some</b> — в утверждении, <b>any</b> — в вопросе и отрицании: I have got some sweets. Have you got any sweets?','<b>many</b> — с исчисляемыми (many books), <b>much</b> — с неисчисляемыми (much milk). <b>a lot of</b> — с любыми.'],
  ex:[['There is some cheese.','Есть немного сыра.'],['I haven\'t got many toys.','У меня немного игрушек.']],
  q:[['I have got ___ sweets.','some','any','much','У меня есть конфеты.'],['Have you got ___ pets?','any','some','much','У тебя есть питомцы?'],['There isn\'t ___ milk.','any','some','many','Молока нет.'],['How ___ books have you got?','many','much','any','Сколько у тебя книг?'],['How ___ water do you drink?','much','many','some','Сколько воды ты пьёшь?'],['She has got ___ friends.','a lot of','much','any','У неё много друзей.']],
  ord:[['I have got some apples','У меня есть яблоки'],['Are there any eggs','Есть ли яйца?'],['There is a lot of snow','Много снега']]},
 {id:'g-quest',g:4,e:'💬',ru:'Общие и специальные вопросы',rule:['Общий вопрос (да / нет): глагол вперёд — <b>Is</b> he at home? <b>Do</b> you like tea? Короткий ответ: Yes, he is. / No, I don\'t.','Специальный вопрос: вопросительное слово + общий вопрос — <b>Where</b> do you live?'],
  ex:[['Are you nine? — Yes, I am.','Тебе девять? — Да.'],['What do you like?','Что ты любишь?']],
  q:[['___ you got a sister? — Yes, I have.','Have','Do','Are','У тебя есть сестра?'],['Is it cold? — Yes, it ___.','is','does','has','Холодно? — Да.'],['Can you swim? — No, I ___.','can\'t','don\'t','am not','Ты умеешь плавать? — Нет.'],['Where ___ you live?','do','does','are','Где ты живёшь?'],['What ___ she like?','does','do','is','Что она любит?'],['Do you like cats? — Yes, I ___.','do','am','like','Ты любишь кошек? — Да.']],
  ord:[['Where do you live','Где ты живёшь?'],['Is your sister at home','Твоя сестра дома?'],['What does he like','Что он любит?']]},
 {id:'g-comp',g:4,e:'📏',ru:'Сравнительная степень',rule:['Короткие прилагательные: <b>-er</b> + <b>than</b>: big → bigg<b>er</b> than, tall → tall<b>er</b>.','Длинные: <b>more</b>: more interesting. Особые: good → <b>better</b>, bad → <b>worse</b>. Равенство: <b>as</b> tall <b>as</b>.'],
  ex:[['An elephant is bigger than a mouse.','Слон больше мыши.'],['My bag is as heavy as yours.','Мой рюкзак такой же тяжёлый, как твой.']],
  q:[['A giraffe is ___ than a dog.','taller','more tall','tallest','Жираф выше собаки.'],['An elephant is ___ than a cat.','bigger','biger','more big','Слон больше кошки.'],['This book is ___ than that one.','more interesting','interestinger','most interesting','Эта книга интереснее той.'],['My mark is ___ than yesterday.','better','gooder','more good','Моя оценка лучше вчерашней.'],['Tom is as tall ___ Ben.','as','than','that','Том такого же роста, как Бен.'],['Summer is ___ than winter.','hotter','hoter','more hot','Летом жарче, чем зимой.']],
  ord:[['A cat is smaller than a dog','Кошка меньше собаки'],['My sister is older than me','Моя сестра старше меня'],['Tom is as tall as Ben','Том такого же роста, как Бен']]},
 {id:'g-past',g:4,e:'⏪',ru:'Past Simple',rule:['Было: <b>was</b> (I, he, she, it), <b>were</b> (you, we, they). I <b>was</b> at home yesterday.','Правильные глаголы: <b>-ed</b>: play → play<b>ed</b>. Неправильные запоминаем: go → <b>went</b>, have → <b>had</b>, see → <b>saw</b>, eat → <b>ate</b>.'],
  ex:[['We were at the zoo yesterday.','Вчера мы были в зоопарке.'],['I saw a lion.','Я видел льва.']],
  q:[['I ___ at school yesterday.','was','were','am','Вчера я был в школе.'],['They ___ in the park.','were','was','are','Они были в парке.'],['We ___ football yesterday.','played','play','plaied','Вчера мы играли в футбол.'],['She ___ to the zoo last Sunday.','went','goed','go','В прошлое воскресенье она ходила в зоопарк.'],['I ___ a big fish!','saw','seed','see','Я видел большую рыбу!'],['He ___ pizza for dinner.','had','haved','has','На ужин у него была пицца.'],['It ___ cold last winter.','was','were','is','Прошлой зимой было холодно.']],
  ord:[['I was at home yesterday','Вчера я был дома'],['We went to the cinema','Мы ходили в кино'],['She played with her cat','Она играла со своей кошкой']]}
];
