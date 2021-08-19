import React from "react"
import "react-google-flight-datepicker/dist/main.css"
import { Container, Row, Col, Card, CardBody, Button, FormInput, FormGroup, } from "shards-react"
import { CBadge } from "@coreui/react"
import firebase from "../../../util/firebase"
import InActiveUserModal from "./InActiveUserModal"
import { BsEye, BsTrash } from "react-icons/bs"
import { CSVLink } from 'react-csv'
const db = firebase.firestore()

const InactiveUsers = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [modalForView, setModalForView] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [userForView, setUserForView] = React.useState([])
  const [filteredUsers, setFilteredUsers] = React.useState([])
  const [searchItem, setSearchItem] = React.useState("")
  const [downloadDate, setDownloadDate] = React.useState(`Inactive Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      await getUsers()
    }
    fetchData()
  }, [])

  const getUsers = async () => {
    let usersFromDB = (await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(element => element.inactive_at && !element.deleted_at)
    setUsers(usersFromDB)
    setFilteredUsers(usersFromDB)
    setIsLoading(false)
  }

  const deleteUser = async (idForDel) => {
    let deleteAnswer = window.confirm("Are you sure?")
    if (deleteAnswer) {
      setIsLoading(true)
      await db.collection("users").doc(idForDel).delete()
      await getUsers()
    }
  }

  const handleViewUser = (user) => {
    setUserForView(user)
    setModalForView(true)
  }

  const setUsersDueSearchKey = () => {
    var item_split_array = searchItem.split(" ")
    var temp_user_array = []
    for (var i = 0; i < users.length; i++) {
      var temp_user = JSON.stringify(users[i])
      var element_search_success_flag = false
      for (var j = 0; j < item_split_array.length; j++) {
        if (temp_user.toLowerCase().indexOf(item_split_array[j]) !== -1) {
          element_search_success_flag = true
        } else {
          element_search_success_flag = false
        }
      }
      if (element_search_success_flag) {
        temp_user_array.push(users[i])
      }
    }
    setFilteredUsers(temp_user_array)
    setSearchItem("")
  }

  const reset = () => {
    setUsersDueSearchKey()
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <h1>Inactive Users</h1>
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardBody className="p-0 pb-3">
              <Col>
                <Row className="border-bottom px-3 py-2 bg-light">
                  <Col md="4" className="mt-2 mb-sm-0">
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
                        onKeyPress={e => e.charCode === 13 ? setUsersDueSearchKey() : null}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="2" className="d-flex align-items-center">
                    <Button
                      size="sm"
                      theme="info"
                      className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0"
                      onClick={() => setUsersDueSearchKey()}
                    >
                      Search
                    </Button>
                  </Col>
                  <Col md="2" className="d-flex align-items-center">
                    <Button
                      size="sm"
                      theme="secondary"
                      className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0"
                      onClick={() => reset()}
                    >
                      Reset
                    </Button>
                  </Col>
                  <Col md="4" className="d-flex align-items-center">
                    <CSVLink
                      filename={downloadDate}
                      data={filteredUsers}
                      onClick={() => setDownloadDate(`Inactive Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)}
                      className="btn d-flex btn-warning btn-sm ml-auto ml-sm-auto mr-2 mt-3 mt-sm-0"
                    >
                      Download CSV
                    </CSVLink>
                  </Col>
                </Row>
              </Col>
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>PhoneNumber</th>
                    <th>UserType</th>
                    <th>Status</th>
                    <th>Registration Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <IsLoading /> : filteredUsers.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.userType}</td>
                      <td><CBadge color="danger" shape="pill">Inactive</CBadge></td>
                      <td>{item.inactive_at.toDate().toLocaleDateString()}</td>
                      <td className="d-flex align-items-center">
                        <Button onClick={() => handleViewUser(item)} size="sm" pill theme="info" className="mr-1">
                          <BsEye />
                        </Button>
                        <Button onClick={() => deleteUser(item.id)} size="sm" pill theme="danger">
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
        <InActiveUserModal
          userForView={userForView}
          setModalForView={setModalForView}
          getUsers={getUsers}
          setIsLoading={setIsLoading}
          classNames={modalForView ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
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

export default InactiveUsers
