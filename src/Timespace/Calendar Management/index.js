import React from "react"
import { Container, Row, Col, Card, CardHeader, CardBody, Button, FormGroup, FormInput, FormSelect } from "shards-react"
import { BsEye, BsTrash, BsPencil, BsPlus } from "react-icons/bs"
import { CBadge } from "@coreui/react"
import firebase from "../../util/firebase"
import "react-google-flight-datepicker/dist/main.css"
import "../../assets/style.css"
import CalendarCreateModal from "./Modals/CalendarCreateModal"
import CalendarUpdateModal from "./Modals/CalendarUpdateModal"
const db = firebase.firestore()

const CalenderManagement = () => {
  const [calendars, setCalendars] = React.useState([])
  const [filteredCalendars, setFilteredCalendars] = React.useState([])
  const [admins, setAdmins] = React.useState([])
  const [states, setStates] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [towns, setTowns] = React.useState([])
  const [modalForCreate, setModalForCreate] = React.useState(false)
  const [modalForUpdate, setModalForUpdate] = React.useState(false)
  const [editID, setEditID] = React.useState('0')
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchItem, setSearchItem] = React.useState("")

  const setFilterAdminUser = (adminName) => {
    if (adminName === "all") {
      setFilteredCalendars(calendars)
    } else {
      let temp = calendars.filter(element => element.admin === adminName)
      setFilteredCalendars(temp)
    }
  }

  React.useEffect(() => {
    setIsLoading(true)
    async function fetchData() {
      await getCalendars()
      await getAdmins()
      await getStates()
      await getDistricts()
      await getTowns()
    }
    fetchData()
  }, [])

  const getStates = async () => {
    setStates((await db.collection("states").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getDistricts = async () => {
    setDistricts((await db.collection("districts").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getTowns = async () => {
    setTowns((await db.collection("towns").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getCalendars = async () => {
    let calendarsFromDB = (await db.collection("calendarManagement").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.created_at - b.created_at)
    setCalendars(calendarsFromDB)
    setFilteredCalendars(calendarsFromDB)
    setIsLoading(false)
  }

  const getAdmins = async () => {
    setAdmins((await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(user => user.userType === "Admin").sort((a, b) => a.created_at - b.created_at))
  }

  const handleCreateUser = () => {
    setModalForCreate(true)
  }

  const handleEditEvent = id => {
    setModalForUpdate(true)
    setEditID(id)
  }

  const handleSearch = () => {
    var item_split_array = searchItem.split(" ")
    var temp_calendar_array = []
    for (var i = 0; i < calendars.length; i++) {
      var temp_calendar = JSON.stringify(calendars[i])
      var element_search_success_flag = false
      for (var j = 0; j < item_split_array.length; j++) {
        if (temp_calendar.toLowerCase().indexOf(item_split_array[j]) !== -1) {
          element_search_success_flag = true
        } else {
          element_search_success_flag = false
        }
      }
      if (element_search_success_flag) {
        temp_calendar_array.push(calendars[i])
      }
    }
    setFilteredCalendars(temp_calendar_array)
    setSearchItem("")
  }

  const deleteCalendar = async (idForDel) => {
    const result = window.confirm("Are you sure?")
    if (result) {
      setIsLoading(true)
      await db.collection("calendarManagement").doc(idForDel).delete()
      await getCalendars()
    }
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <h1>Calendar Management</h1>
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Calendars</h6>
              <Button
                size="md"
                theme="secondary"
                className="d-flex ml-auto ml-auto ml-sm-auto mr-sm-2 mt-3 mt-sm-0"
                onClick={handleCreateUser}
              >
                <BsPlus style={{ fontSize: 16, marginRight: 14 }} /> Add New
                Calendar
              </Button>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <Col>
                <Row className="border-bottom align-items-center px-3 py-2 bg-light">
                  <Col md="4" className="mt-0 mb-sm-0">
                    <FormGroup
                      inline
                      className="d-flex mb-0 align-items-center"
                    >
                      <FormInput
                        id="feLastName"
                        placeholder="Search here"
                        className="mr-1"
                        value={searchItem}
                        onChange={e => setSearchItem(e.target.value)}
                        onKeyPress={e => e.charCode === 13 ? handleSearch() : null}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="4" className="mt-0 mb-sm-0">
                    <FormGroup inline className="d-flex mb-0 align-items-center">
                      <FormSelect onChange={e => setFilterAdminUser(e.target.value)} className="mr-1">
                        <option value="all">Administrated By</option>
                        {admins.map((each, i) => (
                          <option key={i} value={each.name}>{each.name}</option>
                        ))}
                      </FormSelect>
                    </FormGroup>
                  </Col>
                  <Col md="1" className="d-flex align-items-center">
                    <Button onClick={() => handleSearch()} size="sm" theme="secondary" className="d-flex  mr-2 mr-sm-auto mt-3 mt-sm-0">
                      Search
                    </Button>
                  </Col>
                  <Col md="1"></Col>
                </Row>
              </Col>

              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th>No</th>
                    <th>Calendar Name</th>
                    <th>Location</th>
                    <th>Categories</th>
                    <th>Status</th>
                    <th>Registration Date</th>
                    <th>Administrated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <IsLoading /> : filteredCalendars.map((each, i) => (
                    <tr key={each.id}>
                      <td>{i + 1}</td>
                      <td>{each.calendarName}</td>
                      <td>{each.location ? each.location.all ? "India" : each.location.district : null}</td>
                      <td>{each.categories}</td>
                      {each.status === true ? <td><CBadge color="success" shape="pill">ACTIVE</CBadge></td> :
                        <td><CBadge color="danger" shape="pill">DEACTIVE</CBadge></td>}
                      <td>{each.created_at.toDate().toLocaleDateString()}</td>
                      <td>{each.admin}</td>
                      <td className="d-flex align-items-center">
                        <Button onClick={() => handleEditEvent(each.id)} pill size="sm" theme="secondary" className="mr-1">
                          <BsPencil />
                        </Button>
                        <Button href={`/#/eventlist/` + each.id} pill size="sm" theme="info" className="mr-1">
                          <BsEye />
                        </Button>
                        <Button onClick={() => deleteCalendar(each.id)} pill size="sm" theme="danger">
                          <BsTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        <CalendarCreateModal
          setModalForCreate={setModalForCreate}
          setIsLoading={setIsLoading}
          getCalendars={getCalendars}
          admins={admins}
          states={states}
          districts={districts}
          towns={towns}
          classNames={modalForCreate ? "modal bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
        />
        <CalendarUpdateModal
          onClick={() => {
            setModalForUpdate(false)
            setEditID(0)
          }}
          sendData={calendars.find(x => x.id === editID)}
          setCalendars={setCalendars}
          classNames={modalForUpdate ? "modal bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
          setModalForUpdate={setModalForUpdate}
        />
      </Row>
    </Container>
  )
}

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default CalenderManagement