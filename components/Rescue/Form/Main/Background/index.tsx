import { Steps, Spinner } from "@chakra-ui/react";
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
  UploadBox,
  MediaList,
  MediaItem,
  MediaItemImg,
  MediaItemDelete,
  Button,
  SubmitButton,
} from "@/components/Rescue/Form/Main/Layout";
import { useMemo, useState } from "react";
import UploadIcon from "@/components/icons/upload";
import CloseIcon from "@/components/icons/close";
import { uploadImage } from "@/shared/upload";
import { createBlobUrl } from "@/shared/utils";
import { MAX_IMAGE_SIZE } from "@/shared/constant";
import { useRescueRequestCtx } from "@/hooks/useRescue";
import { uploadJson } from "@/shared/api";

interface Props {
  onNext: () => void;
  onPrev: () => void;
}

const FormBackground: React.FC<Props> = ({ onNext, onPrev }) => {
  const { backgroundForm, setBackgroundForm } = useRescueRequestCtx();
  const [uploading, setUploading] = useState(false);
  const [mediaBlobUrls, setMediaBlobUrls] = useState<string[]>([]);
  const [uploadedMediaUrls, setUploadedMediaUrls] = useState<string[]>([]);

  const [attachmentUploading, setAttachmentUploading] = useState(false);

  const isFormValid = useMemo(() => {
    return !!backgroundForm.context.trim();
  }, [backgroundForm]);

  const isNextDisabled = !isFormValid || uploading;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setBackgroundForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDelMedia = (index: number) => {
    setMediaBlobUrls((prev) => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      return newUrls;
    });
    setUploadedMediaUrls((prev) => {
      const newUrls = [...prev];
      newUrls.splice(index, 1);
      return newUrls;
    });
  };
  const handleMediaFileSelect = async (e: any) => {
    const files = e.target.files;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const isVideo = files[i].type === "video/mp4";
      const isImage = files[i].type.startsWith("image/");
      const isValid = isVideo || isImage;
      if (!isValid) {
        continue;
      }
      // if (isVideo) {
      //   setProofVideoBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
      //   const res = await uploadVideo({ file: files[i] }, MAX_VIDEO_SIZE);
      //   if (res) {
      //     onProofUploaded?.(res.data.url);
      //     setProofVideos((prev) => [...prev, res.data.url]);
      //   }
      //   continue;
      // }
      if (isImage) {
        setMediaBlobUrls((prev) => [...prev, createBlobUrl(files[i])]);
        const res = await uploadImage({ file: files[i] }, MAX_IMAGE_SIZE);
        if (res) {
          // onProofUploaded?.(res.data.url);
          setUploadedMediaUrls((prev) => [...prev, res.data.url]);
        }
        continue;
      }
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNextDisabled) return;
    setAttachmentUploading(true);
    const attachmentIPFSRes = await uploadJson(uploadedMediaUrls);
    const attachmentIPFSLink = attachmentIPFSRes?.data?.url;
    setBackgroundForm((prev) => ({
      ...prev,
      attachment: attachmentIPFSLink,
    }));
    setAttachmentUploading(false);
    onNext();
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Main>
        <Header>
          <Title>Background Info</Title>
          <Description>
            Please describe your situation and the rescue animal&apos;s
            condition in detail. Photos/videos will help us process your request
            faster.
          </Description>
        </Header>
        <Content>
          <FormGroup>
            <FormInputLabel>
              <RedAsterisk>*</RedAsterisk>Context
            </FormInputLabel>
            <FormTextarea
              required
              placeholder={`What supplies are urgently needed?
What resources are you lacking?
What kind of assistance do you need?`}
              value={backgroundForm.context}
              name="context"
              onChange={handleInputChange}
            />
          </FormGroup>
          <FormGroup>
            <FormInputLabel>
              Attachment （Attach media files: e.g. JPEG, PNG, SVG .etc）
            </FormInputLabel>
            <MediaList>
              {mediaBlobUrls.map((url, index) => {
                return (
                  <MediaItem key={index}>
                    <MediaItemImg src={url} alt={`Media-${index}`} />
                    <MediaItemDelete
                      onClick={() => {
                        handleDelMedia(index);
                      }}
                    >
                      <CloseIcon />
                    </MediaItemDelete>
                  </MediaItem>
                );
              })}
              <MediaItem>
                <UploadBox htmlFor="upload-record">
                  {uploading ? (
                    <Spinner />
                  ) : (
                    <>
                      <UploadIcon />
                      <span>Upload</span>
                    </>
                  )}

                  <input
                    id="upload-record"
                    type="file"
                    // accept="image/*,video/mp4"
                    accept="image/*"
                    multiple
                    maxLength={20}
                    onChange={handleMediaFileSelect}
                    disabled={uploading}
                  />
                </UploadBox>
              </MediaItem>
            </MediaList>
          </FormGroup>
        </Content>
      </Main>
      <Footer>
        <Button disabled={uploading || attachmentUploading} onClick={onPrev}>
          Prev
        </Button>
        {/* {isFormValid ? (
          <Steps.NextTrigger asChild>
            <SubmitButton disabled={isNextDisabled} type="submit">
              Next
            </SubmitButton>
          </Steps.NextTrigger>
        ) : (
          <SubmitButton type="submit">Next</SubmitButton>
        )} */}
        <SubmitButton
          loading={attachmentUploading}
          disabled={uploading || attachmentUploading}
          type="submit"
        >
          Next
        </SubmitButton>
      </Footer>
    </FormContainer>
  );
};

export default FormBackground;
