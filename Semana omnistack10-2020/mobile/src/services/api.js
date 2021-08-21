import axios from 'axios';

const api = axios.create({
    //baseURL muda de acordo com o ambiente que voce esta e o SO
    // emulador ios http://localhost:3333   http://192.168.1.109:3333
    // emulador android http://10.0.2.2:3333 ou ip do expo

    baseURL: 'http://192.168.1.109:3333',
});

export default api;