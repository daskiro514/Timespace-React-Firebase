import React, { useEffect, useState } from "react";
import {
  Container,
  Card,
  CardHeader,
  Row,
  Col,
  CardBody,
  CardFooter,
  Button,
  FormInput,
  FormGroup,
} from "shards-react";
import {CButton, CModal, CModalHeader, CModalBody, CModalFooter} from '@coreui/react'
import { BsTrash, BsPencil } from "react-icons/bs";
import PageTitle from "../../components/common/PageTitle";
//import EditColor from "../components/modals/EditColor";
import "../../assets/style.css";
//import axios from "axios";
import firebase from '../../util/firebase'
//import { API_URL } from "../../api/apiUrl";
const ManageColors = () => {
 // const [update, setUpdate] = useState(false);
  const [themeName, setThemeName] = useState("");
  const [theme_color, setThemeColor] = useState("");
  const [text_color_code, setTextColorCode] = useState("");
  const [outer_color_code, setOuterColorCode] = useState("");
  const [inner_color_code, setInnerColorCode] = useState("");
  const initialFormStateforUpdate = { updateThemeName: '', 
  updateLineColor: '', updateTextColor: '', updatedOuterColorCode:'', updatedInnerColorCode:'' }
  const [updatedtheme, setUpdateTheme] = useState(initialFormStateforUpdate)
  const [updateThemeName, setUpdateThemeName] = useState("");
  const [updateLineColor, setUpdateLineColor] = useState("");
  const [updateTextColor, setUpdateTextColor] = useState("");
  const [updatedOuterColorCode, setUpdatedOuterColorCode] = useState("");
  const [updatedInnerColorCode, setUpdatedInnerColorCode] = useState("");
  const [classUpdate, setClassUpdate] = useState(false);
  const [editID, setEditID] = useState(0);
  //const [modal, setModal] = useState(false);
  const [themeData, setThemedata] = useState([]);
  const [modal, setModal] = useState(false);
  const [idfordel, setIdfordel]=useState('')
  const [loader, setLoader]= useState(false)
   // const ref=firebase.firestore().collection("manageTheme")
  // useEffect(() => {
  //   axios
  //     .get(`${API_URL}/themes`)
  //     .then((res) => setThemedata(res.data.data));
  // }, [update]);
 


useEffect(()=>{
  const getAllTheme=()=>{
    setLoader(true)
    const db=firebase.firestore();
    db.collection('manageTheme')
    .onSnapshot(function(data){
      console.log(data)
      setLoader(false)
      setThemedata(data.docs.map(doc=>({...doc.data(), id: doc.id})))
    // ref.onSnapshot((querySnapshot)=>{
    //   const items=[];
    //   querySnapshot.forEach((doc)=>{
    //     items.push(doc.data());
    //   });
    //   setLoader(false)
    //   setThemedata(items)
     //console.log(`****************theme`,themeData)
     // SetLoading(false)
    });
    
  }
  getAllTheme();
},[])
//Create new Theme

const handleSave = () => {
   
  const db=firebase.firestore();
  db.collection('manageTheme').add({
    themeName:themeName,
    themeColor:theme_color,
    textColor:text_color_code,
    buttonOuterColor:outer_color_code,
    buttonInnerColor:inner_color_code

  })

  
};


  // const handleSave = () => {
  //   const uploadData = {
  //     name:themeName,
  //     line_color_code:theme_color,
  //     text_color_code: text_color_code,
  //     button_outer_color_code:outer_color_code,
  //     button_inner_color_code:inner_color_code
  //   };
  //   console.log(uploadData)
  //   axios({
  //     method: "post",
  //     url: `${API_URL}/themes`,
  //     data: uploadData,
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   }).then(() => setUpdate((prevState) => !prevState));
  // };
  const handleUpdate = (id) => {
    console.log(`all values***************`, updateThemeName, updateLineColor, updateTextColor, updatedOuterColorCode, updatedInnerColorCode )
   const db=firebase.firestore();
   db.collection('manageTheme').doc(editID).set({
    themeName:updateThemeName?updateThemeName:updatedtheme.updateThemeName,
    themeColor:updateLineColor?updateLineColor:updatedtheme.updateLineColor,
    textColor:updateTextColor?updateTextColor:updatedtheme.updateTextColor,
    buttonOuterColor:updatedOuterColorCode?updatedOuterColorCode:updatedtheme.updatedOuterColorCode,
    buttonInnerColor:updatedInnerColorCode?updatedInnerColorCode:updatedtheme.updatedInnerColorCode
   })
   
      
      
    console.log(`update theme*****`, id)
    const elementIndex = themeData.findIndex((x) => x.id === id);
    const newArray = [...themeData];
 
    if (updateThemeName !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        themeName: updateThemeName,
      };
      setThemedata(newArray);
    }
    if (updateLineColor !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        lineColorCode: updateLineColor,
      };
      setThemedata(newArray);
    }
    if (updateTextColor !== "") {
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        textColorCode: updateTextColor,
      };
      setThemedata(newArray);
   
    }

    if(updatedOuterColorCode !==""){
      newArray[elementIndex] = {
        ...newArray[elementIndex],
        textColorCode: updatedOuterColorCode,
      };
    }
      setThemedata(newArray);
      if(updatedInnerColorCode !==""){
        newArray[elementIndex] = {
          ...newArray[elementIndex],
          textColorCode: updatedInnerColorCode,
        };
        setThemedata(newArray);
     // console.log(`***********Update value`, newArray)
    }
    const updateTheme = {
      id:id,
      name:updateThemeName?updateThemeName:updatedtheme.updateThemeName,
      line_color_code:updateLineColor,
      text_color_code: updateTextColor,
      button_outer_color_code:updatedOuterColorCode,
      button_inner_color_code:updatedInnerColorCode
    };
    console.log(`i am ready for upadate****`, updateTheme)
    // axios({
    //   method: "put",
    //   url: `${API_URL}/themes`,
    //   data: updateTheme, id,
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    // }).then(() => setUpdate((prevState) => !prevState));
    setClassUpdate(false);
    setEditID(0);
  };
  const handelCancel = () => {
    setClassUpdate(false);
    setEditID(0);
  };
  const handleEdit = (item) => {
    console.log(`item for edit`, item)
    setClassUpdate(true);
  setUpdateTheme({updateThemeName:item.themeName, 
  updateLineColor:item.theme_color, updateTextColor:item.text_color_code,
  updatedOuterColorCode:item.outer_color_code, updatedInnerColorCode:item.inner_color_code })
   setEditID(item.id);
   
  };
  console.log(`i am ready for update`, updatedtheme)
  // const handleDelete = (id) => {
  //   console.log(`id for delete`, id)
  //   const result = window.confirm(
  //     "Are you sure you want to delete this theme"
  //   );
  //   axios({
  //     method: "DELETE",
  //     url: `${API_URL}/themes/${id}`,
  //     headers: {
  //       "Content-type": "application/json",
  //     },
  //   }).then(() => setUpdate((prevState) => !prevState));
  //   if (result) {
  //     setThemedata((prevData) => prevData.filter((x) => x.id !== id));
  //   }
  // };
  const openModel=(id)=>{
    setIdfordel(id)
    setModal(true)
  }
  const DeleteItem = ()=>{
    setModal(false)
    const db=firebase.firestore();
    db.collection('manageTheme').doc(idfordel).delete()
    // axios({
    //   method: "DELETE",
    //   url: `${API_URL}/themes/${idfordel}`,
    //   headers: {
    //     "Content-type": "application/json",
    //   },
    // }).then(() => setUpdate((prevState) => !prevState));
  }
  const toggle = ()=>{
    setModal(!modal);
  }
  const handleClose = () => {
    setThemeName("");
    setThemeColor("");
    setTextColorCode("");
    setOuterColorCode("");
    setInnerColorCode("");
  };
  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-4">
        <PageTitle
          sm="4"
          title="Manage Colors"
          subtitle="Theme"
          className="text-sm-left"
        />
      </Row>
      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-2">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Manage Theme</h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Col sm="12" md="3">
                  <Card className="shadow-sm">
                    <CardHeader className="border-bottom bg-light  pt-2 mb-2 py-1">
                      <strong className=" d-block mb-2">Theme Name</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <FormInput
                          type="text"
                          placeholder="Theme Name"
                          value={themeName}
                          onChange={(e) => setThemeName(e.target.value)}
                        />
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm="12" md="2">
                  <Card className="shadow-sm">
                    <CardHeader className="border-bottom bg-light  pt-2 mb-2 py-1">
                      <strong className=" d-block mb-2">ThemeColor</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <input type="color"  
                        value= {theme_color? theme_color:"#e66465"}
                        onChange={(e) => setThemeColor(e.target.value)}/>
                        &nbsp;<label for="head">{theme_color}</label>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm="12" md="2">
                  <Card className="shadow-sm">
                    <CardHeader className="border-bottom bg-light  pt-2 mb-2 py-1">
                      <strong className=" d-block mb-2">Text Color</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <input type="color"  
                        value= {text_color_code?text_color_code :'#FFC0CB'} 
                        onChange={(e) => setTextColorCode(e.target.value)}/>
                        &nbsp;<label for="head">{text_color_code}</label>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm="12" md="2">
                  <Card className="shadow-sm">
                    <CardHeader className="border-bottom bg-light  pt-2 mb-2 py-1">
                      <strong className=" d-block mb-2">Outer Color</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <input type="color"  
                        value={outer_color_code?outer_color_code:"#0000FF"} 
                        onChange={(e) => setOuterColorCode(e.target.value)}
                        />
                      &nbsp;<label for="head">{outer_color_code}</label>
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                <Col sm="12" md="2">
                  <Card className="shadow-sm">
                    <CardHeader className="border-bottom bg-light  pt-2 mb-2 py-1">
                      <strong className=" d-block mb-2">Inner Color</strong>
                    </CardHeader>
                    <CardBody>
                      <FormGroup>
                        <input type="color"  
                        value={inner_color_code?inner_color_code:"#FF0000"} 
                        onChange={(e) => setInnerColorCode(e.target.value)}
                      />
                     &nbsp;<label for="head">{inner_color_code}</label>
                    
                      </FormGroup>
                    </CardBody>
                  </Card>
                </Col>
                
              </Row>
            </CardBody>
            <CardFooter>
              <Button theme="primary" onClick={() => handleSave()}>
                Save
              </Button>&nbsp;&nbsp;
              <Button theme="primary" onClick={handleClose}>
                    Clear
                  </Button>
            </CardFooter>
          </Card>
        </Col>

        {/* COLOR MANAGE DATA LIST */}
        <Col sm="12 mt-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Theme Data</h6>
            </CardHeader>
            <CardBody className="py-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">
                      Theme Name
                    </th>
                    <th scope="col" className="border-0">
                      Theme color
                    </th>
                    <th scope="col" className="border-0">
                      Text Color
                    </th>
                    <th scope="col" className="border-0">
                      Outer Color
                    </th>
                    <th scope="col" className="border-0">
                      Inner Color
                    </th>
                    <th scope="col" className="border-0">
                      Action
                    </th>
                  </tr>
                </thead>
                <tr align="left">  {loader? (<p style={{color:'blue', fontWeight:'bold'}}>Loading...</p>
                //    <Loader
                //    type="Puff"
                //    color="#00BFFF"
                //    height={20}
                //    width={20}
                //    timeout={3000} //3 secs
                //  />
                ):''}</tr>
                {themeData.map((item, id) => {
                  return (
                    <tbody key={id}>
                      {classUpdate && editID === item.id ? (
                        <tr>
                          <td>
                            <FormInput
                              type="text"
                              placeholder="Theme Name"
                              value= {updateThemeName?updateThemeName:item.themeName}
                              onChange={(e) =>
                                setUpdateThemeName(e.target.value)
                              }
                            />
                          </td>
                          <td>
                            {/* <FormInput
                              type="text"
                              placeholder="Theme Color"
                              defaultValue={item.line_color_code}
                              onChange={(e) =>
                                setUpdateLineColor(e.target.value)
                              }
                            /> */}
                          <input type="color"  
                        value= {item.themeColor}
                        onChange={(e) =>
                          setUpdateLineColor(e.target.value)}
                        />
                        &nbsp;<label for="head">{updateLineColor}</label>
                          </td>
                          <td>
                            {/* <FormInput
                              type="text"
                              placeholder="Text Color"
                              defaultValue={item.text_color_code}
                              onChange={(e) =>
                                setUpdateTextColor(e.target.value)
                              }
                            /> */}
                            <input type="color"  
                        value= {item.textColor}
                        onChange={(e) =>
                          setUpdateTextColor(e.target.value)}
                        />
                        &nbsp;<label for="head">{updateTextColor}</label>
                          </td>
                          <td>
                            {/* <FormInput
                              type="text"
                              placeholder="Outer Color"
                              defaultValue={item.button_outer_color_code}
                              onChange={(e) =>
                                setUpdatedOuterColorCode(e.target.value)
                              }
                            /> */}
                          <input type="color"  
                        value= {item.buttonOuterColor}
                        onChange={(e) =>
                          setUpdatedOuterColorCode(e.target.value)}
                        />
                        &nbsp;<label for="head">{updatedOuterColorCode}</label>
                          </td>
                          <td>
                            {/* <FormInput
                              type="text"
                              placeholder="Inner Color"
                              defaultValue={item.button_inner_color_code}
                              onChange={(e) =>
                                setUpdatedInnerColorCode(e.target.value)
                              }
                            /> */}
                        <input type="color"  
                        value= {item.buttonInnerColor}
                        onChange={(e) =>
                          setUpdatedInnerColorCode(e.target.value)}
                        />
                        &nbsp;<label for="head">{updatedInnerColorCode}</label>
                          </td>
                          <td className="d-flex align-items-center">
                            <Button
                              className="mr-1"
                              theme="primary"
                              onClick={() => handleUpdate(item.id)}
                            >
                              <i className="material-icons">update</i>
                            </Button>
                            <Button
                              className="mr-1"
                              theme="primary"
                              onClick={() => handelCancel()}
                            >
                              <i className="material-icons">cancel</i>
                            </Button>
                          </td>
                        </tr>
                      ) : (
                        <tr>
                          <td>{item.themeName}</td>
                          <td>{item.themeColor}</td>
                          <td>{item.textColor}</td>
                          <td>{item.buttonOuterColor}</td>
                          <td>{item.buttonInnerColor}</td>
                          <td className="d-flex align-items-center">
                            <Button
                              size="sm"
                              pill
                              className="mr-1"
                              theme="secondary"
                              onClick={() => handleEdit(item)}
                            >
                            	<BsPencil />
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
                      )}
                    </tbody>
                  );
                })}
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        {/* <EditColor
          onClick={() => setModal(false)}
          classNames={
            modal
              ? "modal  bd-example-modal-lg faded d-block"
              : "modal  bd-example-modal-lg faded"
          }
        /> */}
      </Row>
      <CModal
        show={modal}
        onClose={toggle}
      >
        <CModalHeader closeButton style={{color:'red'}}>Delete</CModalHeader>
        <CModalBody>
          Are you Sure you want to delete this item
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={DeleteItem}>Confirm</CButton>{' '}
          <CButton
            color="secondary"
            onClick={toggle}
          >Cancel</CButton>
        </CModalFooter>
      </CModal>
    </Container>
  );
};

export default ManageColors;
