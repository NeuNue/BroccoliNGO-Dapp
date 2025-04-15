// Declare the global _TL_ function
declare global {
  function _TL_(v: string): string;
}

// Provide a default implementation that can be used in the browser
if (typeof window !== 'undefined') {
  (window as any)._TL_ = function(v: string): string {
    return v;
  };
}

// Ensure the function is available in Node.js environments as well
if (typeof global !== 'undefined') {
  (global as any)._TL_ = function(v: string): string {
    return v;
  };
}

export {};