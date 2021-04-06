import axios from 'axios';

var dataPath = {
    PLAYER_DATA: "http://192.168.43.159:5000/Lobby/Identity",
    IDENTITY_COOCKIE: "http://192.168.43.159:5000/Lobby/CheckIdentityCookie"
}

export default {
   getPlayer() {
       return axios.get(`${dataPath.PLAYER_DATA}`, {withCredentials: true})
   },

   isIdentityCookieAlive() {
       return axios.get(`${dataPath.IDENTITY_COOCKIE}`, {withCredentials: true})
   }
}