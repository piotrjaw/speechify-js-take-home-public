import { DataType } from "@common";
import { htmlToText } from "html-to-text";

const parsers: Record<DataType, (data: string) => string> = {
  [DataType.TXT]: (data: string): string => data.replace(/\s+/gi, " "),
  [DataType.JSON]: (data: string): string => {
    try {
      return JSON.parse(data).message;
    } catch (e) {
      console.error(e);
      return "";
    }
  },
  [DataType.HTML]: (data: string): string =>
    htmlToText(data, { wordwrap: null }),
};

export default parsers;
