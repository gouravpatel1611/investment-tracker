import sgbSeriesData from "../../data/sgbSeriesData";

export const findSGBBySeriesCode = async (seriesCode) => {
  if (!seriesCode) {
    throw new Error("SGB Series Code is required");
  }

  const normalizedCode = seriesCode
    .trim()
    .toUpperCase();

  const sgb = sgbSeriesData.find(
    (item) =>
      item.seriesCode.toUpperCase() === normalizedCode
  );

  if (!sgb) {
    throw new Error("SGB Series Code not found");
  }

  return sgb;
};