import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Strict design tokens from visual_spec.skill.md
const designTokens = {
  light: {
    background_primary: "#ffffff",
    background_secondary: "#e2e8f0",
    text_primary: "#5c5c5c",
    text_secondary: "#475569",
    border: "#e2e8f0",
    chart_palette: ["#ea75b0", "#7375c9", "#f59e0b", "#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#ef4444", "#10b981", "#8b5cf6"],
    components: {
      button: {
        primaryBg: "#598dc5", primaryHoverBg: "#054aa3", primaryText: "#ffffff",
        secondaryBg: "#ffffff", secondaryHoverBg: "#f8fafc", secondaryText: "#598dc5", secondaryBorder: "#e2e8f0",
        destructiveBg: "#ea7676", destructiveHoverBg: "#a91439", destructiveText: "#ffffff",
        ghostText: "#598dc5", ghostHoverBg: "#e9edf1",
        borderRadius: 3, paddingX: 11, paddingY: 5, fontWeight: "500", fontSize: 14, fontFamily: "\"Inter\", sans-serif",
      },
      card: {
        bg: "#ffffff", borderColor: "#e2e8f0", borderRadius: 12, padding: 20,
        titleColor: "#457bb4", valueColor: "#5f6972",
      },
      overlay: {
        bg: "#ffffff", borderColor: "#e2e8f0", textColor: "#64748b", headerTextColor: "#0f172a",
        footerBg: "#f8fafc", borderRadius: 12,
      },
      table: {
        bg: "#ffffff", borderColor: "#e2e8f0", headerText: "#457bba", rowText: "#657281",
        rowBorder: "#f1f5f9", borderRadius: 5, headerTypography: "small", rowTypography: "xs",
      },
      typography: {
        h2: { fontSize: 30, fontWeight: "600", fontFamily: "\"Inter\", sans-serif", color: "#5c5c5c" },
        h4: { fontSize: 20, fontWeight: "600", fontFamily: "\"Inter\", sans-serif", color: "#5c5c5c" },
        h6: { fontSize: 14, fontWeight: "600", fontFamily: "\"Inter\", sans-serif", color: "#64748b", textTransform: "uppercase" },
        p: { fontSize: 14, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#475569" },
        small: { fontSize: 12, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#64748b" },
        xs: { fontSize: 12, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#64748b" },
      }
    }
  },
  dark: {
    background_primary: "#1a1a1a",
    background_secondary: "#1e293b",
    text_primary: "#dbdbdb",
    text_secondary: "#cbd5e1",
    border: "#1e293b",
    chart_palette: ["#ea75b0", "#7375c9", "#f59e0b", "#62a8ea", "#aaa47c", "#a8d95e", "#40bdd4", "#ef4444", "#10b981", "#8b5cf6"],
    components: {
      button: {
        primaryBg: "#5aa1d8", primaryHoverBg: "#3875a3", primaryText: "#000000",
        secondaryBg: "#292929", secondaryHoverBg: "#122940", secondaryText: "#a0a7b0", secondaryBorder: "#1e293b",
        destructiveBg: "#25a77c", destructiveHoverBg: "#610f24", destructiveText: "#cfcfcf",
        ghostText: "#9ea5ae", ghostHoverBg: "#eff6ff",
        borderRadius: 8, paddingX: 16, paddingY: 8, fontWeight: "500", fontSize: 14, fontFamily: "\"Inter\", sans-serif",
      },
      card: {
        bg: "#1a1a1a", borderColor: "#1e293b", borderRadius: 12, padding: 20,
        titleColor: "#94a3b8", valueColor: "#3b82f6",
      },
      overlay: {
        bg: "#1a1a1a", borderColor: "#1e293b", textColor: "#94a3b8", headerTextColor: "#f8fafc",
        footerBg: "#121212", borderRadius: 12,
      },
      table: {
        bg: "#1a1a1a", borderColor: "#1e293b", headerText: "#94a3b8", rowText: "#cbd5e1",
        rowBorder: "#262626", borderRadius: 12, headerTypography: "xs", rowTypography: "p",
      },
      typography: {
        h2: { fontSize: 30, fontWeight: "600", fontFamily: "\"Inter\", sans-serif", color: "#f8fafc" },
        h4: { fontSize: 20, fontWeight: "500", fontFamily: "\"Inter\", sans-serif", color: "#f8fafc" },
        h6: { fontSize: 14, fontWeight: "600", fontFamily: "\"Inter\", sans-serif", color: "#94a3b8", textTransform: "uppercase" },
        p: { fontSize: 16, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#cbd5e1" },
        small: { fontSize: 12, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#94a3b8" },
        xs: { fontSize: 12, fontWeight: "400", fontFamily: "\"Inter\", sans-serif", color: "#64748b" },
      }
    }
  }
};

const getThemeTokens = (mode) => designTokens[mode];

const generateMockData = () => {
  const campaigns = Array.from({ length: 15 }, (_, i) => {
    const id = `CAM-${1000 + i}`;
    const spend = parseFloat((Math.random() * 10000).toFixed(2));
    const impressions = Math.floor(Math.random() * 500000);
    const clicks = Math.floor(impressions * (0.01 + Math.random() * 0.05)); // 1-6% CTR
    const conversions = Math.floor(clicks * (0.005 + Math.random() * 0.03)); // 0.5-3.5% CVR
    const cpc = clicks > 0 ? (spend / clicks).toFixed(2) : 0;
    const cpa = conversions > 0 ? (spend / conversions).toFixed(2) : 0;
    const statuses = ['Active', 'Paused', 'Draft', 'Completed'];
    const types = ['Search', 'Display', 'Social', 'Video'];
    const startDate = new Date(2023, 0, 1 + i).toISOString().split('T')[0];
    const endDate = new Date(2023, 0, 15 + i).toISOString().split('T')[0];

    return {
      id,
      name: `Campaign ${i + 1} - ${types[i % types.length]}`,
      status: statuses[i % statuses.length],
      type: types[i % types.length],
      spend,
      impressions,
      clicks,
      conversions,
      cpc: parseFloat(cpc),
      cpa: parseFloat(cpa),
      startDate,
      endDate,
    };
  });

  const dailyMetrics = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(2023, 10, i + 1).toISOString().split('T')[0];
    const spend = parseFloat((Math.random() * 1000 + 500).toFixed(2));
    const impressions = Math.floor(Math.random() * 10000 + 5000);
    const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
    const conversions = Math.floor(clicks * (0.01 + Math.random() * 0.015));
    return { date, spend, impressions, clicks, conversions };
  });

  const statusBreakdown = campaigns.reduce((acc, campaign) => {
    acc[campaign.status] = (acc[campaign.status] || 0) + campaign.spend;
    return acc;
  }, {});

  const typeBreakdown = campaigns.reduce((acc, campaign) => {
    acc[campaign.type] = (acc[campaign.type] || 0) + campaign.impressions;
    return acc;
  }, {});

  return { campaigns, dailyMetrics, statusBreakdown, typeBreakdown };
};

export default function AdCampaignsDashboard() {
  const [themeMode, setThemeMode] = useState('light'); // State for theme mode
  const tokens = getThemeTokens(themeMode);

  const [campaignsData, setCampaignsData] = useState([]);
  const [dailyMetricsData, setDailyMetricsData] = useState([]);
  const [statusBreakdownData, setStatusBreakdownData] = useState([]);
  const [typeBreakdownData, setTypeBreakdownData] = useState([]);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');

  useEffect(() => {
    const { campaigns, dailyMetrics, statusBreakdown, typeBreakdown } = generateMockData();
    setCampaignsData(campaigns);
    setDailyMetricsData(dailyMetrics);
    setStatusBreakdownData(Object.entries(statusBreakdown).map(([name, value]) => ({ name, value })));
    setTypeBreakdownData(Object.entries(typeBreakdown).map(([name, value]) => ({ name, value })));
  }, []);

  const totalSpend = campaignsData.reduce((sum, c) => sum + c.spend, 0);
  const totalImpressions = campaignsData.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaignsData.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaignsData.reduce((sum, c) => sum + c.conversions, 0);

  const handleAddNewCampaign = () => {
    if (newCampaignName.trim()) {
      const newCampaign = {
        id: `CAM-${Math.floor(Math.random() * 10000)}`,
        name: newCampaignName.trim(),
        status: 'Draft',
        type: 'Unknown',
        spend: 0,
        impressions: 0,
        clicks: 0,
        conversions: 0,
        cpc: 0,
        cpa: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      };
      setCampaignsData([newCampaign, ...campaignsData]);
      setNewCampaignName('');
      setIsNewCampaignModalOpen(false);
    }
  };

  const Typography = ({ variant, children, className = '' }) => {
    const Component = variant.startsWith('h') ? variant : 'p';
    const style = tokens.components.typography[variant] || tokens.components.typography.p;
    const color = themeMode === 'light' ? style.color : (style.darkColor || style.color);

    return (
      <Component
        className={className}
        style={{
          fontSize: `${style.fontSize}px`,
          fontWeight: style.fontWeight,
          fontFamily: style.fontFamily,
          color: color,
          letterSpacing: style.letterSpacing || 'normal',
          lineHeight: style.lineHeight || 'normal',
          textTransform: style.textTransform || 'none',
          fontStyle: style.fontStyle || 'normal',
        }}
      >
        {children}
      </Component>
    );
  };

  const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
    const buttonTokens = tokens.components.button;
    const baseStyle = {
      fontFamily: buttonTokens.fontFamily,
      fontSize: `${buttonTokens.fontSize}px`,
      fontWeight: buttonTokens.fontWeight,
      borderRadius: `${buttonTokens.borderRadius}px`,
      paddingLeft: `${buttonTokens.paddingX}px`,
      paddingRight: `${buttonTokens.paddingX}px`,
      paddingTop: `${buttonTokens.paddingY}px`,
      paddingBottom: `${buttonTokens.paddingY}px`,
      letterSpacing: buttonTokens.letterSpacing,
      textTransform: buttonTokens.textTransform,
      transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out, color 0.2s ease-in-out',
      cursor: 'pointer',
    };

    let variantStyle = {};
    let hoverStyle = {};

    if (variant === 'primary') {
      variantStyle = {
        backgroundColor: buttonTokens.primaryBg,
        color: buttonTokens.primaryText,
      };
      hoverStyle = {
        backgroundColor: buttonTokens.primaryHoverBg,
      };
    } else if (variant === 'secondary') {
      variantStyle = {
        backgroundColor: buttonTokens.secondaryBg,
        color: buttonTokens.secondaryText,
        border: `1px solid ${buttonTokens.secondaryBorder}`,
      };
      hoverStyle = {
        backgroundColor: buttonTokens.secondaryHoverBg,
      };
    } else if (variant === 'destructive') {
      variantStyle = {
        backgroundColor: buttonTokens.destructiveBg,
        color: buttonTokens.destructiveText,
      };
      hoverStyle = {
        backgroundColor: buttonTokens.destructiveHoverBg,
      };
    } else if (variant === 'ghost') {
      variantStyle = {
        backgroundColor: 'transparent',
        color: buttonTokens.ghostText,
      };
      hoverStyle = {
        backgroundColor: buttonTokens.ghostHoverBg,
      };
    }

    return (
      <button
        onClick={onClick}
        className={className}
        style={{ ...baseStyle, ...variantStyle }}
        onMouseEnter={(e) => {
          Object.entries(hoverStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }}
        onMouseLeave={(e) => {
          Object.entries(variantStyle).forEach(([key, value]) => {
            e.currentTarget.style[key] = value;
          });
        }}
      >
        {children}
      </button>
    );
  };

  const Card = ({ title, value, children }) => {
    const cardTokens = tokens.components.card;
    const titleTypo = tokens.components.typography.h6;
    const valueTypo = tokens.components.typography.h4;
    const titleColor = themeMode === 'light' ? cardTokens.titleColor : (cardTokens.darkTitleColor || cardTokens.titleColor);
    const valueColor = themeMode === 'light' ? cardTokens.valueColor : (cardTokens.darkValueColor || cardTokens.valueColor);
    const bgColor = themeMode === 'light' ? cardTokens.bg : (cardTokens.darkBg || cardTokens.bg);
    const borderColor = themeMode === 'light' ? cardTokens.borderColor : (cardTokens.darkBorderColor || cardTokens.borderColor);

    return (
      <div
        className="flex flex-col p-4 shadow-sm"
        style={{
          backgroundColor: bgColor,
          borderColor: borderColor,
          borderWidth: '1px',
          borderRadius: `${cardTokens.borderRadius}px`,
          padding: `${cardTokens.padding}px`,
        }}
      >
        <Typography
          variant="h6"
          className="mb-2"
          style={{
            fontSize: `${titleTypo.fontSize}px`,
            fontWeight: titleTypo.fontWeight,
            fontFamily: titleTypo.fontFamily,
            color: titleColor,
            textTransform: titleTypo.textTransform,
            letterSpacing: titleTypo.letterSpacing,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h4"
          style={{
            fontSize: `${valueTypo.fontSize}px`,
            fontWeight: valueTypo.fontWeight,
            fontFamily: valueTypo.fontFamily,
            color: valueColor,
            letterSpacing: valueTypo.letterSpacing,
          }}
        >
          {value}
        </Typography>
        {children}
      </div>
    );
  };

  const Modal = ({ title, isOpen, onClose, children, footerContent }) => {
    if (!isOpen) return null;

    const overlayTokens = tokens.components.overlay;
    const bgColor = themeMode === 'light' ? overlayTokens.bg : (overlayTokens.darkBg || overlayTokens.bg);
    const borderColor = themeMode === 'light' ? overlayTokens.borderColor : (overlayTokens.darkBorderColor || overlayTokens.borderColor);
    const headerTextColor = themeMode === 'light' ? overlayTokens.headerTextColor : tokens.components.typography.h4.darkColor;
    const footerBg = themeMode === 'light' ? overlayTokens.footerBg : overlayTokens.footerBg;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          className="relative w-full max-w-lg mx-auto shadow-lg flex flex-col"
          style={{
            backgroundColor: bgColor,
            borderRadius: `${overlayTokens.borderRadius}px`,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div
            className="flex justify-between items-center px-6 py-4 border-b"
            style={{ borderColor: borderColor }}
          >
            <Typography
              variant="h4"
              style={{
                color: headerTextColor,
                fontSize: `${tokens.components.typography.h4.fontSize}px`,
                fontWeight: tokens.components.typography.h4.fontWeight,
                fontFamily: tokens.components.typography.h4.fontFamily,
              }}
            >
              {title}
            </Typography>
            <Button variant="ghost" onClick={onClose} className="p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color: tokens.text_primary}}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          </div>
          <div className="p-6 flex-grow overflow-y-auto">
            {children}
          </div>
          {footerContent && (
            <div
              className="flex justify-end px-6 py-4 border-t"
              style={{ backgroundColor: footerBg, borderColor: borderColor }}
            >
              {footerContent}
            </div>
          )}
        </div>
      </div>
    );
  };


  return (
    <div
      className="min-h-screen p-8"
      style={{
        backgroundColor: tokens.background_primary,
        color: tokens.text_primary,
        fontFamily: tokens.typography.font_family,
      }}
    >
      <button
        onClick={() => setThemeMode(themeMode === 'light' ? 'dark' : 'light')}
        className="absolute top-4 right-4 px-3 py-1 text-xs rounded-full"
        style={{
          backgroundColor: tokens.background_secondary,
          color: tokens.text_secondary,
          border: `1px solid ${tokens.border}`
        }}
      >
        Toggle {themeMode === 'light' ? 'Dark' : 'Light'} Mode
      </button>

      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h2">Ad Campaigns Overview</Typography>
        <div className="flex items-center space-x-4">
          {/* Mock Date Range Filter UI */}
          <div
            className="flex items-center px-4 py-2 rounded-md border"
            style={{
              borderColor: tokens.border,
              backgroundColor: tokens.background_secondary,
            }}
          >
            <Typography variant="small" className="mr-2" style={{color: tokens.text_secondary}}>Date Range:</Typography>
            <Typography variant="p" style={{color: tokens.text_primary}}>Last 30 Days</Typography>
          </div>
          <Button onClick={() => setIsNewCampaignModalOpen(true)}>Add New Campaign</Button>
        </div>
      </div>

      {/* Top Row (KPI Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card title="Total Spend" value={`$${totalSpend.toLocaleString()}`} />
        <Card title="Total Impressions" value={totalImpressions.toLocaleString()} />
        <Card title="Total Clicks" value={totalClicks.toLocaleString()} />
        <Card title="Total Conversions" value={totalConversions.toLocaleString()} />
      </div>

      {/* Middle Section (Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div
          className="lg:col-span-2 p-4 shadow-sm flex flex-col"
          style={{
            backgroundColor: tokens.components.card.bg,
            borderColor: tokens.components.card.borderColor,
            borderWidth: '1px',
            borderRadius: `${tokens.components.card.borderRadius}px`,
          }}
        >
          <Typography variant="h4" className="mb-4" style={{
            color: themeMode === 'light' ? tokens.components.card.titleColor : tokens.components.card.darkTitleColor
          }}>Daily Performance Trend</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyMetricsData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.border} />
              <XAxis dataKey="date" stroke={tokens.text_secondary} style={{ fontSize: '10px' }} />
              <YAxis stroke={tokens.text_secondary} style={{ fontSize: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tokens.components.overlay.bg,
                  borderColor: tokens.components.overlay.borderColor,
                  borderRadius: '5px',
                  color: tokens.text_primary,
                }}
                itemStyle={{ color: tokens.text_primary }}
                labelStyle={{ color: tokens.text_secondary }}
              />
              <Line type="monotone" dataKey="spend" stroke={tokens.chart_palette[1]} activeDot={{ r: 8 }} name="Spend" />
              <Line type="monotone" dataKey="impressions" stroke={tokens.chart_palette[3]} name="Impressions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          className="p-4 shadow-sm flex flex-col"
          style={{
            backgroundColor: tokens.components.card.bg,
            borderColor: tokens.components.card.borderColor,
            borderWidth: '1px',
            borderRadius: `${tokens.components.card.borderRadius}px`,
          }}
        >
          <Typography variant="h4" className="mb-4" style={{
            color: themeMode === 'light' ? tokens.components.card.titleColor : tokens.components.card.darkTitleColor
          }}>Spend by Campaign Status</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusBreakdownData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={tokens.border} />
              <XAxis dataKey="name" stroke={tokens.text_secondary} style={{ fontSize: '10px' }} />
              <YAxis stroke={tokens.text_secondary} style={{ fontSize: '10px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tokens.components.overlay.bg,
                  borderColor: tokens.components.overlay.borderColor,
                  borderRadius: '5px',
                  color: tokens.text_primary,
                }}
                itemStyle={{ color: tokens.text_primary }}
                labelStyle={{ color: tokens.text_secondary }}
              />
              <Bar dataKey="value" fill={tokens.chart_palette[0]} name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section (Data Table) */}
      <div
        className="p-4 shadow-sm overflow-x-auto"
        style={{
          backgroundColor: tokens.components.table.bg,
          borderColor: tokens.components.table.borderColor,
          borderWidth: '1px',
          borderRadius: `${tokens.components.table.borderRadius}px`,
        }}
      >
        <Typography variant="h4" className="mb-4" style={{
          color: themeMode === 'light' ? tokens.components.card.titleColor : tokens.components.card.darkTitleColor
        }}>All Campaigns</Typography>
        <table className="min-w-full divide-y" style={{ borderColor: tokens.components.table.rowBorder }}>
          <thead>
            <tr>
              {['ID', 'Name', 'Status', 'Type', 'Spend', 'Impressions', 'Clicks', 'Conversions', 'CPC', 'CPA', 'Start Date', 'End Date'].map((header) => (
                <th
                  key={header}
                  className="px-4 py-2 text-left"
                  style={{
                    fontSize: `${tokens.components.typography.small.fontSize}px`,
                    fontWeight: tokens.components.typography.small.fontWeight,
                    fontFamily: tokens.components.typography.small.fontFamily,
                    color: tokens.components.table.headerText,
                    textTransform: 'uppercase',
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: tokens.components.table.rowBorder }}>
            {campaignsData.map((campaign) => (
              <tr key={campaign.id}>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.id}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.name}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.status}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.type}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  ${campaign.spend.toLocaleString()}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.impressions.toLocaleString()}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.clicks.toLocaleString()}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.conversions.toLocaleString()}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  ${campaign.cpc}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  ${campaign.cpa}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.startDate}
                </td>
                <td
                  className="px-4 py-2 whitespace-nowrap"
                  style={{
                    fontSize: `${tokens.components.typography.xs.fontSize}px`,
                    fontWeight: tokens.components.typography.xs.fontWeight,
                    fontFamily: tokens.components.typography.xs.fontFamily,
                    color: tokens.components.table.rowText,
                  }}
                >
                  {campaign.endDate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Campaign Modal */}
      <Modal
        title="Add New Campaign"
        isOpen={isNewCampaignModalOpen}
        onClose={() => setIsNewCampaignModalOpen(false)}
        footerContent={
          <>
            <Button variant="secondary" onClick={() => setIsNewCampaignModalOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleAddNewCampaign}>Create Campaign</Button>
          </>
        }
      >
        <div className="flex flex-col space-y-4">
          <label style={{
            fontSize: `${tokens.components.typography.p.fontSize}px`,
            fontWeight: tokens.components.typography.p.fontWeight,
            fontFamily: tokens.components.typography.p.fontFamily,
            color: tokens.components.overlay.textColor,
          }}>
            Campaign Name:
            <input
              type="text"
              value={newCampaignName}
              onChange={(e) => setNewCampaignName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              style={{
                backgroundColor: themeMode === 'light' ? designTokens.light.components.input.bg : designTokens.dark.components.input.darkBg,
                borderColor: themeMode === 'light' ? designTokens.light.components.input.borderColor : designTokens.dark.components.input.darkBorderColor,
                color: themeMode === 'light' ? designTokens.light.components.input.textColor : designTokens.dark.components.input.textColor,
                fontFamily: tokens.components.typography.p.fontFamily,
                fontSize: `${tokens.components.typography.p.fontSize}px`,
                fontWeight: tokens.components.typography.p.fontWeight,
              }}
              placeholder="e.g., Summer Sale 2024"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}