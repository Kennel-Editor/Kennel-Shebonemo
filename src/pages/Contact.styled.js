import styled from "styled-components";

export const ContactContainer = styled.div`
  text-align: start;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  font-size: 3rem;
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.accent};
  font-weight: 900;
  margin-bottom: 1rem;
`;

export const Paragraph = styled.p`
  font-size: 1.2rem;
  font-family: ${(props) => props.theme.fonts.body};
  color: ${(props) => props.theme.colors.text};
  line-height: 1.6;
  margin-bottom: 1rem;
`;

export const ContactInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;

  img {
    border-radius: 5px;
    border: 8px solid white;
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.3);
  }
`;

export const ContactInfo = styled.p`
  font-family: ${(props) => props.theme.fonts.body};
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.text};
  text-align: start;
`;
