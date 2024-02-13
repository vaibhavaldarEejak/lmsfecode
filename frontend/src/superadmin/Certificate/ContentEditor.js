import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, ContentState, convertToRaw } from "draft-js";
import DynamicFieldsDropdown from "./DynamicFieldsDropdown.tsx";
import "./contentEditor.css";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import HTMLSource from "./common/Toolbar/HtmlSource.tsx";

const ContentEditor = ({ updateParentState, dynamicList, certStructure }) => {
  const [isSourceVisible, setIsSourceVisible] = useState(false),
    [htmlSource, setHtmlSource] = useState(""),
    [editorState, setEditorState] = useState(() => EditorState.createEmpty());

  useEffect(() => {
    if (certStructure) {
      const contentBlock = htmlToDraft(certStructure);
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
      }
    }
  }, [certStructure]);

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
    setIsSourceVisible(true);
    setIsSourceVisible(!isSourceVisible);
  };

  const toolbarOptions = {
    options: ["inline", "textAlign", "blockType", "fontSize", "fontFamily"],
    className: "ce-toolbar",
    inline: {
      className: "ce-toolbar",
      options: ["bold", "italic", "underline", "strikethrough"],
    },
    textAlign: {
      className: "ce-toolbar",
    },
    blockType: {
      className: "ce-toolbar",
    },
    fontSize: {
      inDropdown: true,
      className: "ce-toolbar",
    },
    fontFamily: {
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
    value: item.dynamicFieldTag,
    label: item.dynamicFieldName,
  }));

  return (
    <div
      className="cs-editor-wrapper rich"
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