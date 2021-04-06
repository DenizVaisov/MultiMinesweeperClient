import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

const messages = {
    'en': {
        gameResults: "Game results",
        gameRecords: "Rating",
        guest: "Guest",
        playButtonText: "PLAY",
        textAreaPlaceholder: "Message",
        textAreaButtonText: "Send",
        authorizeToPlay: "Log in to play!",
        authorizeToChat: "Log in to chat!",
        noPlayers: "There are no other players in the lobby",
        playersInLobby: "Players in lobby",
        playersMatched: "Players are being matched, wait...",
        playersIsAwait: "Players waiting for the game",
        player: "Player",
        rating: "Rating", 
        rate: "Rate",
        win: "Win", 
        lose: "Lose",
        place: "Place",
        times: "times",
        cheat: "Don't cheat!",
        wumpus: "Wumpus is a cheater, so no one plays with him!",
        toLobby: "To the lobby",
        prepareStage: "Prepare stage, hurry up!",
        competitiveStage: "Competitive stage, carefully mined fields are swapped!",
        timer: "Timer",
        livesLeft: "LIVES LEFT",
        notification: "Notification",
        minesPlaced: "Mines placed",
        yourTurn: "Your turn",
        notYourTurn: "Now is not your turn!",
        kaboom: "Kaboom -1 life!",
        hidechat: "Hide chat",
        showChat: "Show chat",
        hideField: "Hide field",
        showField: "Show field",
        youWin: "Congratulations You are the Winner!",
        youLose: "Lose, lucky next time 😉!"
    },

    'ru': { 
        gameResults: "Результаты игр",
        gameRecords: "Рекорды",
        guest: "Гость",
        playButtonText: "ИГРАТЬ",
        textAreaPlaceholder: "Сообщение",
        textAreaButtonText: "Отправить",
        authorizeToPlay: "Авторизуйтесь, чтобы играть!",
        authorizeToChat: "Авторизуйтесь, чтобы писать в чат!",
        noPlayers: "В лобби нет других игроков",
        playersInLobby: "Игроков в лобби",
        playersMatched: "Идёт подбор игроков, ждите...",
        playersIsAwait: "Игроков ожидающих игру",
        player: "Игрок",
        rating: "Рейтинг", 
        rate: "Ставка",
        win: "Победил", 
        lose: "Проиграл",
        place: "Место",
        times: "раз(а)",
        livesLeft: "ОСТАЛОСЬ ЖИЗНЕЙ",
        notification: "Оповещение",
        cheat: "Не читери!",
        wumpus: "Вампус читерит, поэтому с ним никто не играет!",
        toLobby: "Вернуться в лобби",
        prepareStage: "Подготовительный этап, торопись!",
        competitiveStage: "Подготовительный этап, осторожно заминированные поля поменялись!",
        timer: "Таймер",
        minesPlaced: "Мин расставлено",
        yourTurn: "Твой ход",
        notYourTurn: "Сейчас не твой ход!",
        kaboom: "Подрыв на мине -1 жизнь!",
        hidechat: "Скрыть чат",
        showChat: "Показать чат",
        hideField: "Скрыть поле",
        showField: "Показать поле",
        youWin: "Поздравляем, ты победитель!",
        youLose: "Проиграл, повезёт в следующий раз 😉!"
    }
};

const i18n = new VueI18n({
    locale: 'ru', // set locale
    fallbackLocale: 'en', // set fallback locale
    messages, // set locale messages
});

export default i18n;