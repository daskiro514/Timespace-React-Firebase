import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import Papa from 'papaparse';
import firebase from "../../../util/firebase";
import { Row, Col, ListGroup, ListGroupItem, Form, FormGroup, FormInput, Button, FormCheckbox } from "shards-react";

import Modal from "../../../components/common/Modal";

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    "& > span": {
      marginRight: 10,
      fontSize: 18,
    },
  },
});
const CalendarUpdateModal = (props) => {
  const classes = useStyles();
  // const [tagData, setTagData] = useState("");
  // const [newtags, setNewTag] = useState([]);
  const [calendarName, setcalendarName] = useState("");
  const [allStates, setAllStates] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [myCSV] = useState();
  const [eventRows, setEventRows] = useState([]);
  const [calendarStatus, setCalendarStatus] = useState(false); 
  const [location, setLocation] = useState({
    all: false,
    state: "",
    district: "",
  });
  const [category, setCategory] = useState("");
  // const handleSetTagData = () => {
  //   setNewTag((oldTags) => {
  //     return [...oldTags, tagData];
  //   });
  //   setTagData("");
  // };
  const clear = () => {
    // setNewTag([]);
    setcalendarName("");
    setLocation({
      all: false,
      state: "",
      district: "",
    });
    setCategory("");
  };
  const handleSave = () => {
    const sendData = {
      calendarName: calendarName,
      location: location,
      categories: category,
      status: calendarStatus
    };

    const db = firebase.firestore();

    db.collection("calendarManagement").doc(props.sendData.id).update(sendData);

    let firebaseSendData = eventRows;
    firebaseSendData.forEach(element => {
      element.calendarId = props.sendData.id
      db.collection("event").add(element).then(function (docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
    });

    props.setModal2(false);
  };
  // const handleClose = (itemval) => {
  //   const remainTag = newtags.filter((x) => x !== itemval);
  //   setNewTag(remainTag);
  // };

  const readLocalFile = (file) => {
    var fr = new FileReader();
    fr.onload = () => {
      const results = Papa.parse(fr.result, { header: true });
      let rows = results.data;
      let keys = Object.keys(rows[0]);
      let tempRows = [];
      for (let i = 0; i < rows.length; i++) {
        let descriptions = {};
        let tempRow = {};
        for (let j = 0; j < 10; j++) {
          tempRow[keys[j]] = rows[i][keys[j]];
        }        
        for (let j = 10; j < keys.length; j++) {
          descriptions[keys[j]] = rows[i][keys[j]];
        }
        tempRow.descriptions = descriptions;
        tempRows.push(tempRow);
      }
      setEventRows(tempRows);
    }
    fr.readAsText(file);
  }

  useEffect(() => {
    if (props.sendData) {
      console.log(props.sendData)
      const setAllInput = () => {
        setcalendarName(props.sendData.calendarName);
        setCategory(props.sendData.categories);
        setLocation(props.sendData.location);
        setCalendarStatus(props.sendData.status);
      };
      setAllInput();
    }
  }, [props.sendData]);

  useEffect(() => {
    const getAllLocationForCalender = () => {
      const db = firebase.firestore();
      db.collection("states").onSnapshot(function (data) {
        let tempStates = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        let tempStates1 = [];
        for (let index = 0; index < tempStates.length; index++) {
          tempStates1.push(tempStates[index].name);
        }
        setAllStates(tempStates1);  
      });
      db.collection("districts").onSnapshot(function (data) {
        let tempDistricts = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        let tempDistricts1 = [];
        for (let index = 0; index < tempDistricts.length; index++) {
          tempDistricts1.push(tempDistricts[index].name);
        }
        setAllDistricts(tempDistricts1);  
      });
    };
    getAllLocationForCalender();
  }, []);

  return (
    <Modal
      containModalSize="bd-example-modal-lg"
      modalSize="modal-lg"
      classNames={props.classNames}
      title="Edit Calendar"
      onClick={() => {
        props.onClick();
        clear();
      }}
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
                        onChange={(e) => setcalendarName(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <Row>
                      <Col md="5">
                        <FormGroup>
                          <label>State</label>
                          <Autocomplete
                            value={location.state}
                            id="country-select-demo"
                            style={{ width: "100%" }}
                            size="small"
                            options={allStates}
                            classes={{
                              option: classes.option,
                            }}
                            autoHighlight
                            // getOptionLabel={(option) => option}
                            // getOptionLabel={location.state}
                            onChange={(e, value) => {
                              setLocation((prevState) => {
                                return {
                                  ...prevState,
                                  state: value,
                                  all: false,
                                };
                              });
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose a state"
                                variant="outlined"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="5">
                        <FormGroup>
                          <label>District</label>
                          <Autocomplete
                            value={location.district}
                            id="country-select-demo"
                            style={{ width: "100%" }}
                            size="small"
                            options={allDistricts}
                            classes={{
                              option: classes.option,
                            }}
                            onChange={(e, value) => {
                              setLocation((prevState) => {
                                return {
                                  ...prevState,
                                  district: value,
                                  all: false,
                                };
                              });
                            }}
                            autoHighlight
                            getOptionLabel={(option) => option}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Choose a district"
                                variant="outlined"
                                inputProps={{
                                  ...params.inputProps,
                                  autoComplete: "new-password", // disable autocomplete and autofill
                                }}
                              />
                            )}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <label>All Location</label>
                        <fieldset>
                          <FormCheckbox
                            small
                            checked={location.all}
                            onChange={(e, value) => {
                              setLocation((prevState) => {
                                return {
                                  ...prevState,
                                  district: "",
                                  state: "",
                                  all: !prevState.all,
                                };
                              });
                            }}
                          >
                            All
                          </FormCheckbox>
                        </fieldset>
                      </Col>
                    </Row>
                  </Col>
                </Row>

                {/* Add categories */}
                <Row>
                  <Col sm="8">
                    <label>Category</label>
                    <FormInput
                      placeholder="Category"
                      defaultValue={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </Col>
                </Row>
                {/* Add status */}
                <Row>
                  <Col sm="8">
                    <label>Status</label>
                    <select value={calendarStatus} onChange={(e) => setCalendarStatus(e.target.value === "true" ? true : false)}>
                      <option value={true}>Active</option>
                      <option value={false}>Deactive</option>
                    </select>
                  </Col>
                </Row>
                {/* Add csv */}
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
                    <Button theme="accent" onClick={() => handleSave()}>
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
  );
};

export default CalendarUpdateModal;

