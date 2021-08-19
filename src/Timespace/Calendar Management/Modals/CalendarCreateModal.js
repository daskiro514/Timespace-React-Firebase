import React from "react"
import Papa from 'papaparse'
import { Row, Col, ListGroup, ListGroupItem, Form, FormGroup, FormInput, Button, FormCheckbox, FormSelect } from "shards-react"
import Modal from "../../../components/common/Modal"
import firebase from "../../../util/firebase"
const db = firebase.firestore()

const CalendarCreateModal = ({ setModalForCreate, setIsLoading, getCalendars, classNames, states, districts, towns, admins }) => {
  const [calendarName, setCalendarName] = React.useState("")
  const [myCSV] = React.useState()
  const [calendarStatus, setCalendarStatus] = React.useState(false)
  const [state, setState] = React.useState("")
  const [district, setDistrict] = React.useState("")
  const [town, setTown] = React.useState("")
  const [isAll, setIsAll] = React.useState(false)
  const [category, setCategory] = React.useState("")
  const [eventRows, setEventRows] = React.useState([])
  const [admin, setAdmin] = React.useState("")

  const closeModal = () => {
    setModalForCreate(false)
    setCalendarName("")
    setState("")
    setDistrict("")
    setTown("")
    setIsAll(false)
    setCategory("")
  }

  const handleSave = async () => {
    const sendData = {
      admin: admin,
      calendarName: calendarName,
      location: {
        all: isAll,
        state: state,
        district: district,
        town: town
      },
      categories: category,
      status: calendarStatus,
      created_at: firebase.firestore.Timestamp.now(),
    }

    if (calendarName && category && admin && ((isAll === false && state && district) || isAll) && eventRows.length >= 1) {
      setIsLoading(true)
      setModalForCreate(false)
      const docRef = await db.collection("calendarManagement").add(sendData)
      if (eventRows.length >= 1) {
        let firebaseSendData = eventRows
        for (let i = 0; i < firebaseSendData.length; i++) {
          let element = firebaseSendData[i]
          element.calendarId = docRef.id
          await db.collection("event").add(element)
        }
      }
      await getCalendars()
    } else {
      alert("Please insert the fields of Calendar Name, Location Info, Calendar Category, Administrator and Event List CSV File.")
    }
  }

  const readLocalFile = (file) => {
    var fr = new FileReader()
    fr.onload = () => {
      const results = Papa.parse(fr.result, { header: true })
      let rows = results.data
      let keys = Object.keys(rows[0])
      let tempRows = []
      for (let i = 0; i < rows.length - 1; i++) {
        let descriptions = {}
        let tempRow = {}
        for (let j = 0; j < 10; j++) {
          tempRow[keys[j]] = rows[i][keys[j]]
        }
        for (let j = 10; j < keys.length; j++) {
          descriptions[keys[j]] = rows[i][keys[j]]
        }
        tempRow.descriptions = descriptions
        tempRows.push(tempRow)
      }
      setEventRows(tempRows)
    }
    fr.readAsText(file)
  }

  return (
    <Modal
      containModalSize="bd-example-modal-lg"
      modalSize="modal-lg"
      classNames={classNames}
      title="Add New Calendar"
      onClick={() => closeModal()}
    >
      <ListGroup flush>
        <ListGroupItem className="p-3">
          <Row>
            <Col>
              <Form>
                <Row form>
                  {/* First Name */}
                  <Col md="6">
                    <FormGroup>
                      <label htmlFor="spaceName">Calendar Name</label>
                      <FormInput
                        autoFocus
                        placeholder="Calendar Name"
                        defaultValue={calendarName}
                        onChange={(e) => setCalendarName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <Row>
                      <Col md="1"></Col>
                      <Col md="5">
                        <label>All Location</label>
                        <FormCheckbox
                          small
                          checked={isAll}
                          onChange={(e) => setIsAll(!isAll)}
                        >
                          All
                        </FormCheckbox>
                      </Col>
                      <Col md="6">
                        <label className="d-block">State</label>
                        <FormSelect
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                        >
                          <option value="">Choose State ...</option>
                          {isAll ? null : states.map((each, i) =>
                            <option value={each.name} key={i}>{each.name}</option>
                          )}
                        </FormSelect>
                      </Col>
                      <Col md="6">
                        <label className="d-block">District</label>
                        <FormSelect
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                        >
                          <option value="">Choose District ...</option>
                          {districts.filter(element => element.state === state).map((each, i) =>
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
                          {towns.filter(element => element.state === state && element.district === district).map((each, i) =>
                            <option value={each.name} key={i}>{each.name}</option>
                          )}
                        </FormSelect>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Add categories */}
                <Row>
                  <Col sm="6">
                    <label>Category</label>
                    <FormInput
                      placeholder="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Col>
                  {/* Add administrated by */}
                  <Col sm="6">
                    <label>Administrated By</label>
                    <FormSelect
                      value={admin}
                      onChange={e => setAdmin(e.target.value)}
                    >
                      <option value="">Choose Admin...</option>
                      {admins.map((user, i) => (
                        <option key={i} value={user.name}>{user.name}</option>
                      ))}
                    </FormSelect>
                  </Col>
                </Row>
                <Row>
                  <Col sm="8">
                    <label>Status</label>
                    <FormSelect
                      value={calendarStatus}
                      onChange={(e) => setCalendarStatus(!calendarStatus)}
                    >
                      <option value={true}>Active</option>
                      <option value={false}>Deactive</option>
                    </FormSelect>
                  </Col>
                </Row>
                <Row style={{ marginTop: "20px" }}>
                  <Col md="6">
                    <label>Upload CSV</label>
                    <input
                      type="file"
                      name="StateData"
                      value={myCSV}
                      onChange={(e) => readLocalFile(e.target.files[0])}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col className="mt-4">
                    <Button size="sm" theme="primary" onClick={() => handleSave()}>
                      Save
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </ListGroupItem>
      </ListGroup>
    </Modal>
  )
}

export default CalendarCreateModal
