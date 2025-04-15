"use client";

import { Suspense } from "react";
import React from "react";
import RescueDialog from "@/components/RescueHuman";

export default function WrappedTestPage() {
  const handleSuccess = () => {

  }
  
  return (
    <Suspense>
      <RescueDialog onSuccess={handleSuccess} />
    </Suspense>
  );
}
