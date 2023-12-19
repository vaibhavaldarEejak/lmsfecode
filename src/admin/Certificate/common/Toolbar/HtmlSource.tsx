import React, { useRef, useEffect, useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CImage,
  CFormInput,
  CButton,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import { HTMLSourceProps } from '../contentEditorTypes';
// import IconSource from './common/svg/IconSource';
// import IconSource from './common/svg/IconSource';


const HTMLSource: React.FC<HTMLSourceProps> = ({ toggleSource }) => {
  const [htmlVisible, setHtmlVisible] = useState(false)
  return (
    <>
                  
   
    <div className="ce-toolbar--html-source">
      <button className="ce-toolbar--html-source-btn" type="button" onClick={toggleSource}>
       <svg height='10px' viewBox="0 0 48 48" width='10px'>
       <path d="M0 0h48v48H0V0z" fill="none" />
     <path d="M18.8 33.2L9.7 24l9.2-9.2L16 12 4 24l12 12 2.8-2.8zm10.4 0l9.2-9.2-9.2-9.2L32 12l12 12-12 12-2.8-2.8z" />
    </svg>
      </button>
    </div>  
  
                
                </>
  );
};

export default HTMLSource;
