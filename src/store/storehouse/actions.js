import { getUrl } from "src/tools/url";
import { axiosInstance } from "boot/axios";
import { setFormatedDate } from "src/utils/FrequentlyCalledFunctions";

export const fetchStorehouseTableData = ({ commit }) =>
  axiosInstance
    .get(`${getUrl("storehouseData")}/${1}`)
    .then(({ data }) => {
      commit("SET_STOREHOUSE_DATA", setFormatedDate(data, ["created_at"]));
    })
    .catch(() => {
      console.warn("Ошибка при запросе fetchStorehouseTableData");
    });

// export const setStorehouseData = (({ commit }, data) => {
//   commit('SET_STOREHOUSE_DATA', data);
// });

export const setStorehouseCategoriesData = ({ commit }, data) => {
  commit("SET_STOREHOUSE_CATEGORIES_DATA", data);
};

export const addToStorehouseData = ({ commit }, entry) => {
  commit("ADD_TO_STOREHOUSE_DATA", entry);
};

export const updateStorehouseData = ({ commit }, entry) => {
  commit("UPDATE_STOREHOUSE_DATA", entry);
};

export const destroyStorehouseData = ({ commit }, arr) => {
  commit("DESTROY_STOREHOUSE_DATA", arr);
};
