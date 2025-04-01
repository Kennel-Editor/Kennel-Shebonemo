import React from "react";
import {
  SkeletonContent,
  SkeletonBox,
  ImagePlaceholder,
} from "./Skeleton.styled";

const SkeletonDogs = () => {
  return (
    <SkeletonContent>
      <SkeletonBox style={{ width: "50%", height: "40px", margin: "0 auto" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ImagePlaceholder style={{ width: "100%", height: "200px" }} />
            <SkeletonBox
              style={{ width: "60%", height: "20px", margin: "10px auto 5px" }}
            />
            <SkeletonBox
              style={{ width: "40%", height: "16px", margin: "0 auto" }}
            />
          </div>
        ))}
      </div>
    </SkeletonContent>
  );
};

export default SkeletonDogs;
