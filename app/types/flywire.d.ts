interface Window {
  FlywirePayment?: {
    initiate: (config: unknown) => {
      render: () => void;
    };
  };
}
