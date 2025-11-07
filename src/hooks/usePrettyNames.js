import { useEffect, useMemo, useState } from "react";
import sanityClient from "../sanityClient";

function extractIds(childrenByGroup) {
  const dogs = new Set();
  const litters = new Set();
  const gallery = new Set();
  for (const r of childrenByGroup["/dogs"] || []) {
    const parts = String(r.page || "")
      .split("/")
      .filter(Boolean);
    if (parts[0] === "dogs" && parts[1]) dogs.add(parts[1]);
  }
  for (const r of childrenByGroup["/litters"] || []) {
    const parts = String(r.page || "")
      .split("/")
      .filter(Boolean);
    if (parts[0] === "litters" && parts[1]) litters.add(parts[1]);
  }
  for (const r of childrenByGroup["/gallery"] || []) {
    const parts = String(r.page || "")
      .split("/")
      .filter(Boolean);
    if (parts[0] === "gallery" && parts[1]) gallery.add(parts[1]);
  }
  return {
    dogIds: Array.from(dogs),
    litterIds: Array.from(litters),
    galleryIds: Array.from(gallery),
  };
}

export default function usePrettyNames(childrenByGroup) {
  const [nameMap, setNameMap] = useState({});
  const { dogIds, litterIds, galleryIds } = useMemo(
    () => extractIds(childrenByGroup),
    [childrenByGroup]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const out = {};
      if (dogIds.length > 0) {
        const q = `*[_type == "dog" && _id in $ids]{ _id, name, nickname }`;
        const rows = await sanityClient.fetch(q, { ids: dogIds });
        for (const d of rows || []) {
          const label = d.nickname || d.name || d._id;
          out[`/dogs/${d._id}`] = label;
        }
      }
      if (litterIds.length > 0) {
        const q = `*[_type == "litter" && _id in $ids]{
          _id,
          mother { isOwned, name, nickname, dogReference->{name, nickname} },
          father { isOwned, name, nickname, dogReference->{name, nickname} }
        }`;
        const rows = await sanityClient.fetch(q, { ids: litterIds });
        for (const l of rows || []) {
          const m = l.mother || {};
          const f = l.father || {};
          const mName =
            m.isOwned && m.dogReference
              ? m.dogReference.nickname || m.dogReference.name
              : m.nickname || m.name;
          const fName =
            f.isOwned && f.dogReference
              ? f.dogReference.nickname || f.dogReference.name
              : f.nickname || f.name;
          const label = [mName, fName].filter(Boolean).join(" & ") || l._id;
          out[`/litters/${l._id}`] = label;
        }
      }
      if (galleryIds.length > 0) {
        const q = `*[_type == "gallery" && _id in $ids]{ _id, title }`;
        const rows = await sanityClient.fetch(q, { ids: galleryIds });
        for (const g of rows || []) {
          out[`/gallery/${g._id}`] = g.title || g._id;
        }
      }
      if (!cancelled) setNameMap(out);
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [dogIds.join(","), litterIds.join(","), galleryIds.join(",")]);

  return nameMap;
}
