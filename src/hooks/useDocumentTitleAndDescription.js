import { useEffect } from "react";

export default function useDocumentTitleAndDescription(title, description) {
  useEffect(() => {
    // Update the document title
    document.title = title;

    // Update the meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    } else {
      // If meta description doesn't exist, create one
      const newMetaDescription = document.createElement("meta");
      newMetaDescription.name = "description";
      newMetaDescription.content = description;
      document.head.appendChild(newMetaDescription);
    }
  }, [title, description]); // Effect runs again if title or description changes
}
