import React, { useEffect, useState } from "react";

const RemoveHtmlTags = ({ htmlString }) => {
  const [textOnly, setTextOnly] = useState("");

  useEffect(() => {
    // Create a div and set its innerHTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Extract text content
    const textContent = tempDiv.textContent || tempDiv.innerText;

    // Update state with text content
    setTextOnly(textContent);

    // Clean up
    return () => {
      setTextOnly("");
    };
  }, [htmlString]);

  return textOnly;
};

export default RemoveHtmlTags;
