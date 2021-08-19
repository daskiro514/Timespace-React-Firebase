import React, { useEffect, useState } from "react";
import firebase from "../util/firebase";
import './EventList.css';

const CalenderManagement = (props) => {
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    const getEventList = () => {
      const db = firebase.firestore();
      db.collection("event").onSnapshot(function (data) {
        let tempList = data.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setEventList(tempList.filter(element => element.calendarId === props.match.params.id));
      });
    };
    getEventList();
  }, [props.match.params.id]);

  const deleteEvent = (id) => {
    // console.log(id)
    const db = firebase.firestore();
    db.collection("event").doc(id).delete();
  }

  return (
    <div>
      <table id="customers">
        <thead>
          <tr>
            <th></th>
            <th>Title</th>
            <th>Start Date</th>
            <th>Start Time</th>
            <th>End Date</th>
            <th>End Time</th>
            <th>All Day Event</th>
            <th>Location</th>
            <th>Repeat</th>
            <th>Alert</th>
            <th>Tags</th>
            {eventList[0] ? Object.keys(eventList[0].descriptions).sort().map(key => <th>{key}</th>) : null}
          </tr>
        </thead>
        <tbody>
          {eventList.map((event, i) => (
            <tr key={i}>
              <td><button onClick={() => { deleteEvent(event.id) }}>DELETE</button></td>
              <td>{event["Subject ( Title )"]}</td>
              <td>{event["Start Date"]}</td>
              <td>{event["Start Time"]}</td>
              <td>{event["End Date"]}</td>
              <td>{event["End Time"]}</td>
              <td>{event["All Day Event "]}</td>
              <td>{event["Location"]}</td>
              <td>{event["Repeat "]}</td>
              <td>{event["Alert "]}</td>
              <td>{event["Tags"]}</td>
              {Object.keys(event.descriptions).sort().map(key => <td>{event.descriptions[key] ? event.descriptions[key] : "NULL"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CalenderManagement;