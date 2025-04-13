import { Profile } from "@/shared/types/profile";
import { RescueTask } from "@/shared/types/rescue";
import FormPreSection from "./PreSection";
import FormMain from "./Main";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { useState } from "react";

interface Props {}

const RescueForm: React.FC<Props> = ({}) => {
  const { profile, xAuthLink } = useRescueRequestCtx();
  const [step, setStep] = useState(0);

  return step === 0 ? (
    <FormPreSection
      profile={profile}
      xAuthLink={xAuthLink}
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
