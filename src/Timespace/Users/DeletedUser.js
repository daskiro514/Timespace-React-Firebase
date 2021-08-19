import React from "react";
import { Container, Row, Col, Card, CardBody, Button, FormInput, FormGroup } from "shards-react";
import firebase from "../../util/firebase";
import { CSVLink } from 'react-csv';
const db = firebase.firestore();

const DeletedUser = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  const [filterUserData, setFilterUserData] = React.useState([]);
  const [searchItem, setSearchItem] = React.useState("");
  const [downloadDate, setDownloadDate] = React.useState(`Deleted Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)
  const [downloadData, setDownloadData] = React.useState([])

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      await getDeletedUsers();
    }
    fetchData();
  }, []);

  const getDeletedUsers = async () => {
    let usersFromDB = ((await db.collection("users").get()).docs.map(doc => ({ ...doc.data(), id: doc.id }))).filter(element => element.deleted_at)
    setUserData(usersFromDB);
    setFilterUserData(usersFromDB);

    let downloadDataTemp = [];
    usersFromDB.forEach(item => {
      var destinationObject = {};
      destinationObject["User Name"] = item["name"]
      destinationObject["Phone Number"] = item["mobile"]
      destinationObject["User Type"] = item["userType"]
      // destinationObject["Status"] = item[""]
      destinationObject["Registration Date"] = item["updated_at"].toDate().toLocaleDateString()
      downloadDataTemp.push(destinationObject);
    });
    setDownloadData(downloadDataTemp);

    setIsLoading(false);
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

  const reset = () => {
    setUsersDueSearchKey()
  }

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <h1>Deleted Users</h1>
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
                    <Button onClick={() => setUsersDueSearchKey()} size="sm" theme="info" className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0">
                      Search
                    </Button>&nbsp;
                  </Col>
                  <Col md="2" className="d-flex align-items-center">
                    <Button onClick={() => reset()} size="sm" theme="secondary" className="d-flex ml-auto mr-sm-auto mt-3 mt-sm-0">
                      Reset
                    </Button>&nbsp;
                  </Col>
                  <Col md="4" className="d-flex align-items-center">
                    <CSVLink 
                      data={downloadData} 
                      onClick={() => setDownloadDate(`Deleted Users_${(new Date()).toLocaleDateString()}_${(new Date()).toLocaleTimeString()}.csv`)} 
                      filename={downloadDate} 
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
                    <th>Mobile Number</th>
                    <th>Location(Town)</th>
                    <th>Registration Date</th>
                    <th>User Type</th>
                    <th>Deleted From</th>
                    <th>Deleted Time</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? <IsLoading /> : filterUserData.map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.town}</td>
                      <td>{item.created_at.toDate().toLocaleDateString()}</td>
                      <td>{item.userType}</td>
                      <td>{item.deleted_from}</td>
                      <td>{item.deleted_at.toDate().toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
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
    <tr><td>LOADING ... </td></tr>
  )
}

export default DeletedUser;