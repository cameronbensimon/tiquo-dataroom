"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface FeatureRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function FeatureRoadmapModal({ isOpen, onClose, title = "Feature Roadmap" }: FeatureRoadmapModalProps) {
  
  // Feature roadmap data structure
  const roadmapData = [
    // Header row
    { 
      category: "Category", 
      feature: "Feature", 
      description: "Description", 
      q3_2025: "Q3 2025", 
      q4_2025: "Q4 2025", 
      q1_2026: "Q1 2026",
      isHeader: true 
    },
    // Users/Customers category
    { category: "Users/Customers", feature: "Predictive CLV", description: "AI-driven estimate of customer lifetime value to inform marketing and service decisions.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Custom user parameters & unstructured data", description: "Add custom fields and store unstructured notes/preferences per profile.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Intake forms", description: "Customizable lead/guest intake forms to capture inquiries, sign-ups, or pre-arrival details.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Membership management", description: "Create, renew, freeze/cancel memberships and track benefits and status.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "CRM functionality", description: "Central customer database with contact history, tasks, and pipelines.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Digital IDs (QR + Apple and Google Wallet)", description: "Issue QR codes and Apple/Google Wallet passes for membership or access.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Guest social graph", description: "Link related guests (family, company, friends) to visualize relationships and group accounts.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Unified Online and Offline order & purchase history", description: "Track purchases online and in person for a 360° customer view.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Recurring subscriptions", description: "Automated recurring billing for plans and services with retries and notifications.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Customer loyalty programs", description: "Points/tiered programs with rewards and perks to increase retention.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Customer segmentation & tags", description: "Create dynamic segments/tags based on spend, behavior, or demographics.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "AI-driven guest insights", description: "Surface preferences and smart tips from history/reviews to personalize service.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Duplicate profile merge", description: "Detect and merge duplicates to maintain a single source of truth per guest.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Customer Authentication category
    { category: "Customer Authentication", feature: "Email OTP auth", description: "One-time passcodes via email for secure sign-in.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "SMS OTP auth", description: "One-time passcodes via SMS to add a security factor.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Email + order/inventory auth", description: "Passwordless access using email plus a recent order or active inventory number.", q3_2025: false, q4_2025: false, q1_2026: true },
    { category: "", feature: "Embedded login widget", description: "Iframe/webview login component for seamless sign-on in other apps/sites.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Magic link (passwordless)", description: "Email-based link that signs the user in without a password.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Social login", description: "Sign in with Google, Facebook, Apple, etc., to reduce friction.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Two-factor authentication (2FA/MFA)", description: "Require an extra verification step (e.g., SMS or authenticator app).", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Single Sign-On (SSO)", description: "SAML/OIDC support for enterprise identity providers.", q3_2025: false, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Channels category
    { category: "Channels", feature: "Channel manager integration", description: "Two-way sync of rates, inventory, and bookings with OTAs and GDS via channel managers.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Direct OTA/GDS connectivity", description: "Connect directly to Booking.com, Expedia, etc., where available.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Multi-channel inventory sync", description: "Real-time parity and availability across website, OTAs, and direct sales.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Channel performance analytics", description: "Reports on production by channel and acquisition costs.", q3_2025: false, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Customer Flow category
    { category: "Customer Flow", feature: "Custom domain", description: "Host booking portal on a branded domain/subdomain.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Embeddable booking widget", description: "Iframe/widget to embed booking on existing sites.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "AI chat booking", description: "Conversational assistant for inquiries and bookings.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Hourly/minute booking", description: "Fine-grained time-slot reservations for rooms/desks/resources.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Day booking", description: "Full-day reservations for activities or spaces.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Night booking", description: "Overnight stays for lodging/hospitality.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-day booking", description: "Reserve continuous multi-day periods and packages.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Enquiries & RFPs", description: "Capture and manage tentative requests with CRM-style pipeline.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Online payments", description: "Accept deposits or full payments during booking checkout.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "In-person payments", description: "Record/pay on site and unify with online transactions.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "White-label theming", description: "Per-flow theming of colors, logos, and styles.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Group & event booking", description: "Manage room blocks, banquets, packages, and group billing.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Table-side ordering & payments", description: "Guests/staff place orders and pay at the table from devices.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Self-service kiosks", description: "Self check-in/out or self-ordering via kiosks.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Online/Mobile check-in/out", description: "Digital registration and checkout; supports digital keys/QRs.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-language & locale", description: "Localized UI, currency, timezone, and tax settings.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Full theming", description: "Customize the design, branding, and details entirely for your use case.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Dynamic pricing & upsells", description: "Peak/off-peak rules, add-ons, early/late check-in offers in flow.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Settle your bill directly on your phone", description: "Pay for any open tabs directly from your phone without needing to ask staff for your bill.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Sub Locations category
    { category: "Sub Locations", feature: "Check-in/check-out workflows", description: "End-to-end flows for lodging, classes, coworking, etc.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Per-sublocation Stripe connection", description: "Connect separate payment accounts per business unit/brand.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-property management", description: "Operate multiple venues/properties under one admin.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Departmental segmentation", description: "Separate catalogs/settings per department (spa, F&B, retail).", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Single payment splitting", description: "Take and split a single payment across multiple sub-locations and legal entities automatically.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Cross-sub-location selling allocation", description: "Attach services across groups (e.g., spa add-on to room booking).", q3_2025: true, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Integrations category
    { category: "Integrations", feature: "Native integration marketplace", description: "Hundreds of ready-made connectors across accounting, CRM, POS, RMS, etc.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Zapier integration", description: "No-code workflows to sync with thousands of external apps.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Open API & webhooks", description: "REST/GraphQL API and webhooks for custom extensions and data sync.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Accounting/ERP", description: "Sync invoices, payments, products, and inventory to systems like Xero/QuickBooks/ERPs.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Take payments", description: "Support Stripe, Adyen, PayPal, and regional processors.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Access control & devices", description: "Integrate locks, turnstiles, Wi‑Fi, printers for automated on-site access.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Developer SDKs/widgets", description: "Build custom widgets or apps on top of the platform.", q3_2025: false, q4_2025: false, q1_2026: true },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Notifications category
    { category: "Notifications", feature: "Email notifications", description: "Customizable transactional emails for confirmations, receipts, etc.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "SMS notifications", description: "Time-sensitive reminders and alerts via text message.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Automated triggers", description: "Abandoned cart, post-visit follow-ups, renewal notices.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Push notifications", description: "Mobile/app push for reminders, offers, or messages.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "In-app notifications", description: "On-portal alerts for messages, changes, or updates.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // General category
    { category: "General", feature: "Live data engine", description: "Real-time updates across availability, POS, profiles, and dashboards.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-currency & global payments", description: "Process payments in multiple currencies with correct local taxes.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Themeable staff back end", description: "White-label branding and configurable admin UX/terminology.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Themeable front end", description: "White-label branding and configurable customer side UX/terminology.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Document and contract creation", description: "Create documents and contracts directly within the platform.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Send e-singing links", description: "Send links for users to sign contracts or documents linking to their profile.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Intake forms", description: "Create and send intake forms with parameters linked to the customer's profile.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Add services or products to active booking", description: "Add products/services to an in-progress booking and have a single payment for all of them together.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "At least 99.9%–99.99% SLA & Security processes", description: "Cloud hosting with strong uptime, encryption, and audits.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "SOC 2", description: "SOC 2 certification to guarantee security.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Offline mode (critical modules)", description: "Continue core operations when internet is down; auto-sync later.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Cross-platform access", description: "Web-first across desktop/tablet/mobile and native apps on IOS, Android and PDQ firmware", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Data privacy compliance", description: "GDPR-ready consent, export/delete, cookie and preference management.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Analytics & dashboards", description: "Customizable KPIs and scheduled reports across modules.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Modular & scalable", description: "Enable only needed modules and scale from single-site to multi-property.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Finances category
    { category: "Finances", feature: "Dunning logic", description: "Automated retries and notices for failed subscription/invoice payments.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Financial analytics & reporting", description: "Revenue breakdowns by product, location, channel, and period.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "PCI-compliant payments", description: "Secure processing with fraud prevention and multiple payment methods.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Tax/VAT/GST calculation", description: "Automatic calculation of local tax rules and rates.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi Tax calculation for hotels depending on length of stay", description: "Change the VAT amount automatically based on the length of the stay, Adjust VAT amount if the stay is extended or shortened.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Invoicing & AR", description: "Create invoices, deposits, reminders; manage receivables at scale.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-currency/accounts", description: "Handle conversions and route funds to different bank accounts.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "City ledger & credit accounts", description: "Bill companies/agents periodically with statements.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Expense & commission tracking", description: "Track costs and commissions for net revenue reporting.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Audit trail & daily closing", description: "Cash drawer closure and immutable log of financial edits.", q3_2025: false, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Point of Sale category
    { category: "Point of Sale", feature: "Multi-location management", description: "Manage unlimited outlets/registers with centralized control.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Shared/separate inventory profiles", description: "Choose global or per-location stock pools; support transfers.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Advanced inventory control", description: "Variants, composites, recipes, barcodes, stock counts, POs, low-stock alerts.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Product/menu management", description: "Categories, modifiers, price rules (e.g., happy hour).", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "In-person payments", description: "Chip and pin, contactless, digital wallet and magnetic stripe payments.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Charge to card on file", description: "Charge payments to the card on file for a user.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Split payments & tipping", description: "Split checks across methods and record gratuities.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Order routing/KDS", description: "Kitchen printers/displays, coursing, and seat numbers for F&B.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Customer-facing checkout display", description: "Optional screen for real-time order/tip/signature.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Receipts & invoices", description: "Print/email receipts and generate invoices from POS.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "POS reporting", description: "Real-time sales, staff, item, and discount performance analytics.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Online ordering integration", description: "Sync e‑commerce/delivery orders and inventory with POS.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Hardware & device support", description: "Support for printers, scanners, drawers, and common POS tablets.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Offline mode for POS", description: "Continue selling offline; reconcile when reconnected.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Staff Authentication & Security category
    { category: "Staff Authentication & Security", feature: "Advanced security controls", description: "Password policies, session rules, and device recognition.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Role-based permissions", description: "Granular roles and custom permissions per user.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Staff PIN login (POS)", description: "Fast PIN/swipe sign-in and per-sale accountability.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Remote device management", description: "Register/disable devices and enforce trusted access.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Audit trails", description: "Log and review critical actions and configuration changes.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Permission change alerts", description: "Notify admins about high-privilege changes.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "SSO for staff", description: "Enterprise SSO (Azure AD, Okta) for centralized security.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Staff training & certification", description: "Built-in guides/checklists for secure compliant usage.", q3_2025: false, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Marketing & Loyalty category
    { category: "Marketing & Loyalty", feature: "Loyalty program management", description: "Points or tiered VIP programs with flexible earn/redeem rules.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Rewards & offers", description: "Coupons, gift cards, referrals, and cashback promotions.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Automated marketing campaigns", description: "Birthday, win-back, and lifecycle email/SMS automation.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Integrated email marketing with segmentation", description: "Send email marketing campaigns through the system without needing to jump to separate systems.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "SMS marketing", description: "Bulk or targeted texting with consent management.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Meta and TikTok pixels.", description: "Integration support with Meta and TikTok pixels.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Surveys & forms", description: "Collect feedback via custom forms tied to profiles.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Campaign analytics", description: "Attribution and revenue impact dashboards for marketing.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Revenue Management category
    { category: "Revenue Management", feature: "Real-time dynamic pricing", description: "Auto-adjust prices based on demand, pacing, and events.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "AI demand forecasting", description: "Predict occupancy/revenue to inform pricing decisions.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Room-level optimization", description: "Optimize rates per room type or unit attributes.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Multi-property/group pricing", description: "Central strategies with local guardrails across a portfolio.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Business mix optimization", description: "Balance transient, group, and corporate segments for profit.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Ancillary revenue management", description: "Yield manage spa, parking, and add-ons by demand.", q3_2025: false, q4_2025: false, q1_2026: true },
    { category: "", feature: "Competitive rate intelligence", description: "Monitor competitor/market data to position pricing.", q3_2025: false, q4_2025: false, q1_2026: true },
    { category: "", feature: "Automated controls & overrides", description: "Full autopilot with min/max rules and manual overrides.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Pickup & pace analytics", description: "Track pickup, pace, forecast vs. actual, RevPAR/ADR/KPIs.", q3_2025: false, q4_2025: true, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Event Management & Ticketing category
    { category: "Event Management & Ticketing", feature: "Custom inquiries and direct bookings", description: "Embeddable forms and direct online bookings for events.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Function sheets, contracts & e-sign on enquiries", description: "Generate BEOs/function sheets and capture digital signatures for enquiries.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Wall-mounted live calendar view display", description: "Mount an iPad on the wall next to a studio or meeting room for example to display the upcoming workings or events.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Online ticketing", description: "Sell ticket types/bundles with promo codes from branded pages.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Time-slot & multi-day events", description: "Calendar-based entry slots and multi-day/session bookings.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Customer selectable seating", description: "Interactive seat maps with section-based pricing.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Restaurant floor plan table management", description: "Place bookings onto tables and manage their tabs directly on the floor plan map.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Attendee management & check-in", description: "Mobile QR scanning, offline-capable check-in, live counts.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Membership/season pass integration", description: "Validate passes for entry and member-priced tickets.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Attendee communications", description: "Broadcast updates, reminders, and confirmations to buyers.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Shared Calendar and ressources", description: "Shared calendars and ressources for event teams.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Event payments & invoicing", description: "Deposits, schedules, and invoices with accounting sync.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Event analytics", description: "Revenue and ticket sales reports, slot heat maps, trends.", q3_2025: true, q4_2025: false, q1_2026: false },
    // Empty row
    { category: "", feature: "", description: "", q3_2025: "", q4_2025: "", q1_2026: "" },
    // Space & Membership Management category
    { category: "Space & Membership Management", feature: "Resource booking (rooms/desks)", description: "Real-time availability and booking for rooms, desks, and equipment.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Member lifecycle management", description: "Onboarding, plan assignment, usage tracking, off-boarding.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Contracts & e-signatures", description: "Digital agreements stored in member profiles with reminders.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Recurring billing & invoicing", description: "Automated invoices, proration, and auto-charges for plans.", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Credits and allowances", description: "Monthly credits for rooms/printing with rollover/expiry rules.", q3_2025: false, q4_2025: true, q1_2026: false },
    { category: "", feature: "Community portal", description: "Directory, announcements, events, and messaging for members.", q3_2025: false, q4_2025: false, q1_2026: true },
    { category: "", feature: "Identity Check In", description: "Check in anywhere or show your identity and membership with your digital card", q3_2025: true, q4_2025: false, q1_2026: false },
    { category: "", feature: "Visitor and Guest management", description: "Pre-registration, associate them to an event or a another CRM user and notifications at check-in.", q3_2025: true, q4_2025: false, q1_2026: false },
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
          value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-400'
        }`}>
          {value ? '✓' : '—'}
        </span>
      );
    }
    return value;
  };

  // Color-code quarters
  const getQuarterColor = (quarter: string) => {
    switch (quarter) {
      case "Q3 2025":
        return "bg-green-100 text-green-800";
      case "Q4 2025":
        return "bg-blue-100 text-blue-800";
      case "Q1 2026":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-700";
    }
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
              width: "min(98vw, 1400px)",
              height: "min(95vh, 900px)",
              maxWidth: "1400px",
              maxHeight: "900px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-200 p-6">
              <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">Development roadmap showing planned feature releases by quarter</p>
            </div>

            {/* Single table layout */}
            <div className="overflow-auto h-[calc(100%-120px)] p-6">
              <div className="overflow-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse text-xs">
                  <thead className="sticky top-0 bg-gray-100 z-10">
                    <tr>
                      <th className="border-b border-gray-300 px-3 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[140px]">
                        Category
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[220px]">
                        Feature
                      </th>
                      <th className="border-b border-gray-300 px-3 py-3 text-left text-xs font-medium text-gray-700 bg-gray-50 min-w-[320px]">
                        Description
                      </th>
                      <th className={`border-b border-gray-300 px-3 py-3 text-center text-xs font-medium rounded-t min-w-[80px] ${getQuarterColor("Q3 2025")}`}>
                        Q3 2025
                      </th>
                      <th className={`border-b border-gray-300 px-3 py-3 text-center text-xs font-medium rounded-t min-w-[80px] ${getQuarterColor("Q4 2025")}`}>
                        Q4 2025
                      </th>
                      <th className={`border-b border-gray-300 px-3 py-3 text-center text-xs font-medium rounded-t min-w-[80px] ${getQuarterColor("Q1 2026")}`}>
                        Q1 2026
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {roadmapData.slice(1).map((row, rowIndex) => {
                      // Check if this is a category header row
                      const isCategoryHeader = row.category && row.category !== "";
                      // Check if this is an empty spacing row
                      const isEmptyRow = !row.category && !row.feature && !row.description;
                      
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
                          <td className={`border-b border-gray-200 px-3 py-3 text-xs ${
                            isCategoryHeader 
                              ? "font-semibold text-blue-900 bg-blue-50" 
                              : "text-gray-600"
                          }`}>
                            {row.category}
                          </td>
                          <td className="border-b border-gray-200 px-3 py-3 text-xs text-gray-900 font-medium">
                            {row.feature}
                          </td>
                          <td className="border-b border-gray-200 px-3 py-3 text-xs text-gray-700 leading-relaxed">
                            {row.description}
                          </td>
                          <td className="border-b border-gray-200 px-3 py-3 text-center">
                            {renderCell(row.q3_2025)}
                          </td>
                          <td className="border-b border-gray-200 px-3 py-3 text-center">
                            {renderCell(row.q4_2025)}
                          </td>
                          <td className="border-b border-gray-200 px-3 py-3 text-center">
                            {renderCell(row.q1_2026)}
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
