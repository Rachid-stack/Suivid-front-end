import axios from 'axios';
import apiUrl from '../tools/apiUrl';

const url = apiUrl() + "/categories-courrier";

const  CategorieCourrierService = {
    getAll :  (parametres)  => {
        return axios.get(url, {params: parametres}).then((res) => res.data);
    },

    create : (data) => {
        return axios.post(url, data).then((res) => ({'data': res.data,  'status': res.status}) );
    },

    update : (data) => {
        return axios.put(url+'/'+data.id, data).then((res) => ({'data': res.data,  'status': res.status}))
    },

    delete : (data) => {
        return axios.delete(url+'/'+data.id).then((res) => ({'data': res.data, 'status': res.status}))
    }
}

export default CategorieCourrierService;