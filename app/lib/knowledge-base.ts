/**
 * Expanded Knowledge Base for RAG System
 * 
 * This contains all verified information about Prakash Bhambhani and Wings9 Group.
 * Used as the source of truth for the AI assistant.
 * 
 * Structure includes:
 * - CEO Profile (detailed)
 * - Firm Overview
 * - Services (with intent mapping, target audience, consultation triggers)
 * - Companies
 * - Contact Information
 */

export const knowledgeBase = {
  ceo: {
    name: "Prakash Bhambhani",
    role: "Business Strategist, Entrepreneur & Corporate Solutions Specialist",
    company: "Wings9 Group",
    focus: "Company structuring, corporate advisory, real estate, rental disputes, trading, technology, and strategic growth",
    approach: "Practical, result-oriented, legally structured, and commercially viable",
    description: "Prakash Bhambhani is a seasoned business strategist, entrepreneur, and corporate solutions specialist with nearly 30 years of multidimensional experience across business consulting, company structuring, real estate, corporate advisory, rental dispute management, trading, technology, and emerging business sectors. He is known for understanding complex business situations and converting them into clear, compliant, and commercially viable structures for entrepreneurs, investors, corporates, and multinational companies.",
    background: "His expertise spans company formation, corporate structuring and restructuring, licensing, regulatory coordination, investor advisory, operational problem-solving, property investments, leasing, commercial negotiations, and rental dispute matters. He has supported businesses across mainland, free zone, and international corporate environments with a professional approach grounded in market knowledge, authority-level understanding, negotiation skills, and strategic execution.",
    achievements: [
      "Nearly 30 years of multidimensional business and real estate experience",
      "Supported entrepreneurs, investors, corporates, and multinational companies with structured growth solutions",
      "Deep expertise in mainland, free zone, and international corporate environments",
      "Built a diversified Wings9 ecosystem spanning Wings9 Consultancies LLC, Wings9 Technologies LLC, trading, real estate solutions, and brand development",
      "Expanded into AI-driven solutions, software and IT ventures, fashion, vacation homes, and modern trading opportunities over the last six years"
    ],
    expertise: [
      "Company formation and structuring",
      "Corporate restructuring and advisory",
      "Licensing and regulatory coordination",
      "Investor advisory",
      "Operational problem-solving",
      "Real estate investment and leasing",
      "Commercial negotiations",
      "Rental dispute management",
      "AI-driven business solutions",
      "Software and IT-related business models",
      "Foodstuff import and export",
      "Brand development and market expansion"
    ],
    values: [
      "Practical solutions grounded in compliance and commercial viability",
      "Discretion and professionalism in high-level corporate matters",
      "Long-term strategic thinking with adaptability to market change",
      "Innovation-led growth across emerging sectors",
      "Trust, clarity, and execution-focused client support"
    ],
    notableClients: [
      "Sun Pharma",
      "Haldiram's",
      "Lufthansa Airways",
      "Quality Foods",
      "MMI"
    ],
    expansionAreas: [
      "AI-driven solutions",
      "Software and IT-related ventures",
      "Fashion ventures",
      "Vacation homes",
      "Modern trading opportunities"
    ]
  },
  firm: {
    name: "Wings9",
    fullName: "Wings9 Group",
    nature: "Diversified business ecosystem spanning Wings9 Consultancies LLC, Wings9 Technologies LLC, trading, real estate solutions, and brand development",
    markets: "UAE, mainland, free zone, India, GCC, and international markets",
    clients: "Entrepreneurs, investors, corporates, multinational companies, startups, and established businesses",
    valueProposition: "Structured, compliant, and commercially viable solutions across company setup, corporate structuring, real estate, trading, technology, and strategic expansion. Wings9 helps clients solve complex business challenges with practical execution and long-term thinking.",
    approach: "We combine strategic advisory, regulatory understanding, commercial negotiation, and hands-on execution to help clients enter markets, structure operations, and grow sustainably.",
    mission: "To deliver structured business solutions that help clients establish, expand, and grow with clarity, compliance, and commercial confidence.",
    vision: "To build a trusted, future-ready business ecosystem that bridges consultancy, technology, trading, and real estate with innovation-led execution.",
    history: "Under the Wings Nine banner, the organization has grown from a consultancy-led foundation into a diversified group serving business setup, restructuring, real estate, technology, trading, and brand-building needs. Its latest expansion includes WINGS NINE GLOBAL TRADING FZCO, focused on foodstuff import and export and the development of proprietary in-house brands for regional and international markets.",
    specialties: [
      "Company formation and structuring",
      "Corporate restructuring and business advisory",
      "Real estate investment, leasing, and rental dispute solutions",
      "Licensing and regulatory coordination",
      "Technology solutions and digital transformation",
      "AI-driven business models",
      "Foodstuff import, export, and private-label development",
      "Brand development and market expansion"
    ],
    geographicPresence: "Primarily based in the UAE with broad experience across mainland, free zone, GCC, India, and international business environments.",
    team: "Led by Prakash Bhambhani, Wings9 Group brings together experience across business advisory, corporate structuring, real estate, technology, trading, and brand development.",
    trackRecord: "Backed by Prakash Bhambhani's nearly 30 years of experience, Wings9 Group has supported entrepreneurs, investors, corporates, and multinational companies with market entry, restructuring, compliance, commercial property, and strategic expansion.",
    notableClients: [
      "Sun Pharma",
      "Haldiram's",
      "Lufthansa Airways",
      "Quality Foods",
      "MMI"
    ]
  },
  services: [
    {
      id: "global-business-advisors",
      name: "Global Business Advisors",
      description: "Providing strategic support for businesses seeking international expansion with tailored market entry strategies, compliance guidance, growth opportunities, and golden visa assistance.",
      whatItDoes: "Helps businesses expand internationally by providing market entry strategies, compliance guidance, and growth opportunities. Also assists with golden visa applications for investors and entrepreneurs.",
      whoItIsFor: "Businesses looking to expand internationally, entrepreneurs seeking market entry, investors needing compliance support, companies requiring golden visa assistance.",
      whenToConsult: "When planning international expansion, needing compliance guidance, seeking growth opportunities, or requiring golden visa support.",
      keyFeatures: [
        "International market entry strategies",
        "Compliance guidance",
        "Growth opportunities",
        "Golden visa assistance"
      ],
      relatedServices: ["legal-embassy-guidance", "accounting-tax-services"]
    },
    {
      id: "prime-realty",
      name: "Prime Realty",
      description: "Offering comprehensive real estate services, including property sales, leasing, and investment consulting, designed for individuals and businesses alike.",
      whatItDoes: "Provides end-to-end real estate services including property sales, leasing, and investment consulting for both residential and commercial properties.",
      whoItIsFor: "Property buyers, sellers, investors, businesses needing commercial space, individuals seeking residential properties, real estate investors.",
      whenToConsult: "When buying or selling property, needing investment advice, requiring leasing services, or seeking commercial real estate solutions.",
      keyFeatures: [
        "Property sales",
        "Leasing services",
        "Investment consulting",
        "Residential and commercial properties"
      ],
      relatedServices: ["swift-property-solutions"]
    },
    {
      id: "innovative-marketing",
      name: "Innovative Marketing",
      description: "Crafting innovative marketing strategies to enhance brand visibility, engage target audiences, and drive sustainable business growth.",
      whatItDoes: "Develops comprehensive marketing strategies to increase brand visibility, engage target audiences, and drive sustainable business growth through innovative campaigns.",
      whoItIsFor: "Businesses needing brand visibility, companies seeking audience engagement, startups requiring marketing strategies, established businesses looking to grow.",
      whenToConsult: "When launching a new product, rebranding, needing to increase visibility, or seeking to engage new target audiences.",
      keyFeatures: [
        "Brand visibility enhancement",
        "Target audience engagement",
        "Sustainable business growth strategies",
        "Marketing campaign development"
      ],
      relatedServices: ["global-business-advisors"]
    },
    {
      id: "rental-dispute",
      name: "Rental Dispute Resolution",
      description: "Resolving conflicts between landlords and tenants through mediation, negotiation, or legal processes as per UAE guidelines.",
      whatItDoes: "Provides expert mediation and legal support to resolve rental disputes between landlords and tenants in compliance with UAE regulations.",
      whoItIsFor: "Landlords facing tenant disputes, tenants with landlord conflicts, property managers, real estate investors, property owners.",
      whenToConsult: "When facing rental disputes, needing mediation, requiring legal support for tenant-landlord issues, or seeking compliance guidance for rental matters.",
      keyFeatures: [
        "Mediation services",
        "Negotiation support",
        "Legal processes",
        "UAE guidelines compliance"
      ],
      relatedServices: ["legal-embassy-guidance", "prime-realty"]
    },
    {
      id: "swift-property-solutions",
      name: "Swift Property Solutions",
      description: "Simplifying property transactions with efficient sales, rentals, and leasing services.",
      whatItDoes: "Streamlines property transactions by providing efficient sales, rental, and leasing services with a focus on speed and reliability.",
      whoItIsFor: "Property buyers and sellers, tenants and landlords, real estate investors, businesses needing quick property solutions.",
      whenToConsult: "When needing fast property transactions, efficient sales or rentals, or streamlined leasing processes.",
      keyFeatures: [
        "Property sales",
        "Rental services",
        "Leasing solutions",
        "Efficient transaction processing"
      ],
      relatedServices: ["prime-realty"]
    },
    {
      id: "sez-vision-advisory",
      name: "SEZ Vision Advisory",
      description: "Delivering expert guidance on Special Economic Zones (SEZs), including Make in India initiatives.",
      whatItDoes: "Provides specialized consulting on Special Economic Zones, including Make in India initiatives, helping businesses understand investment opportunities and compliance requirements.",
      whoItIsFor: "Businesses interested in SEZ investments, companies exploring Make in India opportunities, investors seeking economic zone benefits, manufacturers looking to set up in SEZs.",
      whenToConsult: "When exploring SEZ investments, needing Make in India guidance, seeking economic zone benefits, or planning manufacturing setup in SEZs.",
      keyFeatures: [
        "SEZ guidance",
        "Make in India initiatives",
        "Economic zone consulting",
        "Investment opportunities"
      ],
      relatedServices: ["global-business-advisors", "accounting-tax-services"]
    },
    {
      id: "accounting-tax-services",
      name: "Accounting and Tax Services",
      description: "Offering accounting, VAT registration, filing, and corporate tax compliance services.",
      whatItDoes: "Provides comprehensive accounting and tax services including VAT registration, tax filing, and corporate tax compliance to ensure businesses meet all regulatory requirements.",
      whoItIsFor: "Businesses needing accounting services, companies requiring VAT registration, organizations needing tax filing support, businesses seeking tax compliance.",
      whenToConsult: "When starting a business, needing VAT registration, requiring tax filing, or seeking corporate tax compliance support.",
      keyFeatures: [
        "Accounting services",
        "VAT registration",
        "Tax filing",
        "Corporate tax compliance"
      ],
      relatedServices: ["legal-embassy-guidance", "global-business-advisors"]
    },
    {
      id: "legal-embassy-guidance",
      name: "Legal and Embassy Guidance",
      description: "Providing Power of Attorney (POA) services and embassy-related guidance.",
      whatItDoes: "Offers legal documentation services including Power of Attorney preparation and embassy-related guidance for consular processes and legal requirements.",
      whoItIsFor: "Individuals needing POA services, businesses requiring embassy documentation, people needing consular support, organizations requiring legal documentation.",
      whenToConsult: "When needing Power of Attorney, requiring embassy documentation, seeking consular services, or needing legal documentation support.",
      keyFeatures: [
        "Power of Attorney (POA) services",
        "Embassy-related guidance",
        "Legal documentation",
        "Consular services support"
      ],
      relatedServices: ["global-business-advisors"]
    }
  ],
  contact: {
    phone: "+971 56 760 9898",
    email: "me.prakash.ae",
    whatsapp: "+971 56 760 9898",
    linkedin: "LinkedIn profile available",
    location: "United Arab Emirates (UAE)",
    consultationNote: "For consultations, please contact via phone, email, or WhatsApp. We offer free initial consultations to discuss your business needs. Prakash and the Wings9 Group team are available to help you navigate business challenges, structuring decisions, and expansion opportunities.",
    availability: "Available for consultations Monday through Friday. Emergency support available for urgent matters. Response time typically within 24 hours.",
    languages: "English, Hindi, and other regional languages supported"
  },
  companies: [
    {
      name: "Wings9 Consultancies LLC",
      description: "A strategic business advisory division focused on company formation, corporate structuring, restructuring, licensing, regulatory coordination, investor advisory, and growth-led commercial problem-solving.",
      focus: "Business consultancy, company structuring, licensing, investor advisory, strategic advisory",
      services: ["Company formation", "Corporate structuring and restructuring", "Licensing and regulatory coordination", "Investor advisory", "Strategic business advisory"],
      targetAudience: "Entrepreneurs, investors, startups, corporates, and companies seeking structured market entry or expansion"
    },
    {
      name: "Wings9 Properties LLC",
      description: "A real estate solutions division covering property investments, leasing, corporate rentals, commercial negotiations, and rental dispute matters for clients who need business and premises strategy to work together.",
      focus: "Real estate services, property investment, leasing, commercial negotiations, rental dispute solutions",
      services: ["Property investments", "Leasing services", "Corporate rentals", "Commercial negotiations", "Rental dispute support"],
      targetAudience: "Property buyers, sellers, investors, landlords, tenants, and businesses needing commercial space"
    },
    {
      name: "Wings9 Vacation Homes LLC",
      description: "Specialized vacation rental and hospitality services, helping property owners maximize returns through short-term rentals and vacation home management. Provides end-to-end solutions for vacation property investments.",
      focus: "Vacation rentals, hospitality services, property management",
      services: ["Vacation rental management", "Short-term rental services", "Hospitality consulting", "Property optimization"],
      targetAudience: "Vacation property owners, hospitality investors, property managers"
    },
    {
      name: "Wings9 Technologies LLC",
      description: "A technology and digital transformation division focused on software solutions, AI integration, automation, and modern IT-enabled business models that help companies evolve with changing markets.",
      focus: "Technology solutions, digital transformation, software development, AI integration",
      services: ["Software development", "Cloud solutions", "Digital transformation", "Technology consulting", "AI and automation"],
      targetAudience: "Businesses needing digital transformation, startups requiring tech solutions, enterprises seeking modernization"
    },
    {
      name: "Wings9 Fashion LLC",
      description: "Fashion and retail consulting services, helping fashion brands and retailers with business strategy, market entry, brand development, and retail operations. Specializes in connecting fashion businesses with international markets.",
      focus: "Fashion retail, brand development, retail consulting",
      services: ["Fashion brand consulting", "Retail strategy", "Market entry for fashion brands", "Brand development"],
      targetAudience: "Fashion brands, retailers, fashion entrepreneurs, clothing businesses"
    },
    {
      name: "WINGS NINE GLOBAL TRADING FZCO",
      description: "A Dubai-based foodstuff import and export venture focused on sourcing, quality assurance, logistics, GCC distribution, and the development of proprietary in-house brands for regional and international markets.",
      focus: "Foodstuff import and export, sourcing, trade management, GCC distribution, in-house brand development",
      services: ["Food export", "Food import", "Customized sourcing services", "Quality assurance", "Price negotiation", "Logistics and shipping support", "Private labeling and packaging"],
      targetAudience: "Distributors, supermarkets, retail chains, channel partners, and buyers seeking Indian grocery exports into UAE and GCC markets"
    },
    {
      name: "Yalla Makhana LLC",
      description: "A UAE-facing snack and FMCG brand built around flavored makhana products, offering ready-to-retail foxnut variants such as Za'atar, Peri Peri, Spanish Tomato, Lime & Mint, Labneh & Mint, Cream & Onion, and Cheese & Herbs.",
      focus: "Makhana snacks, retail FMCG, flavored foxnuts",
      services: ["Retail snack distribution", "Product merchandising", "Flavor-led packaged makhana range", "Direct-to-consumer sales", "Channel-ready snack supply"],
      targetAudience: "Snack consumers, grocery retailers, convenience stores, and distribution partners in Dubai and the wider UAE"
    }
  ],
  primaryObjective: "Help clients understand services, identify the right solution, and book consultations when appropriate.",
  
  // Additional context for better understanding
  whyChooseWings9: [
    "Nearly 30 years of multidimensional business and real estate experience",
    "Practical, structured, and commercially viable problem-solving",
    "Deep understanding of mainland, free zone, and international business environments",
    "Integrated expertise across consultancy, real estate, technology, trading, and brand development",
    "Strong regulatory awareness, negotiation capability, and execution focus",
    "Trusted by entrepreneurs, investors, corporates, and multinational companies",
    "Forward-looking approach across AI, software, fashion, vacation homes, and modern trading",
    "Long-term strategic guidance grounded in compliance and clarity"
  ],
  
  industriesServed: [
    "Technology and Software",
    "Real Estate and Property Development",
    "Retail and E-commerce",
    "Fashion and Apparel",
    "Hospitality and Tourism",
    "Manufacturing",
    "Professional Services",
    "Healthcare",
    "Education",
    "Financial Services",
    "Food Import and Export",
    "FMCG and Consumer Brands"
  ],
  
  commonUseCases: [
    "Setting up or restructuring a business in UAE",
    "Expanding business internationally",
    "Structuring mainland and free zone operations",
    "Buying, leasing, or negotiating commercial property in UAE",
    "Resolving rental disputes",
    "Building AI-enabled or software-led business models",
    "Launching trading or food import-export operations",
    "Developing proprietary brands for regional markets",
    "Business licensing and regulatory coordination",
    "Investor advisory and strategic growth planning"
  ],
  
  successFactors: [
    "Expert knowledge of UAE business and real estate environments",
    "Authority-level understanding of licensing and regulatory processes",
    "Comprehensive understanding of international markets",
    "Personalized approach to each client and business structure",
    "Strong negotiation and execution capability",
    "Continuous learning and adaptation to market revolutions",
    "Ethical and compliant business practices",
    "Long-term strategic relationships built on trust"
  ]
} as const;
