// This is a temporary file to build the complete competitor data array
// I'll break it into chunks and then combine it all

const allCompetitorData = [
  // Header row
  { 
    category: "Category", 
    subcategory: "", 
    description: "", 
    tiquo: "TIQUO",
    mews: "MEWS",
    fols: "FOLS", 
    opera: "OPERA", 
    hotix: "HOTIX",
    lightspeed: "LIGHTSPEED",
    toast: "TOAST",
    square: "SQUARE",
    clover: "CLOVER",
    salesforce: "SALESFORCE",
    hubspot: "HUBSPOT",
    zoho: "ZOHO",
    pipedrive: "PIPEDRIVE",
    memberstack: "MEMBERSTACK",
    passkit: "PASSKIT",
    mindbody: "MINDBODY",
    abcGlofox: "ABC GLOFOX",
    exercicecom: "EXERCICE.COM",
    gymflow: "GYMFLOW",
    ideas: "IDEAS",
    atomize: "ATOMIZE",
    mailchimp: "MAILCHIMP",
    klaviyo: "KLAVIYO",
    brevo: "BREVO",
    eventtemple: "EVENTTEMPLE",
    tripleseat: "TRIPLESEAT",
    ticketTailor: "TICKET TAILOR",
    weezevent: "WEEZEVENT",
    ticketmaster: "TICKETMASTER",
    evenbrite: "EVENBRITE",
    officernd: "OFFICERND",
    nexudus: "NEXUDUS",
    optix: "OPTIX",
    isHeader: true 
  },
  // Users/Customers category - Complete
  { category: "Users/Customers", subcategory: "Predictive CLV", description: "AI-driven estimate of customer lifetime value to inform marketing and service decisions.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
  { category: "", subcategory: "Custom user parameters & unstructured data", description: "Add custom fields and store unstructured notes/preferences per profile.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
  { category: "", subcategory: "Intake forms", description: "Customizable lead/guest intake forms to capture inquiries, sign-ups, or pre-arrival details.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "Limited implementation", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "Limited implementation", gymflow: "Limited implementation", ideas: "Limited implementation", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "Fully featured", eventtemple: "Limited implementation", tripleseat: "Limited implementation", ticketTailor: "Fully featured", weezevent: "Fully featured", ticketmaster: "N/A", evenbrite: "Fully featured", officernd: "Fully featured", nexudus: "Fully featured", optix: "Fully featured" },
  { category: "", subcategory: "Membership management", description: "Create, renew, freeze/cancel memberships and track benefits and status.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
  { category: "", subcategory: "CRM functionality", description: "Central customer database with contact history, tasks, and pipelines.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "Limited implementation", passkit: "Limited implementation", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Limited implementation", klaviyo: "Limited implementation", brevo: "Limited implementation", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "Limited implementation", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "Limited implementation", nexudus: "Fully featured", optix: "Limited implementation" },
];

// Continue with all other categories...
// This is just a working file to organize the data before putting it back into the component
