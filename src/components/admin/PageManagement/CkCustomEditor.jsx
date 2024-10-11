/* eslint-disable react/prop-types */
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Bold,
  Essentials,
  Italic,
  Mention,
  Paragraph,
  Undo,
  Image,
  ImageToolbar,
  ImageCaption,
  ImageStyle,
  ImageUpload,
  Table,
  TableToolbar,
  Heading,
  Link,
  PageBreak,
  PageBreakUI,
  AutoLink,
  Underline,
  List,
  Font,
  ImageResize,
  LinkImage,
  SourceEditing,
  GeneralHtmlSupport,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";
import "ckeditor5-premium-features/ckeditor5-premium-features.css";
import CloudinaryUploadAdapterPlugin from "../CloudinaryUploadAdaptor";

function CkCustomEditor({ pageData, setpageData }) {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={pageData}
      onChange={(event, editor) => {
        const data = editor.getData();
        setpageData(data);
      }}
      config={{
        toolbar: {
          items: [
            "undo",
            "redo",
            "|",
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "pageBreak",
            "|",
            "link",
            "imageUpload",
            "insertTable",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "bulletedList",
            "numberedList",
            "imageStyle:inline",

            "imageStyle:block",
            "imageStyle:side",
            "|",
            "sourceEditing",
          ],
        },
        extraPlugins: [CloudinaryUploadAdapterPlugin],
        plugins: [
          Bold,
          Essentials,
          Italic,
          Underline,
          PageBreak,
          PageBreakUI,
          Mention,
          Paragraph,
          Undo,
          Font,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageUpload,
          ImageResize,
          ImageToolbar,
          LinkImage,
          Table,
          TableToolbar,
          Heading,
          Link,
          AutoLink,
          List,
          SourceEditing,
          GeneralHtmlSupport,
        ],
        fontFamily: {
          options: [
            "default",
            "Roboto, sans-serif", // Adding Roboto
            "Arial, Helvetica, sans-serif",
            "Courier New, Courier, monospace",
            "Georgia, serif",
            "Lucida Sans Unicode, Lucida Grande, sans-serif",
            "Tahoma, Geneva, sans-serif",
            "Times New Roman, Times, serif",
            "Trebuchet MS, Helvetica, sans-serif",
            "Verdana, Geneva, sans-serif",
          ],
          supportAllValues: true,
        },
        fontSize: {
          options: [
            8,
            9,
            11,
            12,
            13,
            14,
            15,
            "default",
            16,
            17,
            18,
            19,
            20,
            21,
          ],
        },
        licenseKey: "<YOUR_LICENSE_KEY>",
        mention: {
          // Mention configuration
        },
        htmlSupport: {
          allow: [
            {
              name: /.*/,
              attributes: true,
              classes: true,
              styles: true,
            },
          ],
        },
      }}
    />
  );
}

export default CkCustomEditor;
