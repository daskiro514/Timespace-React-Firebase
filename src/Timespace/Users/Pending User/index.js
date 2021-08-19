import React from "react";
import { Container, Row, Col, Card, CardBody, Button, FormInput, FormGroup } from "shards-react";
import firebase from "../../../util/firebase";
import NotificationUser from "../../../components/modals/NotificationUser";
import { BsTrash } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { CSVLink } from 'react-csv';
const db = firebase.firestore();

const PendingUser = () => {
  const [isLoading, setIsLoading] = React.useState(false)
  const [modal4, setModal4] = React.useState(false)
  const [userData, setUserData] = React.useState([])
  const [admins, setAdmins] = React.useState([])
  const [filterUserData, setFilterUserData] = React.useState([])
  const [searchItem, setSearchItem] = React.useState("")
  const [freeSubscription, setFreeSubscription] = React.useState({})
  const [downloadDate, setDownloadDate] = React.useState(`Pending Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)
  const [downloadData, setDownloadData] = React.useState([])

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      await getAdminUsers();
      await getPendingUsers();
      await getFreeSubscription()
    }
    fetchData();
  }, []);

  const getAdminUsers = async () => {

  }

  const getPendingUsers = async () => {
    let adminsFromDB = ((await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }))).filter(element => element.userType === "Admin" || element.userType === "Super Admin")
    setAdmins(adminsFromDB)
    let tempAdmins = [...adminsFromDB]
    let usersFromDB = (await db.collection("new_users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setUserData(usersFromDB);
    setFilterUserData(usersFromDB);
    let downloadDataTemp = [];
    for (let i = 0; i < usersFromDB.length; i++) {
      var destinationObject = {};
      destinationObject["User Name"] = usersFromDB[i]["name"]
      destinationObject["User Type"] = "App User"
      destinationObject["Phone Number"] = usersFromDB[i]["number"]
      destinationObject["Location(Town)"] = usersFromDB[i]["town"]
      destinationObject["District"] = usersFromDB[i]["district"]
      destinationObject["Administrated By"] = properAdmin(tempAdmins, usersFromDB[i]["town"]).full
      downloadDataTemp.push(destinationObject);
    }
    setDownloadData(downloadDataTemp);
    setIsLoading(false);
  }

  const getFreeSubscription = async () => {
    setFreeSubscription(((await db.collection("subscriptions").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }))).find(element => Number(element.price) === 0))
  }

  const properAdmin = (tempAdmins, requestTown) => {
    let adminForRequest = {}
    adminForRequest = tempAdmins.find(element => element.userType === "Super Admin");
    for (let i = 0; i < tempAdmins.length; i++) {
      if (tempAdmins[i].town === requestTown) {
        adminForRequest = tempAdmins[i]
      }
    }
    return {
      full: adminForRequest.name + " ( " + adminForRequest.userType + " )",
      name: adminForRequest.name
    };
  }

  const deleteUser = async (userForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?");
    if (deleteAnswser) {
      setIsLoading(true);
      await db.collection("new_users").doc(userForDelete.id).delete();
      const sendDB_data = {
        name: userForDelete.name,
        mobile: userForDelete.number,
        userType: "App User",
        district: userForDelete.district,
        town: userForDelete.town,
        created_at: userForDelete.created_at,
        updated_at: firebase.firestore.Timestamp.now(),
        deleted_at: firebase.firestore.Timestamp.now(),
        deleted_from: "Pending User",
      }
      await db.collection("users").add(sendDB_data);
      await getPendingUsers();
    }
  }

  const handleEditUser = async (user) => {
    let nowDateMiliSeconds = new Date().getTime();
    let estimateMiliSeconds = 0;
    if (freeSubscription.durationType === "days") {
      estimateMiliSeconds = nowDateMiliSeconds + 86400000 * Number(freeSubscription.duration);
    } else if (freeSubscription.durationType === "weeks") {
      estimateMiliSeconds = nowDateMiliSeconds + 604800000 * Number(freeSubscription.duration);
    } else if (freeSubscription.durationType === "months") {
      estimateMiliSeconds = nowDateMiliSeconds + 2628000000 * Number(freeSubscription.duration);
    } else if (freeSubscription.durationType === "years") {
      estimateMiliSeconds = nowDateMiliSeconds + 31540000000 * Number(freeSubscription.duration);
    }
    const sendDB_data = {
      name: user.name ? user.name : "",
      email: user.email ? user.email : "",
      mobile: user.number ? user.number : "",
      userType: "App User",
      state: user.state ? user.state : "",
      district: user.district ? user.district : "",
      town: user.town ? user.town : "",
      created_at: firebase.firestore.Timestamp.now(),
      updated_at: firebase.firestore.Timestamp.now(),
      administratedBy: properAdmin(admins, user.town).name,
      subscriptionType: freeSubscription.planType,
      subscriptionEndDate: firebase.firestore.Timestamp.fromDate(new Date(estimateMiliSeconds)),
      deleted_at: null,
    }
    setIsLoading(true)
    await db.collection("new_users").doc(user.id).delete()
    await db.collection("users").add(sendDB_data);
    setIsLoading(false)
    window.location.href = "/#/userManagement/activeUsers";
  };

  const setUsersDueSearchKey = () => {
    var item_split_array = searchItem.split(" ");
    var temp_user_array = [];
    for (var i = 0; i < userData.length; i++) {
      var temp_user = JSON.stringify(userData[i]);
      var element_search_success_flag = false;
      for (var j = 0; j < item_split_array.length; j++) {
        if (temp_user.toLowerCase().indexOf(item_split_array[j]) !== -1) {
          element_search_success_flag = true
        } else {
          element_search_success_flag = false
        }
      }
      if (element_search_success_flag) {
        temp_user_array.push(userData[i]);
      }
    }
    setFilterUserData(temp_user_array);
    setSearchItem("");
  }

  const reset = () => {
    setUsersDueSearchKey()
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <h1>Pending Users</h1>
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
                    </Button>&nbsp;
                  </Col>
                  <Col md="2" className="d-flex align-items-center">
                    <Button
                      size="sm"
                      theme="secondary"
                      className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0"
                      onClick={() => reset() }
                    >
                      Reset
                    </Button>&nbsp;
                  </Col>
                  <Col md="4" className="d-flex align-items-center">
                    <CSVLink
                      filename={downloadDate}
                      onClick={() => setDownloadDate(`Pending Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)}
                      className="btn d-flex btn-warning btn-sm ml-auto ml-sm-auto mr-2 mt-3 mt-sm-0"
                      data={downloadData}
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
                    <th>District</th>
                    <th>Town</th>
                    <th>Will be Administrated By</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? <IsLoading /> : filterUserData.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.number}</td>
                      <td>{item.district}</td>
                      <td>{item.town}</td>
                      <td>{properAdmin(admins, item.town).full}</td>
                      <td className="d-flex align-items-center">
                        <Button size="sm" pill onClick={() => handleEditUser(item)} theme="primary">
                          <ImCheckmark />
                        </Button>
                        <Button size="sm" pill onClick={() => deleteUser(item)} theme="danger">
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
        <NotificationUser
          onClick={() => setModal4(false)}
          classNames={modal4 ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
        />
      </Row>
    </Container>
  );
};

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default PendingUser;
