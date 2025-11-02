# 🧘‍♀️ Vishuddhi Mental Health Profile

## Overview
A **Neubrutalism-styled** mental health profile interface for students in the Vishuddhi wellness system. This component allows users to input and manage their mental health indicators with a bold, accessible design.

## Design Style: Neubrutalism
- ✅ Bold black outlines (3-4px solid borders)
- ✅ Minimal gradients (pastel backgrounds)
- ✅ Blocky, geometric structure
- ✅ Offset hard shadows (`box-shadow: 4px 4px 0px #000`)
- ✅ High contrast for accessibility
- ✅ Tactile, interactive elements

## Features

### 1. **Anxiety Level (1-20)**
- Horizontal slider with 5 checkpoint markers
- Pastel lavender (#E0DFFF) background
- Real-time label showing intensity: Minimal, Mild, Moderate, Severe
- Circular black handle with hover animation

### 2. **Mental Health History (Yes/No)**
- Toggle button group
- Active state: black background with white text
- Shadow shrink animation on click
- Pastel background for inactive state

### 3. **Headache Severity (1-5)**
- Slider with pastel peach (#FEE9D7) background
- Tooltip shows descriptive label (None, Mild, Moderate, Strong, Severe)
- 5 evenly spaced markers

### 4. **Financial Condition (Yes/No)**
- Toggle buttons with pastel mint (#D5F0D5) background
- Same Neubrutalist interaction as Mental Health History

### 5. **Safety Level (1-5)**
- Slider with pastel yellow (#FEF5D5) background
- Descriptive labels: Very Low to Very High

### 6. **Excel Import 📂**
- File upload button with Neubrutal styling
- Accepts `.xlsx` and `.csv` files
- Auto-maps columns: `anxietyLevel`, `mentalHealthHistory`, `headache`, `financialCondition`, `safety`
- Download template button included
- Hover translate effect (bounce)

### 7. **Save/Update Button**
- Full-width rectangular button
- Background: #E0DFFF
- Border: 3px solid #000
- Drop shadow: 4px 4px 0 #000
- Hover: `translate(2px, 2px)` with reduced shadow
- Active: `translate(4px, 4px)` with no shadow

## Technologies Used
- **React** (TSX)
- **Bootstrap 5.3.2** (Grid system & utilities)
- **Custom CSS** (Neubrutalism styles)
- **xlsx** library (Excel file parsing)
- **localStorage** (Data persistence)

## Installation & Usage

### Import the Component
```tsx
import MentalHealthProfile from './components/mental-health-profile';

function ProfilePage() {
  return <MentalHealthProfile />;
}
```

### Install Dependencies
```bash
npm install xlsx
```

### Include Bootstrap CSS
Already imported in `/styles/globals.css`:
```css
@import url('https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css');
```

## Excel File Format

### Column Headers (Required)
| anxietyLevel | mentalHealthHistory | headache | financialCondition | safety |
|--------------|---------------------|----------|-------------------|--------|
| 10           | No                  | 3        | Yes               | 4      |

### Data Types
- `anxietyLevel`: Number (1-20)
- `mentalHealthHistory`: String ("Yes" or "No") or Boolean
- `headache`: Number (1-5)
- `financialCondition`: String ("Yes" or "No") or Boolean
- `safety`: Number (1-5)

### Download Template
Users can download a pre-formatted Excel template directly from the interface.

## Data Persistence
All form data is automatically saved to `localStorage` under the key `mentalHealthProfile`:

```json
{
  "anxietyLevel": 10,
  "mentalHealthHistory": false,
  "headache": 3,
  "financialCondition": true,
  "safety": 4
}
```

## Accessibility Features
- ✅ Semantic HTML
- ✅ Keyboard navigation support
- ✅ Focus indicators on interactive elements
- ✅ High contrast colors
- ✅ Large, readable fonts
- ✅ Touch-friendly button sizes
- ✅ Screen reader compatible

## Responsive Design
- Desktop: Full-width card with optimal spacing
- Tablet: Adjusted padding and font sizes
- Mobile: Stacked layout, reduced shadow sizes

### Breakpoints
- `< 576px`: Mobile
- `< 768px`: Tablet
- `≥ 768px`: Desktop

## Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements
- [ ] Real-time validation
- [ ] Multi-language support
- [ ] Dark mode variant
- [ ] Animation on data save
- [ ] Historical data visualization
- [ ] Export data to PDF

## License
Part of the Vishuddhi Mental Health System

---

**Designed with ❤️ for student mental wellness**
