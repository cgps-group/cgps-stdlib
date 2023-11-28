/* eslint-disable @next/next/no-img-element */
/* eslint new-cap: 0 */

import PropTypes from "prop-types";
import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import cc from "classcat";
import FeedbackScreenshot from "feedback-screenshot-tool";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./feedback.module.css";

const initialState = {
  mode: "off",
  includeScreenshot: false,
  screenshotImage: null,
  showHint: true,
  text: "",
  email: "",
  areElementsRetained: false,
};

class Feedback extends React.Component {

  state = {
    ...initialState,
  }

  feedback = new FeedbackScreenshot({
    // default:#347EF8(blue)
    borderColor: "#fdd835",

    // zIndex of screen shot content
    // default:999
    zIndex: 200,

    // content will append to
    // default:document.body
    parent: document.querySelector("body"),

    // html2canvas options
    // default:{}
    html2canvas: {
      logging: false,
      useCROS: true,
      scale: 1,
      ignoreElements: (el) => {
        return el?.classList?.contains("mr-feedback") || el?.classList?.contains("mdl-layout__obfuscator");
      },
    },
  })

  open = () => {
    this.setState({ mode: "dialog" });
  }

  close = () => {
    this.setState(initialState);
  }

  send = () => {
    if (this.props.onSend) {
      this.props.onSend(
        this.state.text,
        this.state.email,
        this.state.includeScreenshot ? this.state.screenshotImage : null,
      );
    }
    if (this.props.sendFeedbackUrl) {
      fetch(
        this.props.sendFeedbackUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "emailAddress": this.state.email,
            "feedbackText": this.state.text,
            "screenshotImage": this.state.includeScreenshot ? this.state.screenshotImage : null,
          }),
        },
      )
        .catch(console.error);
    }
    this.close();
  }

  toggleIncludeScreenshot = (event) => {
    this.setState({ includeScreenshot: event.target.checked });
    if (!this.state.screenshotImage) {
      this.handleStartScreenshot();
    }
  }

  handleTextChange = (event) => {
    this.setState({
      text: event.target.value,
    });
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  handleStartScreenshot = () => {
    this.setState({
      mode: "screenshot",
      screenshotImage: null,
    });
    this.feedback.open(
      this.state.areElementsRetained,
      this.state.helperElements,
      this.state.helpers,
      this.state.helperId,
    );
    this.feedback._root.addEventListener(
      "mousedown",
      () => {
        this.setState({ showHint: false });
      }
    );

    window.feedbackTool = this;
    window.feedback = this.feedback;
  }

  handleStopScreenshot = () => {
    this.setState({
      mode: "dialog",
      areElementsRetained: true,
      helperElements: this.feedback._helperElements,
      helpers: this.feedback._helpers,
      helperId: this.feedback._helperIdx,
    });

    this.props?.onBeforeScreenshot?.();

    this.feedback.close()
      .then(
        (canvas) => {
          this.setState({ screenshotImage: canvas.toDataURL() });
          this.props?.onAfterScreenshot?.();
        },
      )
      .catch((error) => console.error(error));

  }

  setHighlightMode = (highlighMode) => {
    this.setState({ highlighMode });
    this.feedback.setBlackMode(highlighMode);
  }

  render() {
    const { props } = this;

    return (
      <React.Fragment>
        { props.renderButton && props.renderButton(this.open) }
        {/* {
          props.children && (
            <Button
              onClick={this.open}
              title="Report a problem or send feedback"
              className="mr-feedback-button"
              startIcon={<FeedbackTwoToneIcon />}
            >
              Send Feedback
            </Button>
          )
        } */}

        <Dialog
          className={
            cc([
              styles.root,
              { [styles["mr-has-screenshot"]]: this.state.includeScreenshot },
            ])
          }
          disableBackdropClick
          onClose={this.close}
          open={this.state.mode === "dialog"}
        >
          <DialogTitle
            disableTypography
          >
            <h1>
              Send feedback
              <IconButton
                aria-label="close"
                onClick={this.close}
                color="inherit"
              >
                <CloseIcon />
              </IconButton>
            </h1>
          </DialogTitle>
          <DialogContent dividers>

            <div className="mr-text-input">
              {/* <div className="mr-text-margin"></div> */}
              <textarea
                placeholder="Have a question or feedback? We would love to hear it."
                rows="1"
                autoFocus=""
                value={this.state.text}
                onChange={this.handleTextChange}
              >
              </textarea>
            </div>

            <div className="mr-email-input">
              <input
                placeholder="Enter your email if you would like a reply"
                type="email"
                value={this.state.email}
                onChange={this.handleEmailChange}
              />
            </div>

            <div className="mr-include-screenshot">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={this.state.includeScreenshot}
                    onChange={this.toggleIncludeScreenshot}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Include screenshot"
              />
            </div>

            <div className="mr-screenshot-preview">
              {
                this.state.screenshotImage
                  ?
                  (
                    <button
                      onClick={this.handleStartScreenshot}
                      title="Capture a new screenshot"
                    >
                      <img
                        alt="screenshot"
                        src={this.state.screenshotImage}
                      />
                      <div>
                        <svg xmlns="https://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24" height="36" width="36">
                          <path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z" fill="#757575"></path>
                        </svg>
                        <span>Click to highlight or hide info</span>
                      </div>
                    </button>
                  )
                  :
                  <CircularProgress />
                }
            </div>

            <small>
              Your feedback will be sent to the <a href="https://www.pathogensurveillance.net/">Centre for Genomic Pathogen Surveillance</a>.
              In addition to the information you provide, we collect system information (such as browser version and  operating system).
              {/* We will use the information that you give us to help address technical issues and to improve our website. */}
            </small>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.close}>
              Cancel
            </Button>
            <Button
              autoFocus
              onClick={this.send}
              color="primary"
              disabled={!this.state.text}
            >
              Send
            </Button>
          </DialogActions>
        </Dialog>

        {
          (this.state.mode === "screenshot" && this.state.showHint) && (
            <div
              className={styles.hint}
              data-html2canvas-ignore="true"
            >
              <div>
                Draw using yellow to highlight issues or black to hide sensitive info
              </div>
            </div>
          )
        }

        {
          (this.state.mode === "screenshot") && (
            <div
              className={styles.toolbar}
              data-html2canvas-ignore="true"
            >
              <Button
                onClick={() => this.setHighlightMode(false)}
                title="Highlight issues"
                className={this.feedback._state.highlight ? "mr-active" : null}
              >
                <span style={{ display: "inline-block", position: "relative", height: "36px", width: "36px" }}>
                  <svg xmlns="https://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24" height="36" width="36">
                    <path d="M3 3h18v18H3z" fill="#FDD835"></path>
                    <path d="M21 17h-2.58l2.51 2.56c-.18.69-.73 1.26-1.41 1.44L17 18.5V21h-2v-6h6v2zM19 7h2v2h-2V7zm2-2h-2V3.08c1.1 0 2 .92 2 1.92zm-6-2h2v2h-2V3zm4 8h2v2h-2v-2zM9 21H7v-2h2v2zM5 9H3V7h2v2zm0-5.92V5H3c0-1 1-1.92 2-1.92zM5 17H3v-2h2v2zM9 5H7V3h2v2zm4 0h-2V3h2v2zm0 16h-2v-2h2v2zm-8-8H3v-2h2v2zm0 8.08C3.9 21.08 3 20 3 19h2v2.08z" fill="#757575"></path>
                  </svg>
                </span>
              </Button>
              <Button
                onClick={() => this.setHighlightMode(true)}
                title="Highlight Hide sensitive info"
                className={!this.feedback._state.highlight ? "mr-active" : null}
              >
                <span style={{ display: "inline-block", position: "relative", height: "36px", width: "36px" }}>
                  <svg xmlns="https://www.w3.org/2000/svg" focusable="false" viewBox="0 0 24 24" height="36" width="36" fill="#000"><path d="M3 3h18v18H3z"></path></svg>
                </span>
              </Button>
              <Button
                onClick={this.handleStopScreenshot}
                color="primary"
              >
                Done
              </Button>
            </div>
          )
        }

      </React.Fragment>
    );
  }
}

Feedback.propTypes = {
  sendFeedbackUrl: PropTypes.string,
  onAfterScreenshot: PropTypes.func,
  onBeforeScreenshot: PropTypes.func,
  onSend: PropTypes.func,
  renderButton: PropTypes.func,
};

export default Feedback;
