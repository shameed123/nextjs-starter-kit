export interface SubscriptionPlanFeature {
  name: string;
  included: boolean;
  limit?: string | number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  productId: string;
  features: SubscriptionPlanFeature[];
  popular?: boolean;
  buttonText?: string;
}

// This will be populated from environment variables or a configuration file
let subscriptionPlans: SubscriptionPlan[] = [];

// Parse subscription plans from environment variables
function parseSubscriptionPlansFromEnv(): SubscriptionPlan[] {
  const plans: SubscriptionPlan[] = [];
  
  // Try to parse from JSON first (for multiple plans)
  const plansJson = process.env.NEXT_PUBLIC_SUBSCRIPTION_PLANS;
  if (plansJson) {
    try {
      const parsedPlans = JSON.parse(plansJson);
      return Array.isArray(parsedPlans) ? parsedPlans : [parsedPlans];
    } catch (error) {
      console.warn('Failed to parse NEXT_PUBLIC_SUBSCRIPTION_PLANS JSON:', error);
    }
  }
  
  // Fallback to legacy environment variables for backward compatibility
  const legacyTier = process.env.NEXT_PUBLIC_STARTER_TIER;
  const legacySlug = process.env.NEXT_PUBLIC_STARTER_SLUG;
  
  if (legacyTier && legacySlug) {
    plans.push({
      id: 'starter',
      name: 'Starter',
      slug: legacySlug,
      description: 'Perfect for getting started',
      price: 1000,
      currency: 'USD',
      interval: 'month',
      productId: legacyTier,
      features: [
        { name: '5 Projects', included: true },
        { name: '10GB Storage', included: true },
        { name: '1 Team Member', included: true, limit: 1 },
        { name: 'Email Support', included: true },
      ],
      buttonText: 'Get Started'
    });
  }
  
  return plans;
}

// Initialize subscription plans
export function initializeSubscriptionPlans(): void {
  subscriptionPlans = parseSubscriptionPlansFromEnv();
}

// Get all subscription plans
export function getSubscriptionPlans(): SubscriptionPlan[] {
  if (subscriptionPlans.length === 0) {
    initializeSubscriptionPlans();
  }
  return subscriptionPlans;
}

// Get a specific subscription plan by ID
export function getSubscriptionPlan(planId: string): SubscriptionPlan | undefined {
  return getSubscriptionPlans().find(plan => plan.id === planId);
}

// Get a specific subscription plan by product ID
export function getSubscriptionPlanByProductId(productId: string): SubscriptionPlan | undefined {
  return getSubscriptionPlans().find(plan => plan.productId === productId);
}

// Get a specific subscription plan by slug
export function getSubscriptionPlanBySlug(slug: string): SubscriptionPlan | undefined {
  return getSubscriptionPlans().find(plan => plan.slug === slug);
}

// Get all product IDs for checkout configuration
export function getAllProductIds(): string[] {
  return getSubscriptionPlans().map(plan => plan.productId);
}

// Get all products for checkout configuration (with slug mapping)
export function getAllProductsForCheckout(): Array<{ productId: string; slug: string }> {
  return getSubscriptionPlans().map(plan => ({
    productId: plan.productId,
    slug: plan.slug
  }));
}

// Format price for display
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price / 100); // Assuming price is in cents
}

// Validate subscription plans configuration
export function validateSubscriptionPlans(): { valid: boolean; errors: string[] } {
  const plans = getSubscriptionPlans();
  const errors: string[] = [];
  
  if (plans.length === 0) {
    errors.push('No subscription plans configured. Please set NEXT_PUBLIC_SUBSCRIPTION_PLANS or legacy environment variables.');
  }
  
  const productIds = new Set<string>();
  const slugs = new Set<string>();
  const planIds = new Set<string>();
  
  plans.forEach((plan, index) => {
    if (!plan.id) errors.push(`Plan at index ${index} missing id`);
    if (!plan.name) errors.push(`Plan at index ${index} missing name`);
    if (!plan.slug) errors.push(`Plan at index ${index} missing slug`);
    if (!plan.productId) errors.push(`Plan at index ${index} missing productId`);
    if (typeof plan.price !== 'number' || plan.price <= 0) {
      errors.push(`Plan at index ${index} has invalid price`);
    }
    
    // Check for duplicates
    if (productIds.has(plan.productId)) {
      errors.push(`Duplicate productId: ${plan.productId}`);
    } else {
      productIds.add(plan.productId);
    }
    
    if (slugs.has(plan.slug)) {
      errors.push(`Duplicate slug: ${plan.slug}`);
    } else {
      slugs.add(plan.slug);
    }
    
    if (planIds.has(plan.id)) {
      errors.push(`Duplicate plan id: ${plan.id}`);
    } else {
      planIds.add(plan.id);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}