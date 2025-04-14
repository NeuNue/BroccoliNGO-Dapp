import { Steps } from "@chakra-ui/react";
import {
  FormContainer,
  Content,
  Header,
  Title,
  Description,
  Footer,
  FormGroup,
  Main,
  FormInput,
  FormInputLabel,
  FormTextarea,
  RedAsterisk,
  Button,
  SubmitButton,
} from "@/components/Rescue/Form/Main/Layout";
import YesNoSelection from "../YesNoSection";
import { useMemo, useState } from "react";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { useGlobalCtx } from "@/hooks/useGlobal";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FormRequest: React.FC<Props> = ({ onNext, onPrev }) => {
  const { refreshProfile } = useGlobalCtx();
  const {
    requestForm,
    setRequestForm,
    isSubmitting,
    handleRescueSubmit,
    isPreviewMode,
  } = useRescueRequestCtx();

  const isFormValid = useMemo(() => {
    return requestForm.suppliesRequest.trim() !== "";
  }, [requestForm]);

  const isNextDisabled = !isFormValid;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRequestForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextDisabled) return;
    const isSuccess = await handleRescueSubmit();
    if (!isSuccess) return;
    await refreshProfile();
    onNext();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Main>
        <Header>
          <Title>Funds Request</Title>
          <Description>
            Please describe your situation and the rescue animal&apos;s
            condition in detail. Photos/videos will help us process your request
            faster.
          </Description>
        </Header>
        <Content>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Supplies request
            </FormInputLabel>
            <FormTextarea
              required
              name="suppliesRequest"
              onChange={handleInputChange}
              value={requestForm.suppliesRequest}
              placeholder={`What supplies are urgently needed?
Specify exact quantities and specifications (e.g. "200kg adult dog food (chicken flavor), 10 sterile vet-grade bandages (5cm width), amoxicillin 250mg ×30 tablets, 20kg puppy milk powder (goat milk base)")
`}
              disabled={isPreviewMode}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>Additional Info</FormInputLabel>
            <FormTextarea
              name="additionalInfo"
              onChange={handleInputChange}
              value={requestForm.additionalInfo}
              placeholder={`Please provide any other relevant details (e.g., special requirements, preferred brands, or delivery instructions)`}
              disabled={isPreviewMode}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Can you provide invoices?
            </FormInputLabel>
            <YesNoSelection
              value={requestForm.canProvideInvoices}
              disabled={isPreviewMode}
              onChange={(bool) => {
                setRequestForm((prev) => ({
                  ...prev,
                  canProvideInvoices: bool,
                }));
              }}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Are public acknowledgments possible
              for us (Broccoli Hope Foundation)?
            </FormInputLabel>
            <YesNoSelection
              value={requestForm.canProvidePublicAcknowledgments}
              disabled={isPreviewMode}
              onChange={(bool) => {
                setRequestForm((prev) => ({
                  ...prev,
                  canProvidePublicAcknowledgments: bool,
                }));
              }}
            />
          </FormGroup>
        </Content>
      </Main>
      <Footer>
        <Button disabled={isSubmitting} onClick={onPrev}>
          Prev
        </Button>
        {isPreviewMode ? (
          <Button disabled={isSubmitting} type="button" onClick={onNext}>
            Next
          </Button>
        ) : (
          <SubmitButton
            loading={isSubmitting}
            disabled={isSubmitting}
            type="submit"
          >
            Submit
          </SubmitButton>
        )}
      </Footer>
    </FormContainer>
  );
};

export default FormRequest;
