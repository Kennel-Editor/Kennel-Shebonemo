import styled from "styled-components";

export const AboutContainer = styled.div`
  text-align: center;
  border-radius: 8px;
  padding: 0 2rem;
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
  margin-bottom: 4rem;
  @media (max-width: 992px) {
    font-size: 1rem;
  }
`;
export const SectionTitle = styled.h2`
  font-size: 2rem;
  font-family: ${(props) => props.theme.fonts.accent};
  color: ${(props) => props.theme.colors.title};
  font-weight: 500;
  margin-top: 0.8rem;
`;
