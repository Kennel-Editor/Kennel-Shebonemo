import React from "react";
import {
  SkeletonContent,
  Line,
  ImagePlaceholder,
  ImageRow,
  Headline,
} from "./Skeleton.styled";

const SkeletonGeneral = () => (
  <SkeletonContent className="col-10 m-auto">
    <Headline className=" col-6 m-auto mb-4" />
    <Line width="50%" />
    <Line width="60%" />
    <ImagePlaceholder />
    <Line width="100%" />
    <Line width="90%" />
    <ImageRow>
      <ImagePlaceholder />
      <ImagePlaceholder />
    </ImageRow>
  </SkeletonContent>
);

export default SkeletonGeneral;
