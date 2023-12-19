import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import DynamicFieldsDropdown from "./DynamicFieldsDropdown.tsx";
import "./contentEditor.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./contentEditor.css";
import HTMLSource from "./common/Toolbar/HtmlSource.tsx";
import "./common/link.css";

const ContentEditor = ({
  updateParentState,
  dynamicList,
  notificationContent,
}) => {
  const [isSourceVisible, setIsSourceVisible] = useState(false),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty()),
    [htmlSource, setHtmlSource] = useState("");

  useEffect(() => {
    if (notificationContent) {
      const contentBlock = htmlToDraft(notificationContent);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  }, [notificationContent]);

  const _setIsSourceVisible = () => {
    if (isSourceVisible) {
      const contentBlock = htmlToDraft(htmlSource);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    } else {
      const sourceValue = draftToHtml(
        convertToRaw(editorState.getCurrentContent())
      );
      setHtmlSource(sourceValue);
    }
    setIsSourceVisible(!isSourceVisible);
  };
  const toolbarOptions = {
    options: [
      "inline",
      "textAlign",
      "blockType",
      "fontSize",
      "fontFamily",
      "link",
    ],
    className: "ce-toolbar",
    inline: {
      className: "ce-toolbar",
      options: ["bold", "italic", "underline", "strikethrough"],
    },
    blockType: {
      className: "ce-toolbar",
    },
    fontSize: {
      className: "ce-toolbar",
    },
    fontFamily: {
      className: "ce-toolbar",
    },
    textAlign: {
      className: "ce-toolbar",
    },
    list: {
      className: "ce-toolbar",
    },
    link: {
      className: "ce-toolbar",
    },
    remove: {
      className: "ce-toolbar",
    },
    history: {
      className: "ce-toolbar",
    },
    image: {
      className: "ce-toolbar",
    },
  };

  const _onEditorStateChange = (es) => {
    setEditorState(es);
  };

  const _setHtmlSource = (value) => {
    setHtmlSource(value);
  };

  const _handleSourceChange = (e) => {
    const value = e.currentTarget.value;
    _setHtmlSource(value);
  };

  useEffect(() => {
    let html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    updateChildState(html);
  }, [editorState]);

  const updateChildState = (text) => {
    // Call the function to update the parent state with the child state
    updateParentState(text);
  };

  const dynamicListOptions = dynamicList.map((item) => ({
    ...item,
    value: item.dynamicFieldsTag,
    label: item.dynamicFieldsName,
  }));

  return (
    <div
      style={{
        height: "18rem",
        border: "1px solid rgb(141, 144, 147)",
        borderRadius: "5px",
      }}
    >
      <Editor
        editorState={editorState}
        wrapperClassName="ce-wrapper"
        editorClassName={isSourceVisible ? "ce-editor hide" : "ce-editor"}
        onEditorStateChange={_onEditorStateChange}
        toolbarClassName={
          isSourceVisible ? "cs-toolbar disabled" : "cs-toolbar"
        }
        toolbar={toolbarOptions}
        toolbarCustomButtons={[
          <DynamicFieldsDropdown options={dynamicListOptions} />,
          <HTMLSource toggleSource={_setIsSourceVisible} />,
        ]}
      />
      {isSourceVisible && (
        <div className="cw-source">
          <textarea
            onChange={_handleSourceChange}
            value={htmlSource}
            className="cw-source--textarea"
          />
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
