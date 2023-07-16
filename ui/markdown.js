import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = { p: React.Fragment };
const plugins = [remarkGfm];

const Markdown = (
  (props) => {
    return (
      <ReactMarkdown
        remarkPlugins={props.unwrap ? plugins : undefined}
        components={props.unwrap ? components : undefined}
      >
        { props.children }
      </ReactMarkdown>
    );
  }
);

Markdown.displayName = "Markdown";

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
  unwrap: PropTypes.bool,
};

export default Markdown;