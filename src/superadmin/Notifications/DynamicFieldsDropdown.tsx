import React, { FormEvent, useEffect, useState } from 'react';
import Select from 'react-select';
import { EditorState, Modifier } from 'draft-js';
import { DynamicFieldsDropdownProps } from './contentEditorTypes';
export interface OptionsProps {
  label: string;
  value: string;
}

const DynamicFieldsDropdown: React.FC<DynamicFieldsDropdownProps> = ({ editorState, onChange, options }) => {
  const [selectedOption, setSelectedOption] = useState<OptionsProps | null>(null);

  const _handleDropdownChange = (option: OptionsProps | null) => {
    setSelectedOption(option);
    if (option && editorState && onChange) {
      const contentState = Modifier.replaceText(
        editorState.getCurrentContent(),
        editorState.getSelection(),
        option.value,
        editorState.getCurrentInlineStyle(),
      );
      onChange(EditorState.push(editorState, contentState, 'insert-characters'));
    }
  };

  return (
    <div className="ce-toolbar--dynamic-field">
      <Select
        value={selectedOption}
        options={options}
        onChange={_handleDropdownChange}
        menuPortalTarget={document.body}
      />
    </div>
  );
};
export default DynamicFieldsDropdown;
