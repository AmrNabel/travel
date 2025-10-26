# Premium MUI Theme System

This directory contains the comprehensive theme configuration for the Firebase Travel application.

## Quick Start

### Using the Theme in Components

```tsx
import { useTheme, alpha } from '@mui/material';

function MyComponent() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: alpha(theme.palette.primary.main, 0.15),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Content
    </Box>
  );
}
```

### Custom Button Variants

```tsx
// Gradient button (primary action)
<Button variant="gradient" size="large">
  Get Started
</Button>

// Orange button (secondary action)
<Button variant="orange" size="large">
  Learn More
</Button>
```

### Responsive Typography

```tsx
<Typography
  variant='h1'
  sx={{
    fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
    mb: { xs: 2, md: 4 },
  }}
>
  Responsive Heading
</Typography>
```

## Theme Structure

### Colors

- **Primary**: Sky Blue (#38BDF8) - Main brand color
- **Secondary**: Orange (#F97316) - Accent color
- **Mint**: Green (#10B981) - Success/eco color

### Typography Scale

- **H1**: 3.5rem (56px) - Hero headings
- **H2**: 2.5rem (40px) - Section headings
- **H3**: 2rem (32px) - Subsection headings
- **H4**: 1.5rem (24px) - Card titles
- **Body1**: 1rem (16px) - Default text
- **Body2**: 0.875rem (14px) - Secondary text

### Spacing System

MUI's default 8px grid system with custom multipliers:

- 0.5 = 4px
- 1 = 8px
- 2 = 16px
- 3 = 24px
- 4 = 32px
- 6 = 48px
- 8 = 64px

### Breakpoints

```tsx
xs: 0px    // Mobile
sm: 600px  // Small tablet
md: 900px  // Tablet
lg: 1200px // Desktop
xl: 1536px // Large desktop
```

## Component Customizations

### Buttons

- Pill-shaped (borderRadius: 9999px)
- Hover lift effect (translateY: -1px)
- Active press effect (scale: 0.98)
- Premium shadows on hover

### Cards

- Rounded corners (16px)
- Hover lift animation (translateY: -4px)
- Border + shadow combination
- Smooth transitions (0.3s)

### Text Fields

- Custom background colors
- 12px border radius
- Icon support via InputAdornment
- Focus glow effect

### Tabs

- Toggle-button style
- Background indicator
- Smooth transitions
- Rounded corners

## Advanced Usage

### Creating Gradient Backgrounds

```tsx
<Box
  sx={{
    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  }}
>
  Gradient Content
</Box>
```

### Using Alpha for Transparency

```tsx
import { alpha } from '@mui/material';

<Box sx={{ bgcolor: alpha(theme.palette.primary.main, 0.15) }}>
  Semi-transparent background
</Box>;
```

### Responsive Layouts

```tsx
<Grid container spacing={{ xs: 2, md: 3, lg: 4 }}>
  <Grid item xs={12} md={6} lg={4}>
    Content
  </Grid>
</Grid>
```

### Custom Shadows

```tsx
<Paper elevation={11} sx={{ borderRadius: 4 }}>
  Premium shadow (elevation 11)
</Paper>
```

## Best Practices

### 1. Use Theme Tokens

❌ Don't: `color: '#38BDF8'`  
✅ Do: `color: 'primary.main'`

### 2. Responsive by Default

❌ Don't: `fontSize: '3rem'`  
✅ Do: `fontSize: { xs: '2rem', md: '3rem' }`

### 3. Semantic Colors

❌ Don't: `color: '#374151'`  
✅ Do: `color: 'text.primary'`

### 4. Use sx Prop

❌ Don't: Create styled components for simple styles  
✅ Do: Use `sx` prop for component-level styling

### 5. Consistent Spacing

❌ Don't: `padding: '24px'`  
✅ Do: `p: 3` (uses theme spacing)

## Component Patterns

### Premium Card Pattern

```tsx
<Card
  elevation={2}
  sx={{
    p: 4,
    borderRadius: 4,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: theme.shadows[12],
    },
  }}
>
  <CardContent>Content here</CardContent>
</Card>
```

### Icon-Enhanced Input

```tsx
<TextField
  label='Email'
  fullWidth
  InputProps={{
    startAdornment: (
      <InputAdornment position='start'>
        <EmailIcon sx={{ color: 'text.secondary' }} />
      </InputAdornment>
    ),
  }}
/>
```

### Responsive Container

```tsx
<Container
  maxWidth='lg'
  sx={{
    py: { xs: 4, md: 8 },
    px: { xs: 2, md: 3 },
  }}
>
  Content
</Container>
```

## TypeScript Support

The theme is fully typed with TypeScript. Custom variants are augmented:

```tsx
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    gradient: true;
    orange: true;
  }
}
```

## Dark Mode (Future)

The theme is ready for dark mode. To implement:

```tsx
const [mode, setMode] = useState<'light' | 'dark'>('light');
const theme = mode === 'light' ? lightTheme : darkTheme;

<ThemeProvider theme={theme}>
  <App />
</ThemeProvider>;
```

## Troubleshooting

### Fonts not loading?

Ensure Poppins is imported in `layout.tsx`:

```tsx
import { poppins } from '@/theme/theme';
<body className={poppins.className}>
```

### Custom variants not working?

Check that the theme is imported:

```tsx
import { lightTheme } from '@/theme/theme';
<ThemeProvider theme={lightTheme}>
```

### Responsive breakpoints not triggering?

Verify you're using the correct syntax:

```tsx
sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}
```

## Examples

See these files for implementation examples:

- `/src/app/page.tsx` - Home page
- `/src/components/auth/LoginForm.tsx` - Forms
- `/src/app/search/page.tsx` - Complex layouts
- `/src/components/trips/TripForm.tsx` - Interactive forms

## Resources

- [MUI Theme Documentation](https://mui.com/material-ui/customization/theming/)
- [MUI sx Prop](https://mui.com/system/getting-started/the-sx-prop/)
- [Poppins Font](https://fonts.google.com/specimen/Poppins)

---

For questions or contributions, please refer to the main project documentation.
