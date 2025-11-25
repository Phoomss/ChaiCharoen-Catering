import http from './http-common';

const API_URL = '/menus';

const createMenu = (menuData) => {
    return http.post(API_URL, menuData);
};

const getAllMenus = () => {
    return http.get(API_URL);
};

const getMenuById = (id) => {
    return http.get(`${API_URL}/${id}`);
};

const updateMenu = (id, menuData) => {
    return http.put(`${API_URL}/${id}`, menuData);
};

const deleteMenu = (id) => {
    return http.delete(`${API_URL}/${id}`);
};

const toggleActive = (id) => {
    return http.patch(`${API_URL}/${id}/toggle`);
};

const menuService = {
    createMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu,
    toggleActive
};

export default menuService;