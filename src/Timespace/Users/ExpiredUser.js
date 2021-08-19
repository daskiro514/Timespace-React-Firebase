import React from "react";
import { Container, Row, Col, Card, CardBody, FormCheckbox, Button, FormInput, FormGroup } from "shards-react";
import { CButton, CModal, CModalHeader, CModalBody, CModalFooter, CBadge } from "@coreui/react";
import firebase from "../../util/firebase";
import EditUser from "../../components/modals/EditUser";
import ViewUser from "../../components/modals/ViewUser";
import NotificationUser from "../../components/modals/NotificationUser";
import { BsEye, BsTrash, BsPencil } from "react-icons/bs";
import { CSVLink } from 'react-csv';
const db = firebase.firestore();

const ExpiredUser = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [modal2, setModal2] = React.useState(false);
  const [modal3, setModal3] = React.useState(false);
  const [modal4, setModal4] = React.useState(false);
  const [showEditUserID, setShowEditUserID] = React.useState(0);
  const [showViewUserId, setShowViewUserId] = React.useState(0);
  const [modalfordel, setModalfordel] = React.useState(false);
  const [idfordel, setIdfordel] = React.useState("");
  const [getState, SetStates] = React.useState([]);
  const [getDistrict, SetDistrict] = React.useState([]);
  const [getTowns, SetTowns] = React.useState([]);
  const [userData, setUserData] = React.useState([]);
  const [filterUserData, setFilterUserData] = React.useState([]);
  const [searchItem, setSearchItem] = React.useState("");
  const [downloadData, setDownloadData] = React.useState([]);
  const [downloadDate, setDownloadDate] = React.useState(`Expired Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)

  React.useEffect(() => {
    const getAllusers = () => {
      setIsLoading(true)
      db.collection("users").onSnapshot(function (data) {
        setIsLoading(false);
        let nowDateSeconds = new Date().getTime() / 1000;
        let usersFromDB = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        usersFromDB = usersFromDB.filter(element => element.deleted_at === null && element.subscriptionEndDate.seconds < nowDateSeconds);
        setUserData(usersFromDB);
        setFilterUserData(usersFromDB);

        let downloadDataTemp = [];
        usersFromDB.forEach(item => {
          var destinationObject = {};
          destinationObject["User Name"] = item["name"]
          destinationObject["Phone Number"] = item["mobile"]
          destinationObject["User Type"] = item["userType"]
          destinationObject["Subscription Type"] = item["subscriptionType"]
          destinationObject["Subscription Due Date"] = item["subscriptionEndDate"].toDate().toLocaleDateString()
          destinationObject["Registration Date"] = item["updated_at"].toDate().toLocaleDateString()
          destinationObject["Administrated By"] = item["administratedBy"]
          downloadDataTemp.push(destinationObject);
        });
        setDownloadData(downloadDataTemp);
        setIsLoading(false);
      });
    };

    const getAllStates = () => {
      db.collection("states").onSnapshot(function (data) {
        SetStates(
          data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        );
      });
    }

    const getAllDistricts = () => {
      db.collection("districts").onSnapshot(function (data) {
        SetDistrict(
          data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        );
      });
    }
    const getAllTowns = () => {
      db.collection("towns").onSnapshot(function (data) {
        SetTowns(
          data.docs.map(doc => ({ ...doc.data(), id: doc.id }))
        );
      });
    }
    getAllusers();
    getAllStates();
    getAllDistricts();
    getAllTowns();
  }, []);
  const toggle = () => {
    setModalfordel(!modalfordel);
  };
  const openModel = id => {
    setIdfordel(id);
    setModalfordel(true);
  };
  const DeleteItem = () => {
    setModalfordel(false);
    db.collection("users").doc(idfordel).delete();
  };

  const handleEditUser = id => {
    setShowEditUserID(id);
    setModal2(true);
  };
  const handleViewUser = id => {
    setShowViewUserId(id);
    setModal3(true);
  };

  const handleAllChecked = e => {
    setUserData(prevState =>
      prevState.map(x => {
        return { ...x, isChecked: e.target.checked };
      })
    );
  };
  const handleCheckBox = (e, id) => {
    const elementIndex = userData.findIndex(ele => ele.id === id);
    const newUserData = [...userData];
    newUserData[elementIndex] = {
      ...newUserData[elementIndex],
      isChecked: e.target.checked,
    };
    setUserData(newUserData);
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
        <h1>Expired Users</h1>
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
                    <CSVLink filename={downloadDate} onClick={() => setDownloadDate(`Expired Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)} className="btn d-flex btn-warning btn-sm ml-auto ml-sm-auto mr-2 mt-3 mt-sm-0" data={downloadData} >Download CSV</CSVLink>
                  </Col>
                </Row>
              </Col>
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0 checkboxLeftPadding">
                      <FormCheckbox onChange={e => handleAllChecked(e)} />
                    </th>
                    <th scope="col" className="border-0">
                      Name
                    </th>
                    <th scope="col" className="border-0">
                      PhoneNumber
                    </th>
                    <th scope="col" className="border-0">
                      UserType
                    </th>
                    <th scope="col" className="border-0">
                      Subscription Type
                    </th>
                    <th scope="col" className="border-0">
                      Subscription End Date
                    </th>
                    <th scope="col" className="border-0">
                      Registration Date
                    </th>

                    <th scope="col" className="border-0">
                      Administrated By
                    </th>
                    <th scope="col" className="border-0">
                      Action
                    </th>
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
                      <td><CBadge color="danger" shape="pill">Expired</CBadge></td>
                      <td>{item.subscriptionEndDate.toDate().toLocaleDateString()}</td>
                      <td>{item.created_at.toDate().toLocaleDateString()}</td>
                      <td>{item.addminitstratedBy}</td>
                      <td className="d-flex align-items-center">
                        <Button
                          size="sm"
                          pill
                          className="mr-1"
                          theme="secondary"
                          onClick={() => handleEditUser(item.id)}
                        >
                          <BsPencil />
                        </Button>
                        <Button
                          size="sm"
                          pill
                          theme="info"
                          className="mr-1"
                          onClick={() => handleViewUser(item.id)}
                        >
                          <BsEye />
                        </Button>
                        <Button
                          size="sm"
                          pill
                          theme="danger"
                          onClick={() => openModel(item.id)}
                        >
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
        <EditUser
          onClick={() => {
            setModal2(false);
            setShowEditUserID(0);
          }}
          sendData={userData.find(x => x.id === showEditUserID)}
          sendAllStates={getState}
          sendAllDistricts={getDistrict}
          sendAllTowns={getTowns}
          setModal2={setModal2}
          viewType="expired"
          classNames={
            modal2
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        />
        <ViewUser
          onClick={() => {
            setModal3(false);
            setShowViewUserId(0);
          }}
          sendData={userData.find((x) => x.id === showViewUserId)}
          viewType="expired"
          classNames={
            modal3
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        />
        <NotificationUser
          onClick={() => setModal4(false)}
          classNames={
            modal4
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        />
      </Row>
      <CModal show={modalfordel} onClose={toggle}>
        <CModalHeader closeButton style={{ color: "red" }}>
          Delete
        </CModalHeader>
        <CModalBody>Are you Sure you want to delete this item</CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={DeleteItem}>
            Confirm
          </CButton>{" "}
          <CButton color="secondary" onClick={toggle}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </Container>
  );
};

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default ExpiredUser;

