# 📋 EXCEL TEMPLATE BLUEPRINT
## Complete Structure for Building APEX OPS CENTER Financial Models

**Version:** 1.0
**Last Updated:** 2025-12-11
**Classification:** Internal Reference
**Purpose:** Detailed blueprint for constructing Excel financial models from scratch

---

## 🎯 OVERVIEW

This document provides the exact structure, layout, and formulas for building a professional-grade real estate financial model that meets APEX OPS CENTER standards.

**Use this document to:**
- Build new models from scratch
- Understand model architecture
- Ensure compliance with APEX standards
- Train new modelers

---

## 📑 TAB-BY-TAB STRUCTURE

### TAB 1: COVER

**Purpose:** Model introduction, version control, and table of contents

**Layout:**

```
╔════════════════════════════════════════════════════════════════╗
║                      [APEX OPS CENTER LOGO]                     ║
║                                                                  ║
║                  REAL ESTATE FINANCIAL MODEL                     ║
║              [Model Name - e.g., "Single-Family Rental"]        ║
║                                                                  ║
║  Version: 1.0                    Date: 12/11/2025              ║
║  Prepared By: APEX OPS CENTER Real Estate Operations           ║
║  Model Type: Underwriting Template                              ║
╚════════════════════════════════════════════════════════════════╝

═══════════════════════════════════════════════════════════════════

📌 MODEL INFORMATION

Property Type:      [Dynamic from INPUTS tab]
Analysis Type:      Acquisition / Refinance / Disposition
Hold Period:        [Dynamic] Years
Created:            12/11/2025
Last Modified:      12/11/2025
Author:             Systems Architect

═══════════════════════════════════════════════════════════════════

📖 TABLE OF CONTENTS

Tab 1:  COVER              Model information and instructions
Tab 2:  INPUTS             User data entry (LIGHT BLUE cells)
Tab 3:  ASSUMPTIONS        Fixed market assumptions (GRAY headers)
Tab 4:  CALCULATIONS       Computational engine (LIGHT GREEN)
Tab 5:  OUTPUTS            Executive summary (LIGHT YELLOW)
Tab 6:  CHARTS             Visual analysis and graphs
Tab 7:  SUPPORTING         Detailed schedules and tables
Tab 8:  DATA               Reference data and lookups
Tab 9:  CHANGELOG          Version history

═══════════════════════════════════════════════════════════════════

🎯 INSTRUCTIONS

1. INPUTS Tab
   • Enter all deal-specific data in LIGHT BLUE cells only
   • Do not modify any other cells
   • Use drop-downs where provided
   • All monetary values should be entered without $ sign

2. OUTPUTS Tab
   • Review key metrics and Go/No-Go decision
   • All values calculate automatically
   • Green = Good, Yellow = Caution, Red = Problem

3. CHARTS Tab
   • Visualizations update automatically
   • Export charts for presentations as needed

4. Model Protection
   • Only LIGHT BLUE input cells are unlocked
   • To unprotect: Review → Unprotect Sheet
   • Password: [Provide if needed]

═══════════════════════════════════════════════════════════════════

⚠️ DISCLAIMER

This financial model is for internal analysis purposes only. Projections
are based on assumptions that may not be realized. Actual results may
vary materially from those shown. This model does not constitute
investment advice or a recommendation to buy, sell, or hold any security.

All information is confidential and proprietary to APEX OPS CENTER.
Unauthorized distribution or reproduction is strictly prohibited.

═══════════════════════════════════════════════════════════════════

📞 SUPPORT

Questions or issues?
Contact: Excel Systems Architect
Location: APEX OPS CENTER Real Estate Operations
Reference: File Room Documentation

═══════════════════════════════════════════════════════════════════
```

---

### TAB 2: INPUTS

**Purpose:** All user-entered deal-specific data
**Cell Color:** Light Blue (#D9E1F2) for all input cells
**Protection:** Unlocked only

**Layout:**

```
═══════════════════════════════════════════════════════════════════
                           USER INPUTS
                 (Enter data in light blue cells only)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│ 🏠 PROPERTY INFORMATION                                          │
└─────────────────────────────────────────────────────────────────┘

Property Address:          [Text Input]                    City, State
Property Type:             [Drop-down: Single-Family, Multifamily, Commercial, etc.]
Number of Units:           [Number]                        units
Total Square Footage:      [Number]                        SF
Year Built:                [Number]                        year
Lot Size:                  [Number]                        SF

┌─────────────────────────────────────────────────────────────────┐
│ 💰 ACQUISITION DETAILS                                           │
└─────────────────────────────────────────────────────────────────┘

Purchase Price:            $[Number]
Land Value (Est.):         $[Number]                       (for depreciation)
Closing Costs:             $[Number]                       or [%] of price
Acquisition Date:          [Date: mm/dd/yyyy]

┌─────────────────────────────────────────────────────────────────┐
│ 🔨 RENOVATION / IMPROVEMENT COSTS                                │
└─────────────────────────────────────────────────────────────────┘

Rehab Budget:              $[Number]
Contingency Reserve:       [%]                             (e.g., 10-15%)
Total Rehab (incl. cont.): $[Formula: =ReFab*(1+Contingency)]

Rehab Timeline:            [Number]                        months
Holding Costs (rehab):     $[Number]                       (insurance, utils, etc.)

┌─────────────────────────────────────────────────────────────────┐
│ 💵 INCOME (Annual)                                               │
└─────────────────────────────────────────────────────────────────┘

Gross Rental Income:       $[Number]                       per year
  OR Monthly Rent:         $[Number] × 12 = [Formula]
Other Income:              $[Number]                       (laundry, parking, pet fees, etc.)

Rent Growth (Annual):      [%]                             (e.g., 2-3% per year)

┌─────────────────────────────────────────────────────────────────┐
│ 📉 VACANCY & EXPENSES                                            │
└─────────────────────────────────────────────────────────────────┘

Vacancy Rate:              [%]                             (typically 5-10%)
Management Fee:            [%] of Gross Income             (typically 8-10%)

Operating Expenses (Annual):
  Property Tax:            $[Number]                       or [%] of value
  Insurance:               $[Number]
  HOA Fees:                $[Number]
  Utilities (if LL paid):  $[Number]
  Maintenance & Repairs:   $[Number]                       or [%] of income
  CapEx Reserve:           $[Number]                       or [$/unit/month × 12]
  Other Expenses:          $[Number]

┌─────────────────────────────────────────────────────────────────┐
│ 🏦 FINANCING                                                     │
└─────────────────────────────────────────────────────────────────┘

Loan Type:                 [Drop-down: Conventional, FHA, Commercial, Hard Money, etc.]
Loan Amount:               $[Number]                       or use LTV below
  OR Loan-to-Value:        [%]                             (e.g., 75% = 75,000 loan per $100K value)
Interest Rate:             [%]                             (annual rate)
Loan Term:                 [Number]                        years
Amortization Period:       [Number]                        years (if different from term)

Loan Fees & Points:        $[Number]                       or [%] of loan

Loan Type Toggle:          [Drop-down: Amortizing, Interest-Only, Balloon]

┌─────────────────────────────────────────────────────────────────┐
│ 📆 INVESTMENT HORIZON                                            │
└─────────────────────────────────────────────────────────────────┘

Hold Period:               [Number]                        years
Exit Strategy:             [Drop-down: Sale, Refinance, Hold, 1031 Exchange]

Exit Cap Rate:             [%]                             (for sale valuation)
Selling Costs:             [%]                             (typically 6-8% for brokerage, closing)

┌─────────────────────────────────────────────────────────────────┐
│ 💼 INVESTOR PARAMETERS                                           │
└─────────────────────────────────────────────────────────────────┘

Discount Rate (for NPV):   [%]                             (hurdle rate, typically 10-15%)
Tax Rate (combined):       [%]                             (federal + state, e.g., 37%)
Depreciation Method:       [Drop-down: Straight-Line 27.5yr, 39yr, Cost Segregation]

═══════════════════════════════════════════════════════════════════
```

**Key Formulas in INPUTS Tab:**

```excel
// Total All-In Cost
=PurchasePrice + ClosingCosts + RehabBudget + HoldingCosts

// Loan Amount (if using LTV)
=PurchasePrice * LTV_Percent

// Depreciable Basis
=PurchasePrice - LandValue

// Required Cash to Close
=PurchasePrice - LoanAmount + ClosingCosts + LoanFees

// Total Cash Invested
=RequiredCash + RehabBudget + HoldingCosts
```

---

### TAB 3: ASSUMPTIONS

**Purpose:** Fixed assumptions, market data, industry benchmarks
**Cell Color:** Gray (#D9D9D9) for headers, White for data
**Protection:** Locked

**Layout:**

```
═══════════════════════════════════════════════════════════════════
                         MARKET ASSUMPTIONS
            (Reference data - not deal-specific inputs)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│ 🏢 MARKET DATA (Update Quarterly)                                │
└─────────────────────────────────────────────────────────────────┘

Last Updated: 12/11/2025

┌──────────────────────────┬──────────┬──────────┬──────────┬──────────┐
│ Property Type            │ Low      │ Median   │ High     │ Source   │
├──────────────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Cap Rate - Single-Family │ 5.5%     │ 6.5%     │ 7.5%     │ CBRE     │
│ Cap Rate - Multifamily   │ 5.0%     │ 6.0%     │ 7.0%     │ CBRE     │
│ Cap Rate - Commercial    │ 6.0%     │ 7.5%     │ 9.0%     │ CoStar   │
│ Vacancy Rate - SF        │ 3.0%     │ 5.0%     │ 8.0%     │ Local MLS│
│ Vacancy Rate - MF        │ 5.0%     │ 7.0%     │ 10.0%    │ NMHC     │
│ Rent Growth Rate         │ 2.0%     │ 3.0%     │ 5.0%     │ Zillow   │
│ Property Tax Rate        │ 1.0%     │ 1.5%     │ 2.5%     │ County   │
└──────────────────────────┴──────────┴──────────┴──────────┴──────────┘

┌─────────────────────────────────────────────────────────────────┐
│ 💼 UNDERWRITING STANDARDS (APEX OPS CENTER)                      │
└─────────────────────────────────────────────────────────────────┘

Minimum DSCR:              1.25
Minimum Cash-on-Cash:      8.0%
Minimum IRR:               12.0%
Target Equity Multiple:    1.50x       (over 5 years)

Maximum LTV:               80.0%
Maximum LTC:               85.0%

┌─────────────────────────────────────────────────────────────────┐
│ 🏗️ CONSTRUCTION COST BENCHMARKS ($ per SF)                       │
└─────────────────────────────────────────────────────────────────┘

Light Rehab:               $15 - $30 per SF
Medium Rehab:              $30 - $60 per SF
Heavy Rehab / Gut:         $75 - $125 per SF

New Construction:
  Economy:                 $100 - $150 per SF
  Standard:                $150 - $200 per SF
  Premium:                 $200 - $300 per SF
  Luxury:                  $300+ per SF

┌─────────────────────────────────────────────────────────────────┐
│ 📊 TYPICAL EXPENSE RATIOS (% of Gross Income)                    │
└─────────────────────────────────────────────────────────────────┘

Single-Family:             25% - 35%
Small Multifamily (2-4):   35% - 40%
Large Multifamily (5+):    40% - 50%
Commercial (NNN):          5% - 15%    (tenant pays most expenses)
Commercial (Full Service): 40% - 60%

┌─────────────────────────────────────────────────────────────────┐
│ 🏦 LENDING PARAMETERS                                            │
└─────────────────────────────────────────────────────────────────┘

Conventional (30-yr):
  Max LTV:                 80%         (or 75% investment property)
  Interest Rate Range:     6.5% - 8.0%
  Min FICO:                680

FHA (30-yr):
  Max LTV:                 96.5%       (owner-occupied only)
  Interest Rate Range:     6.0% - 7.5%
  Min FICO:                580

Commercial (20-25yr):
  Max LTV:                 75%
  Interest Rate Range:     7.0% - 9.5%
  Min DSCR:                1.25

Hard Money / Bridge:
  Max LTV:                 70%
  Max LTC:                 85-90%
  Interest Rate Range:     10% - 14%
  Points:                  2 - 4 points
  Term:                    6 - 24 months

┌─────────────────────────────────────────────────────────────────┐
│ 🧮 STANDARD CALCULATIONS                                         │
└─────────────────────────────────────────────────────────────────┘

Residential Depreciation:  27.5 years  (straight-line)
Commercial Depreciation:   39 years    (straight-line)

CapEx Reserve (per unit):  $250 - $500 per unit per year
Maintenance Reserve:       5-10% of gross income

Typical Closing Costs:
  Buyer (cash):            2-5% of purchase price
  Buyer (financed):        3-6% of purchase price
  Seller:                  6-10% of sale price (includes brokerage)

═══════════════════════════════════════════════════════════════════
```

---

### TAB 4: CALCULATIONS

**Purpose:** All computational logic and formulas
**Cell Color:** Light Green (#E2EFDA) for formula cells
**Protection:** Locked (formulas hidden from end user)

**Layout:**

```
═══════════════════════════════════════════════════════════════════
                        CALCULATION ENGINE
                   (All formulas - DO NOT EDIT)
═══════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 1: ACQUISITION SUMMARY                                   │
└─────────────────────────────────────────────────────────────────┘

Cell: B5    Purchase Price
Formula:    =INPUTS!B10

Cell: B6    Land Value
Formula:    =INPUTS!B11

Cell: B7    Closing Costs
Formula:    =INPUTS!B12

Cell: B8    Rehab Budget
Formula:    =INPUTS!B20

Cell: B9    Contingency Reserve
Formula:    =B8 * INPUTS!B21

Cell: B10   Total Rehab Cost
Formula:    =B8 + B9

Cell: B11   Holding Costs (During Rehab)
Formula:    =INPUTS!B23

Cell: B12   Total Acquisition Cost
Formula:    =B5 + B7 + B10 + B11

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 2: FINANCING CALCULATIONS                                │
└─────────────────────────────────────────────────────────────────┘

Cell: B20   Loan Amount
Formula:    =IF(INPUTS!B50>0, INPUTS!B50, B5*INPUTS!B51)
// Uses direct input OR calculates from LTV

Cell: B21   Interest Rate (Annual)
Formula:    =INPUTS!B52

Cell: B22   Loan Term (Years)
Formula:    =INPUTS!B53

Cell: B23   Loan Term (Months)
Formula:    =B22 * 12

Cell: B24   Monthly Payment (P&I)
Formula:    =IFERROR(PMT(B21/12, B23, -B20), 0)

Cell: B25   Annual Debt Service
Formula:    =B24 * 12

Cell: B26   Loan Fees & Points
Formula:    =INPUTS!B55

Cell: B27   Down Payment
Formula:    =B5 - B20

Cell: B28   Total Cash Required
Formula:    =B27 + B7 + B26 + B10 + B11

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 3: OPERATING INCOME (YEAR 1)                             │
└─────────────────────────────────────────────────────────────────┘

Cell: B35   Gross Scheduled Income
Formula:    =INPUTS!B30

Cell: B36   Other Income
Formula:    =INPUTS!B32

Cell: B37   Total Gross Income
Formula:    =B35 + B36

Cell: B38   Vacancy Loss
Formula:    =B37 * INPUTS!B40

Cell: B39   Effective Gross Income
Formula:    =B37 - B38

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 4: OPERATING EXPENSES (YEAR 1)                           │
└─────────────────────────────────────────────────────────────────┘

Cell: B45   Property Tax
Formula:    =INPUTS!B45

Cell: B46   Insurance
Formula:    =INPUTS!B46

Cell: B47   HOA Fees
Formula:    =INPUTS!B47

Cell: B48   Utilities
Formula:    =INPUTS!B48

Cell: B49   Maintenance & Repairs
Formula:    =INPUTS!B49

Cell: B50   CapEx Reserve
Formula:    =INPUTS!B50

Cell: B51   Management Fee
Formula:    =B37 * INPUTS!B41

Cell: B52   Other Expenses
Formula:    =INPUTS!B51

Cell: B53   Total Operating Expenses
Formula:    =SUM(B45:B52)

Cell: B54   Operating Expense Ratio
Formula:    =IFERROR(B53/B39, 0)

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 5: NET OPERATING INCOME                                  │
└─────────────────────────────────────────────────────────────────┘

Cell: B60   Net Operating Income (NOI)
Formula:    =B39 - B53

Cell: B61   Annual Debt Service
Formula:    =B25

Cell: B62   Net Cash Flow (Before Tax)
Formula:    =B60 - B61

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 6: KEY METRICS                                           │
└─────────────────────────────────────────────────────────────────┘

Cell: B70   Cap Rate (Purchase)
Formula:    =IFERROR(B60/B5, 0)

Cell: B71   Cash-on-Cash Return
Formula:    =IFERROR(B62/B28, 0)

Cell: B72   DSCR
Formula:    =IFERROR(B60/B61, 0)

Cell: B73   LTV
Formula:    =IFERROR(B20/B5, 0)

Cell: B74   Break-Even Occupancy
Formula:    =IFERROR((B53+B61)/B37, 0)

Cell: B75   Gross Rent Multiplier (GRM)
Formula:    =IFERROR(B5/B35, 0)

Cell: B76   Price Per Square Foot
Formula:    =IFERROR(B5/INPUTS!B8, 0)

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 7: 10-YEAR PROJECTION                                    │
└─────────────────────────────────────────────────────────────────┘

// Create table with columns: Year, Gross Income, Vacancy, EGI, OpEx, NOI, Debt Service, Cash Flow

Year 1:
Gross Income:         =B37
EGI:                  =B39
OpEx:                 =B53
NOI:                  =B60
Debt Service:         =B61
Cash Flow:            =B62

Year 2:
Gross Income:         =Year1_GrossIncome * (1 + INPUTS!$B$34)
// Multiply by rent growth rate
EGI:                  =GrossIncome * (1 - INPUTS!$B$40)
OpEx:                 =Year1_OpEx * 1.03
// 3% expense inflation
NOI:                  =EGI - OpEx
Debt Service:         =Year1_DebtService
// Remains constant (fixed rate)
Cash Flow:            =NOI - DebtService

Year 3-10: Copy Year 2 formulas down

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 8: EXIT ANALYSIS                                         │
└─────────────────────────────────────────────────────────────────┘

Cell: B100  Year of Exit
Formula:    =INPUTS!B70

Cell: B101  NOI at Exit (Year 10)
Formula:    =INDEX(ProjectionTable_NOI, B100)
// Pull NOI from projection table

Cell: B102  Exit Cap Rate
Formula:    =INPUTS!B71

Cell: B103  Sale Price
Formula:    =B101 / B102

Cell: B104  Loan Balance at Exit
Formula:    =FV(B21/12, B100*12, -B24, B20)

Cell: B105  Selling Costs
Formula:    =B103 * INPUTS!B72

Cell: B106  Net Sale Proceeds (Before Tax)
Formula:    =B103 - B104 - B105

Cell: B107  Total Cash Returned
Formula:    =B106 + SUM(CashFlow_Year1:CashFlow_Year10)

Cell: B108  Equity Multiple
Formula:    =IFERROR(B107 / B28, 0)

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 9: IRR CALCULATION                                       │
└─────────────────────────────────────────────────────────────────┘

// Build cash flow array:
Year 0:     =-B28              (initial investment, negative)
Year 1-9:   =CashFlow from projection
Year 10:    =CashFlow + B106   (final year includes exit proceeds)

Cell: B120  Internal Rate of Return (IRR)
Formula:    =IRR(CashFlowArray, 0.10)

Cell: B121  Net Present Value (NPV)
Formula:    =NPV(INPUTS!B80, FutureCashFlows) + InitialInvestment

┌─────────────────────────────────────────────────────────────────┐
│ SECTION 10: TAX ANALYSIS (OPTIONAL)                              │
└─────────────────────────────────────────────────────────────────┘

Cell: B130  Depreciable Basis
Formula:    =B5 - B6

Cell: B131  Depreciation Method
Formula:    =INPUTS!B83

Cell: B132  Annual Depreciation (Year 1)
Formula:    =IF(B131="27.5yr", B130/27.5, IF(B131="39yr", B130/39, 0))

Cell: B133  Interest Portion (Year 1)
Formula:    =CUMIPMT(B21/12, B23, B20, 1, 12, 0) * -1

Cell: B134  Taxable Income
Formula:    =B60 - B133 - B132

Cell: B135  Tax Liability
Formula:    =B134 * INPUTS!B81

Cell: B136  After-Tax Cash Flow
Formula:    =B62 - B135

═══════════════════════════════════════════════════════════════════
```

---

### TAB 5: OUTPUTS

**Purpose:** Executive summary dashboard with key decision metrics
**Cell Color:** Light Yellow (#FFF2CC) for output cells
**Protection:** Locked

**Layout:**

```
╔═══════════════════════════════════════════════════════════════════╗
║                      INVESTMENT SUMMARY                            ║
║                       [Property Address]                           ║
╚═══════════════════════════════════════════════════════════════════╝

┌───────────────────────────────────────────────────────────────────┐
│ 💰 ACQUISITION OVERVIEW                                            │
└───────────────────────────────────────────────────────────────────┘

Purchase Price:                    $920,000        =CALC!B5
Rehab Budget:                      $75,000         =CALC!B10
Total All-In Cost:                 $1,008,500      =CALC!B12

Loan Amount:                       $700,000        =CALC!B20
Down Payment:                      $220,000        =CALC!B27
Total Cash Required:               $308,500        =CALC!B28

┌───────────────────────────────────────────────────────────────────┐
│ 📊 KEY PERFORMANCE METRICS (YEAR 1)                                │
└───────────────────────────────────────────────────────────────────┘

Gross Rental Income:               $72,000         =CALC!B35
Net Operating Income (NOI):        $48,000         =CALC!B60
Annual Debt Service:               $55,916         =CALC!B61
───────────────────────────────────────────────────────────────────
Net Cash Flow:                     ($7,916)        =CALC!B62


 ⚡ RETURN METRICS

Cap Rate:                          5.2%            =CALC!B70
Cash-on-Cash Return:               (2.6%)          =CALC!B71
DSCR:                              0.86            =CALC!B72
───────────────────────────────────────────────────────────────────

10-Year IRR:                       14.3%           =CALC!B120
Equity Multiple:                   1.89x           =CALC!B108
Total Profit:                      $274,539        =CALC!B107 - CALC!B28

┌───────────────────────────────────────────────────────────────────┐
│ 🏦 FINANCING SUMMARY                                               │
└───────────────────────────────────────────────────────────────────┘

Loan Type:                         Conventional    =INPUTS!B48
Interest Rate:                     7.00%           =CALC!B21
Loan Term:                         30 years        =CALC!B22
Monthly Payment:                   $4,660          =CALC!B24

LTV:                               76.1%           =CALC!B73
LTC:                               69.4%           =LoanAmount/AllInCost

┌───────────────────────────────────────────────────────────────────┐
│ 📈 EXIT ANALYSIS (Year 10)                                         │
└───────────────────────────────────────────────────────────────────┘

NOI at Exit:                       $62,571         =CALC!B101
Exit Cap Rate:                     6.50%           =INPUTS!B71
Projected Sale Price:              $962,631        =CALC!B103

Loan Balance:                      $579,519        =CALC!B104
Net Proceeds:                      $325,362        =CALC!B106

┌───────────────────────────────────────────────────────────────────┐
│ ✅ GO / NO-GO DECISION                                             │
└───────────────────────────────────────────────────────────────────┘

╔═══════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                         🟢  BUY  🟢                                ║
║                                                                    ║
║                    This deal meets investment criteria             ║
║                                                                    ║
╚═══════════════════════════════════════════════════════════════════╝

Formula:
=IF(AND(IRR>=MIN_IRR, DSCR>=MIN_DSCR, CoC>=MIN_COC), "🟢 BUY",
   IF(OR(IRR>=MIN_IRR*0.8, DSCR>=MIN_DSCR*0.9), "🟡 MAYBE", "🔴 PASS"))

Decision Criteria:

✅ IRR:              14.3%  ≥  12.0% (Minimum)    PASS
❌ DSCR:             0.86   ≥  1.25 (Minimum)     FAIL
❌ Cash-on-Cash:     -2.6%  ≥  8.0% (Minimum)     FAIL
✅ Equity Multiple:  1.89x  ≥  1.50x (Target)     PASS

NOTES:
• Negative Year 1 cash flow due to high debt load
• Strong long-term returns driven by appreciation and rent growth
• Consider: Lower leverage (larger down payment) to improve DSCR
• Consider: Interest-only loan structure for first 5 years

┌───────────────────────────────────────────────────────────────────┐
│ 📊 SENSITIVITY ANALYSIS                                            │
└───────────────────────────────────────────────────────────────────┘

Impact on IRR:

Purchase Price ±10%:       10.8% to 18.2%
Rent ±10%:                 11.5% to 17.1%
Exit Cap Rate ±50bps:      12.9% to 15.9%
Vacancy ±2%:               13.7% to 14.9%

Most Sensitive Variable:   Purchase Price

═══════════════════════════════════════════════════════════════════
```

---

### TAB 6: CHARTS

**Purpose:** Visual analysis and graphical representations
**Protection:** Locked

**Required Charts:**

1. **Cash Flow Waterfall (Year 1)**
   - Type: Waterfall chart
   - X-axis: Gross Income → Vacancy → OpEx → NOI → Debt Service → Net Cash Flow
   - Shows progression of income to cash flow

2. **10-Year Cash Flow Projection**
   - Type: Column chart
   - X-axis: Years 1-10
   - Y-axis: Annual cash flow ($)
   - Year 10 includes exit proceeds

3. **Sensitivity Tornado Chart**
   - Type: Horizontal bar chart
   - Shows impact of ±10% change in key variables on IRR
   - Variables: Purchase price, Rent, Exit cap, Vacancy, OpEx

4. **Scenario Comparison**
   - Type: Grouped column chart
   - Scenarios: Best Case, Base Case, Worst Case
   - Metrics: IRR, CoC, Equity Multiple

5. **NOI Build-Up (Pie Chart)**
   - Shows expense breakdown as % of gross income
   - Slices: Property Tax, Insurance, Maintenance, Management, Other, NOI

---

### TAB 7: SUPPORTING

**Purpose:** Detailed schedules and amortization tables

**Contents:**

1. **Amortization Schedule**
```
Month | Beginning Balance | Payment | Interest | Principal | Ending Balance
  1   |    $700,000      | $4,660  | $4,083   |   $577    |   $699,423
  2   |    $699,423      | $4,660  | $4,080   |   $580    |   $698,843
  3   |    $698,843      | $4,660  | $4,077   |   $583    |   $698,260
 ...  |       ...        |   ...   |   ...    |    ...    |      ...
 360  |     $4,627       | $4,660  |   $27    | $4,633    |       $0
```

Formulas:
- Beginning Balance: =PreviousMonth_EndingBalance
- Payment: =$B$24 (fixed)
- Interest: =BeginningBalance * ($B$21/12)
- Principal: =Payment - Interest
- Ending Balance: =BeginningBalance - Principal

2. **Depreciation Schedule**
```
Year | Depreciable Basis | Annual Depreciation | Cumulative | Remaining Basis
  1  |    $750,000       |     $27,273         |  $27,273   |   $722,727
  2  |    $750,000       |     $27,273         |  $54,545   |   $695,455
 ...
```

3. **Rent Roll (if multifamily)**
```
Unit | SF  | Rent | Lease Start | Lease End | Annual Rent
 101 | 850 |$1,500| 1/1/2025    | 12/31/2025|   $18,000
 102 | 850 |$1,500| 3/1/2025    | 2/28/2026 |   $18,000
```

4. **Operating Expense Detail**
```
Expense Category    | Monthly | Annual | % of Income | $/Unit | $/SF
Property Tax        |  $625   | $7,500 |   10.4%     | $938   | $3.00
Insurance           |  $208   | $2,500 |    3.5%     | $313   | $1.00
Maintenance         |  $417   | $5,000 |    6.9%     | $625   | $2.00
...
```

5. **CapEx Reserve Schedule**
```
Item              | Expected Life | Replacement Cost | Annual Reserve
Roof              |   25 years    |    $25,000       |   $1,000
HVAC              |   15 years    |    $15,000       |   $1,000
Appliances        |   10 years    |    $5,000        |   $500
...
```

---

### TAB 8: DATA

**Purpose:** Reference tables, lookups, validation lists

**Contents:**

1. **Property Type List** (for data validation)
```
Single-Family
Multifamily
Commercial - Office
Commercial - Retail
Commercial - Industrial
Mixed-Use
Land
Short-Term Rental
```

2. **Loan Type List**
```
Conventional 30-year
FHA 30-year
VA 30-year
Commercial 20-year
Commercial 25-year
Hard Money / Bridge
DSCR Loan
Portfolio Loan
```

3. **Market Data Table** (for lookups)
```
MSA               | Median Rent | Cap Rate | Vacancy | Rent Growth
Austin, TX        |   $1,800    |  5.5%    |  4.0%   |   3.5%
Dallas, TX        |   $1,600    |  6.0%    |  5.0%   |   3.0%
Houston, TX       |   $1,500    |  6.5%    |  6.0%   |   2.5%
...
```

4. **Expense Ratios by Type**
```
Property Type           | Low  | Median | High
Single-Family           | 25%  |  30%   |  35%
Multifamily (2-4 units) | 35%  |  38%   |  40%
Multifamily (5+ units)  | 40%  |  45%   |  50%
Commercial NNN          |  5%  |  10%   |  15%
```

---

### TAB 9: CHANGELOG

**Purpose:** Version control and modification tracking

**Layout:**

```
═══════════════════════════════════════════════════════════════════
                           VERSION HISTORY
═══════════════════════════════════════════════════════════════════

┌─────────┬────────────┬──────────────┬─────────────────────┬─────────┐
│ Version │    Date    │    Author    │       Changes       │ Reason  │
├─────────┼────────────┼──────────────┼─────────────────────┼─────────┤
│  1.0    │ 12/11/2025 │ Systems Arch │ Initial release     │ New     │
│         │            │              │                     │ model   │
│         │            │              │                     │         │
│  1.1    │ [Future]   │              │ Added tax calc      │ User    │
│         │            │              │                     │ request │
│         │            │              │                     │         │
└─────────┴────────────┴──────────────┴─────────────────────┴─────────┘

═══════════════════════════════════════════════════════════════════

KNOWN ISSUES:
• None at this time

FUTURE ENHANCEMENTS PLANNED:
• Multi-scenario analysis (Best/Base/Worst)
• Monte Carlo simulation for risk analysis
• Partnership waterfall calculator
• Cost segregation detail tab

═══════════════════════════════════════════════════════════════════
```

---

## 🎨 FORMATTING CHECKLIST

Before finalizing model:

- [ ] All input cells are light blue (#D9E1F2)
- [ ] All calculation cells are light green (#E2EFDA)
- [ ] All output cells are light yellow (#FFF2CC)
- [ ] Headers use gray background (#D9D9D9)
- [ ] Font is Calibri 10pt (body) and 12pt (headers)
- [ ] Currency formatted as Accounting with $ and ()
- [ ] Percentages show 2 decimals
- [ ] All formulas have IFERROR wrappers
- [ ] Data validation on all input cells
- [ ] Only input cells unlocked
- [ ] Worksheet protection enabled
- [ ] Charts update automatically with inputs
- [ ] Print areas defined
- [ ] Page breaks appropriate
- [ ] Headers/footers configured

---

## 🔧 FINAL STEPS

1. **Test Thoroughly**
   - Enter zeros → should not error
   - Enter extreme values → should not break
   - Test multiple scenarios → verify calculations
   - Check all charts update → verify links

2. **Peer Review**
   - Have another modeler review formulas
   - Verify calculations against manual calcs
   - Check for hardcoded values
   - Ensure compliance with APEX standards

3. **Documentation**
   - Complete COVER tab instructions
   - Fill out CHANGELOG
   - Add any model-specific notes
   - Include contact information

4. **Protection**
   - Lock all tabs except INPUTS
   - Hide formulas in CALCULATIONS tab
   - Enable worksheet protection (optional password)
   - Save master template

5. **Deployment**
   - Save to appropriate File Room directory
   - Update FILE-ROOM-INDEX.md
   - Notify team of new template availability
   - Provide training if needed

---

## 📞 SUPPORT

Template questions or customization requests:
Contact: Excel Systems Architect
Reference: APEX Modeling Standards v1.0
Location: `/file-room/10-REFERENCE-DOCS/Standards/`

---

**END OF TEMPLATE BLUEPRINT**

*Use this document as your complete guide for building Excel financial models that meet APEX OPS CENTER standards.*

**Version:** 1.0
**Last Updated:** 2025-12-11
**Next Review:** Upon user feedback or methodology change
