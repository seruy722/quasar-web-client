import { axiosInstance } from "boot/axios";
import { Notify } from "quasar";

export default function exportRequest(url, data, fileName) {
  return axiosInstance({
    url,
    method: "POST",
    responseType: "blob", // important
    data,
  })
    .then((response) => {
      if (!window.navigator.msSaveOrOpenBlob) {
        // BLOB NAVIGATOR
        const downloadUrl = window.URL.createObjectURL(
          new Blob([response.data]),
        );
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
      } else {
        // BLOB FOR EXPLORER 11
        window.navigator.msSaveOrOpenBlob(new Blob([response.data]), fileName);
      }
      Notify.create({
        position: "center",
        message: `${fileName} успешно выгружены.`,
        color: "positive",
      });
    })
    .catch(() => {
      Notify.create({
        position: "center",
        message: `Произошла ошибка при выгрузке ${fileName}`,
        color: "negative",
      });
    });
}
