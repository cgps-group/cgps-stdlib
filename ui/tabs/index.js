import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
// import TabContext from "@mui/material/TabContext";
// import TabList from "@mui/material/TabList";
// import TabPanel from "@mui/material/TabPanel";

import nextAnimation from "../../browser/next-animation.js";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

class UiTabs extends React.PureComponent {

  static getDerivedStateFromProps(props) {
    if (props.selectedIndex) {
      return { value: props.selectedIndex.toString() };
    }
    else {
      return null;
    }
  }

  state = {
    value: this.props.defaultPaneIndex?.toString() ?? "0",
  }

  componentDidMount() {
    nextAnimation(() => this.setState({ loaded: true }));
  }

  handleChange = (event, newValue) => {
    this.selectTab(newValue);
  }

  selectTab = (index) => {
    this.setState({ value: index.toString() });
  }

  render() {
    const { props, state } = this;

    const tabs = props.children.filter((x) => !!x);

    return (
      <div
        className={
          classnames(
            "mr-ui-tabs",
            props.className,
          )
        }
        style={props.style}
      >
        <Tabs
          value={state.value}
          onChange={this.handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
        >
          {
            tabs.map(
              (tab, index) => {
                return (
                  <Tab
                    key={tab.props.label || tab.key || index}
                    label={tab.props.label || index}
                    value={index.toString()}
                  />
                );
              }
            )
          }
        </Tabs>
        {
          tabs.map(
            (tab, index) => {
              return (
                <TabPanel
                  key={tab.props.label || tab.key || index}
                  value={index.toString()}
                >
                  { tab.props.children }
                </TabPanel>
              );
            }
          )
        }
      </div>
    );
  }

}

UiTabs.displayName = "UiTabs";

UiTabs.propTypes = {
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  defaultPaneIndex: PropTypes.number,
  selectedIndex: PropTypes.number,
  style: PropTypes.object,
};

UiTabs.TabPanel = "div";

export default UiTabs;
