Here's a Product Requirements Document (PRD) in Markdown format for your Amazon Product Statistics Viewer application:

```markdown
# Amazon Product Statistics Viewer - PRD

## 1. Overview

A Next.js web application that visualizes Amazon product statistics from Excel data using interactive charts. Users can upload spreadsheets and analyze product metrics through various chart combinations.

## 2. Objectives

- Transform Excel product data into interactive visualizations
- Provide insights through multiple chart combinations
- Enable quick data analysis without spreadsheet manipulation
- User-friendly interface for non-technical users

## 3. Key Features

### 3.1 File Upload & Processing

- Drag-and-drop Excel file upload (.xlsx, .csv)
- File validation (format, size < 10MB)
- Preview uploaded data in tabular format
- Column header recognition

### 3.2 Data Mapping Interface

- Column selection dropdowns for:
  - Order
  - Style
  - Fit
  - Type
  - Pant type
  - MATERIAL
  - MaterialComposition
  - Price
  - Sell
  - Color
- Auto-detect data types (numerical/categorical)
- Data validation indicators

### 3.3 Chart Visualization

**Supported Chart Types:**

- Bar Charts (Comparisons)
- Pie Charts (Distributions)
- Line Charts (Trends)
- Combination Charts
- Scatter Plots (Relationships)

**Chart Combinations:**

1. Price vs Sell distribution
2. Material composition breakdown
3. Style popularity analysis
4. Color distribution
5. Fit comparison across styles
6. Pant type statistics
7. Price trends by material
8. Sell performance by product type

### 3.4 Chart Interactivity

- Dynamic filtering by category
- Date range selection (if applicable)
- Hover tooltips
- Chart legend toggle
- Axis configuration
- Export charts as PNG/SVG
- Save chart configurations

### 3.5 Dashboard Features

- Multiple chart layout (grid view)
- Responsive design
- Dark/light mode
- Chart persistence between sessions
- Data summary statistics

## 4. Technical Requirements

### 4.1 Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: shadcn/ui
- **Charting**: Recharts/Tremor (shadcn compatible)
- **File Parsing**: XLSX.js
- **State Management**: Zustand
- **Validation**: Zod

### 4.2 Data Processing

- Excel file parsing client-side
- Data normalization
- Error handling for:
  - Missing columns
  - Invalid data formats
  - Empty values
- Memory optimization for large files

### 4.3 Security

- Client-side processing only (no cloud storage)
- Data sanitization
- XSS protection
- File type validation

## 5. User Flow

1. Upload Excel file
2. Auto-column mapping verification
3. Select chart type
4. Choose X/Y axis columns
5. Apply filters
6. View visualization
7. (Optional) Add multiple charts
8. Export/Share dashboard

## 6. Design Guidelines

- Follow shadcn/ui design system
- Clean, minimal interface
- Consistent spacing and typography
- Accessible color contrast
- Mobile-responsive layout
- Loading states for file processing
- Error states with recovery options

## 7. Assumptions

- Excel files follow consistent format
- All products are from Amazon
- No real-time data updates
- Users understand basic chart types
- Data contains no PII

## 8. Dependencies

- shadcn/ui chart compatibility
- XLSX.js browser compatibility
- Modern browser features (File API)

## 9. Risks

- Large file processing performance
- Complex data relationships
- Browser memory limitations
- Column mapping errors

## 11. Success Metrics

- 95% successful file upload rate
- < 2s chart rendering time
- 80% user satisfaction (survey)
- < 5% error occurrence rate
- 90% repeat usage rate

## 12. Non-Functional Requirements

- Support Chrome/Firefox/Safari latest versions
- Handle files up to 10MB
- < 3s initial load time
- Accessible (WCAG 2.1 AA)
- Error logging/reporting
```
