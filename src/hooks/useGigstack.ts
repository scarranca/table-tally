/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios from "axios";

const GIGSTACK_API_KEY = import.meta.env.VITE_GIGSTACK_API_KEY || "";
const GIGSTACK_API_URL = import.meta.env.DEV
  ? "/api/gigstack"
  : "https://api.gigstack.io/v2";

interface PaymentItem {
  id: string;
  quantity: number;
  unit_price: number;
}

interface RegisterPaymentParams {
  client: {
    search?: {
      on_value: string | null;
      on_key: string;
      auto_create?: boolean;
    };
    name?: string;
  };
  automation_type?: string;
  currency: string;
  exchange_rate?: number;
  payment_form: string;
  items: PaymentItem[];
  metadata?: Record<string, string>;
}

interface PaymentResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export function useGigstack() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const registerPayment = useCallback(
    async (params: RegisterPaymentParams): Promise<PaymentResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios({
          method: "post",
          url: `${GIGSTACK_API_URL}/payments/register`,
          headers: {
            Authorization: GIGSTACK_API_KEY,
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            client: params.client,
            automation_type: params.automation_type || "pue_invoice",
            currency: params.currency,
            exchange_rate: params.exchange_rate || 1,
            payment_form: params.payment_form,
            items: params.items,
            metadata: params.metadata,
          }),
        });

        setIsLoading(false);
        return {
          success: true,
          data: response.data,
        };
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Payment registration failed";
        setError(errorMessage);
        setIsLoading(false);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    []
  );

  return {
    registerPayment,
    isLoading,
    error,
  };
}
