import { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";

interface Props {
  attachment: string;
}

const AttachmentView: FC<Props> = ({ attachment }) => {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    if (!attachment) return;
    const fetchPreviewUrls = async () => {
      try {
        const urls = await fetch(attachment).then((res) => res.json());
        setPreviewUrls(urls);
      } catch (error) {
        console.error("Error fetching preview URLs:", error);
      }
    };

    fetchPreviewUrls();
  }, [attachment]);
  return (
    <Container>
      {previewUrls.length ? (
        previewUrls.map((url, index) => (
          <PreviewLink key={index} href={url} target="_blank">
            <PreviewImage
              key={index}
              src={url}
              alt={`Attachment ${index + 1}`}
            />
          </PreviewLink>
        ))
      ) : (
        <span>-</span>
      )}
    </Container>
  );
};

export default AttachmentView;

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 8px;
`;

const PreviewLink = styled.a`
  display: block;
  width: 100%;
`;

const PreviewImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
  object-fit: contain;
`;
