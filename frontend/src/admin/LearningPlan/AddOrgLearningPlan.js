import React, { useEffect, useState, useRef } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormInput,
  CForm,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CTabContent,
  CFormTextarea,
  CImage,
  CModalTitle,
  CBadge,
  CTabPane,
} from "@coreui/react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Link, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import getApiCall from "src/server/getApiCall";
import postApiCall from "src/server/postApiCall";
import "../../css/form.css";
import { FilterMatchMode } from "primereact/api";
import generalUpdateApi from "src/server/generalUpdateApi";
import { InputText } from "primereact/inputtext";
function AddOrgLearningPlan() {
  const navigate = useNavigate();
  const [courseListvisible, setcourseListvisible] = useState(false);
  const colorName = localStorage.getItem("ThemeColor");
  const [themes, setThemes] = useState(colorName);
  const [responseData2, setResponseData2] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [orderPayload, setOrderPayload] = useState({});
  const [learningPlanRequirementId, setLearningPlanRequirementId] = useState("");
  const [shouldUpdateOrder, setShouldUpdateOrder] = useState(false);
  const [openCourseTypeModel, setOpenCourseTypeModel] = useState(false);
  const [hideSaveAndContinueButton, setHideSaveAndContinueButton] =
    useState(false);
  const [learningPlanId, setLearningPlanId] = useState("");
  let learningPlanId1 = "";
  const [showEditButton, setShowEditButton] = useState(false);
  const [showAddRequirmentButton, setShowAddRequirmentButton] = useState(false);
  useEffect(() => {
    learningPlanId1 = localStorage.getItem("learningPlanId");
    setLearningPlanId(learningPlanId1);
    setShowEditButton(learningPlanId1 != null ? true : false);
  }, [learningPlanId1]);


  const toast = useRef(null);
  const [data, setData] = useState({
    learningPlanName: "",
    forceOrder: "",
    description: "",
    isActive: 1,
    learningPlanRequirements: [],
    learningPlanUsers: [],
    learningPlanGroups: [],
    learningPlanJobTitles: [],
  });
  const [outerListing, setOuterListing] = useState("");
  const [loading1, setLoading1] = useState(false);
  const [firstSaveButton, setFirstSaveButton] = useState(false);

  const addOrgLearningPlan = async (data, navigateOrNot) => {
    setLoading1(true);

    try {
      const response = await postApiCall("addOrgLearningPlan", data);
      setLearningPlanId(response);
      toast.current.show({
        severity: "success",
        summary: "Successful",
        detail: "Learning Plan Added Successfully",
        life: 3000,
      });

      if (navigateOrNot === true) {
        setTimeout(() => {
          navigate("/admin/organizationlearningplan");
        }, 1000);
      } else {
        // setcourseListvisible(!courseListvisible);
      }
      setShowAddRequirmentButton(true);
    } catch (error) {
      setLoading1(false);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error Adding Learning Plan",
        life: 3000,
      });
    }
  };
  const getOrgRequirementListLearningPlanById = async (Id) => {
    try {
      const response = await getApiCall(
        `getOrgRequirementListByLearningPlanId`,
        Id
      );
      setResponseData2(response);
    } catch (error) {
      throw Promise.reject(error);
    }
  };

  const buttonTemplate2 = (responseData2, index, totalItems) => {
    const totallist = outerListing.length - 1;
    const firstlist = outerListing[0];
    return (

      <div style={{ display: "flex", alignItems: "center" }}>
        {/* Add a Move Up button if it's not the first item */}
        {responseData2.orders !== firstlist.orders && (
          <div
            title="Move Up"
            style={{ cursor: "pointer" }}
            onClick={() => moveUp(responseData2.orders, responseData2.learningPlanRequirementId)}
            disabled={isFirstLearningPlanRequirement(responseData2.orders, responseData2.learningPlanRequirementId)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-up-square-fill" viewBox="0 0 16 16">
              <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 0 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z" />
            </svg>
          </div>
        )}
        <div style={{ margin: "2px", paddingLeft : "2px" }}></div>
        {/* Add a Move Down button if it's not the last item */}
        {responseData2.orders !== outerListing[totallist].orders && (
          <div
            title="Move Down"
            style={{ cursor: "pointer" }}
            onClick={() => moveDown(responseData2.orders, responseData2.learningPlanRequirementId)}
            disabled={isLastOrder(responseData2.orders, responseData2.learningPlanRequirementId)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-arrow-down-square-fill" viewBox="0 0 16 16">
              <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z" />
            </svg>
          </div>
        )}
      </div>
    );
  };



  function isLastOrder(order, learningPlanRequirementId) {
    const lastItem = data.learningPlanRequirements[data.learningPlanRequirements.length - 1];
    return (
      lastItem &&
      order === lastItem.orders &&
      learningPlanRequirementId === lastItem.learningPlanRequirementId
    );
  }


  const moveUp = (orders, learningPlanRequirementId) => {
    const index = data.learningPlanRequirements.findIndex(
      (item) => item.orders === orders
    );

    if (index > 0) {
      const copyArray = [...data.learningPlanRequirements];

      // Swap only requirementName, requirementId, and typeName values
      const tempRow = { ...copyArray[index] };
      copyArray[index] = { ...copyArray[index - 1], orders: tempRow.orders };
      copyArray[index - 1] = { ...tempRow, orders: copyArray[index - 1].orders };

      const newData = { ...data, learningPlanRequirements: copyArray };
      setData(newData);
      setOuterListing(newData.learningPlanRequirements);

      // Update the responseData2 array by swapping the entire row
      const updatedResponseData2 = responseData2
        ? responseData2.map((item) =>
          item.learningPlanRequirementId === learningPlanRequirementId
            ? newData.learningPlanRequirements.find(
              (req) => req.orders === item.orders
            )
            : item
        )
        : [];

      // Create newOrderPayload object
      const newOrderPayload = {};
      newData.learningPlanRequirements.forEach((item, index) => {
        newOrderPayload[item.learningPlanRequirementId] = index + 1;
      });

      // Update state with newOrderPayload
      setOrderPayload(newOrderPayload);
      setShouldUpdateOrder(true);

      // Use the updated responseData2 when updating the state
      setResponseData2(updatedResponseData2);

      console.log('Moved up, new data:', newData);
      console.log('learningPlanRequirementId:', learningPlanRequirementId);

    }
  };

  const moveDown = (orders, learningPlanRequirementId) => {
    const index = data.learningPlanRequirements.findIndex(
      (item) => item.orders === orders
    );

    if (index < data.learningPlanRequirements.length - 1) {
      const copyArray = [...data.learningPlanRequirements];

      // Swap only requirementName, requirementId, and typeName values
      const tempRow = { ...copyArray[index] };
      copyArray[index] = { ...copyArray[index + 1], orders: tempRow.orders };
      copyArray[index + 1] = { ...tempRow, orders: copyArray[index + 1].orders };

      const newData = { ...data, learningPlanRequirements: copyArray };
      setData(newData);
      setOuterListing(newData.learningPlanRequirements);

      // Update the responseData2 array by swapping the entire row
      const updatedResponseData2 = responseData2
        ? responseData2.map((item) =>
          item.learningPlanRequirementId === learningPlanRequirementId
            ? newData.learningPlanRequirements.find(
              (req) => req.orders === item.orders
            )
            : item
        )
        : [];

      // Use the updated responseData2 when updating the state
      setResponseData2(updatedResponseData2);

      console.log('Moved down, new data:', newData);
      console.log('learningPlanRequirementId:', learningPlanRequirementId);
    }
  };

  const isFirstLearningPlanRequirement = (learningPlanRequirement) => {
    return data.learningPlanRequirements.indexOf(learningPlanRequirement) === 0;
  };

  const isLastLearningPlanRequirement = (orders, learningPlanRequirementId) => {
    const learningPlanRequirements = data.learningPlanRequirements;

    // Check if learningPlanRequirements is an array and not empty
    if (Array.isArray(learningPlanRequirements) && learningPlanRequirements.length > 0) {
      const lastItem = learningPlanRequirements[learningPlanRequirements.length - 1];

      // Check if lastItem has the required properties
      if (
        lastItem &&
        lastItem.orders !== undefined &&
        lastItem.learningPlanRequirementId !== undefined
      ) {
        return (
          orders === lastItem.orders &&
          learningPlanRequirementId === lastItem.learningPlanRequirementId
        );
      }
    }

    return false;
  };

  const [userID, setUserID] = useState();

  useEffect(() => {
    // Update the data state directly
    setData((prevData) => ({
      ...prevData,
      learningPlanRequirements: [...outerListing],
    }));

    if (outerListing) {
      //replace the record on the basis of requirementId of responseData2

      let outerListingData = outerListing;
      let responseData2Data = responseData2;

      responseData2Data?.map((item) => {
        outerListingData?.map((item2, index) => {
          if (item.requirementId == item2.requirementId) {
            const findIndex = responseData2Data.findIndex(
              (x) => x.requirementId === item.requirementId
            );

            responseData2Data[findIndex].requirementId = item2.requirementId;
            // responseData2Data[findIndex].requirementName =
            //   item2.requirementName;
            // responseData2[findIndex].expiry = item2.dueDateSetting == 1 ? 0 : 1;
            // responseData2Data[findIndex].dueDateSetting = item2.dueDateSetting;
            // responseData2Data[findIndex].fromDateOfAssign = parseInt(
            //   item2.fromDateOfAssign
            // );
            // responseData2Data[findIndex].fromDateOfExpiration = parseInt(
            //   item2.fromDateOfExpiration
            // );
            // responseData2Data[findIndex].fromOrderOfPreviousCompletion =
            //   parseInt(item2.fromOrderOfPreviousCompletion);

            responseData2Data[findIndex].requirementType = item2.typeId;

            responseData2Data[findIndex].dueDateValue = parseInt(
              item2.dueDateValue
            );
            responseData2Data[findIndex].dueDateType = parseInt(
              item2.dueDateType
            );
            // responseData2Data[findIndex].expirationDateSetting = parseInt(
            //   item2.expirationDateSetting
            // );
            // responseData2Data[findIndex].fromDateOfCompletion = parseInt(
            //   item2.fromDateOfCompletion
            // );
            // responseData2Data[findIndex].fromDateOfAssignment = parseInt(
            //   item2.fromDateOfAssignment
            // );
            responseData2Data[findIndex].expirationDateValue = parseInt(
              item2.expirationDateValue
            );
            responseData2Data[findIndex].expirationDateType = parseInt(
              item2.expirationDateType
            );
            responseData2Data[findIndex].orders = (index + 1) * 100;
            responseData2Data[findIndex].isActive = 1;
            responseData2Data[findIndex].expirationType = item2.expirationType;
            responseData2Data[findIndex].learning_plan_requirement_id =
              item2.learning_plan_requirement_id;
            // responseData2Data[findIndex].expirationLength =
            //   item2.expirationLength;
            // responseData2Data[findIndex].expirationTime = item2.expirationTime;
          }
        });
      });

      setResponseData2(responseData2Data);
    }
  }, [outerListing]);

  useEffect(() => {
    console.log({ outerListing });
  }, [outerListing]);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
  };
  const [filters, setFilters] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      requirementName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      category: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      type: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };
  const [selectAll, setSelectAll] = useState(false);

  const checkboxHeader = () => {
    return (
      <input
        class="form-check-input"
        type="checkbox"
        checked={selectAll}
        onChange={handleSelectAll}
      />
    );
  };

  function handleSelectAll(event) {
    console.log("sdsdsds", event.target.checked);

    const isChecked = event.target.checked ? 1 : 0;

    const updatedData = responseData2.map((row) => ({
      ...row,
      isChecked: isChecked,
    }));
    setOuterListing(updatedData);
    setSelectAll(event.checked);
    if (isChecked === false) {
      const updatedData1 = responseData2.map((row) => ({
        ...row,
        isChecked: 0,
        isActive: 0,
      }));
      setOuterListing(updatedData1);
    }
  }

  const checkbox1 =
    responseData2 &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          checked={e.isChecked === 1 ? true : false}
          // value={e.isChecked === 1 ? true : false}
          value={e.requirementId}
          onChange={(event) => handleChange(event, e.requirementId)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));

  const handleChange = (e, requirementId) => {
    responseData2.map((index) => {
      if (index.requirementId === requirementId) {
        index.isChecked = e.target.checked ? 1 : 0;
      }
    });
  };
  const setOuterListingTable = (e) => {
    let checkedData = [];
    e.forEach((value) => {
      if (value.isChecked === 1) {
        checkedData.push(value);
      }
    });

    setcourseListvisible(false);

    setOuterListing((prevOuterListing) => {
      // Check for duplicate IDs before adding to the array
      const newOuterListing = [...prevOuterListing];

      checkedData.forEach((checkedItem) => {
        // Check if the ID already exists in OuterListing
        const isDuplicate = newOuterListing.some(
          (item) => item.requirementId === checkedItem.requirementId
        );

        // If it's not a duplicate, add it to the array
        if (!isDuplicate) {
          newOuterListing.push(checkedItem);
        }
      });

      return newOuterListing;
    });
  };
  const Requirement = (responseData) => (
    <>{responseData.requirementName ? responseData.requirementName : "-"}</>
  );
  const GroupName = (responseData) => (
    <div>
      {responseData.groupName}(<span>{responseData.groupCode}</span>)
    </div>
  );
  const jobtitleName = (responseData) => (
    <div>
      {responseData.jobTitleName}(<span>{responseData.jobTitleCode}</span>)
    </div>
  );
  useEffect(() => {
    initFilters();
    initFilters2();
  }, []);

  // user
  const [selectedUserValue, setSelectedUserValue] = useState("");
  const [userResponseData1, setUserResponseData1] = useState([]);
  const [userResponseData, setUserResponseData] = useState([]);
  const [openUserModel, setOpenUserModel] = useState(false);
  const [openTableAfterSelection, setOpenTableAfterSelection] = useState(false);
  const [selectedUserContent2, setSelectedUserContent2] = useState([]);
  const [selectedGroupContent, setSelectedGroupContent] = useState([]);
  const [outerUserListing, setOuterUserListing] = useState("");
  const [rowClick, setRowClick] = useState(false);
  const [filters2, setFilters2] = useState(null);

  const [showValidationMessages, setShowValidationMessages] = useState(false);

  const handleRadioChange2 = (event) => {
    setSelectedUserValue(event.target.value);
  };
  const getActiveUserListing = async (id) => {
    try {
      const res = await getApiCall("getUserListByLearningPlanId", id);
      setUserResponseData1(
        res.filter((item) => item.isChecked === 1).map((item) => item)
      );
      setUserResponseData(res);
    } catch (err) { }
  };
  const [outerJobListing, setOuterJobListing] = useState("");

  const [outerGroupListing, setOuterGroupListing] = useState("");

  const [jobTitleList, setJobTitleList] = useState([]);

  const JobListApi = async (Id) => {
    try {
      const res = await getApiCall("getJobTitleListByLearningPlanId", Id);
      setJobTitleList(res);
    } catch (err) { }
  };
  const [groupList, setGroupListData] = useState([]);
  const getOrgGroupList = async (id) => {
    try {
      const response = await getApiCall("getGroupsListByLearningPlanId", id);
      setGroupListData(response);
    } catch (error) { }
  };
  const [globalFilterValue2, setGlobalFilterValue2] = useState("");

  const onGlobalFilterChange2 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters2 };
    _filters["global"].value = value;

    setFilters2(_filters);
    setGlobalFilterValue2(value);
  };
  const initFilters2 = () => {
    setFilters2({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      firstName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      lastName: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
      role_name: {
        value: null,
        matchMode: FilterMatchMode.CONTAINS,
      },
    });
    setGlobalFilterValue("");
  };
  const [userVisible, setUserVisible] = useState(false);

  const setOuterUserListingTable = (data) => {
    let checkedData1 = [];
    data.map((value) => {
      if (value.isChecked === 1) {
        checkedData1.push(value);
      }
    });
    setUserVisible(false);
    // setOuterUserListing(checkedData1);
    if (!outerUserListing) {
      setOuterUserListing(checkedData1);
    } else {
      // setOuterUserListing((prevOuterListing) => [
      //   ...prevOuterListing,
      //   ...checkedData1,
      // ]);
      setOuterUserListing((prevOuterListing) => {
        const newOuterListing = [...prevOuterListing];

        checkedData1.forEach((checkedItem) => {
          const isDuplicate = newOuterListing.some(
            (item) => item.userId === checkedItem.userId
          );
          if (!isDuplicate) {
            newOuterListing.push(checkedItem);
          }
        });

        return newOuterListing;
      });
    }
  };
  const checkbox3 =
    userResponseData &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          checked={e.isChecked}
          value={e.userId}
          onChange={(event) => handleChange3(event, e.userId)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));
  const [userIDPresent, setUserIDPresent] = useState(false);
  const handleChange3 = (e, userId) => {
    userResponseData.map((index) => {
      if (index.userId === userId) {
        index.isChecked = e.target.checked ? 1 : 0;
        setUserID(userId);
        setUserIDPresent(true);
      }
    });
  };
  const [formattedDate, setFormattedDate] = useState();
  useEffect(() => {
    const currentDate = new Date();

    // Extract the parts of the date
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so add 1
    const day = String(currentDate.getDate()).padStart(2, "0");
    // Format the date as "YYYY/MM/DD"
    const formattedDate1 = `${year}/${month}/${day}`;
    setFormattedDate(formattedDate1);
  }, []);
  useEffect(() => {
    if (userIDPresent) {
      setData((prevData) => {
        return {
          ...prevData,
          learningPlanUsers: [
            ...(prevData.learningPlanUsers || []),
            {
              userId: `${userID}`,
              assignDate: formattedDate,
              isActive: "1",
            },
          ],
        };
      });
    }
  }, [userID, userIDPresent]);
  // job
  const setOuterJobListingTable = (data) => {
    let checkedData1 = [];
    data.map((value) => {
      if (value.isChecked === 1) {
        checkedData1.push(value);
      }
    });
    if (!outerJobListing) {
      setOuterJobListing(checkedData1);
    } else {
      setOuterJobListing((prevOuterListing) => {
        const newOuterListing = [...prevOuterListing];
        checkedData1.forEach((checkedItem) => {
          const isDuplicate = newOuterListing.some(
            (item) => item.jobTitleId === checkedItem.jobTitleId
          );
          if (!isDuplicate) {
            newOuterListing.push(checkedItem);
          }
        });

        return newOuterListing;
      });
    }
  };
  const checkboxJob =
    jobTitleList &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          checked={e.isChecked}
          value={e.jobTitleId}
          onChange={(event) => handleChangeJob(event, e.jobTitleId)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));
  const [jobID, setJobID] = useState([]);
  const [jobIDPresent, setJobIDPresent] = useState(false);
  const handleChangeJob = (e, jobId) => {
    jobTitleList.map((index) => {
      if (index.jobTitleId === jobId) {
        index.isChecked = e.target.checked ? 1 : 0;
        setJobID(jobId);
        setJobIDPresent(true);
      }
    });
  };
  useEffect(() => {
    if (jobIDPresent) {
      setData((prevData) => {
        return {
          ...prevData,
          learningPlanJobTitles: [
            ...(prevData.learningPlanJobTitles || []),
            {
              jobTitleId: `${jobID}`,
              assignDate: formattedDate,
              isActive: "1",
            },
          ],
        };
      });
    }
  }, [jobID, jobIDPresent]);
  // Groups
  const setOuterGroupsListingTable = (data) => {
    let checkedGroupData = [];
    data.map((value) => {
      if (value.isChecked === 1) {
        checkedGroupData.push(value);
      }
    });
    if (!outerGroupListing) {
      setOuterGroupListing(checkedGroupData);
    } else {
      setOuterGroupListing((prevOuterListing) => {
        const newOuterListing = [...prevOuterListing];
        checkedGroupData.forEach((checkedItem) => {
          const isDuplicate = newOuterListing.some(
            (item) => item.groupId === checkedItem.groupId
          );
          if (!isDuplicate) {
            newOuterListing.push(checkedItem);
          }
        });
        return newOuterListing;
      });
    }
  };
  const checkboxGroups =
    groupList &&
    ((e) => (
      <>
        <input
          class="form-check-input"
          type="checkbox"
          checked={e.isChecked}
          value={e.groupId}
          onChange={(event) => handleChangeGroups(event, e.groupId)}
          style={{ marginTop: "11px" }}
        />
      </>
    ));
  const [groupsID, setGroupsID] = useState();
  const [groupIDPresent, setGroupIDPresent] = useState(false);
  const handleChangeGroups = (e, groupId) => {
    groupList.forEach((index) => {
      if (index.groupId === groupId) {
        index.isChecked = e.target.checked ? 1 : 0;
        setGroupsID(groupId);
        setGroupIDPresent(true);
      }
    });
  };
  useEffect(() => {
    if (groupIDPresent) {
      setData((prevData) => {
        return {
          ...prevData,
          learningPlanGroups: [
            ...(prevData.learningPlanGroups || []),
            {
              groupId: `${groupsID}`,
              assignDate: formattedDate,
              isActive: "1",
            },
          ],
        };
      });
    }
  }, [groupsID, groupIDPresent]);

  const [openFromRadioButton, setOpenFromRadioButton] = useState(false);

  // Get Api for Update

  useEffect(() => {
    if (learningPlanId) {
      getLearningPlanById(learningPlanId);
    }
  }, [learningPlanId]);

  const getLearningPlanById = async (learningPlanId) => {
    try {
      const response = await getApiCall(
        "getOrgLearningPlanById",
        learningPlanId
      );
      console.log("API Response:", response)

      if (response) {
        setData({
          ...data,
          learningPlanName: response?.learningPlanName,
          forceOrder: response?.forceOrder,
          description: response?.description,
        });
        setShowAddRequirmentButton(true);
        setHideSaveAndContinueButton(true);

        setOuterListing(
          response.learningPlanRequirements.map((item, index) => ({
            // requirementId: item.requirementId,
            // isChecked: item.isActive,
            // type: item.type,
            // expiry: item.dueDateSetting == 1 ? 0 : 1,
            // dueDateSetting: item.dueDateSetting,
            // fromDateOfAssign: item.fromDateOfAssign,
            // fromDateOfExpiration: item.fromDateOfExpiration,
            // expirationDateSetting: item.expirationDateSetting,
            // fromDateOfCompletion: item.fromDateOfCompletion,
            // fromDateOfAssignment: item.fromDateOfAssignment,
            // fromDateOfCompletion: item.fromDateOfCompletion,
            // fromDateOfAssignment: item.fromDateOfAssignment,
            // expirationLength: item.expirationLength,
            // expirationTime: item.expirationTime,
            // fromDateOfAssign: item.fromDateOfAssign,
            // fromDateOfExpiration: item.fromDateOfExpiration,
            // fromOrderOfPreviousCompletion: item.fromOrderOfPreviousCompletion,
            id: item.id,
            requirementId: item.requirementId,
            requirementType: item.typeName,
            dueDateValue: item.dueDateValue,
            dueDateType: item.dueDateType,
            expirationDateValue: item.expirationDateValue,
            learningPlanRequirementId: item.learningPlanRequirementId,
            isActive: 1,
            expirationType: item.expirationType,
            orders: item.orders,
            requirementName: item.requirementName,
            typeName: item.typeName,
            // learning_plan_requirement_id: item.learning_plan_requirement_id,
          }))
        );
        setOuterGroupListing(response.learningPlanGroups);
        setOuterJobListing(response.learningPlanJobTitles);
        setOuterUserListing(response.learningPlanUsers);
        console.log("responseData2.orders", responseData2.orders)
      }
    } catch (error) {
      //console.log(error);
    }
  };
  const [outerListingIndex, setOuterListingIndex] = useState("");
  const [dueDateVisible, setDueDateVisible] = useState(false);
  const [expirationDateVisible, setExpirationDateVisible] = useState(false);
  const [expiryDateTextBoxShow, setExpiryDateTextBoxShow] = useState("");
  const [expiryDateTextBoxShow1, setExpiryDateTextBoxShow1] = useState("");

  const expiryShow = (responseData, props) => (
    <>
      {isNaN(responseData?.expirationDateValue) ||
        responseData?.expirationDateValue === null ? (
        <>
          <div
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            Add Expiration Date
          </div>
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Notification"
            onClick={() => {
              setExpirationDateVisible(!expirationDateVisible);
              setOuterListingIndex(props.rowIndex);
            }}
          />
        </>
      ) : (
        <>
          {responseData?.expirationType === 1 ? (
            <div
              className={`badge badge-light-info text-info badgeColor${themes} `}
              color="light"
            >
              {responseData?.expirationDateValue} days from date of assignment
            </div>
          ) : (
            <div
              className={`badge badge-light-info text-info badgeColor${themes} `}
              color="light"
            >
              {responseData?.expirationDateValue} days from date of expiration
            </div>
          )}

          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Notification"
            onClick={() => {
              setExpirationDateVisible(!expirationDateVisible);
              setOuterListingIndex(props.rowIndex);
            }}
          />
        </>
      )}
    </>
  );
  const dueDateShow = (responseData, props) => (
    <>
      {isNaN(responseData?.dueDateValue) ||
        responseData?.dueDateValue === null ? (
        <>
          <div
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            Add Due Date
          </div>
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Notification"
            onClick={() => {
              setDueDateVisible(!dueDateVisible);
              setOuterListingIndex(props.rowIndex);
            }}
          />
        </>
      ) : (
        <>
          {responseData?.dueDateType === 1 ? (
            <div
              className={`badge badge-light-info text-info badgeColor${themes} `}
              color="light"
            >
              {responseData?.dueDateValue} days from date of assignment
            </div>
          ) : responseData?.dueDateType === 2 ? (
            <div
              className={`badge badge-light-info text-info badgeColor${themes} `}
              color="light"
            >
              {responseData?.dueDateValue} days from date of expiration
            </div>
          ) : (
            <div
              className={`badge badge-light-info text-info badgeColor${themes} `}
              color="light"
            >
              {responseData?.dueDateValue} days from date of previous completion
            </div>
          )}
          {/* <div
            className={`badge badge-light-info text-info badgeColor${themes} `}
            color="light"
          >
            {responseData?.dueDateValue} days from date of assignment
          </div> */}
          <CImage
            src="/custom_icon/edit.svg"
            alt="edit.svg"
            style={{ height: "25px", cursor: "pointer" }}
            className="me-2"
            title="Edit Notification"
            onClick={() => {
              setDueDateVisible(!dueDateVisible);
              setOuterListingIndex(props.rowIndex);
            }}
          />
        </>
      )}
    </>
  );

  const updateOrgLearningPlan = async (id, data, buttonName, learningPlanRequirementId) => {
    setLoading1(true);

    try {
      const response = await generalUpdateApi("updateOrgLearningPlanById", data, id, learningPlanRequirementId);

      if (response) {

        const updatedData = {
          ...data,
          learningPlanRequirements: response.data?.learningPlanRequirements || data.learningPlanRequirements,

        };

        setData(updatedData);

        // Update the order in the orderPayload object
        const newOrderPayload = { ...orderPayload };
        updatedData.learningPlanRequirements.forEach((item, index) => {
          newOrderPayload[item.learningPlanRequirementId] = index + 1;
        });
        setOrderPayload(newOrderPayload);
        setShouldUpdateOrder(true);
        setLoading1(false);
        setLearningPlanRequirementId(learningPlanRequirementId);


      }

      if (toast.current) {
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Learning Plan Updated Successfully",
          life: 3000,
        });
      }
      setTimeout(() => {
        navigate("/admin/organizationlearningplan");
      }, 1000);
    } catch (error) {
      setLoading1(false);
      if (toast.current) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error Updating Learning Plan",
          life: 3000,
        });
      }
    }
  };

  const updateOrdersInData = (updatedData, responseData2, learningPlanRequirementId) => {
    // Your existing function logic...

    // Use learningPlanRequirementId as needed in your function

    if (responseData2) {
      const updatedLearningPlanRequirements = updatedData.learningPlanRequirements.map((item) => {
        const correspondingItem = responseData2.find((dataItem) => dataItem.learningPlanRequirementId === item.learningPlanRequirementId);
        if (correspondingItem) {
          return {
            ...item,
            orders: correspondingItem.orders, // Update the 'orders' value
            learningPlanRequirementId: correspondingItem.learningPlanRequirementId, // Update the 'learningPlanRequirementId' value
          };
        }
        return item;
      });

      // Return the updated data object with updated learningPlanRequirements
      return { ...updatedData, learningPlanRequirements: updatedLearningPlanRequirements };
    } else {
      // Handle the case where responseData2 is null or undefined
      return updatedData;
    }
  };

  const updatedData = updateOrdersInData(data, responseData2, learningPlanRequirementId);
  const [validationMessages, setValidationMessages] = useState({});

  const validateForm = () => {
    let formIsValid = true;
    let error = {};
    if (!data.learningPlanName) {
      formIsValid = false;
      error["learningPlanName"] = "Please enter learning plan name.";
    }

    setValidationMessages(error);
    setShowValidationMessages(!formIsValid);

    return formIsValid;
  };

  const handleSubmission = (navigateOrNot, saveButton, buttonName, learningPlanRequirementId) => {
    if (validateForm()) {
      // Update the data object with the orders
      const updatedData = updateOrdersInData(data, learningPlanRequirementId);

      if (learningPlanId != null) {
        updateOrgLearningPlan(learningPlanId, updatedData, buttonName, learningPlanRequirementId);
      } else {
        addOrgLearningPlan(updatedData, navigateOrNot);
      }
    }
  };

  const updateOrder = (item, newOrder) => {
    // Find the index of the item in the data array
    const index = data.learningPlanRequirements.findIndex(
      (elem) => elem.requirementId === item.requirementId
    );

    if (index !== -1) {
      // Create a copy of the data array and update the order value
      const updatedData = [...data.learningPlanRequirements];
      updatedData[index] = { ...item, orders: parseInt(newOrder) };

      // Update the state with the new data
      setData({ ...data, learningPlanRequirements: updatedData });
    }
  };
  const confirmDeleteProduct = (id) => {
    const filteredData = outerListing.filter(
      (item) => item.requirementId !== id
    );
    setOuterListing(filteredData);
  };
  const buttonTemplate = (responseData) => (
    <div style={{ display: "flex" }}>
      <CImage
        src="/custom_icon/bin.svg"
        className="me-3"
        alt="bin.svg"
        style={{ height: "24px", cursor: "pointer" }}
        onClick={() => confirmDeleteProduct(responseData.requirementId)}
        title="Delete Credential"
      />
    </div>
  );
  const name = (userlist) => (
    <>{userlist.firstName ? userlist.firstName + userlist?.lastName : "-"}</>
  );
  const [selectedCourseContent, setSelectedCourseContent] = useState([]);

  return (
    <CRow>
      <Toast ref={toast} />
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Learning Plan</strong>
          </CCardHeader>
          <CCardBody className="card-body org border-top p-9">
            <CModal
              size="md"
              alignment="center"
              visible={courseListvisible}
              onClose={() => setcourseListvisible(false)}
              scrollable
            >
              <CModalHeader closeButton={true}>
                <CTabContent className="rounded-bottom">
                  <strong>Choose Course Type</strong>
                  <CTabPane className="p-3 preview" visible>
                    <div className="card-header border-0 d-flex justify-content-between">
                      <div className="d-flex row align-items-center">
                        <div
                          className={`col-md-12 col-xxl-12 searchBarBox${themes}`}
                        >
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              value={globalFilterValue}
                              onChange={onGlobalFilterChange}
                              style={{ height: "40px" }}
                              className="p-input-sm"
                              placeholder="Search..."
                            />
                          </span>
                        </div>
                      </div>
                      <div className="d-grid gap-2 d-md-flex justify-content-md-end"></div>
                    </div>
                  </CTabPane>
                </CTabContent>
              </CModalHeader>

              <>
                <CModalBody>
                  <div className={`InputThemeColor${themes}`}>
                    <DataTable
                      value={responseData2}
                      removableSort
                      showGridlines
                      rowHover
                      emptyMessage="No records found."
                      dataKey="requirementId"
                      filters={filters}
                      globalFilterFields2={[
                        "requirementName",
                        "category",
                        "type",
                      ]}
                      onSelectionChange={(e) => {
                        setSelectedCourseContent(
                          e.value.map((value, i) => value.requirementId)
                        );
                      }}
                      selection={selectedCourseContent}
                    >
                      <Column
                        header={checkboxHeader}
                        // body={checkbox1}
                        body={(rowData) => (
                          <input
                            class="form-check-input"
                            type="checkbox"
                            value={rowData.isChecked === 1 ? true : false}
                            // checked={rowData.isActive === 1}
                            checked={rowData.isActive}
                            onChange={(event) =>
                              handleChange(event, rowData.requirementId)
                            }
                          />
                        )}
                        style={{ maxWidth: "2.7rem" }}
                      ></Column>
                      <Column
                        field="requirementName"
                        header="Course Title"
                        sortable
                      ></Column>
                      <Column
                        field="category"
                        header="Category"
                        body={(rowData) => <>{rowData?.category?.join(",")}</>}
                        sortable
                      ></Column>
                      <Column
                        field="typeName"
                        header="Course Type"
                        sortable
                      ></Column>
                    </DataTable>
                  </div>
                </CModalBody>
                <CModalFooter>
                  <CButton
                    className={`btn btn-primary saveButtonTheme${themes}`}
                    type="button"
                    title="Assign Course"
                    onClick={() => {
                      setOuterListingTable(responseData2),
                        setHideSaveAndContinueButton(true);
                    }} // setRequirement(requirement)}
                  >
                    Assign
                  </CButton>

                  <CButton
                    className="btn btn-primary"
                    onClick={() => setcourseListvisible(false)}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </>
            </CModal>
            {/* User Model */}
            <CModal
              size="lg"
              alignment="center"
              visible={openUserModel}
              onClose={() => setOpenUserModel(false)}
              scrollable
            >
              {openFromRadioButton === "user" ? (
                <>
                  <CModalHeader closeButton={true}>
                    <CTabContent className="rounded-bottom">
                      <strong>Choose Course Type</strong>
                      <CTabPane className="p-3 preview" visible>
                        <div className="card-header border-0 d-flex justify-content-between">
                          <div className="d-flex row align-items-center">
                            <div
                              className={`col-md-12 col-xxl-12 searchBarBox${themes}`}
                            >
                              <span className="p-input-icon-left">
                                <i className="pi pi-search" />
                                <InputText
                                  value={globalFilterValue2}
                                  onChange={onGlobalFilterChange2}
                                  style={{ height: "40px" }}
                                  className="p-input-sm"
                                  placeholder="Search..."
                                />
                              </span>
                            </div>
                          </div>
                          <div className="d-grid gap-2 d-md-flex justify-content-md-end"></div>
                        </div>
                      </CTabPane>
                    </CTabContent>
                  </CModalHeader>
                  <CModalBody>
                    <div className={`InputThemeColor${themes}`}>
                      <DataTable
                        value={userResponseData}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        globalFilterFields2={["organizationName"]}
                        filters={filters2}
                        dataKey="userId"
                        globalFilterFields={[
                          "firstName",
                          "lastName",
                          "role_name",
                        ]}
                      >
                        <Column
                          body={checkbox3}
                          style={{ maxWidth: "2.7rem" }}
                        ></Column>
                        <Column
                          field="firstName"
                          header="User Name"
                          sortable
                          body={name}
                        ></Column>
                        <Column field="email" header="Email" sortable></Column>
                        <Column
                          field="roleName"
                          header="Role"
                          sortable
                        ></Column>
                        <Column
                          field="jobTitle"
                          header="Job Title"
                          sortable
                        ></Column>
                        <Column field="area" header="Area" sortable></Column>
                        <Column
                          field="location"
                          header="Location"
                          sortable
                        ></Column>
                      </DataTable>
                    </div>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className={`btn btn-primary saveButtonTheme${themes}`}
                      type="button"
                      title="Assign Course"
                      onClick={() => {
                        setOuterUserListingTable(userResponseData);
                        setOpenUserModel(false);
                        setShowEditButton(true);
                      }}
                    >
                      Assign
                    </CButton>

                    <CButton
                      className="btn btn-primary"
                      onClick={() => setOpenUserModel(false)}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </>
              ) : openFromRadioButton === "jobtitle" ? (
                <>
                  <CModalHeader closeButton={true}>
                    <CTabContent className="rounded-bottom">
                      <strong>Choose Job Title</strong>
                    </CTabContent>
                  </CModalHeader>
                  <CModalBody>
                    <div className={`InputThemeColor${themes}`}>
                      {/* {setLoadOuter && ( */}
                      <DataTable
                        value={jobTitleList}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        filters={filters2}
                        dataKey="jobTitleId"
                        filterDisplay="menu"
                        globalFilterFields={["jobTitleName", "jobTitleCode"]}
                      // onSelectionChange={(e) => {
                      //   setSelectedContent21(
                      //     e.value.map((value, i) => value.userId)
                      //   );
                      //   setCourseLibraryIds1(e.value.map((e) => e.userId));
                      // }}
                      // selection={selectedContent2}
                      >
                        <Column
                          body={checkboxJob}
                          // selectionMode="multiple"
                          style={{ maxWidth: "2.7rem" }}
                        ></Column>
                        <Column
                          field="jobTitleName"
                          header="Job Title"
                          sortable
                        ></Column>
                        <Column
                          field="jobTitleCode"
                          header="Job Title Code"
                          sortable
                        ></Column>
                      </DataTable>
                      {/* )} */}
                    </div>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className={`btn btn-primary saveButtonTheme${themes}`}
                      type="button"
                      title="Assign Course"
                      onClick={() => {
                        setOuterJobListingTable(jobTitleList);
                        setOpenUserModel(false);
                        setShowEditButton(true);
                      }} // setRequirement(requirement)}
                    >
                      Assign
                    </CButton>

                    <CButton
                      className="btn btn-primary"
                      onClick={() => setOpenUserModel(false)}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </>
              ) : openFromRadioButton === "groups" ? (
                <>
                  <CModalHeader closeButton={true}>
                    <CTabContent className="rounded-bottom">
                      <strong>Select Groups</strong>
                    </CTabContent>
                  </CModalHeader>
                  <CModalBody>
                    <div className={`InputThemeColor${themes}`}>
                      {/* {setLoadOuter && ( */}
                      <DataTable
                        value={groupList}
                        removableSort
                        showGridlines
                        rowHover
                        emptyMessage="No records found."
                        filters={filters2}
                        dataKey="groupId"
                        filterDisplay="menu"
                        globalFilterFields={["groupName"]}
                        onSelectionChange={(e) => {
                          setSelectedGroupContent(
                            e.value.map((value, i) => value.groupId)
                          );
                        }}
                        selection={selectedGroupContent}
                      >
                        <Column
                          body={checkboxGroups}
                          // selectionMode="multiple"
                          style={{ maxWidth: "2.7rem" }}
                        ></Column>
                        <Column
                          field="groupName"
                          header="Group"
                          sortable
                        ></Column>
                        <Column
                          field="groupCode"
                          header="Group Code"
                          sortable
                        ></Column>
                      </DataTable>
                      {/* )} */}
                    </div>
                  </CModalBody>
                  <CModalFooter>
                    <CButton
                      className={`btn btn-primary saveButtonTheme${themes}`}
                      type="button"
                      title="Assign Course"
                      onClick={() => {
                        setOuterGroupsListingTable(groupList);
                        setOpenUserModel(false);
                        setShowEditButton(true);
                      }} // setRequirement(requirement)}
                    >
                      Assign
                    </CButton>

                    <CButton
                      className="btn btn-primary"
                      onClick={() => setOpenUserModel(false)}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </>
              ) : (
                <></>
              )}
            </CModal>
            <CForm className="row needs-validation" form={data}>
              <CRow className="mb-3">
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7 required"
                  >
                    Learning Plan Name
                  </CFormLabel>
                  <div className="col-sm-7">
                    <CFormInput
                      type="text"
                      placeholder="Plan Name"
                      value={data.learningPlanName}
                      onChange={(e) => {
                        setData({
                          ...data,
                          learningPlanName: e.target.value,
                        });
                      }}
                    />
                  </div>
                  {showValidationMessages && (
                    <div className="col-sm-7">
                      <span className="text-danger">
                        {validationMessages["learningPlanName"]}
                      </span>
                    </div>
                  )}
                </CRow>
                <CRow className="mb-3">
                  <CFormLabel
                    htmlFor=""
                    className="col-sm-4 col-form-label fw-bolder fs-7 "
                  >
                    Description
                  </CFormLabel>
                  <div className="col-sm-7">
                    <CFormTextarea
                      type="text"
                      placeholder="Description"
                      value={data.description}
                      onChange={(e) => {
                        setData({
                          ...data,
                          description: e.target.value,
                        });
                      }}
                    />
                  </div>
                </CRow>
                <CRow className="mb-3">
                  <div className="col-sm-7" style={{ display: "flex" }}>
                    <input
                      type="checkbox"
                      checked={data.forceOrder === 1}
                      onChange={(e) => {
                        setData({
                          ...data,
                          forceOrder: e.target.checked ? 1 : 0,
                        });
                      }}
                    />
                    <div>
                      &nbsp; Require Users to Complete Lerning Plan Requirment
                      In Given Order
                    </div>
                  </div>
                </CRow>
                {showAddRequirmentButton && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: `${outerListing.length > 0 ? "flex-start" : "center"
                        }`,
                      flexDirection: "column",
                    }}
                  >
                    {outerListing === "" && (
                      <div>
                        There are no requirements added yet. Please click on
                        below button to add the requirement Add Requirement
                        button
                      </div>
                    )}
                    <CButton
                      onClick={() => {
                        setcourseListvisible(true);
                        getOrgRequirementListLearningPlanById(
                          learningPlanId === null ? "0" : learningPlanId
                        );
                        setOpenCourseTypeModel(false);
                      }}
                      style={{ width: "10rem", margin: "1.3rem " }}
                    >
                      Add Requirements
                    </CButton>
                  </div>
                )}
                {outerListing?.length > 0 && (
                  <>
                    <DataTable
                      style={{ overflow: "auto" }}
                      value={outerListing}
                      removableSort
                      showGridlines
                      rowHover
                      emptyMessage="No records found."
                      responsiveLayout="scroll"
                      paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                      rows={10}
                      rowsPerPageOptions={[10, 20, 50]}
                      dataKey="requirementId"
                    >
                      <Column
                        field="requirementName"
                        header="Requirement"
                        body={Requirement}

                        sortable
                      ></Column>
                      <Column
                        field="typeName"
                        header="Course Type"
                        sortable
                      ></Column>

                      <Column
                        field="dueDate"
                        header="Due Date"
                        sortable
                        body={dueDateShow}
                      ></Column>
                      <Column
                        field="expiry"
                        header="Expiration"
                        sortable
                        // body={<div>365 days from date of assignment</div>}
                        body={expiryShow}
                      ></Column>
                      <Column
                        field="orders"
                        header="Order"
                        body={buttonTemplate2}

                        sortable
                      ></Column>
                      <Column
                        field="action"
                        header="Action"
                        body={buttonTemplate}
                      ></Column>
                    </DataTable>

                    <div style={{ marginBottom: "1.5rem" }}>
                      <>
                        <CButton
                          onClick={() => {
                            setOpenUserModel(true);
                            setOpenFromRadioButton("user");
                            getActiveUserListing(
                              learningPlanId === null ? "0" : learningPlanId
                            );
                          }}
                          style={{ width: "10rem", margin: "1.3rem " }}
                        >
                          Add User
                        </CButton>
                        <CButton
                          onClick={() => {
                            setOpenFromRadioButton("groups");
                            setOpenUserModel(true);
                            getOrgGroupList(
                              learningPlanId === null ? "0" : learningPlanId
                            );
                          }}
                          style={{ width: "10rem", margin: "1.3rem " }}
                        >
                          Add Groups
                        </CButton>
                        <CButton
                          onClick={() => {
                            setOpenFromRadioButton("jobtitle");
                            setOpenUserModel(true);
                            JobListApi(
                              learningPlanId === null ? "0" : learningPlanId
                            );
                          }}
                          style={{ width: "10rem", margin: "1.3rem " }}
                        >
                          Add Job Title
                        </CButton>

                        <div
                          className="row"
                          style={{ paddingBottom: "1.5rem" }}
                        >
                          {outerGroupListing?.length > 0 && (
                            <div className="col">
                              <DataTable
                                value={
                                  groupIDPresent != true
                                    ? outerGroupListing
                                    : outerGroupListing
                                }
                                removableSort
                                showGridlines
                                rowHover
                                emptyMessage="-"
                                dataKey="groupId"
                                filterDisplay="menu"
                                globalFilterFields={["groupName"]}
                              >
                                <Column
                                  field="groupName"
                                  header="Groups"
                                  style={{ fontSize: ".8rem" }}
                                  body={GroupName}
                                ></Column>
                              </DataTable>
                            </div>
                          )}
                          {outerJobListing?.length > 0 && (
                            <div className="col">
                              <DataTable
                                selectionMode={rowClick ? null : "checkbox"}
                                value={
                                  jobIDPresent != true
                                    ? outerJobListing
                                    : outerJobListing
                                }
                                removableSort
                                showGridlines
                                rowHover
                                emptyMessage="-"
                                dataKey="userId"
                                filterDisplay="menu"
                                globalFilterFields={["jobTitleName"]}
                              >
                                <Column
                                  field="jobTitleName"
                                  header="Job Titles"
                                  style={{ fontSize: ".8rem" }}
                                  body={jobtitleName}
                                ></Column>
                              </DataTable>
                            </div>
                          )}
                        </div>

                        {outerUserListing?.length > 0 && (
                          <DataTable
                            removableSort
                            selectionMode={rowClick ? null : "checkbox"}
                            value={
                              userIDPresent != true
                                ? outerUserListing
                                : outerUserListing
                            }
                            showGridlines
                            rowHover
                            // emptyMessage="No records found."
                            responsiveLayout="scroll"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                            rows={10}
                            rowsPerPageOptions={[10, 20, 50]}
                            dataKey="userId"
                          >
                            <Column
                              header="User Name"
                              field="firstName"
                              sortable
                              showFilterMenu={false}
                              body={name}
                            ></Column>
                            <Column
                              field="email"
                              header="Email"
                              sortable
                            ></Column>
                            <Column
                              field="roleName"
                              header="Role"
                              sortable
                            ></Column>
                            <Column
                              field="jobTitle"
                              header="Job Title"
                              sortable
                            ></Column>
                            <Column
                              field="area"
                              header="Area"
                              sortable
                            ></Column>
                            <Column
                              field="location"
                              header="Location"
                              sortable
                            ></Column>
                          </DataTable>
                        )}
                      </>
                    </div>
                  </>
                )}
                <div>
                  <div className="d-flex justify-content-end">
                    <CButton
                      className="btn btn-primary me-2"
                      onClick={() => {
                        handleSubmission(true, "update", "done");
                        setFirstSaveButton(true);
                      }}
                    >
                      Save
                    </CButton>
                    {hideSaveAndContinueButton === false &&
                      outerListing === "" ? (
                      <CButton
                        className={`me-md-2 btn btn-info `}
                        title="Save and Continue"
                        onClick={() => {
                          handleSubmission(false, "check", "firstbutton");
                        }}
                      >
                        Save and Continue
                      </CButton>
                    ) : (
                      <></>
                    )}
                    <Link
                      to="/admin/organizationlearningplan"
                      className="btn btn-primary"
                    >
                      Back
                    </Link>
                  </div>
                </div>
              </CRow>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CModal
        size="lg"
        alignment="center"
        onClose={() => {
          setExpirationDateVisible(false);
        }}
        visible={expirationDateVisible}
      >
        <CModalHeader>
          <CModalTitle>Expiry Date Setting</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className={`InputThemeColor${themes}`}>
            <CCol md={12}>
              <CRow className="mb-3 ms-4">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-7">
                      <input
                        type="radio"
                        checked={
                          expiryDateTextBoxShow === "true" ||
                          (outerListing &&
                            outerListing[outerListingIndex] &&
                            outerListing[outerListingIndex]
                              .expirationDateType === 2)
                        }
                        onChange={(e) => {
                          setExpiryDateTextBoxShow(
                            e.target.checked ? "true" : "false"
                          );

                          setOuterListing(
                            outerListing.map((item, index) => {
                              if (index === outerListingIndex) {
                                return {
                                  ...item,
                                  expirationDateValue: 0,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                      &nbsp; From date of completion
                    </div>
                    {expiryDateTextBoxShow === "true" && (
                      <>
                        <div className="col-sm-2">
                          <CFormInput
                            type="number"
                            placeholder="Days"
                            value={
                              outerListing && //show on index
                              outerListing[outerListingIndex] &&
                              outerListing[outerListingIndex]
                                .expirationDateValue
                            }
                            onChange={(e) => {
                              setOuterListing(
                                outerListing.map((item, index) => {
                                  if (index === outerListingIndex) {
                                    return {
                                      ...item,
                                      expirationDateType: 2,
                                      expirationDateValue: e.target.value,
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                          />
                        </div>
                        days
                      </>
                    )}
                  </CRow>
                </CCol>

                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-7">
                      <input
                        type="radio"
                        checked={
                          expiryDateTextBoxShow === "false" ||
                          (outerListing &&
                            outerListing[outerListingIndex] &&
                            outerListing[outerListingIndex]
                              .expirationDateType === 1)
                        }
                        onChange={(e) => {
                          setExpiryDateTextBoxShow(
                            e.target.checked ? "false" : "true"
                          );

                          setOuterListing(
                            outerListing.map((item, index) => {
                              if (index === outerListingIndex) {
                                return {
                                  ...item,
                                  expirationDateValue: 0,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                      &nbsp; From date of Assignments
                    </div>

                    {expiryDateTextBoxShow === "false" && (
                      <>
                        <div className="col-sm-2">
                          <CFormInput
                            type="number"
                            placeholder="Days"
                            value={
                              outerListing &&
                              outerListing[outerListingIndex] &&
                              outerListing[outerListingIndex]
                                .expirationDateValue
                            }
                            onChange={(e) => {
                              setOuterListing(
                                outerListing.map((item, index) => {
                                  if (index === outerListingIndex) {
                                    return {
                                      ...item,
                                      expirationDateType: 1,
                                      expirationDateValue: e.target.value,
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                          />
                        </div>
                        days
                      </>
                    )}
                  </CRow>
                </CCol>
              </CRow>
              {/* )} */}
            </CCol>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            className={`btn btn-primary saveButtonTheme${themes}`}
            type="button"
            title="Assign Course"
            onClick={() => setExpirationDateVisible(false)} // setRequirement(requirement)}
          >
            Save
          </CButton>

          <CButton
            className="btn btn-primary"
            onClick={() => {
              setExpirationDateVisible(false);
              localStorage.removeItem("learningPlanId");
            }}
          >
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
      <CModal
        size="lg"
        alignment="center"
        onClose={() => {
          setDueDateVisible(false);
        }}
        visible={dueDateVisible}
      >
        <CModalHeader>
          <CModalTitle>Due Date Setting</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className={`InputThemeColor${themes}`}>
            <CCol md={12}>
              <CRow className="mb-3 ms-4">
                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-7">
                      <input
                        type="radio"
                        checked={expiryDateTextBoxShow === "true"}
                        onChange={(e) => {
                          setExpiryDateTextBoxShow(
                            e.target.checked ? "true" : "false"
                          );
                          setExpiryDateTextBoxShow1(true);
                          setOuterListing(
                            outerListing.map((item, index) => {
                              if (index === outerListingIndex) {
                                return {
                                  ...item,
                                  fromDateOfExpiration: 0,
                                  fromOrderOfPreviousCompletion: 0,
                                  dueDateValue: 0,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                      &nbsp; From date of assign
                    </div>
                    {expiryDateTextBoxShow === "true" && (
                      <>
                        <div className="col-sm-2">
                          <CFormInput
                            type="number"
                            placeholder="Days"
                            value={
                              outerListing &&
                              outerListing[outerListingIndex] &&
                              outerListing[outerListingIndex].dueDateValue
                            }
                            onChange={(e) => {
                              setOuterListing(
                                outerListing.map((item, index) => {
                                  if (index === outerListingIndex) {
                                    return {
                                      ...item,
                                      dueDateValue: e.target.value,
                                      dueDateType: 1,
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                          />
                        </div>
                        days
                      </>
                    )}
                  </CRow>
                </CCol>
                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-7">
                      <input
                        type="radio"
                        checked={expiryDateTextBoxShow1 === "false"}
                        onChange={(e) => {
                          setExpiryDateTextBoxShow1(
                            e.target.checked ? "false" : "true"
                          );
                          setExpiryDateTextBoxShow(true);

                          setOuterListing(
                            outerListing.map((item, index) => {
                              if (index === outerListingIndex) {
                                return {
                                  ...item,
                                  fromDateOfExpiration: 0,
                                  fromOrderOfPreviousCompletion: 0,
                                  dueDateValue: 0,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                      &nbsp; From Order of Previous requirement completion
                    </div>
                    {expiryDateTextBoxShow1 === "false" && (
                      <>
                        <div className="col-sm-2">
                          <CFormInput
                            type="text"
                            placeholder="Days"
                            value={
                              outerListing &&
                              outerListing[outerListingIndex] &&
                              outerListing[outerListingIndex].dueDateValue
                            }
                            onChange={(e) => {
                              setOuterListing(
                                outerListing.map((item, index) => {
                                  if (index === outerListingIndex) {
                                    return {
                                      ...item,
                                      dueDateValue: e.target.value,
                                      dueDateType: 3,
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                          />
                        </div>
                        days
                      </>
                    )}
                  </CRow>
                </CCol>
                <CCol md={12}>
                  <CRow className="mb-3">
                    <div className="col-sm-7">
                      <input
                        type="radio"
                        checked={expiryDateTextBoxShow === "false"}
                        onChange={(e) => {
                          setExpiryDateTextBoxShow(
                            e.target.checked ? "false" : "true"
                          );
                          setExpiryDateTextBoxShow1(true);

                          // setOrderPreviousCompletion(false);
                          setOuterListing(
                            outerListing.map((item, index) => {
                              if (index === outerListingIndex) {
                                return {
                                  ...item,
                                  fromDateOfAssign: 0,
                                  dueDateValue: 0,
                                  fromOrderOfPreviousCompletion: 0,
                                };
                              }
                              return item;
                            })
                          );
                        }}
                      />
                      &nbsp; From date of Expiry
                    </div>
                    {expiryDateTextBoxShow === "false" && (
                      <>
                        <div className="col-sm-2">
                          <CFormInput
                            type="number"
                            placeholder="Days"
                            value={
                              outerListing &&
                              outerListing[outerListingIndex] &&
                              outerListing[outerListingIndex].dueDateValue
                            }
                            onChange={(e) => {
                              setOuterListing(
                                outerListing.map((item, index) => {
                                  if (index === outerListingIndex) {
                                    return {
                                      ...item,
                                      dueDateType: 2,
                                      dueDateValue: e.target.value,
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                          />
                        </div>
                        days
                      </>
                    )}
                  </CRow>
                </CCol>
              </CRow>
            </CCol>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton
            className={`btn btn-primary saveButtonTheme${themes}`}
            type="button"
            title="Assign Course"
            onClick={() => setDueDateVisible(false)} // setRequirement(requirement)}
          >
            Save
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  );
}

export default AddOrgLearningPlan;
