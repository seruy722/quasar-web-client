import { getUrl } from "src/tools/url";
import { axiosInstance } from "boot/axios";
import { toLower, isEmpty } from "lodash";

export const filterMethod = (val) => {
  if (val) {
    showDialog.value = false;
    emit("update:loading", true);
    axiosInstance
      .post(getUrl("transfersSearch"), {
        value: toLower(val),
        field: searchField.value,
      })
      .then(({ data: { transfers } }) => {
        emit("update:loading", false);
        if (!isEmpty(transfers)) {
          store.dispatch("transfers/setTransfers", transfers);
          store.commit("transfers/SET_TRANSFERS_DATA", {});
        }
      });
  } else {
    searchInput.value.$el.focus();
  }
};
