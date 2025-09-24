# Multiple Subscription Plans Implementation Guide

This document explains how the subscription plans system has been made generic to support multiple plans instead of just the hardcoded "Starter" tier.

## Overview

The system now supports:
- ✅ Multiple subscription plans with configurable features
- ✅ Backward compatibility with existing single-plan setup
- ✅ Dynamic pricing table that adapts to any number of plans
- ✅ Flexible feature configuration per plan
- ✅ Plan validation and error handling

## Configuration Options

### Option 1: Multiple Plans (Recommended)

Set the `NEXT_PUBLIC_SUBSCRIPTION_PLANS` environment variable with a JSON array:

```json
NEXT_PUBLIC_SUBSCRIPTION_PLANS=[
  {
    "id": "starter",
    "name": "Starter",
    "slug": "starter", 
    "description": "Perfect for getting started",
    "price": 1000,
    "currency": "USD",
    "interval": "month",
    "productId": "your-starter-product-id",
    "features": [
      {"name": "5 Projects", "included": true},
      {"name": "10GB Storage", "included": true},
      {"name": "1 Team Member", "included": true, "limit": 1},
      {"name": "Email Support", "included": true}
    ],
    "buttonText": "Get Started"
  },
  {
    "id": "pro", 
    "name": "Professional",
    "slug": "pro",
    "description": "For growing teams",
    "price": 2500,
    "currency": "USD",
    "interval": "month", 
    "productId": "your-pro-product-id",
    "features": [
      {"name": "25 Projects", "included": true},
      {"name": "100GB Storage", "included": true}, 
      {"name": "10 Team Members", "included": true, "limit": 10},
      {"name": "Priority Support", "included": true},
      {"name": "Advanced Analytics", "included": true}
    ],
    "popular": true,
    "buttonText": "Upgrade to Pro"
  }
]
```

### Option 2: Legacy Single Plan (Backward Compatible)

Continue using the existing environment variables:

```env
NEXT_PUBLIC_STARTER_TIER=your-product-id
NEXT_PUBLIC_STARTER_SLUG=starter
```

## Plan Configuration Schema

Each subscription plan object supports these properties:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | ✅ | Unique identifier for the plan |
| `name` | string | ✅ | Display name (e.g., "Professional") |
| `slug` | string | ✅ | URL-friendly identifier for Polar |
| `description` | string | ✅ | Short description of the plan |
| `price` | number | ✅ | Price in cents (e.g., 1000 = $10.00) |
| `currency` | string | ✅ | Currency code (e.g., "USD") |
| `interval` | string | ✅ | Billing interval ("month" or "year") |
| `productId` | string | ✅ | Polar product ID |
| `features` | array | ✅ | List of features (see Feature Schema) |
| `popular` | boolean | ❌ | Mark as "Most Popular" plan |
| `buttonText` | string | ❌ | Custom button text (default: "Get Started") |

## Feature Configuration Schema

Each feature in the `features` array supports:

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `name` | string | ✅ | Feature name (e.g., "5 Projects") |
| `included` | boolean | ✅ | Whether feature is included |
| `limit` | string/number | ❌ | Optional limit description |

## Files Modified

### Core Implementation
- `lib/subscription-plans.ts` - New configuration system
- `lib/subscription.ts` - Enhanced with plan details
- `lib/auth.ts` - Updated to use new configuration

### UI Components  
- `app/pricing/_component/pricing-table.tsx` - Dynamic multi-plan display

### Configuration
- `.env` - Updated with multi-plan example
- `.env.example` - Documentation and examples

## Key Features

### 1. Dynamic Pricing Table
- Automatically adapts grid layout based on number of plans (1-4+ columns)
- Shows "Most Popular" badge for plans marked with `popular: true`
- Displays "Current Plan" badge for active subscriptions
- Responsive design that works on all screen sizes

### 2. Flexible Features Display
- Shows checkmarks for included features
- Shows X marks for excluded features  
- Displays feature limits when specified
- Supports unlimited features per plan

### 3. Smart Checkout Integration
- Automatically configures Polar checkout with all available plans
- Validates configuration on startup
- Provides clear error messages for invalid configurations

### 4. Plan Management Functions

```typescript
// Get all configured plans
const plans = getSubscriptionPlans();

// Find specific plan
const plan = getSubscriptionPlan('pro');
const planByProductId = getSubscriptionPlanByProductId('product-123');
const planBySlug = getSubscriptionPlanBySlug('enterprise');

// Get checkout configuration
const checkoutProducts = getAllProductsForCheckout();

// Format prices consistently
const formatted = formatPrice(2500, 'USD'); // "$25"

// Validate configuration
const validation = validateSubscriptionPlans();
```

## Adding New Plans

1. **In Polar Dashboard**: Create your new subscription product and note the Product ID

2. **Update Environment Variable**: Add your new plan to the JSON array:

```json
{
  "id": "enterprise",
  "name": "Enterprise", 
  "slug": "enterprise",
  "description": "For large organizations",
  "price": 10000,
  "currency": "USD", 
  "interval": "month",
  "productId": "your-new-product-id",
  "features": [
    {"name": "Unlimited Projects", "included": true},
    {"name": "1TB Storage", "included": true},
    {"name": "24/7 Support", "included": true}
  ],
  "buttonText": "Contact Sales"
}
```

3. **Deploy**: The pricing table will automatically display your new plan!

## Error Handling

The system includes comprehensive validation:
- ✅ Checks for required fields
- ✅ Validates for duplicate IDs, slugs, and product IDs
- ✅ Ensures at least one plan is configured
- ✅ Provides clear error messages
- ✅ Graceful fallback to legacy configuration

## Migration Guide

### From Single Plan to Multiple Plans

1. **Identify Current Configuration**: Note your current `NEXT_PUBLIC_STARTER_TIER` and `NEXT_PUBLIC_STARTER_SLUG` values

2. **Create JSON Configuration**: Convert to the new format:

```json
[{
  "id": "starter",
  "name": "Starter",
  "slug": "starter", 
  "description": "Perfect for getting started",
  "price": 1000,
  "currency": "USD",
  "interval": "month", 
  "productId": "YOUR_CURRENT_STARTER_TIER_VALUE",
  "features": [
    {"name": "Your current features", "included": true}
  ],
  "buttonText": "Get Started"
}]
```

3. **Add New Plans**: Extend the array with additional plans

4. **Test**: Verify the pricing page displays correctly

5. **Optional**: Remove legacy environment variables once satisfied

## Benefits

- 🚀 **Scalable**: Add unlimited subscription tiers
- 🔧 **Configurable**: Customize pricing, features, and appearance  
- 🔄 **Compatible**: Works with existing single-plan setups
- 🎨 **Responsive**: Automatically adapts UI to plan count
- ✅ **Validated**: Built-in configuration validation
- 📱 **Modern**: Clean, professional pricing table design

The system is now ready to support any subscription model you need!