import React from "react";
import { LayoutContainer } from "../layout/Layout.styled";
import {
  SkeletonHeaderWrapper,
  SkeletonFooterWrapper,
  SkeletonHero,
  SkeletonNav,
  SkeletonNavItem,
  SkeletonHeaderText,
  Breadcrumb,
} from "./Skeleton.styled";

const SkeletonHeader = () => (
  <SkeletonHeaderWrapper>
    <SkeletonHero>
      <SkeletonHeaderText />
    </SkeletonHero>
    <SkeletonNav>
      <SkeletonNavItem />
      <SkeletonNavItem />
      <SkeletonNavItem />
      <SkeletonNavItem />
      <SkeletonNavItem />
    </SkeletonNav>
    <Breadcrumb />
  </SkeletonHeaderWrapper>
);
const SkeletonFooter = () => <SkeletonFooterWrapper />;

const SkeletonLayout = ({ children }) => (
  <LayoutContainer>
    <SkeletonHeader />
    <main>{children}</main>
    <SkeletonFooter />
  </LayoutContainer>
);

export default SkeletonLayout;
