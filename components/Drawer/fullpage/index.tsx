import { useState, useEffect } from "react";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

interface DrawerRightProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  position: "right" | "bottom";
  children: React.ReactNode;
}

const DrawerRight: React.FC<DrawerRightProps> = ({
  isOpen,
  onOpenChange,
  position = "right",
  children,
}) => {
  const [mounted, setMounted] = useState(false);

  // Handle escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      // Prevent scrolling on the body when drawer is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onOpenChange]);

  // Handle client-side rendering for portals
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleOverlayClick = () => {
    onOpenChange(false);
  };

  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <Overlay isVisible={isOpen} onClick={handleOverlayClick} />
      <DrawerContainer isVisible={isOpen} position={position}>
        {/* <DrawerHeader>
          <CloseButton
            onClick={() => onOpenChange(false)}
            aria-label="Close drawer"
          >
            ✕
          </CloseButton>
        </DrawerHeader> */}
        <DrawerBody>{children}</DrawerBody>
      </DrawerContainer>
    </>,
    document.body
  );
};

export default DrawerRight;


// Styled components for the drawer
const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 98;
  display: ${(props) => (props.isVisible ? "block" : "none")};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const DrawerContainer = styled.div<{
  isVisible: boolean;
  position: "right" | "bottom";
}>`
  position: fixed;
  top: ${(props) => (props.position === "bottom" ? "auto" : "0")};
  right: ${(props) =>
    props.position === "right" ? (props.isVisible ? "0" : "-100%") : "0"};

  bottom: ${(props) =>
    props.position === "bottom" ? (props.isVisible ? "0" : "-100%") : "auto"};
  width: 100%;
  height: 100vh;
  background-color: white;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 99;
  transition: right 0.3s ease, bottom 0.3s ease;
  display: flex;
  flex-direction: column;

  @supports (-webkit-touch-callout: none) {
    /* iOS specific fix */
    height: -webkit-fill-available;
  }

  @media (max-width: 640px) {
    width: 100%;
    max-width: 100%;
  }
`;

const DrawerHeader = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: transparent;
  pointer-events: none;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 118, 255, 0.3);
  }
`;

const DrawerBody = styled.div`
  flex: 1;
  // padding: 16px;
  overflow-y: auto;
`;