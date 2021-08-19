import React from "react"
import { Row, Col, ListGroup, ListGroupItem, FormSelect, Button, FormCheckbox } from "shards-react"
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const AdminUpdateModal = ({ admin, classNames, setAdminModalForUpdate, districts, towns, calendars, getAdmins, setIsAdminsLoading }) => {
  const [district, setDistrict] = React.useState("")
  const [town, setTown] = React.useState("")
  const [locations, setLocations] = React.useState([])
  const [userApproval, setUserApproval] = React.useState(false)
  const [subscriptionView, setSubscriptionView] = React.useState(false)
  const [calendarNamesForManage, setCalendarNamesForManage] = React.useState([])

  React.useEffect(() => {
    setLocations(admin ? admin.manageLocations ? admin.manageLocations : [] : [])
    setUserApproval(admin ? admin.managePermissions ? admin.managePermissions.userApproval : false : false)
    setSubscriptionView(admin ? admin.managePermissions ? admin.managePermissions.subscriptionView : false : false)
    setCalendarNamesForManage(admin ? admin.manageCalendars ? admin.manageCalendars : [] : [])
  }, [admin])

  const handleCalendarForManage = (calendarName) => {
    let tempCalendarNames = [...calendarNamesForManage]
    if (tempCalendarNames.indexOf(calendarName) > -1) {
      tempCalendarNames.splice(tempCalendarNames.indexOf(calendarName), 1)
      setCalendarNamesForManage(tempCalendarNames)
    } else {
      tempCalendarNames.push(calendarName)
      setCalendarNamesForManage(tempCalendarNames)
    }
  }

  const addNewLocation = () => {
    if (district && town) {
      let location = {
        district: district,
        town: town
      }
      let tempLocations = [...locations]
      if (tempLocations.find(element => element.town === location.town)) {
        alert("You selected same.")
      } else {
        tempLocations.push(location)
        setLocations(tempLocations)
      }
      setDistrict("")
      setTown("")
    } else {
      alert("Please select the location below.")
    }
  }

  const deleteLocation = () => {
    setLocations([])
    setCalendarNamesForManage([])
  }

  const updateAdmin = async () => {
    if (locations.length && calendarNamesForManage.length && (userApproval || subscriptionView)) {
      let sendData = {
        manageLocations: locations,
        managePermissions: {
          userApproval: userApproval,
          subscriptionView: subscriptionView
        },
        manageCalendars: calendarNamesForManage
      }
      setIsAdminsLoading(true)
      await db.collection("users").doc(admin.id).update(sendData)
      closeModal()
      await getAdmins()
    } else {
      alert("Location, Permission and Calendar must be chosen.")
    }
  }

  const allClear = () => {
    setDistrict("")
    setTown("")
    setUserApproval(false)
    setSubscriptionView(false)
    setLocations([])
    setCalendarNamesForManage([])
  }

  const closeModal = () => {
    allClear()
    setAdminModalForUpdate(false)
  }

  return (
    <Modal
      classNames={classNames}
      title="Update Admin"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row form>
            <Col md="12" className="form-group">
              <label className="d-block" style={{ fontWeight: 'bold' }}>Choose Location To Manage</label>
              <Row form>
                <Col md="6">
                  <label className="d-block">District</label>
                  <FormSelect
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    <option value="">Choose District ...</option>
                    {districts.map((each, i) =>
                      <option value={each.name} key={i}>{each.name}</option>
                    )}
                  </FormSelect>
                </Col>
                <Col md="6">
                  <label className="d-block">Town</label>
                  <FormSelect
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                  >
                    <option value="">Choose Town ...</option>
                    {towns.filter(element => element.district === district).map((each, i) =>
                      <option value={each.name} key={i}>{each.name}</option>
                    )}
                  </FormSelect>
                </Col>
                <Col>
                  {locations.map((each, i) =>
                    <label key={i} className="d-block">{each.district} {each.town}</label>
                  )}
                </Col>
                <label className="d-block"></label>
                <Col md="12" className="text-center">
                  <Button onClick={() => addNewLocation()} size="sm" theme="primary" className="mr-1">Add Location</Button>
                  <Button onClick={() => deleteLocation()} size="sm" theme="warning" className="mr-1">Delete Location</Button>
                </Col><br /><br />
              </Row>
              <label className="d-block" style={{ fontWeight: 'bold' }}>Add Permission To Manage</label>
              <Row>
                <Col md="2"></Col>
                <Col md="8" className="checkboxLeftPadding">
                  <FormCheckbox
                    checked={userApproval}
                    onChange={e => setUserApproval(!userApproval)}
                  >User Approval Permission</FormCheckbox>
                  <FormCheckbox
                    checked={subscriptionView}
                    onChange={e => setSubscriptionView(!subscriptionView)}
                  >View Subscription Permission</FormCheckbox>
                </Col>
                <Col md="2"></Col><br /><br />
              </Row>
              <label className="d-block" style={{ fontWeight: 'bold' }}>Add Calendar To Manage</label>
              <Row>
                <Col md="2"></Col>
                <Col md="8" className="checkboxLeftPadding">
                  {calendars.filter(element => {
                    for (let i = 0; i < locations.length; i++) {
                      if (locations[i].town === element.location.town) return true
                    }
                    return false
                  }).map((each, i) =>
                    <FormCheckbox
                      key={i}
                      checked={calendarNamesForManage.indexOf(each.calendarName) > -1 ? true : false}
                      onChange={e => handleCalendarForManage(each.calendarName)}
                    >{each.calendarName}</FormCheckbox>
                  )}
                </Col>
                <Col md="2"></Col>
              </Row>
              <Button onClick={() => updateAdmin()} size="sm" theme="primary" style={{ float: "right" }}>
                Update
              </Button>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default AdminUpdateModal
