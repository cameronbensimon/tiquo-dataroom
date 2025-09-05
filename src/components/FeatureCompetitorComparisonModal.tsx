"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureCompetitorComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function FeatureCompetitorComparisonModal({ isOpen, onClose, title = "Feature Competitor Comparison" }: FeatureCompetitorComparisonModalProps) {
  
  // Feature competitor comparison data structure (based on the complete provided CSV)
  const competitorData = [
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
    // Users/Customers category
    { category: "Users/Customers", subcategory: "Predictive CLV", description: "AI-driven estimate of customer lifetime value to inform marketing and service decisions.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Custom user parameters & unstructured data", description: "Add custom fields and store unstructured notes/preferences per profile.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Intake forms", description: "Customizable lead/guest intake forms to capture inquiries, sign-ups, or pre-arrival details.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "Limited implementation", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "Limited implementation", gymflow: "Limited implementation", ideas: "Limited implementation", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "Fully featured", eventtemple: "Limited implementation", tripleseat: "Limited implementation", ticketTailor: "Fully featured", weezevent: "Fully featured", ticketmaster: "N/A", evenbrite: "Fully featured", officernd: "Fully featured", nexudus: "Fully featured", optix: "Fully featured" },
    { category: "", subcategory: "Membership management", description: "Create, renew, freeze/cancel memberships and track benefits and status.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "CRM functionality", description: "Central customer database with contact history, tasks, and pipelines.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "Limited implementation", passkit: "Limited implementation", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Limited implementation", klaviyo: "Limited implementation", brevo: "Limited implementation", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "Limited implementation", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "Limited implementation", nexudus: "Fully featured", optix: "Limited implementation" },
    { category: "", subcategory: "Digital IDs (QR + Apple and Google Wallet)", description: "Issue QR codes and Apple/Google Wallet passes for membership or access.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "N/A", toast: "Limited implementation", square: "Limited implementation", clover: "N/A", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "Fully featured", passkit: "Fully featured", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Guest social graph", description: "Link related guests (family, company, friends) to visualize relationships and group accounts.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Unified Online and Offline order & purchase history", description: "Track purchases online and in person for a 360° customer view.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Limited implementation", klaviyo: "Limited implementation", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Recurring subscriptions", description: "Automated recurring billing for plans and services with retries and notifications.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "Limited implementation", square: "Fully featured", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Customer loyalty programs", description: "Points/tiered programs with rewards and perks to increase retention.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "Fully featured", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "N/A", passkit: "Fully featured", mindbody: "Fully featured", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Customer segmentation & tags", description: "Create dynamic segments/tags based on spend, behavior, or demographics.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "Limited implementation", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "AI-driven guest insights", description: "Surface preferences and smart tips from history/reviews to personalize service.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "Fully featured", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "Limited implementation", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Duplicate profile merge", description: "Detect and merge duplicates to maintain a single source of truth per guest.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Limited implementation", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Limited implementation", klaviyo: "Limited implementation", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    // Empty row
    { category: "", subcategory: "", description: "", tiquo: "", mews: "", fols: "", opera: "", hotix: "", lightspeed: "", toast: "", square: "", clover: "", salesforce: "", hubspot: "", zoho: "", pipedrive: "", memberstack: "", passkit: "", mindbody: "", abcGlofox: "", exercicecom: "", gymflow: "", ideas: "", atomize: "", mailchimp: "", klaviyo: "", brevo: "", eventtemple: "", tripleseat: "", ticketTailor: "", weezevent: "", ticketmaster: "", evenbrite: "", officernd: "", nexudus: "", optix: "" },
    // Customer Authentication category
    { category: "Customer Authentication", subcategory: "Email OTP auth", description: "One-time passcodes via email for secure sign-in.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "SMS OTP auth", description: "One-time passcodes via SMS to add a security factor.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Email + order/inventory auth", description: "Passwordless access using email plus a recent order or active inventory number.", tiquo: "Fully featured", mews: "N/A", fols: "N/A", opera: "N/A", hotix: "N/A", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "Limited implementation", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "Limited implementation", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Embedded login widget", description: "Iframe/webview login component for seamless sign-on in other apps/sites.", tiquo: "Fully featured", mews: "N/A", fols: "N/A", opera: "N/A", hotix: "N/A", lightspeed: "Limited implementation", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Magic link (passwordless)", description: "Email-based link that signs the user in without a password.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Social login", description: "Sign in with Google, Facebook, Apple, etc., to reduce friction.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Two-factor authentication (2FA/MFA)", description: "Require an extra verification step (e.g., SMS or authenticator app).", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Fully featured", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Limited implementation", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Single Sign-On (SSO)", description: "SAML/OIDC support for enterprise identity providers.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Limited implementation", toast: "N/A", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "Limited implementation", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "Limited implementation", nexudus: "Fully featured", optix: "N/A" },
    // Empty row
    { category: "", subcategory: "", description: "", tiquo: "", mews: "", fols: "", opera: "", hotix: "", lightspeed: "", toast: "", square: "", clover: "", salesforce: "", hubspot: "", zoho: "", pipedrive: "", memberstack: "", passkit: "", mindbody: "", abcGlofox: "", exercicecom: "", gymflow: "", ideas: "", atomize: "", mailchimp: "", klaviyo: "", brevo: "", eventtemple: "", tripleseat: "", ticketTailor: "", weezevent: "", ticketmaster: "", evenbrite: "", officernd: "", nexudus: "", optix: "" },
    // Channels category
    { category: "Channels", subcategory: "Channel manager integration", description: "Two-way sync of rates, inventory, and bookings with OTAs and GDS via channel managers.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Fully featured", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Direct OTA/GDS connectivity", description: "Connect directly to Booking.com, Expedia, etc., where available.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Fully featured", lightspeed: "N/A", toast: "N/A", square: "N/A", clover: "N/A", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Multi-channel inventory sync", description: "Real-time parity and availability across website, OTAs, and direct sales.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Fully featured", lightspeed: "N/A", toast: "N/A", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Channel performance analytics", description: "Reports on production by channel and acquisition costs.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "Limited implementation", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "Fully featured", klaviyo: "Fully featured", brevo: "Limited implementation", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "Limited implementation", nexudus: "Fully featured", optix: "Limited implementation" },
    // Empty row
    { category: "", subcategory: "", description: "", tiquo: "", mews: "", fols: "", opera: "", hotix: "", lightspeed: "", toast: "", square: "", clover: "", salesforce: "", hubspot: "", zoho: "", pipedrive: "", memberstack: "", passkit: "", mindbody: "", abcGlofox: "", exercicecom: "", gymflow: "", ideas: "", atomize: "", mailchimp: "", klaviyo: "", brevo: "", eventtemple: "", tripleseat: "", ticketTailor: "", weezevent: "", ticketmaster: "", evenbrite: "", officernd: "", nexudus: "", optix: "" },
    // Customer Flow category
    { category: "Customer Flow", subcategory: "Custom domain", description: "Host booking portal on a branded domain/subdomain.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "N/A", hotix: "N/A", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "N/A", salesforce: "N/A", hubspot: "N/A", zoho: "Fully featured", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Embeddable booking widget", description: "Iframe/widget to embed booking on existing sites.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "N/A", hotix: "N/A", lightspeed: "Fully featured", toast: "N/A", square: "Fully featured", clover: "N/A", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "AI chat booking", description: "Conversational assistant for inquiries and bookings.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Limited implementation", toast: "Fully featured", square: "Fully featured", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Hourly/minute booking", description: "Fine-grained time-slot reservations for rooms/desks/resources.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Fully featured", toast: "Limited implementation", square: "Fully featured", clover: "Limited implementation", salesforce: "N/A", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "N/A", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Day booking", description: "Full-day reservations for activities or spaces.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "N/A", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "N/A", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Fully featured", optix: "Fully featured" },
    { category: "", subcategory: "Night booking", description: "Overnight stays for lodging/hospitality.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Multi-day booking", description: "Reserve continuous multi-day periods and packages.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Enquiries & RFPs", description: "Capture and manage tentative requests with CRM-style pipeline.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "N/A", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "Limited implementation", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Online payments", description: "Accept deposits or full payments during booking checkout.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "Fully featured", passkit: "Limited implementation", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "N/A", nexudus: "Fully featured", optix: "Limited implementation" },
    { category: "", subcategory: "In-person payments", description: "Record/pay on site and unify with online transactions.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "Limited implementation", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "White-label theming", description: "Per-flow theming of colors, logos, and styles.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Fully featured", hotix: "N/A", lightspeed: "Fully featured", toast: "Limited implementation", square: "Fully featured", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Group & event booking", description: "Manage room blocks, banquets, packages, and group billing.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "Fully featured", tripleseat: "Fully featured", ticketTailor: "Limited implementation", weezevent: "Limited implementation", ticketmaster: "Fully featured", evenbrite: "Fully featured", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Table-side ordering & payments", description: "Guests/staff place orders and pay at the table from devices.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Limited implementation", hotix: "N/A", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Self-service kiosks", description: "Self check-in/out or self-ordering via kiosks.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Limited implementation", optix: "N/A" },
    { category: "", subcategory: "Online/Mobile check-in/out", description: "Digital registration and checkout; supports digital keys/QRs.", tiquo: "Fully featured", mews: "Fully featured", fols: "N/A", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Multi-language & locale", description: "Localized UI, currency, timezone, and tax settings.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "Fully featured", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Full theming", description: "Customize the design, branding, and details entirely for your use case.", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Limited implementation", lightspeed: "Fully featured", toast: "Limited implementation", square: "Fully featured", clover: "Limited implementation", salesforce: "Fully featured", hubspot: "Fully featured", zoho: "Fully featured", pipedrive: "N/A", memberstack: "Fully featured", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "Limited implementation", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "Limited implementation", evenbrite: "Limited implementation", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Dynamic pricing & upsells", description: "Peak/off-peak rules, add-ons, early/late check-in offers in flow.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "Limited implementation", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "N/A", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Limited implementation", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Settle your bill directly on your phone", description: "Pay for any open tabs directly from your phone without needing to ask staff for your bill.", tiquo: "Fully featured", mews: "Limited implementation", fols: "N/A", opera: "Limited implementation", hotix: "N/A", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Fully featured", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "Fully featured", nexudus: "Fully featured", optix: "Fully featured" },
    // Empty row
    { category: "", subcategory: "", description: "", tiquo: "", mews: "", fols: "", opera: "", hotix: "", lightspeed: "", toast: "", square: "", clover: "", salesforce: "", hubspot: "", zoho: "", pipedrive: "", memberstack: "", passkit: "", mindbody: "", abcGlofox: "", exercicecom: "", gymflow: "", ideas: "", atomize: "", mailchimp: "", klaviyo: "", brevo: "", eventtemple: "", tripleseat: "", ticketTailor: "", weezevent: "", ticketmaster: "", evenbrite: "", officernd: "", nexudus: "", optix: "" },
    // Sub Locations category
    { category: "Sub Locations", subcategory: "Check-in/check-out workflows", description: "End-to-end flows for lodging, classes, coworking, etc.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Limited implementation", toast: "Limited implementation", square: "Limited implementation", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "Limited implementation", passkit: "N/A", mindbody: "Fully featured", abcGlofox: "Fully featured", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "Limited implementation", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Per-sublocation Stripe connection", description: "Connect separate payment accounts per business unit/brand.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Limited implementation", hotix: "Limited implementation", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "Limited implementation", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Multi-property management", description: "Operate multiple venues/properties under one admin.", tiquo: "Fully featured", mews: "Fully featured", fols: "Fully featured", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Limited implementation", clover: "Limited implementation", salesforce: "Limited implementation", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Departmental segmentation", description: "Separate catalogs/settings per department (spa, F&B, retail).", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Limited implementation", clover: "Limited implementation", salesforce: "Limited implementation", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" },
    { category: "", subcategory: "Single payment splitting", description: "Take and split a single payment across multiple sub-locations and legal entities automatically.", tiquo: "Fully featured", mews: "Limited implementation", fols: "Limited implementation", opera: "Limited implementation", hotix: "Limited implementation", lightspeed: "Fully featured", toast: "Fully featured", square: "Fully featured", clover: "Limited implementation", salesforce: "N/A", hubspot: "N/A", zoho: "N/A", pipedrive: "N/A", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "N/A", optix: "N/A" },
    { category: "", subcategory: "Cross-sub-location selling allocation", description: "Attach services across groups (e.g., spa add-on to room booking).", tiquo: "Fully featured", mews: "Fully featured", fols: "Limited implementation", opera: "Fully featured", hotix: "Fully featured", lightspeed: "Fully featured", toast: "Fully featured", square: "Limited implementation", clover: "Limited implementation", salesforce: "Limited implementation", hubspot: "Limited implementation", zoho: "Limited implementation", pipedrive: "Limited implementation", memberstack: "N/A", passkit: "N/A", mindbody: "N/A", abcGlofox: "N/A", exercicecom: "N/A", gymflow: "N/A", ideas: "N/A", atomize: "N/A", mailchimp: "N/A", klaviyo: "N/A", brevo: "N/A", eventtemple: "N/A", tripleseat: "N/A", ticketTailor: "N/A", weezevent: "N/A", ticketmaster: "N/A", evenbrite: "N/A", officernd: "N/A", nexudus: "Fully featured", optix: "N/A" }
  ];

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Render cell content
  const renderCell = (value: string) => {
    if (value === "Fully featured") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
          ✓ Full
        </span>
      );
    } else if (value === "Limited implementation") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
          ~ Limited
        </span>
      );
    } else if (value === "N/A") {
      return (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
          ✗ N/A
        </span>
      );
    }
    return value;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
        >
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Close button - outside modal on the right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-colors backdrop-blur-sm cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="relative bg-white rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: "min(98vw, 1800px)",
              height: "min(95vh, 900px)",
              maxWidth: "1800px",
              maxHeight: "900px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
            </div>

            {/* Single table layout */}
            <div className="overflow-auto h-[calc(100%-100px)] p-6">
              <div className="overflow-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                      <th className="border-b border-gray-300 px-2 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[140px]">
                        Category
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[200px]">
                        Feature
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[300px]">
                        Description
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-blue-50 min-w-[80px]">
                        TIQUO
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        MEWS
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        FOLS
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        OPERA
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        HOTIX
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        LIGHTSPEED
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        TOAST
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        SQUARE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        CLOVER
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        SALESFORCE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        HUBSPOT
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        ZOHO
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        PIPEDRIVE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        MEMBERSTACK
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        PASSKIT
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        MINDBODY
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        ABC GLOFOX
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        EXERCICE.COM
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        GYMFLOW
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        IDEAS
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        ATOMIZE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        MAILCHIMP
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        KLAVIYO
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        BREVO
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        EVENTTEMPLE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        TRIPLESEAT
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[110px]">
                        TICKET TAILOR
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        WEEZEVENT
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        TICKETMASTER
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        EVENBRITE
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        OFFICERND
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        NEXUDUS
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        OPTIX
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {competitorData.slice(1).map((row, rowIndex) => {
                      // Check if this is a category header row
                      const isCategoryHeader = row.category && row.category !== "";
                      // Check if this is an empty spacing row
                      const isEmptyRow = !row.category && !row.subcategory && !row.description;
                      
                      return (
                        <tr
                          key={rowIndex}
                          className={`${
                            isEmptyRow 
                              ? "h-4 bg-gray-25" 
                              : isCategoryHeader 
                                ? "bg-blue-50 border-t-2 border-blue-200" 
                                : rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                        >
                          <td className={`border-b border-gray-200 px-2 py-2 text-xs ${
                            isCategoryHeader 
                              ? "font-semibold text-blue-900 bg-blue-50" 
                              : "text-gray-600"
                          }`}>
                            {row.category}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-xs text-gray-900 font-medium">
                            {row.subcategory}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-xs text-gray-700 leading-relaxed">
                            {row.description}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center bg-blue-25">
                            {renderCell(row.tiquo)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.mews)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.fols)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.opera)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.hotix)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.lightspeed)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.toast)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.square)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.clover)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.salesforce)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.hubspot)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.zoho)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.pipedrive)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.memberstack)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.passkit)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.mindbody)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.abcGlofox)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.exercicecom)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.gymflow)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.ideas)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.atomize)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.mailchimp)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.klaviyo)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.brevo)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.eventtemple)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.tripleseat)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.ticketTailor)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.weezevent)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.ticketmaster)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.evenbrite)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.officernd)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.nexudus)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.optix)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
