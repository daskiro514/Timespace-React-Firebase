import React from "react";
import { CustomScrollBar } from "react-custom-scrollbar";

const Modal = props => {
  return (
    <div
      className={`${props.classNames}  ${props.containModalSize}`}
      id="exampleModalCenter"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div
        className={"modal-dialog modal-dialog-centered " + props.modalSize}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              {props.title}
            </h5>
            <button
              type="button"
              className="close"
              onClick={props.onClick}
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div
            className="modal-body"
            style={{ maxHeight: "550px", overflowY: "scroll" }}
          >
            <CustomScrollBar>{props.children}</CustomScrollBar>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Modal;
