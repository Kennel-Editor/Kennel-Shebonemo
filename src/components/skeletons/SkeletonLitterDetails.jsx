import React from "react";
import {
  SkeletonContent,
  ImagePlaceholder,
  Line,
  SkeletonBox,
} from "./Skeleton.styled";

const SkeletonLitterDetail = () => {
  return (
    <SkeletonContent>
      <Line width="40%" style={{ height: "40px", margin: "auto" }} />

      <div className="container my-4">
        <div className="row justify-content-center">
          {/* Mor */}
          <div className="col-12 col-md-5 text-center">
            <ImagePlaceholder style={{ height: "250px", width: "100%" }} />
            <Line width="60%" style={{ margin: "1rem auto" }} />
            <Line width="80%" style={{ margin: "0.5rem auto" }} />
            <Line width="40%" style={{ margin: "0.5rem auto" }} />
          </div>

          {/* Far */}
          <div className="col-12 col-md-5 text-center">
            <ImagePlaceholder style={{ height: "250px", width: "100%" }} />
            <Line width="60%" style={{ margin: "1rem auto" }} />
            <Line width="80%" style={{ margin: "0.5rem auto" }} />
            <Line width="40%" style={{ margin: "0.5rem auto" }} />
          </div>
        </div>
      </div>

      <Line width="60%" />
      <Line width="40%" />
      <ImagePlaceholder
        style={{ width: "100%", height: "250px", margin: "2rem 0" }}
      />
      <Line width="90%" />
      <Line width="70%" />
    </SkeletonContent>
  );
};

export default SkeletonLitterDetail;
