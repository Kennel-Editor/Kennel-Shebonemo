import React from "react";
import {
  SkeletonContent,
  SkeletonBox,
  ImagePlaceholder,
  Line,
} from "./Skeleton.styled";

const SkeletonDogDetail = () => {
  return (
    <SkeletonContent>
      <Line width="40%" style={{ height: "30px", margin: "auto" }} />
      <Line width="60%" style={{ height: "24px", margin: "10px auto" }} />
      <ImagePlaceholder style={{ height: "300px", width: "100%", margin: "1rem 0" }} />
      <Line width="80%" />
      <Line width="70%" />
      <Line width="90%" />
      <Line width="50%" />
      <Line width="100%" />
      <Line width="100%" />
      <Line width="100%" />
    </SkeletonContent>
  );
};

export default SkeletonDogDetail;
