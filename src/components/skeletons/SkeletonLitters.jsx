import React from "react";
import {
  SkeletonContent,
  SkeletonBox,
  ImagePlaceholder,
} from "./Skeleton.styled";

const SkeletonLitters = () => {
  return (
    <SkeletonContent>
      <SkeletonBox style={{ width: "40%", height: "40px", margin: "0 auto" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem",
        }}
      >
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <ImagePlaceholder style={{ width: "100%", height: "180px" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <ImagePlaceholder style={{ width: "40%", height: "120px" }} />
              <ImagePlaceholder style={{ width: "40%", height: "120px" }} />
            </div>
            <SkeletonBox
              style={{ width: "80%", height: "20px", margin: "10px auto" }}
            />
            <SkeletonBox
              style={{ width: "60%", height: "16px", margin: "0 auto" }}
            />
          </div>
        ))}
      </div>
    </SkeletonContent>
  );
};

export default SkeletonLitters;
