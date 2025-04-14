import FormPreSection from "./PreSection";
import FormMain from "./Main";
import { useEffect, useState } from "react";

interface Props {}

const RescueForm: React.FC<Props> = ({}) => {
  const [step, setStep] = useState(0);

  return step === 0 ? (
    <FormPreSection
      onNext={() => {
        setStep(1);
      }}
    />
  ) : (
    <FormMain onPrev={() => {
      setStep(0);
    }} />
  );
};

export default RescueForm;
