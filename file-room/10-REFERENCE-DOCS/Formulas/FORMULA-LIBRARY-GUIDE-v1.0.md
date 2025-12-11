# 📐 APEX OPS CENTER FORMULA LIBRARY
## Complete Excel Formula Reference for Real Estate Financial Modeling

**Version:** 1.0
**Last Updated:** 2025-12-11
**Classification:** Internal Reference
**Maintained By:** Excel Systems Architect

---

## 🎯 PURPOSE

This library contains every formula you'll need to build world-class real estate financial models. Each formula includes:
- ✅ Excel syntax (copy-paste ready)
- ✅ Plain English explanation
- ✅ Example with real numbers
- ✅ Common variations
- ✅ Error handling
- ✅ Pro tips

---

## 📚 TABLE OF CONTENTS

1. [Real Estate Fundamentals](#real-estate-fundamentals)
2. [Return Metrics](#return-metrics)
3. [Loan Calculations](#loan-calculations)
4. [Depreciation & Tax](#depreciation--tax)
5. [Cash Flow Projections](#cash-flow-projections)
6. [Investment Analysis](#investment-analysis)
7. [Construction & Budgeting](#construction--budgeting)
8. [Lookup & Reference](#lookup--reference)
9. [Date & Time](#date--time)
10. [Logical & Conditional](#logical--conditional)
11. [Statistical & Analysis](#statistical--analysis)
12. [Advanced Techniques](#advanced-techniques)

---

## 1. REAL ESTATE FUNDAMENTALS

### Net Operating Income (NOI)

**Formula:**
```excel
=GrossRent - VacancyLoss - OperatingExpenses
```

**Detailed Version:**
```excel
=GrossScheduledIncome * (1 - VacancyRate) - OperatingExpenses
```

**Example:**
```excel
=100000 * (1 - 0.05) - 35000
// Result: 95,000 - 35,000 = $60,000 NOI
```

**With Error Handling:**
```excel
=IFERROR(GrossRent*(1-VacancyRate)-OpEx, 0)
```

---

### Capitalization Rate (Cap Rate)

**Formula:**
```excel
=NOI / PropertyValue
```

**Example:**
```excel
=60000 / 920000
// Result: 6.52%
```

**Reverse (Value from NOI & Cap):**
```excel
=NOI / CapRate
// Example: =60000 / 0.065 = $923,077
```

**With Error Handling:**
```excel
=IFERROR(NOI/PropertyValue, "N/A")
```

---

### Cash-on-Cash Return (CoC)

**Formula:**
```excel
=(NOI - AnnualDebtService) / TotalCashInvested
```

**Example:**
```excel
=(60000 - 42000) / 150000
// Result: 12% Cash-on-Cash
```

**Pre-Tax vs After-Tax:**
```excel
// Pre-tax CoC
=(NOI - DebtService) / CashInvested

// After-tax CoC
=((NOI - DebtService) * (1 - TaxRate)) / CashInvested
```

---

### Debt Service Coverage Ratio (DSCR)

**Formula:**
```excel
=NOI / AnnualDebtService
```

**Example:**
```excel
=60000 / 42000
// Result: 1.43 DSCR
```

**Minimum DSCR Check:**
```excel
=IF(NOI/DebtService >= 1.25, "Approved", "Denied")
```

**With Error Handling:**
```excel
=IFERROR(NOI/AnnualDebtService, "No Debt")
```

---

### Loan-to-Value (LTV)

**Formula:**
```excel
=LoanAmount / PropertyValue
```

**Example:**
```excel
=700000 / 1000000
// Result: 70% LTV
```

**Maximum Down Payment:**
```excel
=PropertyValue * (1 - MaxLTV)
// Example: =1000000 * (1-0.80) = $200,000 down payment
```

---

### Loan-to-Cost (LTC)

**Formula:**
```excel
=LoanAmount / TotalProjectCost
```

**Total Project Cost:**
```excel
=PurchasePrice + RehabCost + ClosingCosts + HoldingCosts
```

**Example:**
```excel
=600000 / (500000 + 150000 + 20000 + 10000)
// Result: 600000/680000 = 88.24% LTC
```

---

### Gross Rent Multiplier (GRM)

**Formula:**
```excel
=PropertyValue / GrossAnnualRent
```

**Example:**
```excel
=920000 / 100000
// Result: 9.2 GRM
```

**Reverse (Value from GRM):**
```excel
=GrossAnnualRent * MarketGRM
```

---

### Price Per Square Foot

**Formula:**
```excel
=PropertyValue / SquareFootage
```

**Example:**
```excel
=920000 / 2500
// Result: $368 per SF
```

**Commercial Rent PSF (Annual):**
```excel
=AnnualRent / SquareFootage
```

**Commercial Rent PSF (Monthly):**
```excel
=(MonthlyRent * 12) / SquareFootage
```

---

### Price Per Unit (Multifamily)

**Formula:**
```excel
=PropertyValue / NumberOfUnits
```

**Example:**
```excel
=5000000 / 20
// Result: $250,000 per unit
```

---

### Break-Even Occupancy

**Formula:**
```excel
=(OperatingExpenses + DebtService) / GrossScheduledIncome
```

**Example:**
```excel
=(35000 + 42000) / 100000
// Result: 77% break-even occupancy
```

---

## 2. RETURN METRICS

### Internal Rate of Return (IRR)

**Formula:**
```excel
=IRR(CashFlows)
```

**Example:**
```excel
=IRR({-150000, 18000, 18000, 18000, 18000, 218000})
// Result: 15.2% IRR
```

**With Date-Specific Timing (Preferred):**
```excel
=XIRR(CashFlows, Dates)
```

**Example:**
```excel
=XIRR({-150000,18000,18000,18000,18000,218000},
      {1/1/2025,12/31/2025,12/31/2026,12/31/2027,12/31/2028,12/31/2029})
```

**IRR with Range Reference:**
```excel
=IRR(B10:B20, 0.1)
// 0.1 = 10% guess (optional, helps calculation)
```

---

### Net Present Value (NPV)

**Formula:**
```excel
=NPV(DiscountRate, FutureCashFlows) + InitialInvestment
```

**Example:**
```excel
=NPV(0.10, B11:B15) + B10
// Where B10 = -150000 (initial), B11:B15 = future cash flows
// Result: $18,234 (positive = good investment at 10% discount rate)
```

**With Date-Specific Timing:**
```excel
=XNPV(DiscountRate, CashFlows, Dates)
```

---

### Equity Multiple

**Formula:**
```excel
=TotalCashReturned / TotalCashInvested
```

**Example:**
```excel
=(18000+18000+18000+18000+218000) / 150000
// Result: 1.90x equity multiple
```

**From Cash Flows:**
```excel
=SUM(PositiveCashFlows) / ABS(InitialInvestment)
```

---

### Average Annual Return

**Formula:**
```excel
=((1 + TotalReturn)^(1/Years)) - 1
```

**Example:**
```excel
=((1 + 0.90)^(1/5)) - 1
// Result: 13.7% average annual return (90% total return over 5 years)
```

**From Equity Multiple:**
```excel
=(EquityMultiple^(1/HoldPeriod)) - 1
```

---

### Return on Investment (ROI)

**Formula:**
```excel
=(FinalValue - InitialInvestment) / InitialInvestment
```

**Example:**
```excel
=(285000 - 150000) / 150000
// Result: 90% total ROI
```

---

### Return on Equity (ROE)

**Formula:**
```excel
=NetIncome / EquityInvested
```

**After Refinance:**
```excel
=AnnualCashFlow / RemainingEquity
```

---

## 3. LOAN CALCULATIONS

### Monthly Payment (Principal + Interest)

**Formula:**
```excel
=PMT(MonthlyRate, Months, -LoanAmount)
```

**Example:**
```excel
=PMT(0.07/12, 360, -700000)
// Result: $4,657.07 per month (7% rate, 30 years, $700K loan)
```

**Annual Payment:**
```excel
=PMT(AnnualRate, Years, -LoanAmount)
```

---

### Loan Payment Breakdown

**Interest Payment (First Month):**
```excel
=IPMT(MonthlyRate, Period, TotalPeriods, -LoanAmount)
```

**Example:**
```excel
=IPMT(0.07/12, 1, 360, -700000)
// Result: $4,083.33 interest in month 1
```

**Principal Payment (First Month):**
```excel
=PPMT(MonthlyRate, Period, TotalPeriods, -LoanAmount)
```

**Example:**
```excel
=PPMT(0.07/12, 1, 360, -700000)
// Result: $573.74 principal in month 1
```

---

### Loan Balance After N Payments

**Formula:**
```excel
=FV(MonthlyRate, PaymentsMade, MonthlyPayment, -LoanAmount)
```

**Example:**
```excel
=FV(0.07/12, 60, -4657.07, 700000)
// Result: $657,892 balance after 5 years (60 payments)
```

**Using Cumulative Principal:**
```excel
=LoanAmount + CUMPRINC(Rate, Periods, LoanAmount, StartPeriod, EndPeriod, 0)
```

---

### Total Interest Paid

**Total Interest Over Life of Loan:**
```excel
=(MonthlyPayment * TotalMonths) - LoanAmount
```

**Example:**
```excel
=(4657.07 * 360) - 700000
// Result: $976,546 total interest paid
```

**Interest Paid in Specific Period:**
```excel
=CUMIPMT(Rate, Periods, LoanAmount, StartPeriod, EndPeriod, 0)
```

**Example (Interest Paid in Year 1):**
```excel
=CUMIPMT(0.07/12, 360, 700000, 1, 12, 0)
// Result: -$48,797 interest in year 1
```

---

### Maximum Loan Amount (from Payment)

**Formula:**
```excel
=PV(Rate, Periods, -Payment)
```

**Example:**
```excel
=PV(0.07/12, 360, -4000)
// Result: $600,766 (maximum loan if payment is $4,000/month)
```

---

### Interest-Only Payment

**Formula:**
```excel
=LoanAmount * AnnualRate / 12
```

**Example:**
```excel
=700000 * 0.07 / 12
// Result: $4,083.33 per month (interest only)
```

---

### Adjustable Rate Mortgage (ARM) Payment

**Initial Payment (Intro Rate):**
```excel
=PMT(IntroRate/12, 360, -LoanAmount)
```

**Adjusted Payment (After Rate Change):**
```excel
=PMT(NewRate/12, RemainingMonths, -RemainingBalance)
```

---

### Loan Origination Fees & Points

**Total Loan Costs:**
```excel
=LoanAmount * OriginationPercent + Points
```

**Example:**
```excel
=700000 * 0.01 + (700000 * 0.02)
// Result: $7,000 (1% origination) + $14,000 (2 points) = $21,000
```

**Effective Interest Rate (APR):**
```excel
=RATE(Periods, -Payment, LoanAmount-Fees) * 12
```

---

### Hard Money Loan Calculations

**Monthly Interest (Interest-Only):**
```excel
=LoanAmount * AnnualRate / 12
```

**Points Fee:**
```excel
=LoanAmount * (Points / 100)
```

**Total Loan Cost (1 Year):**
```excel
=(LoanAmount * Rate * HoldTime) + (LoanAmount * Points/100)
```

**Example:**
```excel
=(600000 * 0.12 * 1) + (600000 * 0.03)
// Result: $72,000 interest + $18,000 points = $90,000 total
```

---

## 4. DEPRECIATION & TAX

### Straight-Line Depreciation (Residential)

**Formula:**
```excel
=DepreciableBasis / 27.5
```

**Example:**
```excel
=750000 / 27.5
// Result: $27,273 annual depreciation
```

**Depreciable Basis:**
```excel
=PropertyValue - LandValue
// Land is not depreciable
```

---

### Straight-Line Depreciation (Commercial)

**Formula:**
```excel
=DepreciableBasis / 39
```

**Example:**
```excel
=2000000 / 39
// Result: $51,282 annual depreciation
```

---

### Bonus Depreciation (100%)

**Formula:**
```excel
=PersonalProperty * BonusDepreciationRate
```

**Example:**
```excel
=150000 * 1.00
// Result: $150,000 depreciation in Year 1 (100% bonus depreciation)
```

**Typical Bonus Depreciation Assets:**
- Appliances
- Flooring (carpet, vinyl)
- Landscaping
- Site utilities
- Driveway/parking lot

---

### Cost Segregation Depreciation

**Component Depreciation Schedule:**
```excel
// 5-year property (appliances, carpet)
=ComponentValue / 5

// 7-year property (furniture, fixtures)
=ComponentValue / 7

// 15-year property (land improvements, landscaping)
=ComponentValue / 15

// 27.5-year property (building structure, residential)
=ComponentValue / 27.5

// 39-year property (building structure, commercial)
=ComponentValue / 39
```

---

### Section 179 Deduction

**Formula:**
```excel
=MIN(QualifyingProperty, Section179Limit)
```

**2025 Limit:**
```excel
=MIN(300000, 1220000)
// $1.22M limit for 2025 (check current year limit)
```

---

### Depreciation Recapture (Sale)

**Total Depreciation Taken:**
```excel
=SUM(AnnualDepreciation)
```

**Recapture Amount:**
```excel
=MIN(TotalDepreciation, Gain)
```

**Recapture Tax:**
```excel
=RecaptureAmount * 0.25
// 25% max recapture rate
```

---

### After-Tax Cash Flow

**Formula:**
```excel
=PreTaxCashFlow - TaxLiability
```

**Tax Liability:**
```excel
=(NOI - Interest - Depreciation) * TaxRate
```

**Complete Formula:**
```excel
=(NOI - DebtService) - ((NOI - Interest - Depreciation) * TaxRate)
```

---

### Effective Tax Rate

**Formula:**
```excel
=TaxesPaid / TaxableIncome
```

---

### Tax Savings from Depreciation

**Formula:**
```excel
=Depreciation * MarginalTaxRate
```

**Example:**
```excel
=27273 * 0.37
// Result: $10,091 tax savings (37% bracket)
```

---

## 5. CASH FLOW PROJECTIONS

### Gross Scheduled Income

**Formula:**
```excel
=MonthlyRent * 12 * Units
```

**Example:**
```excel
=1500 * 12 * 8
// Result: $144,000 annual GSI (8 units at $1,500/mo)
```

**With Rent Growth:**
```excel
=BaseRent * (1 + RentGrowth)^Year
```

---

### Effective Gross Income

**Formula:**
```excel
=GrossScheduledIncome * (1 - VacancyRate) + OtherIncome
```

**Example:**
```excel
=144000 * (1 - 0.05) + 5000
// Result: $141,800 EGI (5% vacancy, $5K other income)
```

---

### Operating Expense Ratio

**Formula:**
```excel
=OperatingExpenses / EffectiveGrossIncome
```

**Example:**
```excel
=52000 / 141800
// Result: 36.7% expense ratio
```

---

### Net Cash Flow (After Debt Service)

**Formula:**
```excel
=NOI - AnnualDebtService
```

**Example:**
```excel
=89800 - 64000
// Result: $25,800 annual cash flow
```

---

### Cash Flow Growth Projection

**Formula:**
```excel
=Year1CashFlow * (1 + GrowthRate)^(Year - 1)
```

**Example (Year 5):**
```excel
=25800 * (1 + 0.03)^4
// Result: $29,030 in Year 5 (3% annual growth)
```

---

### Present Value of Cash Flows

**Formula:**
```excel
=CashFlow / (1 + DiscountRate)^Year
```

**Example (Year 5 CF discounted to present):**
```excel
=29030 / (1 + 0.10)^5
// Result: $18,020 present value
```

---

### Exit Proceeds (Sale)

**Formula:**
```excel
=SalePrice - LoanBalance - SellingCosts - TaxLiability
```

**Sale Price (from Exit Cap Rate):**
```excel
=Year10NOI / ExitCapRate
```

**Complete Example:**
```excel
// Sale price
=(89800 * 1.03^10) / 0.065
= $1,840,985

// Loan balance after 10 years
=FV(0.07/12, 120, -4657, 700000)
= $597,035

// Selling costs (6%)
=1840985 * 0.06
= $110,459

// Exit proceeds (ignoring taxes)
=1840985 - 597035 - 110459
= $1,133,491
```

---

## 6. INVESTMENT ANALYSIS

### Total Return (All Cash)

**Formula:**
```excel
=((SalePrice - PurchasePrice) + TotalCashFlow) / PurchasePrice
```

---

### Leveraged Return

**Formula:**
```excel
=((SalePrice - LoanBalance - SellingCosts) + TotalCashFlow) / TotalCashInvested
```

---

### Infinite Return (After Cash-Out Refi)

**Formula:**
```excel
=AnnualCashFlow / RemainingEquity
```

**After Full Cash-Out:**
```excel
=AnnualCashFlow / 0
// = Infinite (all capital recovered, still generating income)
```

---

### Value-Add Return Calculation

**Forced Appreciation:**
```excel
=(ImprovedNOI / ExitCap) - (OriginalNOI / EntryCap)
```

**Example:**
```excel
=(95000 / 0.065) - (60000 / 0.070)
= $1,461,538 - $857,143
= $604,395 forced appreciation
```

---

### Deal Profitability Score

**Weighted Score Formula:**
```excel
=(IRR_Weight * IRR) + (CoC_Weight * CoC) + (EquityMultiple_Weight * EquityMultiple)
```

**Example:**
```excel
=(0.40 * 0.15) + (0.30 * 0.12) + (0.30 * 1.80)
= 0.06 + 0.036 + 0.54
= 0.636 or 63.6% deal score
```

---

## 7. CONSTRUCTION & BUDGETING

### Cost Per Square Foot (Rehab)

**Formula:**
```excel
=TotalRehabCost / SquareFootage
```

**Example:**
```excel
=75000 / 2500
// Result: $30 per SF rehab cost
```

---

### Cost Per Square Foot (New Construction)

**Formula:**
```excel
=TotalConstructionCost / SquareFootage
```

**Typical Ranges:**
- Low-end: $100-150/SF
- Mid-range: $150-200/SF
- High-end: $200-300/SF
- Luxury: $300-500+/SF

---

### Contingency Reserve

**Formula:**
```excel
=EstimatedCosts * ContingencyPercent
```

**Example:**
```excel
=250000 * 0.15
// Result: $37,500 contingency (15%)
```

**Total Budget:**
```excel
=HardCosts + SoftCosts + Contingency
```

---

### Draw Schedule Calculation

**Draw Amount:**
```excel
=PercentComplete * TotalLoan
```

**Example (60% complete):**
```excel
=0.60 * 500000
// Result: $300,000 available (60% of $500K construction loan)
```

---

### Cost Escalation Over Time

**Formula:**
```excel
=BaseCost * (1 + InflationRate)^Years
```

**Example:**
```excel
=200000 * (1 + 0.05)^2
// Result: $220,500 (5% annual cost inflation over 2 years)
```

---

## 8. LOOKUP & REFERENCE

### XLOOKUP (Modern Excel 365)

**Formula:**
```excel
=XLOOKUP(LookupValue, LookupArray, ReturnArray, [IfNotFound], [MatchMode], [SearchMode])
```

**Example:**
```excel
=XLOOKUP(B2, PropertyList, RentList, "Not Found")
```

**Advantages Over VLOOKUP:**
- Can look left
- Returns array of values
- Cleaner syntax
- Better error handling

---

### INDEX + MATCH (Universal)

**Formula:**
```excel
=INDEX(ReturnRange, MATCH(LookupValue, LookupRange, 0))
```

**Example:**
```excel
=INDEX(C2:C100, MATCH(F2, A2:A100, 0))
// Finds F2 in column A, returns corresponding value from column C
```

**Two-Way Lookup (Row & Column):**
```excel
=INDEX(DataRange, MATCH(RowValue, RowHeaders, 0), MATCH(ColValue, ColHeaders, 0))
```

---

### VLOOKUP (Legacy)

**Formula:**
```excel
=VLOOKUP(LookupValue, TableArray, ColumnIndex, [RangeLookup])
```

**Example:**
```excel
=VLOOKUP(B2, A2:D100, 3, FALSE)
// Finds B2 in first column of range, returns value from 3rd column
```

---

### SUMIF & SUMIFS

**SUMIF (Single Condition):**
```excel
=SUMIF(Range, Criteria, SumRange)
```

**Example:**
```excel
=SUMIF(A2:A100, "Multifamily", C2:C100)
// Sums C column where A column = "Multifamily"
```

**SUMIFS (Multiple Conditions):**
```excel
=SUMIFS(SumRange, Criteria1Range, Criteria1, Criteria2Range, Criteria2)
```

**Example:**
```excel
=SUMIFS(D2:D100, A2:A100, "Multifamily", B2:B100, "Texas")
// Sums D where property type is Multifamily AND state is Texas
```

---

### COUNTIF & COUNTIFS

**COUNTIF:**
```excel
=COUNTIF(Range, Criteria)
```

**Example:**
```excel
=COUNTIF(A2:A100, "Single-Family")
// Counts how many cells contain "Single-Family"
```

**COUNTIFS:**
```excel
=COUNTIFS(Range1, Criteria1, Range2, Criteria2)
```

---

### AVERAGEIF & AVERAGEIFS

**AVERAGEIF:**
```excel
=AVERAGEIF(Range, Criteria, AverageRange)
```

**Example:**
```excel
=AVERAGEIF(A2:A100, "Commercial", E2:E100)
// Average cap rate for commercial properties
```

---

## 9. DATE & TIME

### Calculate Months Between Dates

**Formula:**
```excel
=DATEDIF(StartDate, EndDate, "M")
```

**Example:**
```excel
=DATEDIF("1/1/2025", "12/31/2030", "M")
// Result: 71 months
```

---

### Add Months to Date

**Formula:**
```excel
=EDATE(StartDate, Months)
```

**Example:**
```excel
=EDATE("1/1/2025", 6)
// Result: 7/1/2025
```

---

### End of Month

**Formula:**
```excel
=EOMONTH(StartDate, Months)
```

**Example:**
```excel
=EOMONTH("1/15/2025", 0)
// Result: 1/31/2025
```

---

### Calculate Days Between Dates

**Formula:**
```excel
=EndDate - StartDate
```

**Example:**
```excel
=DATE(2025,12,31) - DATE(2025,1,1)
// Result: 364 days
```

---

### Year Fraction (for Interest Calculations)

**Formula:**
```excel
=YEARFRAC(StartDate, EndDate, [Basis])
```

**Example:**
```excel
=YEARFRAC("1/1/2025", "7/1/2025")
// Result: 0.497 (approximately half a year)
```

---

## 10. LOGICAL & CONDITIONAL

### IF Statement

**Formula:**
```excel
=IF(LogicalTest, ValueIfTrue, ValueIfFalse)
```

**Example:**
```excel
=IF(DSCR >= 1.25, "Approved", "Denied")
```

---

### Nested IF

**Formula:**
```excel
=IF(Test1, Value1, IF(Test2, Value2, IF(Test3, Value3, DefaultValue)))
```

**Example:**
```excel
=IF(IRR >= 0.20, "Excellent", IF(IRR >= 0.15, "Good", IF(IRR >= 0.10, "Acceptable", "Pass")))
```

---

### IFS (Modern Excel)

**Formula:**
```excel
=IFS(Test1, Value1, Test2, Value2, Test3, Value3, TRUE, DefaultValue)
```

**Example:**
```excel
=IFS(IRR>=0.20, "Excellent", IRR>=0.15, "Good", IRR>=0.10, "Acceptable", TRUE, "Pass")
```

---

### AND

**Formula:**
```excel
=AND(Condition1, Condition2, Condition3, ...)
```

**Example:**
```excel
=AND(DSCR>=1.25, LTV<=0.80, CoC>=0.10)
// Returns TRUE only if all three conditions are met
```

---

### OR

**Formula:**
```excel
=OR(Condition1, Condition2, Condition3, ...)
```

**Example:**
```excel
=OR(PropertyType="Multifamily", PropertyType="Commercial")
// Returns TRUE if either condition is met
```

---

### Combined Logic

**Formula:**
```excel
=IF(AND(Condition1, Condition2), "Yes", IF(OR(Condition3, Condition4), "Maybe", "No"))
```

---

## 11. STATISTICAL & ANALYSIS

### AVERAGE

**Formula:**
```excel
=AVERAGE(Range)
```

**Excluding Zeros:**
```excel
=AVERAGEIF(Range, ">0")
```

---

### MEDIAN

**Formula:**
```excel
=MEDIAN(Range)
```

---

### MODE (Most Frequent)

**Formula:**
```excel
=MODE.SNGL(Range)
```

---

### PERCENTILE

**Formula:**
```excel
=PERCENTILE.INC(Range, Percentile)
```

**Example:**
```excel
=PERCENTILE.INC(CapRates, 0.25)
// 25th percentile (Q1) of cap rates
```

---

### QUARTILE

**Formula:**
```excel
=QUARTILE.INC(Range, Quart)
// Quart: 0=Min, 1=Q1, 2=Median, 3=Q3, 4=Max
```

---

### Standard Deviation

**Sample:**
```excel
=STDEV.S(Range)
```

**Population:**
```excel
=STDEV.P(Range)
```

---

### Variance

**Formula:**
```excel
=VAR.S(Range)
```

---

### Correlation

**Formula:**
```excel
=CORREL(Array1, Array2)
```

---

### MIN & MAX

**Minimum:**
```excel
=MIN(Range)
```

**Maximum:**
```excel
=MAX(Range)
```

**Excluding Zeros (Minimum):**
```excel
=MINIFS(Range, Range, ">0")
```

---

### RANK

**Formula:**
```excel
=RANK.EQ(Value, Range, [Order])
// Order: 0=Descending (default), 1=Ascending
```

---

## 12. ADVANCED TECHNIQUES

### LET Function (Excel 365)

**Formula:**
```excel
=LET(
    Name1, Value1,
    Name2, Value2,
    Calculation
)
```

**Example:**
```excel
=LET(
    NOI, GrossRent * (1 - Vacancy) - OpEx,
    DebtService, PMT(Rate/12, Months, -Loan) * 12,
    CashFlow, NOI - DebtService,
    CashFlow / Investment
)
```

---

### LAMBDA Function (Custom Functions)

**Formula:**
```excel
=LAMBDA(Parameter1, Parameter2, Formula)
```

**Example (Custom CoC Function):**
```excel
=LAMBDA(NOI, Debt, Equity, (NOI - Debt) / Equity)
```

**Use Named Lambda:**
1. Name it "CashOnCash" in Name Manager
2. Use like: `=CashOnCash(60000, 42000, 150000)`

---

### FILTER Function (Excel 365)

**Formula:**
```excel
=FILTER(Array, IncludeCondition, [IfEmpty])
```

**Example:**
```excel
=FILTER(PropertyList, StateColumn="Texas", "No properties found")
// Returns all properties in Texas
```

---

### SORT Function

**Formula:**
```excel
=SORT(Array, [SortIndex], [SortOrder], [ByColumn])
```

**Example:**
```excel
=SORT(A2:E100, 5, -1)
// Sorts by 5th column, descending
```

---

### UNIQUE Function

**Formula:**
```excel
=UNIQUE(Array, [ByColumn], [ExactlyOnce])
```

**Example:**
```excel
=UNIQUE(A2:A100)
// Returns unique list of values from A2:A100
```

---

### Array Formulas (Legacy)

**Dynamic Array (365):**
```excel
=A1:A10 * 2
// Automatically spills to multiple cells
```

**Legacy Array (Ctrl+Shift+Enter):**
```excel
{=A1:A10 * 2}
```

---

### SUMPRODUCT

**Formula:**
```excel
=SUMPRODUCT(Array1, Array2, Array3, ...)
```

**Example (Weighted Average):**
```excel
=SUMPRODUCT(Values, Weights) / SUM(Weights)
```

**Conditional Sum:**
```excel
=SUMPRODUCT((TypeRange="Multifamily") * (ValueRange))
```

---

### Data Tables (Sensitivity Analysis)

**One-Variable Data Table:**
1. Set up column of input values
2. Reference formula in top-right
3. Select range → Data → What-If Analysis → Data Table
4. Column input cell: Link to variable

**Two-Variable Data Table:**
1. Set up row of values (variable 1)
2. Set up column of values (variable 2)
3. Reference formula in top-left corner
4. Select range → Data Table
5. Row input cell: Variable 1
6. Column input cell: Variable 2

---

### Goal Seek

**Use Case:** Find required input to achieve target output

**Steps:**
1. Data → What-If Analysis → Goal Seek
2. Set cell: Output cell
3. To value: Target value
4. By changing cell: Input cell

**Example:** What purchase price gives 15% IRR?

---

### Scenario Manager

**Use Case:** Save multiple input scenarios

**Steps:**
1. Data → What-If Analysis → Scenario Manager
2. Add scenarios (Best Case, Base Case, Worst Case)
3. Define changing cells
4. Enter values for each scenario
5. Show to switch between scenarios

---

### Monte Carlo Simulation

**Random Normal Distribution:**
```excel
=NORM.INV(RAND(), Mean, StdDev)
```

**Example (Random Cap Rate):**
```excel
=NORM.INV(RAND(), 0.065, 0.01)
// Mean 6.5%, Std Dev 1%
```

**Run 1,000+ iterations to model uncertainty**

---

### Dynamic Named Ranges

**Formula:**
```excel
=OFFSET($A$1, 0, 0, COUNTA($A:$A), 1)
```

**Use Case:** Range automatically expands as data added

---

### INDIRECT (Use Sparingly)

**Formula:**
```excel
=INDIRECT(TextReference)
```

**Example:**
```excel
=INDIRECT("Sheet" & B2 & "!A1")
// References different sheet based on B2 value
```

⚠️ **Warning:** Volatile function, slows calculation

---

### Power Query M Language

**Basic Query:**
```m
let
    Source = Excel.CurrentWorkbook(){[Name="RawData"]}[Content],
    FilteredRows = Table.SelectRows(Source, each [State] = "Texas"),
    SortedRows = Table.Sort(FilteredRows,{{"Price", Order.Descending}})
in
    SortedRows
```

---

## 🎓 PRO TIPS

### Optimization Tips
1. **Avoid volatile functions** (INDIRECT, OFFSET, TODAY, NOW, RAND)
2. **Use named ranges** for clarity
3. **Break complex formulas** into intermediate steps
4. **Use Excel tables** (Ctrl+T) for structured references
5. **Leverage modern functions** (XLOOKUP, LET, LAMBDA) when available

### Error Prevention
1. **Always use IFERROR** wrapper on risky formulas
2. **Validate inputs** with data validation
3. **Use absolute references** ($) where needed
4. **Test edge cases** (zero, negative, blank)
5. **Use conditional formatting** to highlight errors

### Best Practices
1. **Document assumptions** clearly
2. **Color code** inputs vs calculations vs outputs
3. **Use consistent formatting** across all models
4. **Name your ranges** descriptively
5. **Version control** your models

---

## 📞 SUPPORT

For questions about formulas or modeling:
- Reference: APEX Modeling Standards v1.0
- Location: `/file-room/10-REFERENCE-DOCS/Standards/`
- Contact: Excel Systems Architect

---

**END OF FORMULA LIBRARY**

*This reference guide is maintained by APEX OPS CENTER Excel Systems Architect.*

**Version History:**
- v1.0 (2025-12-11): Initial release

**Next Update:** Quarterly or upon request
