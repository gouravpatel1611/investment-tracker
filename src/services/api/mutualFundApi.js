import { mutualFundSchemes } from "../../data/mutualFunds";

function wait(ms = 350) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function findMutualFundBySchemeCode(
  schemeCode
) {
  await wait();

  const code = String(schemeCode || "")
    .trim();

  if (!code) {
    return null;
  }

  const fund = mutualFundSchemes.find(
    (item) => item.schemeCode === code
  );

  return fund || null;
}

export async function getHistoricalNav(
  scheme,
  date
) {
  await wait(250);

  if (!scheme || !date) {
    return {
      nav: null,
      actualDate: null,
      isPreviousDate: false,
    };
  }

  const directNav = scheme.nav?.[date];

  if (directNav !== undefined) {
    return {
      nav: directNav,
      actualDate: date,
      isPreviousDate: false,
    };
  }

  const availableDates = Object.keys(
    scheme.nav || {}
  )
    .filter((item) => item <= date)
    .sort()
    .reverse();

  if (availableDates.length === 0) {
    return {
      nav: null,
      actualDate: null,
      isPreviousDate: false,
    };
  }

  const previousDate = availableDates[0];

  return {
    nav: scheme.nav[previousDate],
    actualDate: previousDate,
    isPreviousDate: previousDate !== date,
  };
}