import Draft from 'draft-js';
export interface DynamicFieldOptionTypes {
  dynamicFieldsId: number;
  dynamicFieldsName: string;
  dynamicFieldsTag: string;
}

export interface OptionsProps {
  label: string;
  value: string;
}

export interface DynamicFieldsDropdownProps {
  editorState?: Draft.EditorState;
  options?: OptionsProps[];
  onChange?: (state: Draft.EditorState) => void;
}

export interface HTMLSourceProps extends DynamicFieldsDropdownProps {
  toggleSource: () => void;
}

export interface DocumentDownloadProps {
  exportToWord: () => void;
}
