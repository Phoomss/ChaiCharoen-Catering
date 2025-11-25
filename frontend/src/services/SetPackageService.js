import http from './http-common';

const API_URL = '/set-packages';

const createSetPackage = (setPackageData) => {
    return http.post(API_URL, setPackageData);
};

const getAllSetPackages = () => {
    return http.get(API_URL);
};

const getSetPackageById = (id) => {
    return http.get(`${API_URL}/${id}`);
};

const updateSetPackage = (id, setPackageData) => {
    return http.put(`${API_URL}/${id}`, setPackageData);
};

const deleteSetPackage = (id) => {
    return http.delete(`${API_URL}/${id}`);
};

const setPackageService = {
    createSetPackage,
    getAllSetPackages,
    getSetPackageById,
    updateSetPackage,
    deleteSetPackage
};

export default setPackageService;