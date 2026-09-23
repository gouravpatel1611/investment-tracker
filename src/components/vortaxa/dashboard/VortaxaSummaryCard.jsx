
import {
  CircleDollarSign,
  Users,
} from "lucide-react";

import {
  formatCurrency,
  formatNumber,
} from "../../../utils/vortaxa/vortaxaFormatters";


function VortaxaSummaryCard() {

  /*
   * ==========================================
   * DUMMY INVESTORS
   * ==========================================
   */

  const investors = [
    {
      id: "dummy-investor-1",
      name: "Investor 1",

      // Future fields
      apr: 0,
      pi: 0,

      // Dummy values
      total: 1250,
      wdl: 250,
      balance: 1000,
    },

    {
      id: "dummy-investor-2",
      name: "Investor 2",

      // Future fields
      apr: 0,
      pi: 0,

      // Dummy values
      total: 2000,
      wdl: 500,
      balance: 1500,
    },
  ];


  /*
   * ==========================================
   * TOTALS
   * ==========================================
   */

  const totalApr = investors.reduce(
    (sum, investor) => sum + investor.apr,
    0
  );

  const totalPi = investors.reduce(
    (sum, investor) => sum + investor.pi,
    0
  );

  const totalEarn = investors.reduce(
    (sum, investor) => sum + investor.total,
    0
  );

  const totalWdl = investors.reduce(
    (sum, investor) => sum + investor.wdl,
    0
  );

  const totalBalance = investors.reduce(
    (sum, investor) => sum + investor.balance,
    0
  );


  return (
    <div
      className="
        mb-5
        rounded-2xl
        border
        border-slate-700
        bg-slate-800
        p-1
        font-[Calibri]
        sm:p-4
      "
      style={{
        fontFamily: "Calibri, Arial, sans-serif",
      }}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <div
        className="
          mb-3
          flex
          items-center
          justify-between
          gap-3
        "
      >

        <div
          className="
            flex
            min-w-0
            items-center
            gap-2.5
          "
        >

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-orange-500/15
            "
          >
            <CircleDollarSign
              className="
                h-5
                w-5
                text-orange-300
              "
            />
          </div>

          <div className="min-w-0">

            <p
              className="
                truncate
                text-base
                font-extrabold
                text-white
              "
            >
              Vortaxa Summary
            </p>

            <p
              className="
                mt-0.5
                text-xs
                font-medium
                text-slate-400
              "
            >
              Investor-wise summary
            </p>

          </div>

        </div>


        {/* Investor Count */}

        <div
          className="
            flex
            shrink-0
            items-center
            gap-1.5
            rounded-lg
            border
            border-slate-700
            bg-slate-900/70
            px-2.5
            py-1.5
            text-sm
            font-bold
            text-white
          "
        >

          <Users
            className="
              h-4
              w-4
              text-orange-300
            "
          />

          {formatNumber(investors.length)}

        </div>

      </div>


      {/* =====================================
          SUMMARY TABLE
      ===================================== */}

      <div
        className="
          overflow-x-auto
          rounded-xl
          border
          border-slate-700
        "
      >

        <table
          className="
            w-full
            min-w-max
            border-collapse
          "
        >

          {/* =================================
              HEADER
          ================================= */}

          <thead>

            <tr className="bg-slate-900/80">

              <th
                className="
                  sticky
                  left-0
                  z-10
                  min-w-[90px]
                  border-b
                  border-r
                  border-slate-700
                  bg-slate-900
                  px-3
                  py-3
                  text-left
                  text-sm
                  font-extrabold
                  text-white
                "
              >
                Investor
              </th>


              {investors.map((investor) => (

                <th
                  key={investor.id}
                  className="
                    min-w-[110px]
                    border-b
                    border-slate-700
                    px-3
                    py-3
                    text-center
                    text-sm
                    font-extrabold
                    text-orange-300
                  "
                >
                  {investor.name}
                </th>

              ))}


              <th
                className="
                  min-w-[110px]
                  border-b
                  border-l
                  border-slate-700
                  bg-slate-900
                  px-3
                  py-3
                  text-center
                  text-sm
                  font-extrabold
                  text-white
                "
              >
                Total
              </th>

            </tr>

          </thead>


          <tbody>

            {/* =================================
                APR $
            ================================= */}

            <tr>

              <td
                className="
                  sticky
                  left-0
                  z-10
                  border-r
                  border-b
                  border-slate-700
                  bg-slate-800
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-white
                "
              >
                APR $
              </td>


              {investors.map((investor) => (

                <td
                  key={investor.id}
                  className="
                    border-b
                    border-slate-700
                    px-3
                    py-3
                    text-center
                    text-base
                    font-bold
                    text-white
                  "
                >
                  {formatCurrency(investor.apr)}
                </td>

              ))}


              <td
                className="
                  border-b
                  border-l
                  border-slate-700
                  bg-slate-900/50
                  px-3
                  py-3
                  text-center
                  text-base
                  font-extrabold
                  text-white
                "
              >
                {formatCurrency(totalApr)}
              </td>

            </tr>


            {/* =================================
                PI $
            ================================= */}

            <tr>

              <td
                className="
                  sticky
                  left-0
                  z-10
                  border-r
                  border-b
                  border-slate-700
                  bg-slate-800
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-fuchsia-300
                "
              >
                PI $
              </td>


              {investors.map((investor) => (

                <td
                  key={investor.id}
                  className="
                    border-b
                    border-slate-700
                    px-3
                    py-3
                    text-center
                    text-base
                    font-bold
                    text-fuchsia-400
                  "
                >
                  {formatCurrency(investor.pi)}
                </td>

              ))}


              <td
                className="
                  border-b
                  border-l
                  border-slate-700
                  bg-slate-900/50
                  px-3
                  py-3
                  text-center
                  text-base
                  font-extrabold
                  text-fuchsia-400
                "
              >
                {formatCurrency(totalPi)}
              </td>

            </tr>


            {/* =================================
                TOTAL $
            ================================= */}

            <tr>

              <td
                className="
                  sticky
                  left-0
                  z-10
                  border-r
                  border-b
                  border-slate-700
                  bg-slate-800
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-emerald-300
                "
              >
                Total $
              </td>


              {investors.map((investor) => (

                <td
                  key={investor.id}
                  className="
                    border-b
                    border-slate-700
                    px-3
                    py-3
                    text-center
                    text-base
                    font-bold
                    text-emerald-400
                  "
                >
                  {formatCurrency(investor.total)}
                </td>

              ))}


              <td
                className="
                  border-b
                  border-l
                  border-slate-700
                  bg-slate-900/50
                  px-3
                  py-3
                  text-center
                  text-base
                  font-extrabold
                  text-emerald-400
                "
              >
                {formatCurrency(totalEarn)}
              </td>

            </tr>


            {/* =================================
                WDL
            ================================= */}

            <tr>

              <td
                className="
                  sticky
                  left-0
                  z-10
                  border-r
                  border-b
                  border-slate-700
                  bg-slate-800
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-rose-300
                "
              >
                WDL
              </td>


              {investors.map((investor) => (

                <td
                  key={investor.id}
                  className="
                    border-b
                    border-slate-700
                    px-3
                    py-3
                    text-center
                    text-base
                    font-bold
                    text-rose-400
                  "
                >
                  {formatCurrency(investor.wdl)}
                </td>

              ))}


              <td
                className="
                  border-b
                  border-l
                  border-slate-700
                  bg-slate-900/50
                  px-3
                  py-3
                  text-center
                  text-base
                  font-extrabold
                  text-rose-400
                "
              >
                {formatCurrency(totalWdl)}
              </td>

            </tr>


            {/* =================================
                BAL $
            ================================= */}

            <tr>

              <td
                className="
                  sticky
                  left-0
                  z-10
                  border-r
                  border-slate-700
                  bg-slate-800
                  px-3
                  py-3
                  text-sm
                  font-bold
                  text-green-400
                "
              >
                BAL $
              </td>


              {investors.map((investor) => (

                <td
                  key={investor.id}
                  className="
                    px-3
                    py-3
                    text-center
                    text-base
                    font-extrabold
                    text-green-400
                  "
                >
                  {formatCurrency(investor.balance)}
                </td>

              ))}


              <td
                className="
                  border-l
                  border-slate-700
                  bg-slate-900/50
                  px-3
                  py-3
                  text-center
                  text-base
                  font-extrabold
                  text-green-400
                "
              >
                {formatCurrency(totalBalance)}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}


export default VortaxaSummaryCard;
