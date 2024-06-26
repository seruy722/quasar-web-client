import { reduce } from "lodash";
export default {
  filters: {
    jsonDecodeThings(val) {
      try {
        return reduce(
          JSON.parse(val),
          (result, { label, value }) => {
            result[label] = value;
            return result;
          },
          {},
        );
      } catch (e) {
        console.error(
          `Неправильный формат JSON строки (функции jsonDecodeThings) - ${val}`,
        );
      }
      return val;
    },
  },
};
