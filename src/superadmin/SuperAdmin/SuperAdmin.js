import React from "react";
import ListWidget from "../ListWidget";
import { Link } from "react-router-dom";
import { CCard, CCardHeader, CCol, CRow, CContainer } from "@coreui/react";
function SuperAdmin() {
  const token = "Bearer " + localStorage.getItem("ApiToken");
  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Super Admin</strong>
            </CCardHeader>
            <CContainer>
              <div className="container">
                <div className="row gy-5 g-xl-8 p-15 py-5">
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/organizationlist`}
                      title="Organisation"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com001.svg"
                        href="/superadmin/organizationlist"
                        name={"Organization"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/roleslist`}
                      title="Roles"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/superadmin/roleslist"
                        name={"Roles"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/modulelist`}
                      title="module"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fin001.svg"
                        href="/superadmin/modulelist"
                        name={"Module"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/actionpermission`}
                      title="Action Permission"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com012.svg"
                        href="/superadmin/actionpermission"
                        name={"Action Permission"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/menulist`}
                      title="Menu"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com004.svg"
                        href="/superadmin/menulist"
                        name={"Menu"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/menupermissionlist`}
                      title="Menu Permissions"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com006.svg"
                        href="/superadmin/menupermissionlist"
                        name={"Menu Permissions"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/themelist`}
                      titile="Theme"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/art007.svg"
                        href="/superAdmin/manageTheme"
                        name={"Theme"}
                      />
                    </Link>
                  </div>
                  {/* <div className='col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0'>
            <Link to={`/superAdmin/manageAnnouncement`}>
            <ListWidget
              className='primary'
              path='/media/icons/duotune/communication/com004.svg'
              href='/superAdmin/manageAnnouncement'
              name={'Announcement'}
            />
            </Link>
          </div> */}
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/notificationlist`}
                      title="Notifications"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com010.svg"
                        href="/superadmin/notificationlist"
                        name={"Notifications"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/genericcategorylist`}
                      title="Generic Category"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com008.svg"
                        href="/superadmin/genericcategorylist"
                        name={"Generic Category"}
                      />
                    </Link>
                  </div>
                  {/* <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/genericgrouplist`}
                      title="Generic Groups"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/com009.svg"
                        href="/superadmin/genericgrouplist"
                        name={"Generic Groups"}
                      />
                    </Link>
                  </div> */}
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/medialibrarylist`}
                      title="Media Library"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/elc001.svg"
                        href="/superadmin/medialibrarylist"
                        name={"Media Library"}
                      />
                    </Link>
                  </div>
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/courselibrarylist`}
                      titile="Course Library"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/art005.svg"
                        href="/superadmin/courselibrarylist"
                        name={"Course Library"}
                      />
                    </Link>
                  </div>
                  {/* <div className='col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0'>
            <Link to={`/superAdmin/manageSkill`}>
            <ListWidget
              className='primary'
              path='/media/icons/duotune/finance/fin004.svg'
              href='/superAdmin/manageSkill'
              name={'Skills'}
            />
            </Link>
          </div> */}
                  <div className="col-xxl-3 col-md-6 col-lg-4 col-sm-6 col-xs-center col  px-2 py-2 my-0">
                    <Link
                      to={`/superadmin/certificatelist`}
                      title="Certificate"
                      style={{ textDecoration: "none" }}
                    >
                      <ListWidget
                        className="primary"
                        path="/media/icon/fil012.svg"
                        href="/superadmin/certificatelist"
                        name={"Certificate"}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </CContainer>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
}

export default SuperAdmin;
