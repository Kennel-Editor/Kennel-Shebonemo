import React from "react";

export function getLegacyParentInfo(parent, dog) {
  return [...new Set([parent?.info, dog?.info].filter(
    (text) => typeof text === "string" && text.trim(),
  ))];
}

export default function LitterAdditionalInfo({ parent }) {
  return (
    <>
      {parent.additionalInfo && (
        <div className="mt-2">{parent.additionalInfo}</div>
      )}
      {parent.extraInfoList?.length > 0 && (
        <ul className="list-unstyled">
          {parent.extraInfoList.map((item, index) => (
            <li key={item._key || index} style={{ whiteSpace: "pre-line" }}>
              {item.title && <strong>{item.title}: </strong>}
              {item.description}
            </li>
          ))}
        </ul>
      )}
      {parent.legacyInfoTexts?.length > 0 && (
        <details>
          <summary>Tidligere registrerte opplysninger</summary>
          {parent.legacyInfoTexts.map((text, index) => (
            <p key={index} style={{ whiteSpace: "pre-line" }}>{text}</p>
          ))}
        </details>
      )}
    </>
  );
}
