import React from "react"
import { Container, Row, Col, Card, CardBody, CardHeader, FormSelect } from "shards-react"
import PageTitle from "../../components/common/PageTitle"
import firebase from "../../util/firebase"
const db = firebase.firestore()

const Dashboard = () => {
  const years = [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034]
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  const [year, setYear] = React.useState(2021)
  const [isUsersLoading, setIsUsersLoading] = React.useState(false)
  const [subscriptions, setSubscriptions] = React.useState([])
  const [districts, setDistricts] = React.useState([])
  const [district, setDistrict] = React.useState("all");
  const [registeredUsers, setRegisteredUsers] = React.useState([])
  const [activeUsers, setActiveUsers] = React.useState([])
  const [freeUsers, setFreeUsers] = React.useState([])
  const [paidUsers, setPaidUsers] = React.useState([])
  const [inactiveUsers, setInactiveUsers] = React.useState([])
  const [pendingUsers, setPendingUsers] = React.useState([])
  const [totalRevenue, setTotalRevenue] = React.useState(0)

  React.useEffect(() => {
    async function fetchData() {
      setIsUsersLoading(true)
      await getDistricts()
      await getAllUsers(year)
      await getPendingUsers()
    }
    fetchData()
  }, [year])

  const getDistricts = async () => {
    setDistricts((await db.collection("districts").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const onSelectDistrict = async (districtName) => {
    setIsUsersLoading(true)
    setDistrict(districtName)
    await getAllUsers(year, districtName);
  }

  const getAllUsers = async (year, district = "all") => {
    let subscriptionsFromDB = (await db.collection("subscriptions").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }))
    let allUsersFromDB = []
    if (district === "all") {
      allUsersFromDB = (await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(element => element.updated_at > firebase.firestore.Timestamp.fromDate(new Date(year, 1, 1)) && element.updated_at < firebase.firestore.Timestamp.fromDate(new Date(year, 12, 31)))
    } else {
      allUsersFromDB = (await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(element => element.updated_at > firebase.firestore.Timestamp.fromDate(new Date(year, 1, 1)) && element.updated_at < firebase.firestore.Timestamp.fromDate(new Date(year, 12, 31)) && element.district === district)
    }
    let registeredUsers = allUsersFromDB.filter(element => element.deleted_at === null || element.deleted_at === undefined)
    let activeUsers = registeredUsers.filter(element => element.inactive_at === null || element.inactive_at === undefined)
    let inactiveUsers = registeredUsers.filter(element => element.inactive_at !== null && element.inactive_at !== undefined)
    let freeUsers = activeUsers.filter(element => {
      for (let i = 0; i < subscriptionsFromDB.length; i++) {
        if (subscriptionsFromDB[i].planType === element.subscriptionType && subscriptionsFromDB[i].price === "0") {
          return true
        }
      }
      return false
    })
    let paidUsers = activeUsers.filter(element => {
      for (let i = 0; i < subscriptionsFromDB.length; i++) {
        if (subscriptionsFromDB[i].planType === element.subscriptionType && subscriptionsFromDB[i].price !== "0") {
          return true
        }
      }
      return false
    })
    let totalRevenue = 0
    for (let i = 0; i < paidUsers.length; i++) {
      for (let j = 0; j < subscriptionsFromDB.length; j++) {
        if (subscriptionsFromDB[j].planType === paidUsers[i].subscriptionType) {
          totalRevenue += Number(subscriptionsFromDB[j].price)
        }
      }
    }
    setSubscriptions(subscriptionsFromDB)
    setRegisteredUsers(registeredUsers)
    setActiveUsers(activeUsers)
    setInactiveUsers(inactiveUsers)
    setFreeUsers(freeUsers)
    setPaidUsers(paidUsers)
    setTotalRevenue(totalRevenue)
    setIsUsersLoading(false)
  }

  const getPendingUsers = async () => {
    setPendingUsers((await db.collection("new_users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })))
  }

  const getMonthlyRevenue = (month) => {
    let totalRevenue = 0
    for (let i = 0; i < paidUsers.filter(element => element.updated_at > firebase.firestore.Timestamp.fromDate(new Date(year, month, 1)) && element.updated_at < firebase.firestore.Timestamp.fromDate(new Date(year, month, 31))).length; i++) {
      for (let j = 0; j < subscriptions.length; j++) {
        if (subscriptions[j].planType === paidUsers[i].subscriptionType) {
          totalRevenue += Number(subscriptions[j].price)
        }
      }
    }
    return totalRevenue
  }

  const getMonthlyMembers = (users, month) => {
    return users.filter(element => element.updated_at > firebase.firestore.Timestamp.fromDate(new Date(year, month, 1)) && element.updated_at < firebase.firestore.Timestamp.fromDate(new Date(year, month, 31))).length
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle title="Dashboard" subtitle="Dashboard" className="text-sm-left mb-3" />
      </Row>

      <Row>
        <TotalNumberShowBox title="Total Pending Approval" number={pendingUsers.length} />
        <TotalNumberShowBox title="Number of Users" number={registeredUsers.length} />
        <TotalNumberShowBox title="Total Revenue" number={totalRevenue} />
        <TotalNumberShowBox title="Total Free Registerations" number={freeUsers.length} />
        <TotalNumberShowBox title="Total Paid Registration" number={paidUsers.length} />
        <TotalNumberShowBox title="Total Expired Users" number="0" />
      </Row>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row form>
                <Col md="3"></Col>
                <Col md="2" className="text-right">For Location</Col>
                <Col md="2">
                  <FormSelect
                    value={district}
                    onChange={(e) => onSelectDistrict(e.target.value)}
                  >
                    <option value="all">All</option>
                    {districts.map((each, i) =>
                      <option key={i} value={each.name}>{each.name}</option>
                    )}
                  </FormSelect>
                </Col>
                <Col md="2">(All District Names)</Col>
                <Col md="3"></Col>
              </Row>
              <table className="table mb-0">
                <thead>
                  <tr>
                    <th>
                      <FormSelect
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        {years.map((each, i) =>
                          <option key={i} value={each}>{each}</option>
                        )}
                      </FormSelect>
                    </th>
                    <th>Lifetime</th>
                    <th>Jan</th>
                    <th>Feb</th>
                    <th>Mar</th>
                    <th>Apr</th>
                    <th>May</th>
                    <th>Jun</th>
                    <th>Jul</th>
                    <th>Aug</th>
                    <th>Sep</th>
                    <th>Oct</th>
                    <th>Nov</th>
                    <th>Dec</th>
                  </tr>
                </thead>
                {isUsersLoading ? <IsLoading /> :
                  <tbody>
                    <tr>
                      <td>Total Revenue</td>
                      <td>{totalRevenue}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyRevenue(each)}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Registered</td>
                      <td>{registeredUsers.length}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyMembers(registeredUsers, each)}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Active</td>
                      <td>{activeUsers.length}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyMembers(activeUsers, each)}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Free</td>
                      <td>{freeUsers.length}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyMembers(freeUsers, each)}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Paid</td>
                      <td>{paidUsers.length}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyMembers(paidUsers, each)}</td>
                      )}
                    </tr>
                    <tr>
                      <td>Inactive</td>
                      <td>{inactiveUsers.length}</td>
                      {months.map((each, i) =>
                        <td key={i}>{getMonthlyMembers(inactiveUsers, each)}</td>
                      )}
                    </tr>
                  </tbody>
                }
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

const IsLoading = () => {
  return (
    <tbody><tr><td>LOADING ... </td></tr></tbody>
  )
}

const TotalNumberShowBox = ({ title, number }) => {
  return (
    <Col sm="4" className="mb-4">
      <Card small className="card-post card-post--1">
        <CardHeader className="text-center">
          <h5 className="card-title font-weight-bold text-fiord-blue">
            {title}
          </h5>
        </CardHeader>
        <CardBody className="text-center">
          <h3 className="card-text d-inline-block mb-3">{number}</h3>
        </CardBody>
      </Card>
    </Col>
  )
}

export default Dashboard

