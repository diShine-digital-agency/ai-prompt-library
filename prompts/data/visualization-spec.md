---
title: Data Visualization Specification
category: data
tags: [visualization, charts, design, storytelling, presentation]
difficulty: intermediate
models: [claude, gpt-4, gemini]
---

# Data Visualization Specification

Design effective data visualizations with proper chart selection, color usage,
annotation, and data storytelling principles.

## When to Use

- Presenting data findings to stakeholders
- Designing charts for reports and presentations
- Building interactive data exploration tools
- Creating infographics for public communication
- Specifying visualization requirements for BI tools

## The Technique

Effective data visualization is about making the right data visible to the right
audience in the right way. Chart selection, color, and annotation should all serve
the story the data tells.

## Template

```
Design a data visualization for:

Data: {{data_description}}
Audience: {{audience}} (technical level and role)
Purpose: {{purpose}} (explore / explain / persuade / monitor)
Medium: {{medium}} (presentation / report / dashboard / social media)
Tool: {{tool}} (matplotlib / D3.js / Tableau / Figma / etc.)

For each visualization, specify:

1. CHART SELECTION
- Chart type: [name]
- Reasoning: Why this chart type for this data and purpose
- Alternatives considered and why they were rejected

2. DATA MAPPING
- X-axis: {{variable}} (scale type: linear / log / categorical / time)
- Y-axis: {{variable}} (scale type and range)
- Color: {{variable_or_fixed}} (meaning and palette)
- Size: {{variable_or_fixed}} (if bubble/proportional)
- Labels: Which data points to label directly

3. DESIGN SPECIFICATIONS
- Title: Descriptive, states the insight (not just "Revenue Chart")
- Subtitle: Context or time period
- Axis labels and units
- Legend placement and format
- Grid lines: show / hide / subtle
- Aspect ratio: recommended width:height
- Font sizes: title (18pt), axis (12pt), labels (10pt), annotation (9pt)

4. COLOR PALETTE
- Sequential data: [specific color ramp]
- Diverging data: [specific diverging palette]
- Categorical data: [specific distinct colors]
- Accessibility: Colorblind-safe palette
- Highlight color for emphasis

5. ANNOTATIONS
- Key data points to annotate
- Trend lines or reference lines
- Benchmark or target indicators
- Contextual notes (events, seasonal markers)

6. INTERACTIVITY (if applicable)
- Tooltip content on hover
- Click behavior (drill-down, filter, navigate)
- Zoom and pan capabilities
- Animation or transition effects

Chart selection guide:
| Data Relationship | Chart Type | When to Use |
|-------------------|-----------|-------------|
| Trend over time | Line chart | Continuous time series |
| Comparison | Bar chart | Comparing categories |
| Composition | Stacked bar or treemap | Parts of a whole |
| Distribution | Histogram or box plot | Spread of values |
| Correlation | Scatter plot | Relationship between 2 vars |
| Geographic | Choropleth map | Location-based data |
| Flow | Sankey diagram | Movement between stages |
| Hierarchy | Treemap or sunburst | Nested categories |
```

## Examples

### Revenue Trend Visualization

```
Data: Monthly revenue by product line (3 products, 24 months)
Audience: Board of directors (non-technical)
Purpose: Explain growth trajectory

Chart: Multi-line chart with area fill

Design:
- Title: "SaaS Revenue Grew 140% in Two Years, Led by Enterprise Plan"
- Subtitle: "Monthly Recurring Revenue by Product Tier, Jan 2024 - Dec 2025"
- X-axis: Month (abbreviated: Jan, Feb, ...)
- Y-axis: Revenue ($0 to $3M, formatted as $XM)
- Lines: Enterprise (blue, prominent), Pro (teal), Starter (gray, subtle)
- Annotation: Arrow pointing to inflection point: "Enterprise plan launched"
- Reference line: Dashed horizontal at $2M target
- Area fill: Light opacity under each line for cumulative effect

Color: Blue (#2563EB), Teal (#0D9488), Gray (#9CA3AF)
Colorblind-safe: Yes (distinguishable by both hue and value)
```

## Tips

1. **Title states the insight** — "Revenue Grew 23% YoY" is better than
   "Revenue Chart." The title should tell the story at a glance.

2. **Remove chartjunk** — Grid lines, 3D effects, decorative elements, and
   gradient fills distract from the data. Minimize non-data ink.

3. **Annotate the interesting parts** — If you are presenting the chart, add
   annotations that highlight what you want the audience to notice.

4. **Design for colorblind users** — 8% of males have color vision deficiency.
   Use shape, pattern, or direct labels in addition to color.

5. **Start y-axis at zero for bar charts** — Truncated y-axes on bar charts
   visually exaggerate small differences. Line charts can start above zero.

## Common Mistakes

1. **Wrong chart type** — Pie charts with 15 slices, line charts for
   categorical data, and 3D charts for any purpose are common errors.

2. **Too much data** — A chart with 50 lines or 100 bars is unreadable.
   Aggregate, filter, or use small multiples.

3. **Missing context** — Numbers without units, time periods, or benchmarks
   leave the audience guessing what they are looking at.

4. **Dual y-axes** — Charts with two y-axes are almost always misleading.
   Use separate panels or normalize the data instead.

5. **Rainbow color palettes** — Using every color in the spectrum makes it
   impossible to distinguish categories. Use a coherent palette with 5-7 colors.
