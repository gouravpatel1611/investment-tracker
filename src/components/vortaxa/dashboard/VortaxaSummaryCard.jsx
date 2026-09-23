import {
  CircleDollarSign,
  Users,
} from "lucide-react";

import {
  formatCurrency,
  formatNumber,
} from "../../../utils/vortaxa/vortaxaFormatters";

import {
  useVortaxa,
} from "../../../context/VortaxaContext";


function VortaxaSummaryCard() {

  /*
   * ==========================================
   * REAL INVESTOR DATA
   * ==========================================
   *
   * investorData comes from VortaxaContext.
   *
   * Each investor contains:
   *
   * {
   *   ...investor,
   *   summary
   * }
   *
   * summary contains:
   *
   * apr
   * pi
   * totalEarn
   * totalEarnWithdrawn
   * availableEarn
   */

  const {
    investorData = [],
  } = useVortaxa();


  const investors =
    Array.isArray(investorData)
      ? investorData
      : [];


  /*
   * ==========================================
   * NORMALIZED SUMMARY VALUES
   * ==========================================
   *
   * Keep the table independent from the
   * internal summary property names.
   */

  const investorRows =
    investors.map(
      (investor) => {

        const summary =
          investor?.summary || {};


        const apr =
          Number(
            summary?.apr || 0
          );


        const pi =
          Number(
            summary?.pi || 0
          );


        const total =
          Number(
            summary?.totalEarn ??
            summary?.total ??
            apr + pi
          );


        const wdl =
          Number(
            summary?.totalEarnWithdrawn || 0
          );


        const balance =
          Number(
            summary?.availableEarn ??
            summary?.balance ??
            total - wdl
          );


        return {
          id:
            investor?.id,

          name:
            investor?.investorName ||
            investor?.name ||
            "Investor",

          apr,
          pi,
          total,
          wdl,
          balance,
        };

      }
    );


  /*
   * ==========================================
   * TOTALS
   * ==========================================
   */

  const totalApr =
    investorRows.reduce(
      (sum, investor) =>
        sum +
        Number(
          investor?.apr || 0
        ),
      0
    );


  const totalPi =
    investorRows.reduce(
      (sum, investor) =>
        sum +
        Number(
          investor?.pi || 0
        ),
      0
    );


  const totalEarn =
    investorRows.reduce(
      (sum, investor) =>
        sum +
        Number(
          investor?.total || 0
        ),
      0
    );


  const totalWdl =
    investorRows.reduce(
      (sum, investor) =>
        sum +
        Number(
          investor?.wdl || 0
        ),
      0
    );


  const totalBalance =
    investorRows.reduce(
      (sum, investor) =>
        sum +
        Number(
          investor?.balance || 0
        ),
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
        fontFamily:
          "Calibri, Arial, sans-serif",
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


          <div
            className="
              min-w-0
            "
          >

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

          {
            formatNumber(
              investorRows.length
            )
          }

        </div>

      </div>


      {/* =====================================
          NO INVESTOR
      ===================================== */}

      {investorRows.length === 0 ? (

        <div
          className="
            rounded-xl
            border
            border-slate-700
            bg-slate-900/50
            px-4
            py-8
            text-center
          "
        >

          <p
            className="
              text-sm
              font-bold
              text-white
            "
          >
            No Vortaxa investors
          </p>

          <p
            className="
              mt-1
              text-xs
              text-slate-500
            "
          >
            Add an investor to see the summary.
          </p>

        </div>

      ) : (

        /* =====================================
           SUMMARY TABLE
        ===================================== */

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

              <tr
                className="
                  bg-slate-900/80
                "
              >

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


                {investorRows.map(
                  (investor) => (

                    <th
                      key={
                        investor.id
                      }
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

                      {
                        investor.name
                      }

                    </th>

                  )
                )}


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


                {investorRows.map(
                  (investor) => (

                    <td
                      key={
                        investor.id
                      }
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

                      {
                        formatCurrency(
                          investor.apr
                        )
                      }

                    </td>

                  )
                )}


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

                  {
                    formatCurrency(
                      totalApr
                    )
                  }

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
                    text-yellow-400
                  "
                >
                  PI $
                </td>


                {investorRows.map(
                  (investor) => (

                    <td
                      key={
                        investor.id
                      }
                      className="
                        border-b
                        border-slate-700
                        px-3
                        py-3
                        text-center
                        text-base
                        font-bold
                        text-yellow-400
                      "
                    >

                      {
                        formatCurrency(
                          investor.pi
                        )
                      }

                    </td>

                  )
                )}


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
                    text-yellow-400
                  "
                >

                  {
                    formatCurrency(
                      totalPi
                    )
                  }

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


                {investorRows.map(
                  (investor) => (

                    <td
                      key={
                        investor.id
                      }
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

                      {
                        formatCurrency(
                          investor.total
                        )
                      }

                    </td>

                  )
                )}


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

                  {
                    formatCurrency(
                      totalEarn
                    )
                  }

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
                    text-rose-400
                  "
                >
                  WDL
                </td>


                {investorRows.map(
                  (investor) => (

                    <td
                      key={
                        investor.id
                      }
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

                      {
                        formatCurrency(
                          investor.wdl
                        )
                      }

                    </td>

                  )
                )}


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

                  {
                    formatCurrency(
                      totalWdl
                    )
                  }

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


                {investorRows.map(
                  (investor) => (

                    <td
                      key={
                        investor.id
                      }
                      className="
                        px-3
                        py-3
                        text-center
                        text-base
                        font-extrabold
                        text-green-400
                      "
                    >

                      {
                        formatCurrency(
                          investor.balance
                        )
                      }

                    </td>

                  )
                )}


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

                  {
                    formatCurrency(
                      totalBalance
                    )
                  }

                </td>

              </tr>

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}


export default VortaxaSummaryCard;