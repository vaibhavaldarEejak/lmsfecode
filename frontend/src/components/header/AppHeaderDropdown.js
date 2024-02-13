import React, { useEffect, useState } from "react";
import {
  CAvatar,
  CBadge,
  CButton,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import {
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

import avatar8 from "./../../assets/images/avatars/8.jpg";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { faL } from "@fortawesome/free-solid-svg-icons";

const API_URL = process.env.REACT_APP_API_URL;
const AppHeaderDropdown = () => {
  const [rolename, setrolename] = useState(localStorage.getItem("RoleName"));
  const [firstname, setfirstname] = useState(localStorage.getItem("UserName"));
  const [userDetail, setUserDetail] = useState("");
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem("ApiToken");
  const handleLogOut = () => {
    axios
      .post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        localStorage.removeItem("ApiToken");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (token !== "Bearer null") {
      userDetailApi();
    }
  }, []);

  const userDetailApi = async () => {
    try {
      const token = "Bearer " + localStorage.getItem("ApiToken");
      const res = await axios.get(`${API_URL}/getProfileDetails`, {
        headers: { Authorization: token },
      });
      setUserDetail(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const logOutPrompt = () => {
    let text = "Are you sure you want to logout? ";

    if (confirm(text) === true) {
      handleLogOut();
    } else {
      return false;
    }
  };
  return (
    <CDropdown variant="nav-item">
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>LogOut</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to logout!</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleLogOut}>
            Yes! Logout
          </CButton>
        </CModalFooter>
      </CModal>
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        {userDetail?.userPhoto ? (
          <CAvatar src={userDetail.userPhoto} size="md" />
        ) : (
          <CAvatar src ={avatar8} className="me-2" />
        )}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          Account
        </CDropdownHeader>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader> */}
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          {firstname && firstname} ({rolename && rolename})
        </CDropdownItem>
        <CDropdownItem href="/userprofile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Notifications
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={logOutPrompt} style={{ cursor: "pointer" }}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
