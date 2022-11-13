import axios from 'axios';
import secureLocalStorage from 'react-secure-storage'

const tokenString = JSON.parse(secureLocalStorage.getItem('loginUser'))

const apiClient = axios.create({
    baseURL: 'http://localhost/nrich/public/api',
    headers: {
        'roleId': tokenString.data.roleId,
    }
});

export default apiClient;