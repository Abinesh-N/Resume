// Razorpay payment integration service

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    email: string;
    contact?: string;
  };
  handler: (response: any) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function initiatePayment(options: RazorpayOptions) {
  const isLoaded = await loadRazorpayScript();
  
  if (!isLoaded) {
    throw new Error('Failed to load Razorpay script');
  }

  if (!window.Razorpay) {
    throw new Error('Razorpay is not available');
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();
}

export function createPaymentOptions(params: {
  email: string;
  amount: number; // in rupees
  description: string;
  onSuccess: (paymentId: string) => void;
  onError: (error: string) => void;
}): RazorpayOptions {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
  if (!keyId) {
    throw new Error('Razorpay key ID is not configured');
  }

  return {
    key: keyId,
    amount: params.amount * 100, // Convert to paise
    currency: 'INR',
    name: 'Resume Builder',
    description: params.description,
    prefill: {
      email: params.email,
    },
    handler: (response) => {
      params.onSuccess(response.razorpay_payment_id);
    },
    modal: {
      ondismiss: () => {
        params.onError('Payment cancelled');
      },
    },
  };
}
