import React from "react";
import {
  SkeletonContent,
  SkeletonBox,
  Line,
  ImagePlaceholder,
} from "./Skeleton.styled";

const SkeletonHome = () => {
  return (
    <SkeletonContent style={{ textAlign: "center" }}>
      <Line width="60%" style={{ height: "40px", margin: "0 auto" }} />
      <ImagePlaceholder
        style={{ margin: "2rem auto", width: "40vw", height: "50vh" }}
      />
      <Line width="80%" style={{ margin: "0 auto" }} />
      <Line width="70%" style={{ margin: "0 auto" }} />
    </SkeletonContent>
  );
};

export default SkeletonHome;
