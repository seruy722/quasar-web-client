import { getUrl } from "src/tools/url";
import { axiosInstance } from "boot/axios";

export const getCargoDebts = ({ commit }, clientId) => {
  const answer = axiosInstance.get(`${getUrl("allCargoData")}/${clientId}`);
  answer
    .then(({ data: { cargo, debts } }) => {
      commit("SET_CARGO", cargo);
      commit("SET_CARGO_FO_SEARCH", cargo);
      commit("SET_DEBTS", debts);
      commit("SET_DEBTS_FO_SEARCH", debts);
    })
    .catch(() => {
      console.warn("Ошибка при запросе getCargoDebts");
    });
  return answer;
};

export const updateCargoEntry = ({ commit }, data) => {
  commit("UPDATE_CARGO_ENTRY", data);
};

export const addCargoEntry = ({ commit }, data) => {
  commit("ADD_CARGO_ENTRY", data);
};

export const deleteCargoEntry = ({ commit }, data) => {
  commit("DELETE_CARGO_ENTRY", data);
};

export const setCurrentCodeClientId = ({ commit }, id) => {
  commit("SET_CURRENT_CODE_CLIENT_ID", id);
};

export const addDebtEntry = ({ commit }, data) => {
  commit("ADD_DEBT_ENTRY", data);
};
export const updateDebtEntry = ({ commit }, data) => {
  commit("UPDATE_DEBT_ENTRY", data);
};

export const deleteDebtEntry = ({ commit }, data) => {
  commit("DELETE_DEBT_ENTRY", data);
};
export const setCargo = ({ commit }, data) => {
  commit("SET_CARGO", data);
};
export const setDebts = ({ commit }, data) => {
  commit("SET_DEBTS", data);
};
export const getGeneralData = async ({ commit }) =>
  axiosInstance.get(getUrl("generalCargoData")).then(({ data }) => {
    commit("SET_GENERAL_DATA", data);
  });
export const updateOrAddDebtEntry = ({ commit }, data) => {
  commit("UPDATE_OR_ADD_DEBT_ENTRY", data);
};

export const updateOrAddCargoEntry = ({ commit }, data) => {
  commit("UPDATE_OR_ADD_CARGO_ENTRY", data);
};
