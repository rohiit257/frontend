/**
 * Expanded Knowledge Base for RAG System
 * 
 * This contains all verified information about Prakash Bhambhani and Wings9 services.
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
    role: "Founder & Strategic Advisor",
    company: "Wings9",
    focus: "Business advisory, real estate, compliance, and growth strategy",
    approach: "Client-centric, compliance-first, long-term value creation",
    description: "Prakash Bhambhani is the founder and strategic leader behind Wings9, leading five trailblazing enterprises that shape the future of their domains. With over 20 years of experience in business advisory, real estate, and international expansion, Prakash has built a reputation for delivering exceptional results. He is known for his client-centric approach, focusing on compliance-first strategies and long-term value creation for businesses seeking growth and expansion. Prakash has successfully guided hundreds of clients through complex business challenges, helping them navigate international markets, regulatory requirements, and strategic growth opportunities.",
    background: "Prakash Bhambhani brings extensive expertise in international business development, having worked with clients across multiple continents. His deep understanding of UAE business regulations, real estate markets, and cross-border commerce makes him a trusted advisor for entrepreneurs and established businesses alike. He is passionate about helping businesses scale sustainably while maintaining compliance and ethical business practices.",
    achievements: [
      "Successfully launched and scaled 5 companies under Wings9 umbrella",
      "Helped 100+ clients achieve their business expansion goals",
      "Expert in UAE business regulations and compliance",
      "Specialized in golden visa and investor programs",
      "Recognized for excellence in real estate investment consulting"
    ],
    expertise: [
      "International business expansion",
      "Real estate investment",
      "Regulatory compliance",
      "Strategic business advisory",
      "Market entry strategies",
      "UAE business setup and licensing",
      "Golden visa and investor programs",
      "Cross-border commerce",
      "Business transformation",
      "Investment consulting"
    ],
    values: [
      "Integrity and transparency in all business dealings",
      "Client success as the primary measure of achievement",
      "Compliance-first approach to business operations",
      "Long-term partnerships over short-term gains",
      "Innovation and adaptability in service delivery"
    ]
  },
  firm: {
    name: "Wings9",
    fullName: "Wings9 Enterprises",
    nature: "Multi-domain professional services firm",
    markets: "UAE, Middle East, India, and international markets",
    clients: "Entrepreneurs, SMEs, investors, corporates, startups, established businesses",
    valueProposition: "Comprehensive business solutions across multiple domains, from real estate to legal compliance, designed to help businesses scale and succeed in international markets. Wings9 provides end-to-end support ensuring compliance, strategic planning, and sustainable growth.",
    approach: "We provide end-to-end support, ensuring compliance, strategic planning, and sustainable growth for our clients.",
    mission: "To empower businesses and entrepreneurs with comprehensive solutions that drive sustainable growth, ensure regulatory compliance, and unlock international market opportunities.",
    vision: "To be the most trusted partner for businesses seeking to expand, grow, and succeed in international markets, particularly in the UAE and Middle East region.",
    history: "Wings9 was founded with a vision to provide holistic business solutions that go beyond traditional consulting. Over the years, the firm has evolved into a multi-domain powerhouse, operating five specialized companies that collectively offer comprehensive support for businesses at every stage of their journey.",
    specialties: [
      "UAE business setup and licensing",
      "International business expansion",
      "Real estate investment and consulting",
      "Regulatory compliance and legal guidance",
      "Marketing and brand development",
      "Technology solutions and digital transformation",
      "Tax and accounting services",
      "Golden visa and investor programs"
    ],
    geographicPresence: "Primarily based in UAE with extensive experience serving clients across Middle East, India, Europe, and North America. The firm has deep expertise in UAE regulations and business practices.",
    team: "Led by Prakash Bhambhani, Wings9 comprises experienced professionals across various domains including business advisory, real estate, legal, accounting, marketing, and technology.",
    trackRecord: "With 20+ years of combined experience, Wings9 has successfully helped hundreds of clients navigate complex business challenges, achieve regulatory compliance, and scale their operations internationally."
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
      relatedServices: ["venture-launch-hub"]
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
      id: "venture-launch-hub",
      name: "Venture Launch Hub",
      description: "Supporting entrepreneurs with tailored business planning, funding solutions, and market strategies.",
      whatItDoes: "Provides comprehensive support for entrepreneurs including business planning, funding solutions, and market entry strategies to help launch and scale new ventures.",
      whoItIsFor: "Entrepreneurs launching new businesses, startups needing planning support, founders seeking funding, new ventures requiring market strategies.",
      whenToConsult: "When starting a new business, needing business planning, seeking funding, or requiring market entry strategies.",
      keyFeatures: [
        "Business planning",
        "Funding solutions",
        "Market strategies",
        "Entrepreneur support"
      ],
      relatedServices: ["global-business-advisors", "innovative-marketing"]
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
    consultationNote: "For consultations, please contact via phone, email, or WhatsApp. We offer free initial consultations to discuss your business needs. Prakash and his team are available to help you navigate your business challenges and explore growth opportunities.",
    availability: "Available for consultations Monday through Friday. Emergency support available for urgent matters. Response time typically within 24 hours.",
    languages: "English, Hindi, and other regional languages supported"
  },
  companies: [
    {
      name: "Wings9 Consultancy",
      description: "Leading business consultancy providing strategic advisory, international expansion support, golden visa assistance, and comprehensive business solutions. Specializes in helping businesses navigate UAE regulations, market entry strategies, and growth opportunities.",
      focus: "Business consultancy, international expansion, golden visa, strategic advisory",
      services: ["Business setup in UAE", "Golden visa applications", "Market entry strategies", "Compliance guidance", "Strategic business advisory"],
      targetAudience: "Entrepreneurs, investors, businesses seeking UAE expansion, companies needing compliance support"
    },
    {
      name: "Wings9 Properties",
      description: "Premium real estate services offering property sales, leasing, investment consulting, and property management. Specializes in residential and commercial properties across UAE, helping clients make informed real estate investment decisions.",
      focus: "Real estate services, property investment, sales and leasing",
      services: ["Property sales", "Leasing services", "Investment consulting", "Property management", "Real estate advisory"],
      targetAudience: "Property buyers, sellers, investors, businesses needing commercial space, real estate investors"
    },
    {
      name: "Wings9 Vacation Homes",
      description: "Specialized vacation rental and hospitality services, helping property owners maximize returns through short-term rentals and vacation home management. Provides end-to-end solutions for vacation property investments.",
      focus: "Vacation rentals, hospitality services, property management",
      services: ["Vacation rental management", "Short-term rental services", "Hospitality consulting", "Property optimization"],
      targetAudience: "Vacation property owners, hospitality investors, property managers"
    },
    {
      name: "Wings9 Technology",
      description: "Cutting-edge technology solutions and digital transformation services. Provides enterprise software development, cloud solutions, AI integration, and technology consulting to help businesses modernize and scale digitally.",
      focus: "Technology solutions, digital transformation, software development",
      services: ["Software development", "Cloud solutions", "Digital transformation", "Technology consulting", "AI and automation"],
      targetAudience: "Businesses needing digital transformation, startups requiring tech solutions, enterprises seeking modernization"
    },
    {
      name: "Wings9 Fashion",
      description: "Fashion and retail consulting services, helping fashion brands and retailers with business strategy, market entry, brand development, and retail operations. Specializes in connecting fashion businesses with international markets.",
      focus: "Fashion retail, brand development, retail consulting",
      services: ["Fashion brand consulting", "Retail strategy", "Market entry for fashion brands", "Brand development"],
      targetAudience: "Fashion brands, retailers, fashion entrepreneurs, clothing businesses"
    }
  ],
  primaryObjective: "Help clients understand services, identify the right solution, and book consultations when appropriate.",
  
  // Additional context for better understanding
  whyChooseWings9: [
    "20+ years of combined experience in business advisory and real estate",
    "Comprehensive multi-domain expertise under one roof",
    "Deep understanding of UAE regulations and business practices",
    "Proven track record with 100+ successful client engagements",
    "Client-centric approach with personalized service",
    "End-to-end support from planning to execution",
    "Strong network and partnerships in UAE and international markets",
    "Compliance-first approach ensuring regulatory adherence"
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
    "Financial Services"
  ],
  
  commonUseCases: [
    "Setting up a business in UAE",
    "Expanding business internationally",
    "Obtaining golden visa for investors",
    "Buying or selling property in UAE",
    "Resolving rental disputes",
    "VAT registration and tax compliance",
    "Digital transformation initiatives",
    "Market entry strategies",
    "Business licensing and regulatory compliance",
    "Investment consulting"
  ],
  
  successFactors: [
    "Expert knowledge of UAE business environment",
    "Strong relationships with regulatory authorities",
    "Comprehensive understanding of international markets",
    "Personalized approach to each client",
    "Proven methodologies and frameworks",
    "Continuous learning and adaptation",
    "Ethical business practices",
    "Long-term client relationships"
  ]
} as const;
