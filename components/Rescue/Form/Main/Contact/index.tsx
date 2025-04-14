import {
  FormContainer,
  Content,
  Header,
  Title,
  Description,
  Main,
  Footer,
  FormGroup,
  FormInputLabel,
  FormInputGroup,
  FormInput,
  RedAsterisk,
  Button,
  SubmitButton,
} from "@/components/Rescue/Form/Main/Layout";
import { useEffect, useMemo, useState } from "react";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { useGlobalCtx } from "@/hooks/useGlobal";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FormContact: React.FC<Props> = ({ onNext, onPrev }) => {
  const { profile } = useGlobalCtx()
  const { isPreviewMode, contactForm, setContactForm } =
    useRescueRequestCtx();

  const isFormValid = useMemo(() => {
    return (
      contactForm.organization.trim() !== "" &&
      contactForm.email.trim() !== "" &&
      contactForm.country.trim() !== "" &&
      contactForm.city.trim() !== ""
    );
  }, [contactForm]);

  const isNextDisabled = !isFormValid;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextDisabled) return;
    onNext();
  };

  useEffect(() => {
    if (profile?.email) {
      setContactForm((prev) => ({
        ...prev,
        email: profile.email,
      }));
    }
  }, [profile]);

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Main>
        <Header>
          <Title>Contact Info</Title>
          <Description>
            Kindly provide your contact details to facilitate application
            follow-up.
          </Description>
        </Header>
        <Content>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Full Name / Organization
            </FormInputLabel>
            <FormInput
              name="organization"
              value={contactForm.organization}
              onChange={handleInputChange}
              required
              placeholder="-"
              disabled={isPreviewMode}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Contact Email
            </FormInputLabel>
            <FormInput
              name="email"
              value={contactForm.email}
              onChange={handleInputChange}
              required
              type="email"
              placeholder="-"
              disabled={isPreviewMode || profile?.email === contactForm.email}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Location
            </FormInputLabel>
            <FormInputGroup>
              <FormInput
                name="country"
                value={contactForm.country}
                onChange={handleInputChange}
                required
                placeholder="Country"
                disabled={isPreviewMode}
              />
              <FormInput
                name="city"
                value={contactForm.city}
                onChange={handleInputChange}
                required
                placeholder="City"
                disabled={isPreviewMode}
              />
            </FormInputGroup>
          </FormGroup>
        </Content>
      </Main>
      <Footer>
        <Button onClick={onPrev}>Prev</Button>
        {isPreviewMode ? (
          <Button onClick={onNext}>Next</Button>
        ) : (
          <SubmitButton type="submit">Next</SubmitButton>
        )}
      </Footer>
    </FormContainer>
  );
};

export default FormContact;
