import React from "react";
import { useLocation, matchPath } from "react-router-dom";

import SkeletonLayout from "./SkeletonLayout";
import SkeletonHome from "./SkeletonHome";
import SkeletonDogs from "./SkeletonDogs";
import SkeletonDogDetail from "./SkeletonDogsDetail";
import SkeletonLitters from "./SkeletonLitters";
import SkeletonLitterDetail from "./SkeletonLitterDetails";
import SkeletonGeneral from "./SkeletonGeneral";

const PageSkeleton = () => {
  const location = useLocation();
  const path = location.pathname;

  const match = (pattern) => matchPath(pattern, path);

  let Content = null;

  if (match("/")) Content = <SkeletonHome />;
  else if (match("/dogs/:id")) Content = <SkeletonDogDetail />;
  else if (match("/dogs")) Content = <SkeletonDogs />;
  else if (match("/litters/:id")) Content = <SkeletonLitterDetail />;
  else if (match("/litters")) Content = <SkeletonLitters />;
  else Content = <SkeletonGeneral />;

  return <SkeletonLayout>{Content}</SkeletonLayout>;
};

export default PageSkeleton;
