import React, { useEffect, useState } from "react";
import { Col, FormCheckbox, Row, FormInput, Card } from "shards-react";
import { Button as Buttons } from "shards-react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
//import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import { API_URL } from "../../api/apiUrl";

import { BsTrash, BsPencil } from "react-icons/bs";

const MenuManagement = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [menuData, setMenuData] = useState([]);
	const [newMenu, setNewMenu] = useState("");
	const [save, setSave] = useState("");
	const [deletee, setDelete] = useState("");
	const [deleteID, setDeleteID] = useState(0);
	const [updateMenuName, setUpdateMenuName] = useState("");
	const [open, setOpen] = useState(false);
	const [classUpdate, setClassUpdate] = useState(false);
	const [editID, setEditID] = useState(0);
	const [passwordField, setPasswordField] = useState("");
	const [wrongPassword, setwrongPassword] = useState("none");
	const [rightPassword, setRightPassword] = useState("none");
	const password = "qwerty123";

	useEffect(() => {
		axios.get(`${API_URL}/menus`).then(res => setMenuData(res.data.data));
		setIsLoading(false);
		console.log("HI");
	}, []);
	const handleEdit = id => {
		setClassUpdate(true);
		setEditID(id);
	};
	const handleClose = () => {
		setSave("");
		setDelete("");
		setwrongPassword("none");
		setRightPassword("none");
		setOpen(false);
	};
	const handelCancel = () => {
		setClassUpdate(false);
		setEditID(0);
	};
	const handleMenuSave = () => {
		const newData = {
			name: newMenu,
			status: false,
		};
		console.log(newData);
		axios({
			method: "post",
			url: `${API_URL}/menus`,
			data: newData,
			headers: {
				"Content-type": "application/json",
			},
		});
		setMenuData(prevState => {
			return [...prevState, newData];
		});
		setNewMenu("");
	};
	const handleUpdate = id => {
		setMenuData(prevState => {
			const elementIndex = prevState.findIndex(x => x.id === id);
			const newArray = [...prevState];
			newArray[elementIndex] = {
				...newArray[elementIndex],
				name: updateMenuName,
			};
			return newArray;
		});
		setClassUpdate(false);
		setEditID(0);
	};
	const verification = () => {
		if (passwordField === password) {
			setRightPassword("block");
			return true;
		} else {
			setwrongPassword("block");
			return false;
		}
	};
	const handleSave = () => {
		setSave("Save");
		setOpen(true);
	};
	const handleDialogSave = () => {
		if (verification()) {
			console.log(menuData);
		}
	};
	const handleDelete = id => {
		setDeleteID(id);
		setOpen(true);
		setDelete("Delete");
	};
	const handleDIalogDelete = () => {
		if (verification()) {
			axios
				.delete(`${API_URL}/menus/${deleteID}`)
				.then(res =>
					setMenuData(prevState => prevState.filter(x => x.id !== deleteID))
				)
				.then(() => setDeleteID(0));
		}
	};
	if (isLoading) {
		return <div>Please Wait...</div>;
	}
	return (
		<Row>
			<Col sm="12" md="6" className="mb-3 pt-4">
				<Card className="shadow-none">
					<table>
						<thead>
							<tr>
								<th>Menu</th>
								<th>Action</th>
							</tr>
						</thead>
						{menuData.map((item, i) => {
							return (
								<tbody>
									{classUpdate && editID === item.id ? (
										<tr>
											<td>
												<FormInput
													type="text"
													placeholder="Menu Name"
													defaultValue={item.name}
													onChange={e => setUpdateMenuName(e.target.value)}
												/>
											</td>
											<td className="d-flex align-items-center">
												<Buttons
													className="mr-1"
													theme="primary"
													onClick={() => handleUpdate(item.id)}
												>
													<i className="material-icons">update</i>
												</Buttons>
												<Buttons
													className="mr-1"
													theme="primary"
													onClick={() => handelCancel()}
												>
													<i className="material-icons">cancel</i>
												</Buttons>
											</td>
										</tr>
									) : (
										<tr>
											<td>
												<FormCheckbox
													toggle
													small
													checked={item.status}
													onChange={e =>
														setMenuData(prevState => {
															const elementIndex = prevState.findIndex(
																x => x.id === item.id
															);
															const newArray = [...prevState];
															newArray[elementIndex] = {
																...newArray[elementIndex],
																status: !newArray[elementIndex].status,
															};
															return newArray;
														})
													}
												>
													{item.name}
												</FormCheckbox>
											</td>
											<td className="d-flex align-items-center">
												<Buttons
													size="sm"
													pill
													className="mr-1"
													theme="success"
													onClick={() => handleEdit(item.id)}
												>
													<BsPencil />
												</Buttons>
												<Buttons
													size="sm"
													pill
													theme="primary"
													onClick={() => handleDelete(item.id)}
												>
													<BsTrash />
												</Buttons>
											</td>
										</tr>
									)}
								</tbody>
							);
						})}
					</table>
				</Card>
			</Col>
			<Col sm="12" md="6" className="mb-3 pt-4">
				<Row form>
					{/* First Name */}
					<Col md="6" className="form-group">
						<label className="border-bottom pb-2 d-block font-weight-bold">
							Create Menu
						</label>
					</Col>
				</Row>
				<Row form>
					<Col md="6" className="form-group">
						<FormInput
							id="feFirstName"
							placeholder="Menu"
							defaultValue={newMenu}
							onChange={e => setNewMenu(e.target.value)}
						/>
					</Col>
					<Col>
						<Button
							variant="contained"
							style={{ backgroundColor: "#f85b5b", color: "#ffffff" }}
							onClick={() => {
								handleMenuSave();
							}}
						>
							Create
						</Button>
					</Col>
				</Row>
			</Col>
			<Col md="6">
				<Button
					variant="contained"
					color="secondary"
					onClick={() => handleSave()}
				>
					Save
				</Button>
			</Col>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Enter Password</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						onChange={e => {
							setPasswordField(e.target.value);
							setwrongPassword("none");
						}}
						label="Password"
						type="password"
						fullWidth
					/>
					<p style={{ display: `${wrongPassword}`, color: "red" }}>
						Incorrect Password
					</p>
					<p style={{ display: `${rightPassword}`, color: "green" }}>
						Changed Successfully
					</p>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="primary">
						Close
					</Button>
					<Button
						onClick={() => {
							if (save !== "") {
								return handleDialogSave();
							}
							if (deletee !== "") {
								return handleDIalogDelete();
							}
						}}
						variant="contained"
						color="secondary"
					>
						{save}
						{deletee}
					</Button>
				</DialogActions>
			</Dialog>
		</Row>
	);
};

export default MenuManagement;
