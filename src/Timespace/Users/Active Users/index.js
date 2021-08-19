import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, FormSelect, FormCheckbox, Button, FormInput } from "shards-react";
import { CBadge } from "@coreui/react";
import firebase from "../../../util/firebase";
import CreatUser from "./Modals/CreateUserModal";
import EditUser from "./Modals/EditUserModal";
import ViewUser from "./Modals/ViewUserModal";
import NotificationUser from "../../../components/modals/NotificationUser";
import { BsEye, BsTrash, BsPencil } from "react-icons/bs";
import { CSVLink } from 'react-csv';
const db = firebase.firestore();

const ActiveUsers = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalForCreate, setModalForCreate] = React.useState(false);
  const [modalForUpdate, setModalForUpdate] = React.useState(false);
  const [modalForView, setModalForView] = React.useState(false);
  const [modal4, setModal4] = React.useState(false);
  const [showEditUserID, setShowEditUserID] = React.useState(0);
  const [userForView, setUserForView] = React.useState({});
  const [states, setStates] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [towns, setTowns] = React.useState([]);
  const [userData, setUserData] = React.useState([]);
  const [filterUserData, setFilterUserData] = React.useState([]);
  const [searchItem, setSearchItem] = React.useState("");
  const [downloadData, setDownloadData] = React.useState([]);
  const [adminsNames, setAdminNames] = React.useState([]);
  const [isAllChecked, setIsAllChecked] = React.useState(false);
  const [currentNotification, setCurrentNotification] = React.useState({});
  const [admins, setAdmins] = React.useState([]);
  const [filterDueLocation, setFilterDueLocation] = React.useState("all")
  const [filterDueSubscription, setFilterDueSubscription] = React.useState("all")
  const [downloadDate, setDownloadDate] = React.useState(`Active Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      await getUsers();
      await getAdminUsers();
      await getStates()
      await getDistricts()
      await getTowns()
    }
    fetchData();
  }, []);

  const addNewUser = async (newUser) => {
    setIsLoading(true);
    await db.collection("users").add(newUser);
    await getUsers();
  }

  const getAdminUsers = async () => {
    setAdmins(((await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }))).filter(element => element.userType === "Admin" || element.userType === "Super Admin"));
  }

  const getUsers = async () => {
    let nowDateSeconds = new Date().getTime() / 1000;
    let usersFromDB = (await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).filter(element => element.deleted_at === null && !element.inactive_at && element.subscriptionEndDate.seconds > nowDateSeconds).sort((a, b) => b.created_at - a.created_at);
    usersFromDB.forEach(element => {
      element.isChecked = false
    });
    setUserData(usersFromDB);
    setFilterUserData(usersFromDB);
    let tempAdmins = usersFromDB.filter(element => element.userType === "Admin" || element.userType === "Super Admin");
    let tempAdminNames = [];
    tempAdmins.forEach(element => {
      tempAdminNames.push(element.name)
    });
    setAdminNames(tempAdminNames);
    let downloadDataTemp = [];
    usersFromDB.forEach(item => {
      var destinationObject = {};
      // var key_list = Object.keys(item)
      destinationObject["User Name"] = item["name"]
      destinationObject["User Type"] = item["userType"]
      destinationObject["Phone Number"] = item["mobile"]
      destinationObject["Location(Town)"] = item["town"]
      destinationObject["District"] = item["district"]
      destinationObject["State"] = item["state"]
      destinationObject["Email"] = item["email"]
      destinationObject["Registration Date"] = item["updated_at"].toDate().toLocaleDateString()
      destinationObject["Subscription Type"] = item["subscriptionType"]
      destinationObject["Subscription Due Date"] = item["subscriptionEndDate"].toDate().toLocaleDateString()
      destinationObject["Admin Name"] = item["administratedBy"]
      destinationObject["Total Invite Count"] = 0
      downloadDataTemp.push(destinationObject);
    });
    setDownloadData(downloadDataTemp);
    setIsLoading(false);
  }

  const getStates = async () => {
    setStates((await db.collection("states").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getDistricts = async () => {
    setDistricts((await db.collection("districts").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const getTowns = async () => {
    setTowns((await db.collection("towns").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)))
  }

  const handleViewUser = (itemForView) => {
    setUserForView(itemForView);
    setModalForView(true);
  };

  const handleEditUser = id => {
    setShowEditUserID(id);
    setModalForUpdate(true);
  };

  const updateUser = async (userID, userForUpdate) => {
    setIsLoading(true);
    await db.collection("users").doc(userID).update(userForUpdate);
    await getUsers();
  }

  const inactiveUser = async (userID, userForInactive) => {
    setIsLoading(true);
    await db.collection("users").doc(userID).update(userForInactive);
    await getUsers();
  }

  const deleteUser = async (userForDelete) => {
    let deleteAnswser = window.confirm("Are you sure?");
    if (deleteAnswser) {
      setIsLoading(true);
      await db.collection("users").doc(userForDelete.id).delete();
      await getUsers();
    }
  }

  const handleNotificationUser = () => {
    setModal4(true);
  };

  const handleAllChecked = e => {
    isAllChecked ? setIsAllChecked(false) : setIsAllChecked(true)
    const newUserData = [...filterUserData];
    newUserData.forEach(element => {
      isAllChecked ? element.isChecked = false : element.isChecked = true;
    });
    setFilterUserData(newUserData);
  };

  const handleCheckBox = (e, id) => {
    const elementIndex = filterUserData.findIndex(ele => ele.id === id);
    const newUserData = [...filterUserData];
    newUserData[elementIndex].isChecked = newUserData[elementIndex].isChecked ? false : true;
    setFilterUserData(newUserData);
  };

  const sendNotification = () => {
    let temp = filterUserData.filter(element => element.isChecked === true);
    temp.forEach(element => {
      let tempDescription = currentNotification.description;
      tempDescription = tempDescription.replace("_USERNAME_", element.name).replace("_ENDDATE_", element.subscriptionEndDate.toDate().toLocaleDateString());
      alert(tempDescription)
    });
  }

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

  const setUsersDueSubscription = (filterItem) => {
    setFilterDueSubscription(filterItem)
    if (filterItem === "month") {
      let nowDateSeconds = new Date().getTime() / 1000;
      let tempSubscriptionDueUsers = userData.filter(element => element.subscriptionEndDate.seconds < (nowDateSeconds + 2628000))
      setFilterUserData(tempSubscriptionDueUsers);
    } else if (filterItem === "week") {
      let nowDateSeconds = new Date().getTime() / 1000;
      let tempSubscriptionDueUsers = userData.filter(element => element.subscriptionEndDate.seconds < (nowDateSeconds + 604800))
      setFilterUserData(tempSubscriptionDueUsers);
    } else {
      setFilterUserData(userData);
    }
  }

  const setUsersDueLocation = (filterItem) => {
    setFilterDueLocation(filterItem)
    if (filterItem === "all") {
      setFilterUserData(userData);
    } else {
      let tempSubscriptionDueUsers = userData.filter(element => element.district === filterItem)
      setFilterUserData(tempSubscriptionDueUsers);
    }
  }

  const reset = () => {
    setUsersDueSearchKey("")
    setFilterDueSubscription("all")
    setFilterDueLocation("all")
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <h1>Active Users</h1>
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Active Users</h6>
              <Button size="sm" theme="primary" className="d-flex btn-white ml-auto ml-sm-auto mr-2 mt-3 mt-sm-0" onClick={handleNotificationUser}>
                Notification to User
              </Button>
              <CSVLink filename={downloadDate} onClick={() => setDownloadDate(`Active Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)} className="btn d-flex btn-warning btn-sm ml-auto ml-sm-auto mr-2 mt-3 mt-sm-0" data={downloadData} >Download CSV</CSVLink>
              <Button
                size="sm"
                theme="primary"
                className="d-flex mr-sm-0 mt-3 mt-sm-0"
                onClick={() => setModalForCreate(true)}
              >
                Create User
              </Button>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <Col>
                <Row className="border-bottom px-3 py-2 bg-light">
                  <Col md="3" className="d-flex align-items-center">
                    <FormSelect
                      value={filterDueSubscription}
                      onChange={(e) => setUsersDueSubscription(e.target.value)}
                    >
                      <option value="all">All Subscription</option>
                      <option value="month">Subscription Due This Month</option>
                      <option value="week">Subscription Due This Week</option>
                    </FormSelect>
                  </Col>
                  <Col md="3" className="d-flex align-items-center">
                    <FormSelect
                      value={filterDueLocation}
                      onChange={(e) => setUsersDueLocation(e.target.value)}
                    >
                      <option value="all">All Locations</option>
                      {districts.map((each, i) =>
                        <option value={each.name} key={i}>{each.name}</option>
                      )}
                    </FormSelect>
                  </Col>
                  <Col md="3" className="d-flex align-items-center">
                    <FormInput
                      placeholder="Search here"
                      value={searchItem}
                      onChange={e => setSearchItem(e.target.value)}
                      onKeyPress={e => e.charCode === 13 ? setUsersDueSearchKey() : null}
                    />
                  </Col>
                  <Col md="3" className="d-flex align-items-center">
                    <Button
                      size="sm"
                      theme="info"
                      className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0"
                      onClick={() => setUsersDueSearchKey()}
                    >
                      Search
                    </Button>
                    <Button
                      size="sm"
                      theme="secondary"
                      className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0"
                      onClick={() => reset() }
                    >
                      Reset
                    </Button>
                  </Col>
                </Row>
              </Col>
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th className="checkboxLeftPadding">
                      <FormCheckbox checked={isAllChecked} onChange={e => handleAllChecked(e)} />
                    </th>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>User Type</th>
                    <th>Location</th>
                    <th>Subscription Type</th>
                    <th>Subscription End Date</th>
                    <th>Registration Date</th>
                    <th>Administrated By</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <IsLoading /> : filterUserData.map((item, i) => (
                    <tr key={i}>
                      <td className="checkboxLeftPadding">
                        <FormCheckbox
                          checked={item.isChecked}
                          onChange={e => handleCheckBox(e, item.id)}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.userType}</td>
                      <td>{item.district + " / " + item.town}</td>
                      { item.subscriptionType === "Free" ? <td><CBadge color="primary" shape="pill">{item.subscriptionType}</CBadge></td> : <td><CBadge color="success" shape="pill">{item.subscriptionType}</CBadge></td>}
                      <td>{item.subscriptionEndDate.toDate().toLocaleDateString()}</td>
                      <td>{item.created_at.toDate().toLocaleDateString()}</td>
                      <td>{item.administratedBy}</td>
                      <td>
                        <Button size="sm" pill onClick={() => handleEditUser(item.id)} theme="secondary">
                          <BsPencil />
                        </Button>
                        <Button size="sm" pill onClick={() => handleViewUser(item)} theme="info">
                          <BsEye />
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
        <CreatUser
          setModalForCreate={setModalForCreate}
          states={states}
          districts={districts}
          towns={towns}
          adminsNames={adminsNames}
          admins={admins}
          addNewUser={addNewUser}
          classNames={modalForCreate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
        />
        <EditUser
          setModalForUpdate={setModalForUpdate}
          setShowEditUserID={setShowEditUserID}
          sendData={userData.find(x => x.id === showEditUserID)}
          states={states}
          districts={districts}
          towns={towns}
          admins={admins}
          updateUser={updateUser}
          inactiveUser={inactiveUser}
          classNames={modalForUpdate ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
        />
        <ViewUser
          setModalForView={setModalForView}
          user={userForView}
          classNames={modalForView ? "modal  bd-example-modal-lg faded d-block" : "modal  bd-example-modal-lg faded"}
        />
        <NotificationUser
          onClick={() => setModal4(false)}
          setCurrentNotification={setCurrentNotification}
          sendNotification={sendNotification}
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

export default ActiveUsers;
