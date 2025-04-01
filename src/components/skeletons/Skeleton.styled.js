import styled, { keyframes } from "styled-components";

export const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

export const SkeletonBox = styled.div`
  background: #e0e0e0;
  background-image: linear-gradient(
    90deg,
    #e0e0e0 0px,
    #f0f0f0 40px,
    #e0e0e0 80px
  );
  background-size: 600px;
  animation: ${shimmer} 2.2s infinite linear;
  border-radius: 8px;
`;

export const SkeletonHeaderWrapper = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 50vh;
`;

// Header-bilde skeleton
export const SkeletonHero = styled(SkeletonBox)`
  height: 40vh;
  width: 100%;
  position: relative;
`;


export const SkeletonNav = styled(SkeletonBox)`
  display: flex;
  justify-content: space-evenly;
  gap: 1rem;
  padding: 1rem 0;
  background: ${(props) => props.theme.colors.background};
`;

export const SkeletonNavItem = styled(SkeletonBox)`
  height: 1.8rem;
  width: 6rem;
  border-radius: 4px;
`;

export const Breadcrumb = styled(SkeletonBox)`
  height: 1rem;
  width: 20%;
  margin: 30px 0px 0px 10%;
  border-radius: 4px;
`;

export const SkeletonHeaderText = styled(SkeletonBox)`
  position: absolute;
  bottom: 0;
  margin: 0 auto;
  width: 100%;
  height: 3rem;
  border-radius: 0;
  background: #d0d0d0;
  z-index: 2;

  @media (max-width: 993px) {
    position: static;
    width: 80%;
    margin-top: 1rem;
  }
`;

export const SkeletonFooterWrapper = styled(SkeletonBox)`
  height: 60px;
  background-color: #ddd;
  animation: pulse 1.5s infinite ease-in-out;
`;

export const SkeletonContent = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Line = styled(SkeletonBox)`
  height: 20px;
  width: ${(props) => props.width || "100%"};
  margin: auto;
`;

export const Headline = styled(SkeletonBox)`
  height: 2rem;
  width: ${(props) => props.width || "50%"};
  margin: auto;
`;
export const ImagePlaceholder = styled(SkeletonBox)`
  height: 150px;
  width: 150px;
  margin: auto;
`;

export const ImageRow = styled(SkeletonBox)`
  display: flex;
  gap: 1rem;
  margin: auto;
`;
