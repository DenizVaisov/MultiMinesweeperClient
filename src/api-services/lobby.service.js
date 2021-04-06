import axios from 'axios';

var dataPath = {
    RECORDS_DATA: "http://192.168.43.159:5000/Lobby/Records",
    GAME_RESULTS: "http://192.168.43.159:5000/Lobby/HighScores"
}

export default {
    getPlayerRecords() {
        return axios.get(`${dataPath.RECORDS_DATA}`, {withCredentials: true})
    }, 

    getGameResults() {
        return axios.get(`${dataPath.GAME_RESULTS}`, {withCredentials: true})
    }
}