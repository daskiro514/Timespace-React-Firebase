import React from "react"
import { Container, Row, Col, Card, CardBody, Nav, NavItem, NavLink, Button } from "shards-react"
import { CSwitch } from '@coreui/react'
import { BsEye, BsTrash, BsPencil } from "react-icons/bs"
import PageTitle from "../../components/common/PageTitle"
import firebase from "../../util/firebase"
import AdminViewModal from "./Modals/AdminViewModal"
import AdminUpdateModal from "./Modals/AdminUpdateModal"
import MenuUpdateModal from "./Modals/MenuUpdateModal"
import MenuCreateModal from "./Modals/MenuCreateModal"
import FeedbackTypeCreateModal from "./Modals/FeedbackTypeCreateModal"
import FeedbackTypeUpdateModal from "./Modals/FeedbackTypeUpdateModal"
import LanguageCreateModal from "./Modals/LanguageCreateModal"
import LanguageUpdateModal from "./Modals/LanguageUpdateModal"
const db = firebase.firestore()

const Settings = () => {
  const [isAdminsLoading, setIsAdminsLoading] = React.useState(false)
  const [isMenusLoading, setIsMenusLoading] = React.useState(false)
  const [isLanguagesLoading, setIsLanguagesLoading] = React.useState(false)
  const [isFeedbackTypesLoading, setIsFeedbackTypesLoading] = React.useState(false)
  const [createItem, setCreateItem] = React.useState("admin")
  const [admins, setAdmins] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [towns, setTowns] = React.useState([])
  const [calendars, setCalendars] = React.useState([])
  const [languages, setLanguages] = React.useState([])
  const [menus, setMenus] = React.useState([])
  const [feedbackTypes, setFeedbackTypes] = React.useState([])
  const [adminForUpdate, setAdminForUpdate] = React.useState()
  const [adminForView, setAdminForView] = React.useState({})
  const [languageForUpdate, setLanguageForUpdate] = React.useState({})
  const [menuForUpdate, setMenuForUpdate] = React.useState({})
  const [feedbackTypeForUpdate, setFeedbackTypeForUpdate] = React.useState({})
  const [adminModalForUpdate, setAdminModalForUpdate] = React.useState(false)
  const [adminModalForView, setAdminModalForView] = React.useState(false)
  const [languageModalForCreate, setLanguageModalForCreate] = React.useState(false)
  const [languageModalForUpdate, setLanguageModalForUpdate] = React.useState(false)
  const [menuModalForCreate, setMenuModalForCreate] = React.useState(false)
  const [menuModalForUpdate, setMenuModalForUpdate] = React.useState(false)
  const [feedbackTypeModalForCreate, setFeedbackTypeModalForCreate] = React.useState(false)
  const [feedbackTypeModalForUpdate, setFeedbackTypeModalForUpdate] = React.useState(false)

  React.useEffect(() => {
    setIsAdminsLoading(true)
    setIsMenusLoading(true)
    setIsFeedbackTypesLoading(true)
    setIsLanguagesLoading(true)
    async function fetchData() {
      await getAdmins()
      await getDistricts()
      await getTowns()
      await getCalendars()
      await getLanguages()
      await getMenus()
      await getFeedbackTypes()
    }
    fetchData()
  }, [])

  const setForCreate = (item) => {
    setCreateItem(item)
  }

  const getAdmins = async () => {
    setAdmins((await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(user => user.userType === "Admin").sort((a, b) => a.created_at - b.created_at))
    setIsAdminsLoading(false)
  }

  const getDistricts = async () => {
    setDistricts((await db.collection("districts").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getTowns = async () => {
    setTowns((await db.collection("towns").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getCalendars = async () => {
    setCalendars((await db.collection("calendarManagement").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(element => element.location !== null && element.location !== undefined).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getMenus = async () => {
    setMenus((await db.collection("menus").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
    setIsMenusLoading(false)
  }

  const getFeedbackTypes = async () => {
    setFeedbackTypes((await db.collection("feedback_types").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.feedbackType > b.feedbackType) ? 1 : ((b.feedbackType > a.feedbackType) ? -1 : 0)))
    setIsFeedbackTypesLoading(false)
  }

  const getLanguages = async () => {
    setLanguages((await db.collection("Languages").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
    setIsLanguagesLoading(false)
  }

  const handleViewAdmin = (itemForView) => {
    setAdminForView(itemForView)
    setAdminModalForView(true)
  }

  const handleUpdateAdmin = (itemForUpdate) => {
    setAdminForUpdate(itemForUpdate)
    setAdminModalForUpdate(true)
  }

  const deleteAdmin = async (adminForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?")
    if (deleteAnswser) {
      setIsAdminsLoading(true)
      await db.collection("users").doc(adminForDelete.id).delete()
      await getAdmins()
    }
  }

  const updateMenuStatus = async (idForUpdate, item) => {
    setIsMenusLoading(true)
    await db.collection("menus").doc(idForUpdate).update({
      status: item,
      updated_at: firebase.firestore.Timestamp.now(),
    })
    await getMenus()
  }

  const handleUpdateMenu = (itemForUpdate) => {
    setMenuForUpdate(itemForUpdate)
    setMenuModalForUpdate(true)
  }

  const deleteMenu = async (feedbackTypeForDelete) => {
    let deleteAnswer = window.confirm("Are you sure?")
    if (deleteAnswer) {
      setIsMenusLoading(true)
      await db.collection("menus").doc(feedbackTypeForDelete.id).delete()
      await getMenus()
    }
  }

  const updateFeedbackTypeStatus = async (idForUpdate, item) => {
    setIsFeedbackTypesLoading(true)
    await db.collection("feedback_types").doc(idForUpdate).update({
      status: item,
      updated_at: firebase.firestore.Timestamp.now(),
    })
    await getFeedbackTypes()
  }

  const handleUpdateFeedbackType = (itemForUpdate) => {
    setFeedbackTypeForUpdate(itemForUpdate)
    setFeedbackTypeModalForUpdate(true)
  }

  const deleteFeedbackType = async (feedbackTypeForDelete) => {
    let deleteAnswer = window.confirm("Are you sure?")
    if (deleteAnswer) {
      setIsFeedbackTypesLoading(true)
      await db.collection("feedback_types").doc(feedbackTypeForDelete.id).delete()
      await getFeedbackTypes()
    }
  }

  const updateLanguageStatus = async (idForUpdate, item) => {
    setIsLanguagesLoading(true);
    await db.collection("Languages").doc(idForUpdate).update({
      status: item,
      updated_at: firebase.firestore.Timestamp.now(),
    })
    await getLanguages()
  }

  const handleUpdateLanguage = (itemForUpdate) => {
    setLanguageForUpdate(itemForUpdate);
    setLanguageModalForUpdate(true)
  }

  const deleteLanguage = async (languageForDelete) => {
    let deleteAnswer = window.confirm("Are you sure?")
    if (deleteAnswer) {
      setIsLanguagesLoading(true)
      await db.collection("Languages").doc(languageForDelete.id).delete()
      await getLanguages()
    }
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="6" title="Settings" className="text-sm-left" />
      </Row>

      <Row>
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink href="#" active={createItem === "admin" ? true : false} onClick={() => setForCreate("admin")} >
                Manage Admins
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={createItem === "language" ? true : false} onClick={() => setForCreate("language")} >
                Available Languages
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={createItem === "menu" ? true : false} onClick={() => setForCreate("menu")} >
                Menu Management
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" active={createItem === "feedback" ? true : false} onClick={() => setForCreate("feedback")} >
                Manage Feedback Types
              </NavLink>
            </NavItem>
          </Nav>
          <Card style={{ borderRadius: "0px", borderLeft: "1px solid #d1d4d8", borderRight: "1px solid #d1d4d8" }} small className="mb-4">
            <CardBody className="p-0">
              {(() => {
                if (createItem === "admin") {
                  return (
                    <table className="table mb-0">
                      <thead style={{ backgroundColor: "rgba(90,97,105,.06)" }}>
                        <tr>
                          <th className="border-0">No</th>
                          <th className="border-0">Admin Name</th>
                          <th className="border-0">Location</th>
                          <th className="border-0">Permissions</th>
                          <th className="border-0">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isAdminsLoading ? <IsLoading /> : admins.map((each, i) =>
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{each.name}</td>
                            <td>{each.town}</td>
                            <td>{each.managePermissions ? each.managePermissions.userApproval ? "User Approval, " : null : null}{each.managePermissions ? each.managePermissions.subscriptionView ? "Subscription Panel" : null : null}</td>
                            <td>
                              <Button size="sm" pill onClick={() => handleUpdateAdmin(each)} theme="secondary">
                                <BsPencil />
                              </Button>&nbsp;
                              <Button size="sm" pill onClick={() => handleViewAdmin(each)} theme="info">
                                <BsEye />
                              </Button>&nbsp;
                              <Button size="sm" pill onClick={() => deleteAdmin(each)} theme="danger">
                                <BsTrash />
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )
                } else if (createItem === "language") {
                  return (
                    <table className="table mb-0">
                      <thead style={{ backgroundColor: "rgba(90,97,105,.06)" }}>
                        <tr>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0">
                            <Button size="sm" pill onClick={() => setLanguageModalForCreate(true)} theme="primary">Create</Button>
                          </th>
                        </tr>
                        <tr>
                          <th className="border-0">No</th>
                          <th className="border-0">Language Name</th>
                          <th className="border-0">Last Modified</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isLanguagesLoading ? <IsLoading /> : languages.map((each, i) =>
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{each.name}</td>
                            <td>{each.updated_at.toDate().toLocaleDateString()}</td>
                            <td>
                              <CSwitch onChange={() => updateLanguageStatus(each.id, !each.status)} checked={each.status} className='mb-0' color='info' size='sm' tabIndex="0" />
                            </td>
                            <td>
                              <Button size="sm" pill onClick={() => handleUpdateLanguage(each)} theme="secondary">
                                <BsPencil />
                              </Button>&nbsp;
                              <Button size="sm" pill onClick={() => deleteLanguage(each)} theme="danger">
                                <BsTrash />
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )
                } else if (createItem === "menu") {
                  return (
                    <table className="table mb-0">
                      <thead style={{ backgroundColor: "rgba(90,97,105,.06)" }}>
                        <tr>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0">
                            <Button size="sm" pill onClick={() => setMenuModalForCreate(true)} theme="primary">Create</Button>
                          </th>
                        </tr>
                        <tr>
                          <th className="border-0">No</th>
                          <th className="border-0">Menu Name</th>
                          <th className="border-0">Last Modified</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isMenusLoading ? <IsLoading /> : menus.map((each, i) =>
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{each.name}</td>
                            <td>{each.updated_at.toDate().toLocaleDateString()}</td>
                            <td>
                              <CSwitch onChange={() => updateMenuStatus(each.id, !each.status)} checked={each.status} className='mb-0' color='info' size='sm' tabIndex="0" />
                            </td>
                            <td>
                              <Button size="sm" pill onClick={() => handleUpdateMenu(each)} theme="secondary">
                                <BsPencil />
                              </Button>&nbsp;
                              <Button size="sm" pill onClick={() => deleteMenu(each)} theme="danger">
                                <BsTrash />
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )
                } else if (createItem === "feedback") {
                  return (
                    <table className="table mb-0">
                      <thead style={{ backgroundColor: "rgba(90,97,105,.06)" }}>
                        <tr>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0"></th>
                          <th className="border-0">
                            <Button size="sm" pill onClick={() => setFeedbackTypeModalForCreate(true)} theme="primary">Create</Button></th>
                        </tr>
                        <tr>
                          <th className="border-0">No</th>
                          <th className="border-0">Feedback Type Name</th>
                          <th className="border-0">Last Modified</th>
                          <th className="border-0">Status</th>
                          <th className="border-0">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {isFeedbackTypesLoading ? <IsLoading /> : feedbackTypes.map((each, i) =>
                          <tr key={i}>
                            <td>{i + 1}</td>
                            <td>{each.feedbackType}</td>
                            <td>{each.updated_at.toDate().toLocaleDateString()}</td>
                            <td>
                              <CSwitch onChange={() => updateFeedbackTypeStatus(each.id, !each.status)} checked={each.status} className='mb-0' color='info' size='sm' tabIndex="0" />
                            </td>
                            <td>
                              <Button size="sm" pill onClick={() => handleUpdateFeedbackType(each)} theme="secondary">
                                <BsPencil />
                              </Button>&nbsp;
                              <Button size="sm" pill onClick={() => deleteFeedbackType(each)} theme="danger">
                                <BsTrash />
                              </Button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )
                }
              })()}
            </CardBody>
          </Card>
        </Col>
      </Row>
      <AdminViewModal
        setAdminModalForView={setAdminModalForView}
        admin={adminForView}
        classNames={adminModalForView ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <AdminUpdateModal
        setAdminModalForUpdate={setAdminModalForUpdate}
        setIsAdminsLoading={setIsAdminsLoading}
        admin={adminForUpdate}
        districts={districts}
        towns={towns}
        calendars={calendars}
        getAdmins={getAdmins}
        classNames={adminModalForUpdate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <LanguageCreateModal
        setLanguageModalForCreate={setLanguageModalForCreate}
        setIsLanguagesLoading={setIsLanguagesLoading}
        getLanguages={getLanguages}
        classNames={languageModalForCreate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <LanguageUpdateModal
        setLanguageModalForUpdate={setLanguageModalForUpdate}
        setIsLanguagesLoading={setIsLanguagesLoading}
        Language={languageForUpdate}
        getLanguages={getLanguages}
        classNames={languageModalForUpdate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <MenuCreateModal
        setMenuModalForCreate={setMenuModalForCreate}
        setIsMenusLoading={setIsMenusLoading}
        getMenus={getMenus}
        classNames={menuModalForCreate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <MenuUpdateModal
        setMenuModalForUpdate={setMenuModalForUpdate}
        setIsMenusLoading={setIsMenusLoading}
        menu={menuForUpdate}
        getMenus={getMenus}
        classNames={menuModalForUpdate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <FeedbackTypeCreateModal
        setFeedbackTypeModalForCreate={setFeedbackTypeModalForCreate}
        setIsFeedbackTypesLoading={setIsFeedbackTypesLoading}
        getFeedbackTypes={getFeedbackTypes}
        classNames={feedbackTypeModalForCreate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
      <FeedbackTypeUpdateModal
        setFeedbackTypeModalForUpdate={setFeedbackTypeModalForUpdate}
        setIsFeedbackTypesLoading={setIsFeedbackTypesLoading}
        FeedbackType={feedbackTypeForUpdate}
        getFeedbackTypes={getFeedbackTypes}
        classNames={feedbackTypeModalForUpdate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
      />
    </Container>
  )
}

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default Settings
