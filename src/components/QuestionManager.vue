<template>
</template>
  
<script setup>

  // 親コンポーネントから国とゲームタイプを受け取る
  const props = defineProps({
    selectedCountry: String,
    gameType: String
  });
  
  // 親コンポーネントへデータを渡すためのemit
  const emit = defineEmits(["question-updated"]);

  // 新しい問題をセットし、親にデータを渡す
  const setQuestion = () => {
    if (props.selectedCountry && props.gameType) {
      const question = loadQuestion(props.selectedCountry, props.gameType);
      if (question) {
        const key = `${props.selectedCountry}-${props.gameType}`;
        const allQuestions = groups[key] || [];
        const choices = generateChoices(question.answer, allQuestions);
        emit("question-updated", {
          question,
          choices
        });
      }
    }
  };

  // 問題の取得関数
  const loadQuestion = (selectedCountry, gameType) => {
    const key = `${selectedCountry}-${gameType}`;
    const questions = groups[key] || [];
    if (questions.length > 0) {
      const randomIndex = Math.floor(Math.random() * questions.length);
      return questions[randomIndex];
    }
    return null;
  };
  
  // 選択肢の生成関数
  const generateChoices = (correctAnswer, allQuestions) => {
    let wrongAnswers = allQuestions
      .map(q => q.answer)
      .filter(answer => answer !== correctAnswer);
    
    wrongAnswers = wrongAnswers.sort(() => 0.5 - Math.random()).slice(0, 4);
    const choices = [correctAnswer, ...wrongAnswers].sort(() => 0.5 - Math.random());
    return choices;
  };
  
  // `defineExpose` で関数を親から呼べるようにする
  defineExpose({
    setQuestion
  });

  const groups = {
    "Russia-location": [
      {word: "test1", answer: "test1"},
      {word: "test2", answer: "test2"},
      {word: "test3", answer: "test3"},
      {word: "test4", answer: "test4"},
      {word: "test5", answer: "test5"},
      {word: "test6", answer: "test6"}
    ],
    "Russia-letter": [
      { "word": "Москва", "answer": "Moscow" },
      { "word": "Санкт-Петербург", "answer": "Saint Petersburg" },
      { "word": "Севастополь", "answer": "Sevastopol" },
      { "word": "Республика Адыгея", "answer": "Adygea Republic" },
      { "word": "Республика Алтай", "answer": "Altai Republic" },
      { "word": "Республика Башкортостан", "answer": "Bashkortostan Republic" },
      { "word": "Республика Бурятия", "answer": "Buryatia Republic" },
      { "word": "Республика Дагестан", "answer": "Dagestan Republic" },
      { "word": "Республика Ингушетия", "answer": "Ingushetia Republic" },
      { "word": "Кабардино-Балкарская Республика", "answer": "Kabardino-Balkaria Republic" },
      { "word": "Республика Калмыкия", "answer": "Kalmykia Republic" },
      { "word": "Карачаево-Черкесская Республика", "answer": "Karachay-Cherkess Republic" },
      { "word": "Республика Карелия", "answer": "Karelia Republic" },
      { "word": "Республика Коми", "answer": "Komi Republic" },
      { "word": "Республика Крым", "answer": "Crimea Republic" },
      { "word": "Республика Марий Эл", "answer": "Mari El Republic" },
      { "word": "Республика Мордовия", "answer": "Mordovia Republic" },
      { "word": "Республика Саха (Якутия)", "answer": "Sakha Republic (Yakutia)" },
      { "word": "Республика Северная Осетия — Алания", "answer": "North Ossetia-Alania Republic" },
      { "word": "Республика Татарстан", "answer": "Tatarstan Republic" },
      { "word": "Республика Тыва", "answer": "Tuva Republic" },
      { "word": "Удмуртская Республика", "answer": "Udmurt Republic" },
      { "word": "Республика Хакасия", "answer": "Khakassia Republic" },
      { "word": "Чеченская Республика", "answer": "Chechen Republic" },
      { "word": "Чувашская Республика", "answer": "Chuvash Republic" },
      { "word": "Алтайский край", "answer": "Altai Krai" },
      { "word": "Забайкальский край", "answer": "Zabaykalsky Krai" },
      { "word": "Камчатский край", "answer": "Kamchatka Krai" },
      { "word": "Краснодарский край", "answer": "Krasnodar Krai" },
      { "word": "Красноярский край", "answer": "Krasnoyarsk Krai" },
      { "word": "Пермский край", "answer": "Perm Krai" },
      { "word": "Приморский край", "answer": "Primorsky Krai" },
      { "word": "Ставропольский край", "answer": "Stavropol Krai" },
      { "word": "Хабаровский край", "answer": "Khabarovsk Krai" },
      { "word": "Амурская область", "answer": "Amur Oblast" },
      { "word": "Архангельская область", "answer": "Arkhangelsk Oblast" },
      { "word": "Астраханская область", "answer": "Astrakhan Oblast" },
      { "word": "Белгородская область", "answer": "Belgorod Oblast" },
      { "word": "Брянская область", "answer": "Bryansk Oblast" },
      { "word": "Владимирская область", "answer": "Vladimir Oblast" },
      { "word": "Волгоградская область", "answer": "Volgograd Oblast" },
      { "word": "Вологодская область", "answer": "Vologda Oblast" },
      { "word": "Воронежская область", "answer": "Voronezh Oblast" },
      { "word": "Ивановская область", "answer": "Ivanovo Oblast" },
      { "word": "Иркутская область", "answer": "Irkutsk Oblast" },
      { "word": "Калининградская область", "answer": "Kaliningrad Oblast" },
      { "word": "Калужская область", "answer": "Kaluga Oblast" },
      { "word": "Кемеровская область", "answer": "Kemerovo Oblast" },
      { "word": "Кировская область", "answer": "Kirov Oblast" },
      { "word": "Костромская область", "answer": "Kostroma Oblast" },
      { "word": "Курганская область", "answer": "Kurgan Oblast" },
      { "word": "Курская область", "answer": "Kursk Oblast" },
      { "word": "Ленинградская область", "answer": "Leningrad Oblast" },
      { "word": "Липецкая область", "answer": "Lipetsk Oblast" },
      { "word": "Магаданская область", "answer": "Magadan Oblast" },
      { "word": "Московская область", "answer": "Moscow Oblast" },
      { "word": "Мурманская область", "answer": "Murmansk Oblast" },
      { "word": "Нижегородская область", "answer": "Nizhny Novgorod Oblast" },
      { "word": "Новгородская область", "answer": "Novgorod Oblast" },
      { "word": "Новосибирская область", "answer": "Novosibirsk Oblast" },
      { "word": "Омская область", "answer": "Omsk Oblast" },
      { "word": "Оренбургская область", "answer": "Orenburg Oblast" },
      { "word": "Орловская область", "answer": "Oryol Oblast" },
      { "word": "Пензенская область", "answer": "Penza Oblast" },
      { "word": "Псковская область", "answer": "Pskov Oblast" },
      { "word": "Ростовская область", "answer": "Rostov Oblast" },
      { "word": "Рязанская область", "answer": "Ryazan Oblast" },
      { "word": "Самарская область", "answer": "Samara Oblast" },
      { "word": "Саратовская область", "answer": "Saratov Oblast" },
      { "word": "Сахалинская область", "answer": "Sakhalin Oblast" },
      { "word": "Свердловская область", "answer": "Sverdlovsk Oblast" },
      { "word": "Смоленская область", "answer": "Smolensk Oblast" },
      { "word": "Тамбовская область", "answer": "Tambov Oblast" },
      { "word": "Тверская область", "answer": "Tver Oblast" },
      { "word": "Томская область", "answer": "Tomsk Oblast" },
      { "word": "Тульская область", "answer": "Tula Oblast" },
      { "word": "Тюменская область", "answer": "Tyumen Oblast" },
      { "word": "Ульяновская область", "answer": "Ulyanovsk Oblast" },
      { "word": "Челябинская область", "answer": "Chelyabinsk Oblast" },
      { "word": "Ярославская область", "answer": "Yaroslavl Oblast" }
      ],
    "SouthKorea-location": [
      {word: "test1", answer: "test1"},
      {word: "test2", answer: "test2"},
      {word: "test3", answer: "test3"},
      {word: "test4", answer: "test4"},
      {word: "test5", answer: "test5"},
      {word: "test6", answer: "test6"}
    ],
    "SouthKorea-letter": [
      { word: "서울", answer: "Seoul" },
      { word: "부산", answer: "Busan" },
      { word: "인천", answer: "Incheon" },
      {word: "대구", answer: "Daegu"},
      {word: "광주", answer: "Gwangju"},
      {word: "test6", answer: "test6"}
    ],
    "Bangladesh-location": [
      {word: "test1", answer: "test1"},
      {word: "test2", answer: "test2"},
      {word: "test3", answer: "test3"},
      {word: "test4", answer: "test4"},
      {word: "test5", answer: "test5"},
      {word: "test6", answer: "test6"}
    ],
    "Bangladesh-letter": [
      { "word": "ঢাকা", "answer": "Dhaka" },
      { "word": "চট্টগ্রাম", "answer": "Chattogram" },
      { "word": "খুলনা", "answer": "Khulna" },
      { "word": "রাজশাহী", "answer": "Rajshahi" },
      { "word": "সিলেট", "answer": "Sylhet" },
      { "word": "বরিশাল", "answer": "Barishal" },
      { "word": "রংপুর", "answer": "Rangpur" },
      { "word": "কুমিল্লা", "answer": "Cumilla" },
      { "word": "নারায়ণগঞ্জ", "answer": "Narayanganj" },
      { "word": "বগুড়া", "answer": "Bogra" },
      { "word": "ময়মনসিংহ", "answer": "Mymensingh" },
      { "word": "গাজীপুর", "answer": "Gazipur" },
      { "word": "টাঙ্গাইল", "answer": "Tangail" },
      { "word": "ফরিদপুর", "answer": "Faridpur" },
      { "word": "কুষ্টিয়া", "answer": "Kushtia" },
      { "word": "যশোর", "answer": "Jashore" },
      { "word": "নোয়াখালী", "answer": "Noakhali" },
      { "word": "চাঁদপুর", "answer": "Chandpur" },
      { "word": "কক্সবাজার", "answer": "Cox's Bazar" },
      { "word": "ফেনী", "answer": "Feni" },
      { "word": "লক্ষ্মীপুর", "answer": "Lakshmipur" },
      { "word": "দিনাজপুর", "answer": "Dinajpur" },
      { "word": "ঠাকুরগাঁও", "answer": "Thakurgaon" },
      { "word": "পাবনা", "answer": "Pabna" },
      { "word": "শরীয়তপুর", "answer": "Shariatpur" },
      { "word": "গোপালগঞ্জ", "answer": "Gopalganj" },
      { "word": "মাদারীপুর", "answer": "Madaripur" },
      { "word": "সাতক্ষীরা", "answer": "Satkhira" },
      { "word": "পিরোজপুর", "answer": "Pirojpur" },
      { "word": "ঝালকাঠি", "answer": "Jhalokathi" },
      { "word": "ভোলা", "answer": "Bhola" },
      { "word": "বরগুনা", "answer": "Barguna" },
      { "word": "নেত্রকোণা", "answer": "Netrokona" },
      { "word": "সুনামগঞ্জ", "answer": "Sunamganj" },
      { "word": "মৌলভীবাজার", "answer": "Moulvibazar" },
      { "word": "হবিগঞ্জ", "answer": "Habiganj" },
      { "word": "গাইবান্ধা", "answer": "Gaibandha" },
      { "word": "কুড়িগ্রাম", "answer": "Kurigram" },
      { "word": "নওগাঁ", "answer": "Naogaon" },
      { "word": "জয়পুরহাট", "answer": "Joypurhat" },
      { "word": "নাটোর", "answer": "Natore" },
      { "word": "চুয়াডাঙ্গা", "answer": "Chuadanga" },
      { "word": "মেহেরপুর", "answer": "Meherpur" },
      { "word": "মাগুরা", "answer": "Magura" },
      { "word": "ঝিনাইদহ", "answer": "Jhenaidah" },
      { "word": "শেরপুর", "answer": "Sherpur" },
      { "word": "বাগেরহাট", "answer": "Bagerhat" },
      { "word": "বান্দরবান", "answer": "Bandarban" },
      { "word": "খাগড়াছড়ি", "answer": "Khagrachhari" }
    ],
  };
</script>
  