import React from "react";
import { Container, Row, Col, Card, CardHeader, CardBody, CardFooter, Button, FormInput } from "shards-react";
import { BsTrash, BsPencil } from "react-icons/bs";
import PageTitle from "../../components/common/PageTitle";
import firebase from "../../util/firebase";
const db = firebase.firestore();
const storage = firebase.storage();

const SpaceIcon = () => {
  const [image, setImage] = React.useState(null);
  const [iconName, setIconName] = React.useState("");
  const [updateID, setUpdateID] = React.useState("");
  const [spaceIconForUpdate, setSpaceIconForUpdate] = React.useState(null);
  const [imageForUpdate, setImageForUpdate] = React.useState(null);
  const [iconNameForUpdate, setIconNameForUpdate] = React.useState("");
  const [spaceIcons, setSpaceIcons] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const addNewSpaceIcon = async () => {
    if (iconName && image) {
      setIsLoading(true);
      const uploadTask = storage.ref(`/icon/${iconName}`).put(image);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
      }, function (error) {
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const sendData = {
            name: iconName,
            image: downloadURL,
            storage_path: `/icon/${iconName}`,
            created_at: firebase.firestore.Timestamp.now(),
            updated_at: firebase.firestore.Timestamp.now(),
          }
          db.collection("icons").add(sendData).then(res => {
            getSpaceIcons();
            clearCreateInput()
          })
        });
      });
    } else {
      alert("Please Check the image file and icon name");
    }
  }

  const getSpaceIcons = async () => {
    let tempSpaceIcons = (await db.collection("icons").get()).docs.map(doc => ({ ...doc.data(), id: doc.id })).sort((a, b) => a.created_at - b.created_at);
    setSpaceIcons(tempSpaceIcons);
    setIsLoading(false);
  }

  const setForUpdate = (forUpdate) => {
    setUpdateID(forUpdate.id)
    setSpaceIconForUpdate(forUpdate);
    setImageForUpdate(null)
    setIconNameForUpdate(forUpdate.name)
  }

  const updateSpaceIcon = async () => {
    if (imageForUpdate && iconNameForUpdate) {
      setIsLoading(true);
      await storage.ref(spaceIconForUpdate.storage_path).delete();
      const uploadTask = storage.ref(`/icon/${iconNameForUpdate}`).put(imageForUpdate);
      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
      }, function (error) {
      }, function () {
        uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          const sendData = {
            name: iconNameForUpdate,
            image: downloadURL,
            storage_path: `/icon/${iconNameForUpdate}`,
            updated_at: firebase.firestore.Timestamp.now(),
          }
          db.collection("icons").doc(updateID).update(sendData).then(res => {
            setUpdateID("");
            getSpaceIcons();
          })
        });
      });
    } else if (iconNameForUpdate) {
      setIsLoading(true);
      await db.collection("icons").doc(updateID).update({name: iconNameForUpdate})
      setUpdateID("");
      await getSpaceIcons();
    }
  }

  const deleteSpaceIcon = async (spaceIconForDel) => {
    setIsLoading(true);
    await storage.ref(spaceIconForDel.storage_path).delete();
    await db.collection("icons").doc(spaceIconForDel.id).delete();
    await getSpaceIcons();
  }

  const clearCreateInput = () => {
    setImage(null);
    setIconName("");
  }

  React.useEffect(() => {
    setIsLoading(true);
    async function fetchData() {
      await getSpaceIcons();
    }
    fetchData()
  }, [])

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="6" title="Space Icons" className="text-sm-left" />
      </Row>

      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Upload PNG File</h6>
            </CardHeader>
            <CardBody>
              <Row>
                <Col md="6">
                  <Card className="p-3">
                    <strong className=" d-block mb-2">PNG FILE</strong>
                    <FormInput
                      type="file"
                      onChange={(e) => setImage(e.target.files[0])}
                    />
                  </Card>
                </Col>
                <Col md="6">
                  <Card className="p-3">
                    <strong className=" d-block mb-2">Space Icon Name</strong>
                    <FormInput
                      placeholder="Space Icon Name"
                      value={iconName}
                      onChange={(e) => setIconName(e.target.value)}
                    />
                  </Card>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button onClick={addNewSpaceIcon}>Upload</Button>
            </CardFooter>
          </Card>
        </Col>
        <Col sm="12 mt-4">
          <Card small className="mb-4">
            <CardHeader className="border-bottom d-md-flex align-items-md-center justify-content-md-between">
              <h6 className="m-0">Space Icon List</h6>
            </CardHeader>
            <CardBody className="p-0">
              <table className="table mb-0">
                <thead className="bg-dark">
                  <tr>
                    <th scope="col" className="border-0">No</th>
                    <th scope="col" className="border-0">Icon Name</th>
                    <th scope="col" className="border-0">Image</th>
                    <th scope="col" className="border-0">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? <IsLoading /> :
                    spaceIcons.map((each, i) => each.id === updateID ?
                      (<tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <FormInput
                            placeholder="Space Icon Name"
                            value={iconNameForUpdate}
                            onChange={e => setIconNameForUpdate(e.target.value)}
                          />
                        </td>
                        <td>
                          <FormInput
                            type="file"
                            onChange={(e) => setImageForUpdate(e.target.files[0])}
                          />
                        </td>
                        <td>
                          <Button size="sm" pill theme="success" onClick={() => updateSpaceIcon()}>
                            Update
                          </Button>
                          <Button size="sm" pill theme="primary" onClick={() => setUpdateID("")} >
                            Cancel
                          </Button>
                        </td>
                      </tr>) :
                      (<tr key={i}>
                        <td>{i + 1}</td>
                        <td>{each.name}</td>
                        <td><img src={each.image} width="50px" height="50px" alt="Please wait" /></td>
                        <td>
                          <Button size="sm" pill theme="primary" onClick={() => setForUpdate(each)}>
                            <BsPencil />
                          </Button>
                          <Button size="sm" pill theme="danger" onClick={() => deleteSpaceIcon(each)}>
                            <BsTrash />
                          </Button>
                        </td>
                      </tr>)
                    )
                  }
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const IsLoading = () => {
  return (
    <tr><td>LOADING ... </td></tr>
  )
}

export default SpaceIcon;
