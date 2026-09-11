import {
  useEffect,
  useState,
} from "react";

import {
  getSGBPortfolio,
} from "../../services/sgb/sgbPortfolioService";

import {
  calculateSGBHolding,
  calculateSGBSummary,
} from "../../utils/dashboard/assetBreakdownCalculations";


const initialData = {

  holdings: [],

  summary: {

    seriesCount: 0,

    units: 0,

    purchaseRate: 0,

    purchaseValue: 0,

    currentRate: 0,

    currentValue: 0,

    interest: 0,

    profit: 0,

    gain: 0,

    currentValueWithInterest: 0,

    totalGainPercent: 0,

  },

};


export function useDashboardSGB() {

  const [
    sgbData,
    setSgbData,
  ] = useState(
    initialData
  );


  const [
    sgbLoading,
    setSgbLoading,
  ] = useState(true);


  useEffect(() => {

    let isMounted = true;


    async function loadSGB() {

      try {

        setSgbLoading(
          true
        );


        const data =
          await getSGBPortfolio();


        if (!isMounted) {
          return;
        }


        const holdings =
          (
            data?.holdings ||
            []
          ).map(
            calculateSGBHolding
          );


        const summary =
          calculateSGBSummary(
            holdings
          );


        setSgbData({

          holdings,

          summary,

        });

      } catch (error) {

        console.error(
          "Dashboard SGB Error:",
          error
        );


        if (isMounted) {

          setSgbData(
            initialData
          );

        }

      } finally {

        if (isMounted) {

          setSgbLoading(
            false
          );

        }

      }

    }


    loadSGB();


    return () => {

      isMounted = false;

    };

  }, []);


  return {

    sgbData,

    sgbLoading,

  };

}