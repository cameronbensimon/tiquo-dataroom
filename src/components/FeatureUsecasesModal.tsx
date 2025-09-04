"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureUsecasesModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function FeatureUsecasesModal({ isOpen, onClose, title = "Feature Usecases" }: FeatureUsecasesModalProps) {
  
  // Feature usecases data structure
  const usecasesData = [
    // Header row
    { 
      category: "Category", 
      subcategory: "", 
      description: "", 
      hotel: "Hotel", 
      spa: "Spa", 
      restaurant: "Restaurant", 
      gym: "Gym", 
      coworking: "Co-working", 
      exhibition: "Exhibition & Museums", 
      events: "Events", 
      privateHire: "Private Hire", 
      membersClub: "Member&apos;s Club", 
      misc: "Miscellaneous service",
      isHeader: true 
    },
    // Users/Customers category
    { category: "Users/Customers", subcategory: "Predictive CLV", description: "AI-driven estimate of customer lifetime value to inform marketing and service decisions.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Custom user parameters & unstructured data", description: "Add custom fields and store unstructured notes/preferences per profile.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Intake forms", description: "Customizable lead/guest intake forms to capture inquiries, sign-ups, or pre-arrival details.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Membership management", description: "Create, renew, freeze/cancel memberships and track benefits and status.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "CRM functionality", description: "Central customer database with contact history, tasks, and pipelines.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Digital IDs (QR + Apple and Google Wallet)", description: "Issue QR codes and Apple/Google Wallet passes for membership or access.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Guest social graph", description: "Link related guests (family, company, friends) to visualize relationships and group accounts.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Unified Online and Offline order & purchase history", description: "Track purchases online and in person for a 360° customer view.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Recurring subscriptions", description: "Automated recurring billing for plans and services with retries and notifications.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Customer loyalty programs", description: "Points/tiered programs with rewards and perks to increase retention.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Customer segmentation & tags", description: "Create dynamic segments/tags based on spend, behavior, or demographics.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "AI-driven guest insights", description: "Surface preferences and smart tips from history/reviews to personalize service.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Duplicate profile merge", description: "Detect and merge duplicates to maintain a single source of truth per guest.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Customer Authentication category
    { category: "Customer Authentication", subcategory: "Email OTP auth", description: "One-time passcodes via email for secure sign-in.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "SMS OTP auth", description: "One-time passcodes via SMS to add a security factor.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Email + order/inventory auth", description: "Passwordless access using email plus a recent order or active inventory number.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Embedded login widget", description: "Iframe/webview login component for seamless sign-on in other apps/sites.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Magic link (passwordless)", description: "Email-based link that signs the user in without a password.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Social login", description: "Sign in with Google, Facebook, Apple, etc., to reduce friction.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Two-factor authentication (2FA/MFA)", description: "Require an extra verification step (e.g., SMS or authenticator app).", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Single Sign-On (SSO)", description: "SAML/OIDC support for enterprise identity providers.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Channels category
    { category: "Channels", subcategory: "Channel manager integration", description: "Two-way sync of rates, inventory, and bookings with OTAs and GDS via channel managers.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Direct OTA/GDS connectivity", description: "Connect directly to Booking.com, Expedia, etc., where available.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Multi-channel inventory sync", description: "Real-time parity and availability across website, OTAs, and direct sales.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Channel performance analytics", description: "Reports on production by channel and acquisition costs.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Customer Flow category
    { category: "Customer Flow", subcategory: "Custom domain", description: "Host booking portal on a branded domain/subdomain.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Embeddable booking widget", description: "Iframe/widget to embed booking on existing sites.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "AI chat booking", description: "Conversational assistant for inquiries and bookings.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Hourly/minute booking", description: "Fine-grained time-slot reservations for rooms/desks/resources.", hotel: false, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Day booking", description: "Full-day reservations for activities or spaces.", hotel: false, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Night booking", description: "Overnight stays for lodging/hospitality.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Multi-day booking", description: "Reserve continuous multi-day periods and packages.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Enquiries & RFPs", description: "Capture and manage tentative requests with CRM-style pipeline.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Online payments", description: "Accept deposits or full payments during booking checkout.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "In-person payments", description: "Record/pay on site and unify with online transactions.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "White-label theming", description: "Per-flow theming of colors, logos, and styles.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Group & event booking", description: "Manage room blocks, banquets, packages, and group billing.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Table-side ordering & payments", description: "Guests/staff place orders and pay at the table from devices.", hotel: true, spa: true, restaurant: false, gym: true, coworking: false, exhibition: false, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Self-service kiosks", description: "Self check-in/out or self-ordering via kiosks.", hotel: true, spa: true, restaurant: false, gym: false, coworking: true, exhibition: false, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Online/Mobile check-in/out", description: "Digital registration and checkout; supports digital keys/QRs.", hotel: true, spa: false, restaurant: false, gym: false, coworking: true, exhibition: false, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Multi-language & locale", description: "Localized UI, currency, timezone, and tax settings.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Full theming", description: "Customize the design, branding, and details entirely for your use case.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Dynamic pricing & upsells", description: "Peak/off-peak rules, add-ons, early/late check-in offers in flow.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Settle your bill directly on your phone", description: "Pay for any open tabs directly from your phone without needing to ask staff for your bill.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: true, privateHire: false, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Sub Locations category
    { category: "Sub Locations", subcategory: "Check-in/check-out workflows", description: "End-to-end flows for lodging, classes, coworking, etc.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Per-sublocation Stripe connection", description: "Connect separate payment accounts per business unit/brand.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Multi-property management", description: "Operate multiple venues/properties under one admin.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Departmental segmentation", description: "Separate catalogs/settings per department (spa, F&B, retail).", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Single payment splitting", description: "Take and split a single payment across multiple sub-locations and legal entities automatically.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Cross-sub-location selling allocation", description: "Attach services across groups (e.g., spa add-on to room booking).", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Integrations category
    { category: "Integrations", subcategory: "Native integration marketplace", description: "Hundreds of ready-made connectors across accounting, CRM, POS, RMS, etc.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Zapier integration", description: "No-code workflows to sync with thousands of external apps.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Open API & webhooks", description: "REST/GraphQL API and webhooks for custom extensions and data sync.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Accounting/ERP", description: "Sync invoices, payments, products, and inventory to systems like Xero/QuickBooks/ERPs.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Take payments", description: "Support Stripe, Adyen, PayPal, and regional processors.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Access control & devices", description: "Integrate locks, turnstiles, Wi‑Fi, printers for automated on-site access.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Developer SDKs/widgets", description: "Build custom widgets or apps on top of the platform.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Notifications category
    { category: "Notifications", subcategory: "Email notifications", description: "Customizable transactional emails for confirmations, receipts, etc.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "SMS notifications", description: "Time-sensitive reminders and alerts via text message.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Automated triggers", description: "Abandoned cart, post-visit follow-ups, renewal notices.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Push notifications", description: "Mobile/app push for reminders, offers, or messages.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "In-app notifications", description: "On-portal alerts for messages, changes, or updates.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // General category
    { category: "General", subcategory: "Live data engine", description: "Real-time updates across availability, POS, profiles, and dashboards.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Multi-currency & global payments", description: "Process payments in multiple currencies with correct local taxes.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Themeable staff back end", description: "White-label branding and configurable admin UX/terminology.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Themeable front end", description: "White-label branding and configurable customer side UX/terminology.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Document and contract creation", description: "Create documents and contracts directly within the platform.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: false, events: false, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Send e-singing links", description: "Send links for users to sign contracts or documents linking to their profile.", hotel: true, spa: true, restaurant: false, gym: false, coworking: true, exhibition: false, events: false, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Intake forms", description: "Create and send intake forms with parameters linked to the customer&apos;s profile.", hotel: true, spa: true, restaurant: false, gym: true, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Add services or products to active booking", description: "Add products/services to an in-progress booking and have a single payment for all of them together.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: false, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "At least 99.9%–99.99% SLA & Security processes", description: "Cloud hosting with strong uptime, encryption, and audits.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "SOC 2", description: "SOC 2 certification to guarantee security.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Offline mode (critical modules)", description: "Continue core operations when internet is down; auto-sync later.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Cross-platform access", description: "Web-first across desktop/tablet/mobile and native apps on IOS, Android and PDQ firmware", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Data privacy compliance", description: "GDPR-ready consent, export/delete, cookie and preference management.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Analytics & dashboards", description: "Customizable KPIs and scheduled reports across modules.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Modular & scalable", description: "Enable only needed modules and scale from single-site to multi-property..", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Finances category
    { category: "Finances", subcategory: "Dunning logic", description: "Automated retries and notices for failed subscription/invoice payments.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Financial analytics & reporting", description: "Revenue breakdowns by product, location, channel, and period.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "PCI-compliant payments", description: "Secure processing with fraud prevention and multiple payment methods.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Tax/VAT/GST calculation", description: "Automatic calculation of local tax rules and rates.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Multi Tax calculation for hotels depending on length of stay", description: "Change the VAT amount automatically based on the length of the stay, Adjust VAT amount if the stay is extended or shortened.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Invoicing & AR", description: "Create invoices, deposits, reminders; manage receivables at scale.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Multi-currency/accounts", description: "Handle conversions and route funds to different bank accounts.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "City ledger & credit accounts", description: "Bill companies/agents periodically with statements.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Expense & commission tracking", description: "Track costs and commissions for net revenue reporting.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Audit trail & daily closing", description: "Cash drawer closure and immutable log of financial edits.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Point of Sale category
    { category: "Point of Sale", subcategory: "Multi-location management", description: "Manage unlimited outlets/registers with centralized control.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Shared/separate inventory profiles", description: "Choose global or per-location stock pools; support transfers.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Advanced inventory control", description: "Variants, composites, recipes, barcodes, stock counts, POs, low-stock alerts.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Product/menu management", description: "Categories, modifiers, price rules (e.g., happy hour).", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "In-person payments", description: "Chip and pin, contactless, digital wallet and magnetic stripe payments.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Charge to card on file", description: "Charge payments to the card on file for a user.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Split payments & tipping", description: "Split checks across methods and record gratuities.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Order routing/KDS", description: "Kitchen printers/displays, coursing, and seat numbers for F&B.", hotel: true, spa: false, restaurant: true, gym: false, coworking: false, exhibition: false, events: true, privateHire: false, membersClub: true, misc: false },
    { category: "", subcategory: "Customer-facing checkout display", description: "Optional screen for real-time order/tip/signature.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Receipts & invoices", description: "Print/email receipts and generate invoices from POS.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "POS reporting", description: "Real-time sales, staff, item, and discount performance analytics.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Online ordering integration", description: "Sync e‑commerce/delivery orders and inventory with POS.", hotel: true, spa: true, restaurant: true, gym: true, coworking: false, exhibition: false, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Hardware & device support", description: "Support for printers, scanners, drawers, and common POS tablets.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Offline mode for POS", description: "Continue selling offline; reconcile when reconnected.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Staff Authentication & Security category
    { category: "Staff Authentication & Security", subcategory: "Advanced security controls", description: "Password policies, session rules, and device recognition.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Role-based permissions", description: "Granular roles and custom permissions per user.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Staff PIN login (POS)", description: "Fast PIN/swipe sign-in and per-sale accountability.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Remote device management", description: "Register/disable devices and enforce trusted access.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Audit trails", description: "Log and review critical actions and configuration changes.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Permission change alerts", description: "Notify admins about high-privilege changes.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "SSO for staff", description: "Enterprise SSO (Azure AD, Okta) for centralized security.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Staff training & certification", description: "Built-in guides/checklists for secure compliant usage.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Marketing & Loyalty category
    { category: "Marketing & Loyalty", subcategory: "Loyalty program management", description: "Points or tiered VIP programs with flexible earn/redeem rules.", hotel: true, spa: true, restaurant: true, gym: true, coworking: false, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Rewards & offers", description: "Coupons, gift cards, referrals, and cashback promotions.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Automated marketing campaigns", description: "Birthday, win-back, and lifecycle email/SMS automation.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Integrated email marketing with segmentation", description: "Send email marketing campaigns through the system without needing to jump to separate systems.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "SMS marketing", description: "Bulk or targeted texting with consent management.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Meta and TikTok pixels.", description: "Integration support with Meta and TikTok pixels.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Surveys & forms", description: "Collect feedback via custom forms tied to profiles.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Campaign analytics", description: "Attribution and revenue impact dashboards for marketing.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Revenue Management category
    { category: "Revenue Management", subcategory: "Real-time dynamic pricing", description: "Auto-adjust prices based on demand, pacing, and events.", hotel: true, spa: true, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: true, membersClub: false, misc: false },
    { category: "", subcategory: "AI demand forecasting", description: "Predict occupancy/revenue to inform pricing decisions.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Room-level optimization", description: "Optimize rates per room type or unit attributes.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Multi-property/group pricing", description: "Central strategies with local guardrails across a portfolio.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: false, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Business mix optimization", description: "Balance transient, group, and corporate segments for profit.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Ancillary revenue management", description: "Yield manage spa, parking, and add-ons by demand.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Competitive rate intelligence", description: "Monitor competitor/market data to position pricing.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: false },
    { category: "", subcategory: "Automated controls & overrides", description: "Full autopilot with min/max rules and manual overrides.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Pickup & pace analytics", description: "Track pickup, pace, forecast vs. actual, RevPAR/ADR/KPIs.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Event Management & Ticketing category
    { category: "Event Management & Ticketing", subcategory: "Custom inquiries and direct bookings", description: "Embeddable forms and direct online bookings for events.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Function sheets, contracts & e-sign on enquiries", description: "Generate BEOs/function sheets and capture digital signatures for enquiries.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: false },
    { category: "", subcategory: "Wall-mounted live calendar view display", description: "Mount an iPad on the wall next to a studio or meeting room for example to display the upcoming workings or events.", hotel: false, spa: true, restaurant: false, gym: true, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Online ticketing", description: "Sell ticket types/bundles with promo codes from branded pages.", hotel: false, spa: false, restaurant: false, gym: false, coworking: false, exhibition: true, events: true, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Time-slot & multi-day events", description: "Calendar-based entry slots and multi-day/session bookings.", hotel: true, spa: false, restaurant: false, gym: false, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: true },
    { category: "", subcategory: "Customer selectable seating", description: "Interactive seat maps with section-based pricing.", hotel: false, spa: false, restaurant: true, gym: false, coworking: true, exhibition: false, events: true, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Restaurant floor plan table management", description: "Place bookings onto tables and manage their tabs directly on the floor plan map.", hotel: false, spa: false, restaurant: true, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Attendee management & check-in", description: "Mobile QR scanning, offline-capable check-in, live counts.", hotel: true, spa: true, restaurant: true, gym: true, coworking: false, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Membership/season pass integration", description: "Validate passes for entry and member-priced tickets.", hotel: false, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Attendee communications", description: "Broadcast updates, reminders, and confirmations to buyers.", hotel: false, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Shared Calendar and ressources", description: "Shared calendars and ressources for event teams.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Event payments & invoicing", description: "Deposits, schedules, and invoices with accounting sync.", hotel: true, spa: true, restaurant: true, gym: true, coworking: false, exhibition: true, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Event analytics", description: "Revenue and ticket sales reports, slot heat maps, trends.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    // Empty row
    { category: "", subcategory: "", description: "", hotel: "", spa: "", restaurant: "", gym: "", coworking: "", exhibition: "", events: "", privateHire: "", membersClub: "", misc: "" },
    // Space & Membership Management category
    { category: "Space & Membership Management", subcategory: "Resource booking (rooms/desks)", description: "Real-time availability and booking for rooms, desks, and equipment.", hotel: true, spa: false, restaurant: true, gym: false, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: true, misc: true },
    { category: "", subcategory: "Member lifecycle management", description: "Onboarding, plan assignment, usage tracking, off-boarding.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Contracts & e-signatures", description: "Digital agreements stored in member profiles with reminders.", hotel: true, spa: false, restaurant: false, gym: false, coworking: false, exhibition: false, events: false, privateHire: false, membersClub: false, misc: true },
    { category: "", subcategory: "Recurring billing & invoicing", description: "Automated invoices, proration, and auto-charges for plans.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Credits and allowances", description: "Monthly credits for rooms/printing with rollover/expiry rules.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Community portal", description: "Directory, announcements, events, and messaging for members.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Identity Check In", description: "Check in anywhere or show your identity and membership with your digital card", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Visitor and Guest management", description: "Pre-registration, associate them to an event or a another CRM user and notifications at check-in.", hotel: true, spa: true, restaurant: false, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Multi-location management", description: "Central admin for multiple sites with portfolio dashboards.", hotel: true, spa: true, restaurant: true, gym: true, coworking: true, exhibition: true, events: true, privateHire: false, membersClub: true, misc: true },
    { category: "", subcategory: "Space utilization analytics", description: "Occupancy, booking frequency, peak times, and churn KPIs.", hotel: true, spa: true, restaurant: false, gym: false, coworking: true, exhibition: false, events: true, privateHire: true, membersClub: false, misc: true },
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
  const renderCell = (value: string | boolean | number) => {
    if (typeof value === 'boolean') {
      return (
        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? '✓' : '✗'}
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
            className="absolute top-4 right-4 z-30 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition-colors backdrop-blur-sm"
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
              width: "min(98vw, 1600px)",
              height: "min(95vh, 900px)",
              maxWidth: "1600px",
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
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[60px]">
                        Hotel
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[60px]">
                        Spa
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[60px]">
                        Restaurant
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[60px]">
                        Gym
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        Co-working
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        Exhibition & Museums
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[60px]">
                        Events
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[80px]">
                        Private Hire
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[90px]">
                        Member&apos;s Club
                      </th>
                      <th className="border-b border-gray-300 px-2 py-3 text-center text-xs font-medium text-gray-700 bg-gray-50 min-w-[100px]">
                        Miscellaneous
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usecasesData.slice(1).map((row, rowIndex) => {
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
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.hotel)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.spa)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.restaurant)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.gym)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.coworking)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.exhibition)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.events)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.privateHire)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.membersClub)}
                          </td>
                          <td className="border-b border-gray-200 px-2 py-2 text-center">
                            {renderCell(row.misc)}
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
