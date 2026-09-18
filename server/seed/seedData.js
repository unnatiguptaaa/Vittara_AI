export const demoLoans = [
  {
    name: "SBI Xpress Credit Personal Loan",
    bank: "State Bank of India",
    category: "Personal",
    interestRate: 10.35,
    minAmount: 50000,
    maxAmount: 2000000,
    minTenure: 12,
    maxTenure: 72,
    processingFeeRate: 1.5,
    processingFeeMin: 1000,
    minIncome: 25000,
    maxDtiRatio: 0.60,
    features: [
      "Zero hidden administrative charges",
      "Direct salary account integration",
      "Minimal physical paperwork required"
    ],
    conditions: "Salaried employee with minimum 1 year of continuous service. Age 21 to 58.",
    preClosureCharges: "Nil prepayment penalty after 12 EMIs; 3% if closed within first year.",
    productStatus: "Active",
    rating: 4.8,
    badge: "Lowest Interest"
  },
  {
    name: "HDFC Quick Express Personal Loan",
    bank: "HDFC Bank",
    category: "Personal",
    interestRate: 10.75,
    minAmount: 50000,
    maxAmount: 2500000,
    minTenure: 12,
    maxTenure: 60,
    processingFeeRate: 1.99,
    processingFeeMin: 1500,
    minIncome: 30000,
    maxDtiRatio: 0.55,
    features: [
      "Instant 10-second disbursement for account holders",
      "Flexible part-payment options available",
      "Optional credit shield insurance protection"
    ],
    conditions: "Salaried or self-employed professionals with minimum 2 years ITR. Credit score 700+.",
    preClosureCharges: "4% on outstanding principal before 24 months, 2% thereafter.",
    productStatus: "Active",
    rating: 4.7,
    badge: "Fastest Approval"
  },
  {
    name: "ICICI Dream Home Loan",
    bank: "ICICI Bank",
    category: "Home",
    interestRate: 8.75,
    minAmount: 500000,
    maxAmount: 10000000,
    minTenure: 60,
    maxTenure: 360,
    processingFeeRate: 0.5,
    processingFeeMin: 3000,
    minIncome: 35000,
    maxDtiRatio: 0.65,
    features: [
      "Up to 85% property value financing",
      "Pre-approved home loans available",
      "Doorstep service for documentation"
    ],
    conditions: "Approved residential property with clear legal title. Co-borrower allowed.",
    preClosureCharges: "Zero charges on floating rate home loans per RBI guidelines.",
    productStatus: "Active",
    rating: 4.9,
    badge: "Best for Home Buyers"
  },
  {
    name: "Axis Bank Smart Drive Auto Loan",
    bank: "Axis Bank",
    category: "Auto",
    interestRate: 8.95,
    minAmount: 100000,
    maxAmount: 3000000,
    minTenure: 12,
    maxTenure: 84,
    processingFeeRate: 1.0,
    processingFeeMin: 1200,
    minIncome: 25000,
    maxDtiRatio: 0.60,
    features: [
      "Up to 100% on-road financing on select models",
      "Special discounts on electric vehicles (EV)",
      "Instant e-sanction"
    ],
    conditions: "Valid driving license and identity proof. Vehicle hypothecated till loan closure.",
    preClosureCharges: "5% within first year, 3% after 1 year, 0% after 24 months.",
    productStatus: "Active",
    rating: 4.6,
    badge: "Top Auto Choice"
  },
  {
    name: "Kotak Mahindra Business Growth Loan",
    bank: "Kotak Mahindra Bank",
    category: "Business",
    interestRate: 13.5,
    minAmount: 200000,
    maxAmount: 5000000,
    minTenure: 12,
    maxTenure: 48,
    processingFeeRate: 2.25,
    processingFeeMin: 2500,
    minIncome: 50000,
    maxDtiRatio: 0.50,
    features: [
      "Collateral-free business financing",
      "Quick 48-hour approval",
      "OD (Overdraft) facility option"
    ],
    conditions: "Business operational vintage of 3+ years. Annual turnover exceeding ₹40 Lakhs with GST returns.",
    preClosureCharges: "4% on principal outstanding if foreclosed before 12 months.",
    productStatus: "Active",
    rating: 4.5,
    badge: "Collateral-Free"
  },
  {
    name: "Bank of Baroda Scholar Loan",
    bank: "Bank of Baroda",
    category: "Education",
    interestRate: 9.15,
    minAmount: 100000,
    maxAmount: 4000000,
    minTenure: 24,
    maxTenure: 180,
    processingFeeRate: 0.75,
    processingFeeMin: 1000,
    minIncome: 20000,
    maxDtiRatio: 0.70,
    features: [
      "Moratorium period: Course duration + 1 year",
      "0.50% interest concession for female students",
      "Tax benefit under Section 80E"
    ],
    conditions: "Confirmed admission in recognized university/institute in India or abroad. Parent/guardian as co-borrower.",
    preClosureCharges: "Nil charges on pre-payment from own funds at any time.",
    productStatus: "Active",
    rating: 4.8,
    badge: "Student Friendly"
  },
  {
    name: "Punjab National Bank Quick Cash Loan",
    bank: "Punjab National Bank",
    category: "Personal",
    interestRate: 11.20,
    minAmount: 25000,
    maxAmount: 1500000,
    minTenure: 12,
    maxTenure: 60,
    processingFeeRate: 1.0,
    processingFeeMin: 800,
    minIncome: 20000,
    maxDtiRatio: 0.60,
    features: [
      "Very low processing fee",
      "No guarantor required for salary account holders",
      "Simple paperless verification"
    ],
    conditions: "Salaried employee with government, PSU, or reputed private corporation. Age 21-60.",
    preClosureCharges: "2% if foreclosed within 12 months; nil thereafter.",
    productStatus: "Active",
    rating: 4.4,
    badge: "Low Fees"
  }
];

export const demoInsurances = [
  {
    name: "Care Supreme Comprehensive Health Plan",
    provider: "Care Health Insurance",
    category: "Health",
    premium: 9800,
    monthlyPremium: 850,
    coverage: 1000000, // ₹10 Lakhs
    deductible: 10000, // ₹10,000 voluntary deductible
    waitingPeriod: "30 days initial, 24 months for specified ailments, 36 months for pre-existing conditions",
    exclusions: [
      "Self-inflicted injury or suicide attempt",
      "Cosmetic, aesthetic or plastic surgery",
      "Experimental and unproven treatments",
      "Hazardous sports or activities without prior disclosure",
      "Alcohol or drug abuse rehabilitation"
    ],
    limits: "No room rent capping for single private room. ICU covered up to sum insured. Ambulance cover up to ₹2,500/hospitalization.",
    conditions: "Individual or family floater. Entry age 18 to 65 years. Lifelong renewability guaranteed.",
    coPay: "0% for all ages up to 60; 20% co-payment for entry age 61+.",
    networkHospitals: 9800,
    claimSettlementRatio: 98.4,
    productStatus: "Active",
    rating: 4.8,
    badge: "Comprehensive Cover"
  },
  {
    name: "Star Health Comprehensive Family Floater",
    provider: "Star Health & Allied Insurance",
    category: "Health",
    premium: 14200,
    monthlyPremium: 1250,
    coverage: 1500000, // ₹15 Lakhs
    deductible: 0, // Zero deductible
    waitingPeriod: "30 days for fresh illnesses, 24 months for pre-existing illnesses, 12 months for cataract",
    exclusions: [
      "Weight loss / bariatric treatment (unless prescribed life-saving)",
      "Dental procedures unless arising from accidental injury",
      "Sexually transmitted diseases",
      "Non-allopathic treatment beyond AYUSH hospital guidelines",
      "Maternity expenses in first 24 months"
    ],
    limits: "Room rent up to 1% of sum insured per day. Ayush treatment covered up to sum insured. Organ donor expenses included.",
    conditions: "Family floater covering 2 adults + up to 3 children. Pre-policy medical checkup required for 50+ age.",
    coPay: "0% co-pay across all network hospitals across India.",
    networkHospitals: 14000,
    claimSettlementRatio: 99.1,
    productStatus: "Active",
    rating: 4.9,
    badge: "Zero Deductible"
  },
  {
    name: "Max Life Smart Secure Term Plan",
    provider: "Max Life Insurance",
    category: "Term Life",
    premium: 8400,
    monthlyPremium: 720,
    coverage: 10000000, // ₹1 Crore
    deductible: 0,
    waitingPeriod: "No waiting period; immediate cover for death caused by accident or illness",
    exclusions: [
      "Suicide exclusion within the first 12 months of policy inception",
      "Participation in criminal acts",
      "War, invasion, civil war, or nuclear contamination",
      "Death due to undisclosed pre-existing terminal conditions"
    ],
    limits: "Lump sum payout of ₹1 Crore on death. Accelerated terminal illness benefit up to ₹1 Crore on medical certification.",
    conditions: "Non-smoker discount included. Regular premium payment until age 60 or 75. Medical underwriting required.",
    coPay: "Not applicable to life insurance.",
    networkHospitals: 0,
    claimSettlementRatio: 99.5,
    productStatus: "Active",
    rating: 4.9,
    badge: "High ₹1 Cr Cover"
  },
  {
    name: "Digit Smart Drive Comprehensive Motor Plan",
    provider: "GoDigit General Insurance",
    category: "Motor",
    premium: 4600,
    monthlyPremium: 395,
    coverage: 650000, // IDV ₹6.5 Lakhs
    deductible: 1000, // Compulsory deductible ₹1,000
    waitingPeriod: "Nil waiting period; effective instantly from policy issue time",
    exclusions: [
      "Driving without a valid driving license",
      "Driving under influence of intoxicating liquor or drugs",
      "Normal wear and tear, mechanical/electrical breakdown",
      "Consequential loss or depreciation without zero-dep cover"
    ],
    limits: "Third-party liability: Unlimited for bodily injury; property damage up to ₹7.5 Lakhs. Own damage up to declared IDV.",
    conditions: "Comprehensive package including roadside assistance (RSA) and engine protection cover. Cashless claims via app upload.",
    coPay: "Compulsory deductible of ₹1,000 per own damage claim under IRDAI guidelines.",
    networkHospitals: 5500,
    claimSettlementRatio: 97.9,
    productStatus: "Active",
    rating: 4.6,
    badge: "Instant Cashless"
  },
  {
    name: "HDFC ERGO Critical Illness Plan",
    provider: "HDFC ERGO General Insurance",
    category: "Critical Illness",
    premium: 6200,
    monthlyPremium: 540,
    coverage: 2500000, // ₹25 Lakhs
    deductible: 0,
    waitingPeriod: "90 days initial waiting period, 30 days survival period post diagnosis of listed condition",
    exclusions: [
      "Pre-existing critical illnesses diagnosed prior to inception",
      "Illnesses diagnosed within initial 90-day waiting window",
      "Self-inflicted poisoning or alcohol-induced organ failure",
      "Congenital internal anomalies"
    ],
    limits: "100% lump sum payout upon first diagnosis of any of the 15 major critical illnesses (Cancer, Stroke, Heart Attack, Kidney Failure, etc.).",
    conditions: "Surviving 30 days after diagnosis is required for claim payment under standard policy terms. Ages 18 to 65 eligible.",
    coPay: "0% co-payment.",
    networkHospitals: 11000,
    claimSettlementRatio: 98.7,
    productStatus: "Active",
    rating: 4.7,
    badge: "Lump Sum Payout"
  }
];

export const demoTerms = [
  {
    term: "APR",
    aliases: ["Annual Percentage Rate", "Annualized Rate"],
    category: "Loan",
    shortDefinition: "Annual Percentage Rate — the total annual cost of borrowing including interest and processing fees.",
    fullExplanation: "APR represents the true annual cost of borrowing money. While standard nominal interest only includes the base lending rate, APR factors in processing fees, documentation charges, and administrative expenses. Comparing APR between loan offers reveals the true, total cost comparison.",
    hindiExplanation: "APR (Annual Percentage Rate) का मतलब है कि एक साल में लोन पर लगने वाला कुल असली खर्चा। इसमें सिर्फ ब्याज ही नहीं, बल्कि प्रोसेसिंग फीस और अन्य सारे बैंक चार्जेस भी शामिल होते हैं।",
    hinglishExplanation: "APR ka matlab hota hai loan ka actual total annual cost. Nominal interest rate ke alawa isme processing fee aur file charges bhi jude hote hain, taaki aapko pata chale ki sach mein kitna kharcha padega.",
    example: "A loan with 10% interest rate and a 2% processing fee has an effective first-year APR of approximately 11.8% to 12%.",
    analogy: "Think of the nominal interest as the ticket price of a flight, while APR is the final ticket price including taxes, luggage fees, and seat selection charges."
  },
  {
    term: "Deductible",
    aliases: ["Insurance Deductible", "Excess"],
    category: "Insurance",
    shortDefinition: "The initial amount you must pay out of your own pocket before the insurance company pays the rest.",
    fullExplanation: "A deductible is a clause in an insurance contract where the policyholder agrees to pay the first fixed portion of any claim. Choosing a higher deductible usually lowers your annual premium, because the insurer is shielded from tiny nuisance claims and risk.",
    hindiExplanation: "Deductible वह राशि होती है जो क्लेम के समय पहले आपको अपनी जेब से चुकानी पड़ती है। आपके द्वारा यह तय रकम देने के बाद ही बाकी का सारा खर्चा इंश्योरेंस कंपनी उठाती है।",
    hinglishExplanation: "Deductible wo amount hota hai jo claim hone par pehle aapko apni pocket se pay karna padta hai. Example ke liye agar ₹10,000 deductible hai aur bill ₹50,000 aaya, toh pehle ₹10,000 aap doge aur baaki ₹40,000 insurance company degi.",
    example: "With a ₹15,000 deductible, if a hospital bill is ₹85,000, you pay ₹15,000 and the insurance company covers ₹70,000.",
    analogy: "Like a security entry gate where you must present a small token pass of your own before the gatekeeper opens the vault for everything else."
  },
  {
    term: "Premium",
    aliases: ["Insurance Premium", "Policy Payment"],
    category: "Insurance",
    shortDefinition: "The periodic payment (monthly, quarterly, or yearly) made to keep your insurance policy active.",
    fullExplanation: "An insurance premium is the specified sum of money paid regularly by the insured to the insurance carrier in exchange for financial protection against specified hazards or losses. Non-payment results in policy lapse.",
    hindiExplanation: "प्रीमियम वह नियमित भुगतान (मासिक या वार्षिक) है जो आप अपनी बीमा पॉलिसी को चालू और सक्रिय रखने के लिए इंश्योरेंस कंपनी को देते हैं।",
    hinglishExplanation: "Premium wo regular fees hoti hai jo aap insurance company ko pay karte ho apni policy active rakhne ke liye. Agar premium nahi bharenge toh policy lapse ho jayegi.",
    example: "Paying ₹12,000 once a year to maintain a ₹10,00,000 health cover for your family.",
    analogy: "Like your monthly Netflix or electricity subscription — as long as you pay the subscription fee, the service remains active."
  },
  {
    term: "Tenure",
    aliases: ["Loan Tenure", "Duration", "Term"],
    category: "Loan",
    shortDefinition: "The agreed duration or time period over which a loan must be completely repaid.",
    fullExplanation: "Loan tenure is the predetermined duration in months or years during which the borrower repays the principal amount and accrued interest through Equated Monthly Installments (EMIs). A longer tenure lowers monthly EMI but increases overall interest paid.",
    hindiExplanation: "लोन की अवधि (Tenure) वह तय समय या महीनों की संख्या है जिसके भीतर आपको पूरा लोन किश्तों (EMI) में चुकाना होता है।",
    hinglishExplanation: "Tenure matlab loan chukane ka time period (months ya years). Jitna lamba tenure hoga, monthly EMI utni choti hogi par overall interest zyada bharna padega.",
    example: "Choosing a 36-month tenure to repay a ₹2,00,000 personal loan in 36 equal monthly installments.",
    analogy: "Like pacing a 10 km marathon: if you spread the run across 3 hours you run comfortably at a slow pace, but you spend more total time on the track."
  },
  {
    term: "Processing Fee",
    aliases: ["File Charges", "Administrative Fee", "Origination Fee"],
    category: "Loan",
    shortDefinition: "A one-time upfront administrative charge levied by banks to evaluate and sanction a loan application.",
    fullExplanation: "The processing fee is charged by financial institutions to cover the administrative, verification, credit check, legal, and operational expenses involved in processing a borrower's loan dossier. It is usually deducted upfront from the disbursed amount.",
    hindiExplanation: "प्रोसेसिंग फीस वह एकमुश्त शुल्क है जो बैंक आपके लोन आवेदन की जांच, दस्तावेज सत्यापन और फाइल प्रोसेस करने के बदले आपसे लेता है।",
    hinglishExplanation: "Processing fee ek one-time fee hoti hai jo bank aapke loan documents verify karne aur loan approve karne ke liye leta hai. Ye aksar loan disbursement ke time deduct ho jaati hai.",
    example: "A 1.5% processing fee on a ₹2,00,000 loan equals ₹3,000 (plus applicable GST).",
    analogy: "Like a university application fee: you pay it for evaluating your admission file regardless of whether you end up taking the seat."
  },
  {
    term: "Waiting Period",
    aliases: ["Cooling Period", "Qualifying Period"],
    category: "Insurance",
    shortDefinition: "The initial span of time after buying insurance during which specific claims cannot be made.",
    fullExplanation: "A waiting period is a defined period during which an insurance policy is active, but certain or all medical conditions and illnesses are excluded from claim coverage. Common tiers include 30-day initial illness waiting, 2-year specific procedure waiting, and 3-to-4 year pre-existing disease (PED) waiting.",
    hindiExplanation: "वेटिंग पीरियड वह शुरुआती समय सीमा होती है जिसके दौरान पॉलिसी शुरू होने के बाद भी कुछ बीमारियों या क्लेम का कवरेज नहीं मिलता है।",
    hinglishExplanation: "Waiting period insurance khareedne ke baad ka wo fixed time hota hai jismein specific diseases ya pre-existing conditions cover nahi hoti. Accidental injury pe waiting period apply nahi hota.",
    example: "If a health plan has a 24-month waiting period for kidney stones, surgery done within the first 18 months will not be reimbursable.",
    analogy: "Like a probationary period at a new job where benefits like paid vacation days unlock only after completing the first 90 days."
  },
  {
    term: "Coverage",
    aliases: ["Sum Insured", "Sum Assured", "Policy Limit"],
    category: "Insurance",
    shortDefinition: "The maximum financial compensation an insurer will pay for covered events under the policy.",
    fullExplanation: "Coverage (or Sum Insured) represents the upper financial ceiling of liability that the insurance company promises to disburse during the policy tenure for eligible hospitalization, medical procedures, or loss events.",
    hindiExplanation: "कवरेज या सम इंश्योर्ड वह अधिकतम रकम है जो इंश्योरेंस कंपनी किसी दुर्घटना या बीमारी के इलाज पर आपको प्रदान करने का वादा करती है।",
    hinglishExplanation: "Coverage (Sum Insured) ka matlab hai insurance company maximum kitna paisa pay karegi. Agar coverage ₹10 Lakhs hai, toh saal bhar mein ₹10 Lakhs tak ke eligible medical bills cover honge.",
    example: "A health insurance policy with ₹10,00,000 coverage pays medical bills up to ₹10 Lakhs in a policy year.",
    analogy: "Like a pre-paid credit limit loaded onto your emergency protection card: you can draw against it up to the total limit."
  },
  {
    term: "Exclusions",
    aliases: ["Policy Exclusions", "Non-covered Items"],
    category: "Insurance",
    shortDefinition: "Specific conditions, treatments, or situations explicitly stated in the policy that will NOT be covered.",
    fullExplanation: "Exclusions are specific hazards, diseases, perils, or medical items that an insurance policy explicitly specifies it will not pay for under any circumstance. Reviewing exclusions prevents unpleasant surprises during hospital claim processing.",
    hindiExplanation: "एक्सक्लूशन्स (Exclusions) वे खास बीमारियां या परिस्थितियां होती हैं जिन्हें पॉलिसी में साफ लिखा होता है कि उनका कोई भी क्लेम नहीं मिलेगा।",
    hinglishExplanation: "Exclusions wo cheezein ya conditions hoti hain jo policy contract mein clearly likha hota hai ki inka kharcha claim nahi milega (jaise cosmetic surgery, self-injury ya war hazards).",
    example: "Cosmetic rhinoplasty done purely for aesthetic looks is an explicit exclusion in standard health policies.",
    analogy: "Like an all-you-can-eat buffet that has a small sign saying 'Lobster and vintage champagne not included in the buffet pass'."
  },
  {
    term: "Co-pay",
    aliases: ["Co-payment", "Cost Sharing"],
    category: "Insurance",
    shortDefinition: "A predetermined percentage of every medical bill that the insured must pay from their own funds.",
    fullExplanation: "Co-payment is a cost-sharing arrangement where the policyholder agrees to pay a fixed percentage (e.g., 10% or 20%) of every claim, while the insurer pays the remainder. It is very common in senior citizen health policies.",
    hindiExplanation: "को-पे (Co-pay) का मतलब है कि अस्पताल के हर बिल का एक निश्चित प्रतिशत (जैसे 10% या 20%) आपको खुद चुकाना होगा, चाहे बिल कितना भी हो।",
    hinglishExplanation: "Co-pay mein policyholder ko har bill ka fixed percentage khud pay karna hota hai. Jaise 10% co-pay hai aur bill ₹1 Lakh hai, toh ₹10,000 aap doge aur ₹90,000 insurer dega.",
    example: "Under a 15% co-pay clause, if a knee replacement bill is ₹2,00,000, you pay ₹30,000 and the insurer pays ₹1,70,000.",
    analogy: "Like dining out with a friend who has a 20% discount coupon — both of you contribute a fixed split to the final bill."
  },
  {
    term: "Pre-closure Penalty",
    aliases: ["Foreclosure Charges", "Early Repayment Fee"],
    category: "Loan",
    shortDefinition: "A fee charged by lenders if you pay off the remaining loan balance before the official tenure ends.",
    fullExplanation: "A pre-closure penalty is levied by banks when a borrower prepays the loan before maturity. Banks charge this because early repayment cuts off their expected interest stream. Under RBI directives, floating rate home loans to individuals cannot have pre-closure penalties.",
    hindiExplanation: "समय से पहले लोन चुकता करने पर बैंक द्वारा लगाया जाने वाला जुर्माना प्री-क्लोजर पेनल्टी कहलाता है।",
    hinglishExplanation: "Agar aap loan ka tenure khatam hone se pehle poora bacha hua paisa ek saath pay kar dete hain, toh bank uspar thoda fee leta hai jise foreclosure charges kehte hain.",
    example: "Paying a 2% penalty on an outstanding balance of ₹1,00,000 when settling the loan in year 2 instead of year 5.",
    analogy: "Like breaking a lease agreement on an apartment early, where the landlord charges a small settlement fee for the vacancy."
  },
  {
    term: "LTV Ratio",
    aliases: ["Loan to Value", "LTV"],
    category: "Loan",
    shortDefinition: "The percentage ratio of a loan amount compared to the appraised value of the asset being purchased.",
    fullExplanation: "Loan-To-Value (LTV) ratio measures the lending risk. If a property is valued at ₹1 Crore and the bank approves an ₹80 Lakh loan, the LTV is 80%. The remaining 20% is the borrower's down payment.",
    hindiExplanation: "LTV अनुपात संपत्ति की कीमत की तुलना में मिलने वाले लोन का प्रतिशत होता है। बाकि बची रकम खरीदार को डाउन पेमेंट में देनी होती है।",
    hinglishExplanation: "LTV (Loan to Value) ratio batata hai ki property ya gaadi ki value ka kitna percent loan bank de raha hai. Baaki percentage aapko down payment mein dena hota hai.",
    example: "An 80% LTV on a ₹50,00,000 house means the bank finances ₹40 Lakhs and you arrange ₹10 Lakhs.",
    analogy: "If a dinner bill is ₹100 and your sponsor pays ₹80, the sponsorship coverage ratio is 80%."
  },
  {
    term: "NCB",
    aliases: ["No Claim Bonus"],
    category: "Insurance",
    shortDefinition: "A discount rewarded on your insurance renewal premium for every consecutive year you do not make a claim.",
    fullExplanation: "No Claim Bonus (NCB) is a reward given by motor and health insurance companies for driving or living safely and not filing any claims during the policy year. In motor insurance, NCB accumulates up to a 50% discount on the own-damage premium.",
    hindiExplanation: "नो क्लेम बोनस (NCB) वह छूट या इनाम है जो साल भर कोई क्लेम न लेने पर अगली पॉलिसी रिन्यूअल के प्रीमियम पर मिलता है।",
    hinglishExplanation: "Agar aapne saal bhar policy mein koi claim nahi liya, toh insurance company next year aapko premium par handsome discount deti hai jise NCB kehte hain.",
    example: "Earning a 20% discount on your car insurance renewal premium after completing year 1 with zero claims.",
    analogy: "Like a good driver reward card where every accident-free year gives you a discount coupon for next year's license renewal."
  }
];
