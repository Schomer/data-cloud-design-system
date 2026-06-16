#!/usr/bin/env node
// createBrandThemes.cjs
// Creates theme files for popular design systems and seeds them to Firestore.
'use strict';

const { writeFileSync, mkdirSync, existsSync, readFileSync } = require('fs');
const { join } = require('path');

const THEMES_DIR = join(__dirname, 'backend', 'themes');
const FBTOOLS = '/Users/schomer/.npm/_npx/ba4f1959e38407b5/node_modules/firebase-tools';
const PROJECT_ID = 'malloy-data';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// ── Theme definitions ────────────────────────────────────────────────
const BRAND_THEMES = [

  // 1. Stripe
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Clean, modern fintech UI. Crisp whites, deep indigo-purple primary, and razor-sharp typography.',
    font: '"Inter", sans-serif',
    primary: '#635BFF',
    primaryHover: '#4F47E5',
    primaryText: '#ffffff',
    secondary: '#F6F9FC',
    secondaryText: '#635BFF',
    secondaryBorder: '#E6EBF1',
    destructive: '#DF1B41',
    destructiveHover: '#B01232',
    cardBg: '#ffffff',
    cardBorder: '#E6EBF1',
    cardRadius: 8,
    inputBg: '#ffffff',
    inputBorder: '#E6EBF1',
    inputFocus: '#635BFF',
    inputRadius: 6,
    bodyColor: '#1A1F36',
    mutedColor: '#697386',
    h1Color: '#1A1F36',
    badgePrimary: '#EEF0FF',
    badgePrimaryText: '#635BFF',
    badgeSuccess: '#CBFFCD',
    badgeSuccessText: '#0A4D0A',
    navBg: '#0A2540',
    navText: '#ffffff',
    alertInfo: { bg: '#F5F8FF', border: '#D0D9FF', icon: '#635BFF', title: '#1A1F36', text: '#3D4EAC' },
    alertSuccess: { bg: '#EBFFF0', border: '#B0F5C0', icon: '#1A9E3F', title: '#0A4D1A', text: '#1A9E3F' },
    alertWarning: { bg: '#FFF8E6', border: '#FFD980', icon: '#D97706', title: '#7C3E00', text: '#D97706' },
    alertError: { bg: '#FFF0F3', border: '#FFB3C1', icon: '#DF1B41', title: '#7C0A1A', text: '#DF1B41' },
    spinnerColor: '#635BFF',
    chartColors: { light: ['#635BFF','#0073E6','#00B4D8','#06D6A0','#FFB703','#FB8500','#E63946','#8338EC','#3A86FF','#FF006E'], dark: ['#8B85FF','#4DA6FF','#33C5E8','#33E8B0','#FFC833','#FFA033','#FF6B74','#A866FF','#66A8FF','#FF4DA6'] }
  },

  // 2. GitHub
  {
    id: 'github',
    name: 'GitHub',
    description: 'Developer-focused. Monospace accents, dark neutral palette, and GitHub Primer design language.',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
    primary: '#1F883D',
    primaryHover: '#1A7334',
    primaryText: '#ffffff',
    secondary: '#f6f8fa',
    secondaryText: '#24292F',
    secondaryBorder: '#d0d7de',
    destructive: '#CF222E',
    destructiveHover: '#A40E26',
    cardBg: '#ffffff',
    cardBorder: '#d0d7de',
    cardRadius: 6,
    inputBg: '#ffffff',
    inputBorder: '#d0d7de',
    inputFocus: '#0969DA',
    inputRadius: 6,
    bodyColor: '#24292F',
    mutedColor: '#57606A',
    h1Color: '#1F2328',
    badgePrimary: '#ddf4ff',
    badgePrimaryText: '#0550AE',
    badgeSuccess: '#dafbe1',
    badgeSuccessText: '#116329',
    navBg: '#24292F',
    navText: '#ffffff',
    alertInfo: { bg: '#ddf4ff', border: '#54aeff66', icon: '#0969DA', title: '#0550AE', text: '#0550AE' },
    alertSuccess: { bg: '#dafbe1', border: '#2da44e66', icon: '#1A7F37', title: '#116329', text: '#116329' },
    alertWarning: { bg: '#fff8c5', border: '#D4A72C66', icon: '#9A6700', title: '#7D4E00', text: '#7D4E00' },
    alertError: { bg: '#FFEBE9', border: '#FF818266', icon: '#CF222E', title: '#A40E26', text: '#A40E26' },
    spinnerColor: '#0969DA',
    chartColors: { light: ['#0969DA','#1A7F37','#9A6700','#CF222E','#8250DF','#1B7FC4','#2DA44E','#BF8700','#E5534B','#A475F9'], dark: ['#4493F8','#3FB950','#D29922','#F85149','#BC8CFF','#58B0E8','#56D364','#F0C244','#FF7B72','#D2A8FF'] }
  },

  // 3. Vercel / Next.js
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Minimal, razor-sharp black-and-white aesthetic. The design language of modern deployment and developer tools.',
    font: '"Geist", "Inter", system-ui, sans-serif',
    primary: '#000000',
    primaryHover: '#333333',
    primaryText: '#ffffff',
    secondary: '#fafafa',
    secondaryText: '#000000',
    secondaryBorder: '#eaeaea',
    destructive: '#EE0000',
    destructiveHover: '#CC0000',
    cardBg: '#ffffff',
    cardBorder: '#eaeaea',
    cardRadius: 12,
    inputBg: '#ffffff',
    inputBorder: '#eaeaea',
    inputFocus: '#000000',
    inputRadius: 8,
    bodyColor: '#111111',
    mutedColor: '#666666',
    h1Color: '#000000',
    badgePrimary: '#f2f2f2',
    badgePrimaryText: '#000000',
    badgeSuccess: '#F0FFF4',
    badgeSuccessText: '#1C7C38',
    navBg: '#000000',
    navText: '#ffffff',
    alertInfo: { bg: '#F2F2F2', border: '#CCCCCC', icon: '#000000', title: '#000000', text: '#333333' },
    alertSuccess: { bg: '#EBFBEE', border: '#99E9B2', icon: '#1C7C38', title: '#1C7C38', text: '#1C7C38' },
    alertWarning: { bg: '#FFFBEB', border: '#FED7AA', icon: '#C05621', title: '#7C2D12', text: '#C05621' },
    alertError: { bg: '#FFF0F0', border: '#FFCCCC', icon: '#EE0000', title: '#CC0000', text: '#EE0000' },
    spinnerColor: '#000000',
    chartColors: { light: ['#000000','#444444','#888888','#BBBBBB','#0070F3','#7928CA','#F5A623','#50E3C2','#FF0080','#E00000'], dark: ['#FFFFFF','#AAAAAA','#777777','#444444','#3291FF','#9E50F0','#F7B955','#79FFE1','#FF0080','#FF5555'] }
  },

  // 4. Linear
  {
    id: 'linear',
    name: 'Linear',
    description: 'Sleek, dark-first SaaS aesthetic. Purple accent, ultra-smooth surfaces — the gold standard for modern product tools.',
    font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    primary: '#5E6AD2',
    primaryHover: '#4F59C0',
    primaryText: '#ffffff',
    secondary: '#F7F7F8',
    secondaryText: '#5E6AD2',
    secondaryBorder: '#E5E5E7',
    destructive: '#E5484D',
    destructiveHover: '#C53030',
    cardBg: '#ffffff',
    cardBorder: '#E5E5E7',
    cardRadius: 10,
    inputBg: '#ffffff',
    inputBorder: '#E5E5E7',
    inputFocus: '#5E6AD2',
    inputRadius: 8,
    bodyColor: '#1A1A1A',
    mutedColor: '#6E6E7C',
    h1Color: '#1A1A1A',
    badgePrimary: '#EEEEFF',
    badgePrimaryText: '#5E6AD2',
    badgeSuccess: '#E8F8F0',
    badgeSuccessText: '#148553',
    navBg: '#F7F7F8',
    navText: '#1A1A1A',
    alertInfo: { bg: '#EEF0FF', border: '#C0C8FF', icon: '#5E6AD2', title: '#2D3282', text: '#5E6AD2' },
    alertSuccess: { bg: '#E8F8F0', border: '#A8E6C4', icon: '#148553', title: '#0A5C38', text: '#148553' },
    alertWarning: { bg: '#FEF9EC', border: '#FBDF8F', icon: '#C08B00', title: '#7A5400', text: '#C08B00' },
    alertError: { bg: '#FFF0F0', border: '#FFBBBB', icon: '#E5484D', title: '#B01E23', text: '#E5484D' },
    spinnerColor: '#5E6AD2',
    chartColors: { light: ['#5E6AD2','#26B5CE','#4BAE8A','#F2C94C','#EB5757','#9B51E0','#F2994A','#219653','#2F80ED','#BB6BD9'], dark: ['#8892E8','#4DCFE8','#6DC9A6','#F8D97A','#F08080','#B87DE8','#F8B770','#4CB87A','#60A8F8','#D093E8'] }
  },

  // 5. Atlassian (Jira/Confluence)
  {
    id: 'atlassian',
    name: 'Atlassian',
    description: 'Enterprise-grade blue. The trusted design language behind Jira, Confluence, and Bitbucket.',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Noto Sans", sans-serif',
    primary: '#0C66E4',
    primaryHover: '#0055CC',
    primaryText: '#ffffff',
    secondary: '#F1F2F4',
    secondaryText: '#0C66E4',
    secondaryBorder: '#C1C7D0',
    destructive: '#CA3521',
    destructiveHover: '#AE2A19',
    cardBg: '#ffffff',
    cardBorder: '#DFE1E6',
    cardRadius: 4,
    inputBg: '#F7F8F9',
    inputBorder: '#DFE1E6',
    inputFocus: '#0C66E4',
    inputRadius: 4,
    bodyColor: '#172B4D',
    mutedColor: '#626F86',
    h1Color: '#172B4D',
    badgePrimary: '#E9F2FF',
    badgePrimaryText: '#0055CC',
    badgeSuccess: '#DCFFF1',
    badgeSuccessText: '#216E4E',
    navBg: '#1868DB',
    navText: '#ffffff',
    alertInfo: { bg: '#E9F2FF', border: '#85B8FF', icon: '#0C66E4', title: '#0055CC', text: '#0055CC' },
    alertSuccess: { bg: '#DCFFF1', border: '#7EE2B8', icon: '#1F845A', title: '#216E4E', text: '#216E4E' },
    alertWarning: { bg: '#FFF7D6', border: '#F8E6A0', icon: '#CF9F02', title: '#7F5F01', text: '#946F00' },
    alertError: { bg: '#FFECEB', border: '#FD9891', icon: '#CA3521', title: '#AE2A19', text: '#AE2A19' },
    spinnerColor: '#0C66E4',
    chartColors: { light: ['#0C66E4','#1F845A','#CF9F02','#CA3521','#6E5DC6','#0065FF','#00875A','#FF991F','#DE350B','#403294'], dark: ['#579DFF','#4BCE97','#F5CD47','#F87462','#9F8FEF','#4C9AFF','#57D9A3','#FFB94A','#FF7452','#8777D9'] }
  },

  // 6. Shopify Polaris
  {
    id: 'shopify_polaris',
    name: 'Shopify Polaris',
    description: 'Commerce-first. Shopify\'s Polaris design language — friendly greens, rounded surfaces, and merchant-focused clarity.',
    font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    primary: '#008060',
    primaryHover: '#00674E',
    primaryText: '#ffffff',
    secondary: '#F6F6F7',
    secondaryText: '#008060',
    secondaryBorder: '#C9CCCF',
    destructive: '#D82C0D',
    destructiveHover: '#BC2200',
    cardBg: '#ffffff',
    cardBorder: '#E1E3E5',
    cardRadius: 12,
    inputBg: '#ffffff',
    inputBorder: '#8C9196',
    inputFocus: '#458FFF',
    inputRadius: 8,
    bodyColor: '#202223',
    mutedColor: '#6D7175',
    h1Color: '#202223',
    badgePrimary: '#AEE9D1',
    badgePrimaryText: '#00474F',
    badgeSuccess: '#AEE9D1',
    badgeSuccessText: '#00474F',
    navBg: '#1A1A1A',
    navText: '#ffffff',
    alertInfo: { bg: '#EBF9FC', border: '#98C6CD', icon: '#006A8A', title: '#003D52', text: '#006A8A' },
    alertSuccess: { bg: '#F1F8F5', border: '#95C9B4', icon: '#008060', title: '#00474F', text: '#008060' },
    alertWarning: { bg: '#FFF5EA', border: '#F4C983', icon: '#B98900', title: '#594430', text: '#B98900' },
    alertError: { bg: '#FFF4F4', border: '#FFA8A0', icon: '#D82C0D', title: '#7A1500', text: '#D82C0D' },
    spinnerColor: '#008060',
    chartColors: { light: ['#008060','#458FFF','#5BCDDA','#F49342','#B98900','#D82C0D','#6D50B5','#00A0AC','#E37400','#C12257'], dark: ['#33C896','#82B4FF','#82D9E5','#F7B37A','#DFAE00','#F97156','#9E89D8','#33C8D4','#F0A040','#E05C8C'] }
  },

  // 7. Ant Design (Alibaba)
  {
    id: 'ant_design',
    name: 'Ant Design',
    description: 'Enterprise UI from Alibaba. Clean blue system used across thousands of enterprise dashboards in China and globally.',
    font: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    primary: '#1677FF',
    primaryHover: '#0958D9',
    primaryText: '#ffffff',
    secondary: '#ffffff',
    secondaryText: '#1677FF',
    secondaryBorder: '#1677FF',
    destructive: '#FF4D4F',
    destructiveHover: '#D9363E',
    cardBg: '#ffffff',
    cardBorder: '#F0F0F0',
    cardRadius: 8,
    inputBg: '#ffffff',
    inputBorder: '#D9D9D9',
    inputFocus: '#1677FF',
    inputRadius: 6,
    bodyColor: '#000000D9',
    mutedColor: '#00000073',
    h1Color: '#000000E0',
    badgePrimary: '#E6F4FF',
    badgePrimaryText: '#1677FF',
    badgeSuccess: '#F6FFED',
    badgeSuccessText: '#389E0D',
    navBg: '#001529',
    navText: '#ffffff',
    alertInfo: { bg: '#E6F4FF', border: '#91CAFF', icon: '#1677FF', title: '#003EB3', text: '#1677FF' },
    alertSuccess: { bg: '#F6FFED', border: '#B7EB8F', icon: '#52C41A', title: '#135200', text: '#389E0D' },
    alertWarning: { bg: '#FFFBE6', border: '#FFE58F', icon: '#FAAD14', title: '#613400', text: '#D48806' },
    alertError: { bg: '#FFF2F0', border: '#FFCCC7', icon: '#FF4D4F', title: '#820014', text: '#CF1322' },
    spinnerColor: '#1677FF',
    chartColors: { light: ['#1677FF','#52C41A','#FAAD14','#FF4D4F','#722ED1','#13C2C2','#EB2F96','#FA8C16','#A0D911','#2F54EB'], dark: ['#4096FF','#73D13D','#FFC53D','#FF7875','#9254DE','#36CFC9','#F759AB','#FFA940','#BAE637','#597EF7'] }
  },

  // 8. IBM Carbon
  {
    id: 'ibm_carbon',
    name: 'IBM Carbon',
    description: 'IBM\'s open-source design system. Precise, technical, and enterprise-ready with IBM Plex and a cool grey palette.',
    font: '"IBM Plex Sans", "Helvetica Neue", Arial, sans-serif',
    primary: '#0F62FE',
    primaryHover: '#0050E6',
    primaryText: '#ffffff',
    secondary: '#e0e0e0',
    secondaryText: '#161616',
    secondaryBorder: '#8d8d8d',
    destructive: '#DA1E28',
    destructiveHover: '#BA1B23',
    cardBg: '#ffffff',
    cardBorder: '#E0E0E0',
    cardRadius: 0,
    inputBg: '#F4F4F4',
    inputBorder: '#8D8D8D',
    inputFocus: '#0F62FE',
    inputRadius: 0,
    bodyColor: '#161616',
    mutedColor: '#525252',
    h1Color: '#161616',
    badgePrimary: '#D0E2FF',
    badgePrimaryText: '#0043CE',
    badgeSuccess: '#DEFBE6',
    badgeSuccessText: '#044317',
    navBg: '#161616',
    navText: '#F4F4F4',
    alertInfo: { bg: '#EDF5FF', border: '#4589FF', icon: '#0F62FE', title: '#002D9C', text: '#0043CE' },
    alertSuccess: { bg: '#DEFBE6', border: '#42BE65', icon: '#24A148', title: '#044317', text: '#198038' },
    alertWarning: { bg: '#FDF6DD', border: '#F1C21B', icon: '#F1C21B', title: '#3E1A00', text: '#8E6A00' },
    alertError: { bg: '#FFF1F1', border: '#FF8389', icon: '#DA1E28', title: '#750E13', text: '#DA1E28' },
    spinnerColor: '#0F62FE',
    chartColors: { light: ['#0F62FE','#42BE65','#F1C21B','#DA1E28','#8A3FFC','#09BAB5','#FF832B','#D4BBFF','#A7F0BA','#FFD6E8'], dark: ['#4589FF','#6FDC8C','#F6D860','#FF8389','#BE95FF','#3DDBD9','#FF832B','#D4BBFF','#A7F0BA','#FFB3B8'] }
  },
];

// ── Build full specs.json from theme config ──────────────────────────
function buildSpecs(t) {
  const fontFamily = t.font;
  return {
    light: {
      button: {
        primaryBg: t.primary, primaryHoverBg: t.primaryHover, primaryText: t.primaryText,
        primaryLabel: 'Primary Action',
        secondaryBg: t.secondary, secondaryHoverBg: t.cardBg, secondaryText: t.secondaryText,
        secondaryBorder: t.secondaryBorder, secondaryLabel: 'Secondary',
        destructiveBg: t.destructive, destructiveHoverBg: t.destructiveHover, destructiveText: '#ffffff',
        destructiveLabel: 'Destructive',
        ghostText: t.primary, ghostHoverBg: t.secondary, ghostLabel: 'Ghost Button',
        borderRadius: t.cardRadius, paddingX: 12, paddingY: 6,
        fontWeight: '500', typographyVariant: 'small', fontSize: 14,
        fontFamily, letterSpacing: 'normal', textTransform: 'none',
        secondaryDarkBg: '#1e1e1e', secondaryDarkHoverBg: '#2a2a2a', secondaryDarkText: '#e0e0e0',
        secondaryDarkBorder: '#444', ghostDarkText: t.primary, ghostDarkHoverBg: '#1e1e1e',
      },
      input: {
        bg: t.inputBg, borderColor: t.inputBorder, focusRingColor: t.inputFocus,
        borderRadius: t.inputRadius, paddingX: 10, paddingY: 5,
        placeholder: 'Enter text...', textColor: t.bodyColor,
        typographyVariant: 'p', darkBg: '#1a1a1a', darkBorderColor: '#333',
      },
      checkbox: { bg: t.primary, borderColor: t.primary, textColor: t.bodyColor, typographyVariant: 'p' },
      radio: { bg: '#ffffff', dotColor: t.primary, textColor: t.mutedColor, typographyVariant: 'p' },
      switch: { bgOn: t.primary, bgOff: '#d1d5db', circleOn: '#ffffff', circleOff: '#ffffff' },
      segmented: {
        bg: t.secondary, selectedBg: '#ffffff', selectedText: t.primary,
        textColor: t.mutedColor, typographyVariant: 'small',
      },
      card: {
        bg: t.cardBg, borderColor: t.cardBorder, borderRadius: t.cardRadius,
        padding: 20, titleColor: t.primary, valueColor: t.bodyColor,
        subtitleColor: t.mutedColor, footerColor: t.mutedColor,
        kpiLabelColor: t.mutedColor, kpiBg: t.cardBg, kpiBorderColor: t.cardBorder,
        darkBg: '#1a1a1a', darkBorderColor: '#333',
      },
      badge: {
        primaryBg: t.badgePrimary, primaryText: t.badgePrimaryText,
        successBg: t.badgeSuccess, successText: t.badgeSuccessText,
        warningBg: '#FEF9EC', warningText: '#92400E',
        errorBg: '#FEF2F2', errorText: '#991B1B',
        neutralBg: t.secondary, neutralText: t.mutedColor,
        borderRadius: Math.max(4, t.cardRadius),
      },
      typography: {
        h1: { fontSize: 32, fontWeight: '700', fontFamily, color: t.h1Color, letterSpacing: '-0.02em', lineHeight: '1.2', content: 'The quick brown fox' },
        h2: { fontSize: 24, fontWeight: '600', fontFamily, color: t.h1Color, letterSpacing: '-0.01em', lineHeight: '1.3', content: 'Section heading' },
        h3: { fontSize: 20, fontWeight: '600', fontFamily, color: t.h1Color, letterSpacing: 'normal', lineHeight: '1.4', content: 'Card title or panel header' },
        h4: { fontSize: 16, fontWeight: '600', fontFamily, color: t.h1Color, letterSpacing: 'normal', lineHeight: '1.4', content: 'Subsection heading' },
        h5: { fontSize: 14, fontWeight: '600', fontFamily, color: t.h1Color, letterSpacing: 'normal', lineHeight: '1.5', content: 'Small heading' },
        h6: { fontSize: 12, fontWeight: '600', fontFamily, color: t.mutedColor, letterSpacing: '0.05em', lineHeight: '1.5', content: 'LABEL / EYEBROW' },
        p: { fontSize: 14, fontWeight: '400', fontFamily, color: t.bodyColor, letterSpacing: 'normal', lineHeight: '1.6', content: 'Body text for descriptions, tooltips, and general UI copy.' },
        small: { fontSize: 12, fontWeight: '400', fontFamily, color: t.mutedColor, letterSpacing: 'normal', lineHeight: '1.5', content: 'Smaller body text for secondary information.' },
        xs: { fontSize: 11, fontWeight: '400', fontFamily, color: t.mutedColor, letterSpacing: 'normal', lineHeight: '1.5', content: 'Extra small utility text.' },
        mono: { fontSize: 13, fontWeight: '400', fontFamily: 'monospace', color: t.bodyColor, bg: t.secondary, letterSpacing: 'normal', lineHeight: '1.5', content: 'console.log("Hello")', darkColor: '#e0e0e0', darkBg: '#1a1a1a' },
        muted: { fontSize: 14, fontWeight: '400', fontFamily, color: t.mutedColor, fontStyle: 'italic', letterSpacing: 'normal', lineHeight: '1.5', content: 'No data available.', darkColor: '#555' },
        bodyBase: { fontSize: 16, fontWeight: '400', fontFamily, color: t.bodyColor, darkColor: '#e0e0e0', letterSpacing: 'normal', lineHeight: '1.625', content: 'The quick brown fox jumps over the lazy dog. This base text size is used for primary article content.' },
        bodySmall: { fontSize: 14, fontWeight: '400', fontFamily, color: t.bodyColor, darkColor: '#aaa', letterSpacing: 'normal', lineHeight: '1.625', content: 'The quick brown fox jumps over the lazy dog. Small body text for data tables and secondary content.' },
        bodyXs: { fontSize: 12, fontWeight: '400', fontFamily, color: t.mutedColor, darkColor: '#666', letterSpacing: 'normal', lineHeight: '1.5', content: 'Extra small text for metadata, timestamps, and chart axis labels.' },
      },
      alert: {
        infoBg: t.alertInfo.bg, infoBorder: t.alertInfo.border, infoIcon: t.alertInfo.icon, infoTitle: t.alertInfo.title, infoText: t.alertInfo.text,
        successBg: t.alertSuccess.bg, successBorder: t.alertSuccess.border, successIcon: t.alertSuccess.icon, successTitle: t.alertSuccess.title, successText: t.alertSuccess.text,
        warningBg: t.alertWarning.bg, warningBorder: t.alertWarning.border, warningIcon: t.alertWarning.icon, warningTitle: t.alertWarning.title, warningText: t.alertWarning.text,
        errorBg: t.alertError.bg, errorBorder: t.alertError.border, errorIcon: t.alertError.icon, errorTitle: t.alertError.title, errorText: t.alertError.text,
        borderRadius: t.cardRadius,
      },
      loader: {
        spinnerColor: t.spinnerColor, spinnerSecondaryColor: t.mutedColor,
        spinnerSuccessColor: t.alertSuccess.icon, progressBg: t.secondary,
        progressFill: t.spinnerColor, borderRadius: t.cardRadius,
      },
      chart: { titleTypography: 'h3', subtitleTypography: 'small', headerPaddingY: 16 },
    },
  };
}

// ── Write local files ──────────────────────────────────────────────────
function writeThemeFiles(theme) {
  const dir = join(THEMES_DIR, theme.id);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, 'metadata.json'), JSON.stringify({
    id: theme.id, name: theme.name, description: theme.description, thumbnail: '',
  }, null, 2));

  writeFileSync(join(dir, 'specs.json'), JSON.stringify(buildSpecs(theme), null, 2));
  writeFileSync(join(dir, 'chart_colors.json'), JSON.stringify(theme.chartColors, null, 2));
  console.log(`  ✓ Files written for: ${theme.name}`);
}

// ── Seed to Firestore ──────────────────────────────────────────────────
const api = require(`${FBTOOLS}/lib/api`);
const CLIENT_ID = typeof api.clientId === 'function' ? api.clientId() : api.clientId;
const CLIENT_SECRET = typeof api.clientSecret === 'function' ? String(api.clientSecret()) : String(api.clientSecret);

async function getFreshToken() {
  const config = JSON.parse(readFileSync(`${process.env.HOME}/.config/configstore/firebase-tools.json`, 'utf-8'));
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, refresh_token: config.tokens.refresh_token, grant_type: 'refresh_token' }).toString(),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error('Token refresh failed: ' + JSON.stringify(data));
  return data.access_token;
}

function toVal(v) {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === 'string') return { stringValue: v };
  if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === 'boolean') return { booleanValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toVal) } };
  if (typeof v === 'object') { const f = {}; for (const [k, val] of Object.entries(v)) f[k] = toVal(val); return { mapValue: { fields: f } }; }
  return { stringValue: String(v) };
}

async function patch(token, path, data) {
  const fields = {};
  for (const [k, v] of Object.entries(data)) fields[k] = toVal(v);
  const res = await fetch(`${BASE}/${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`PATCH ${path} → ${res.status}: ${(await res.text()).slice(0,200)}`);
}

async function seedTheme(token, theme) {
  const specs = buildSpecs(theme);
  await patch(token, `themes/${theme.id}`, { id: theme.id, name: theme.name, description: theme.description, thumbnail: '' });
  await patch(token, `themes/${theme.id}/data/specs`, specs);
  await patch(token, `themes/${theme.id}/data/chartColors`, theme.chartColors);
}

async function main() {
  console.log('📁 Writing local theme files...');
  for (const theme of BRAND_THEMES) writeThemeFiles(theme);

  console.log('\n🔑 Refreshing token...');
  const token = await getFreshToken();
  console.log('✅ Token ready\n');

  console.log('🔥 Seeding to Firestore...');
  for (const theme of BRAND_THEMES) {
    process.stdout.write(`  Seeding ${theme.name.padEnd(20)}`);
    await seedTheme(token, theme);
    console.log('✓');
  }

  console.log(`\n✅ Done! Created ${BRAND_THEMES.length} brand themes.`);
  process.exit(0);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
