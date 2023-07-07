import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const Markdown = React.memo(
  (props) => {
    return (
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        { props.children }
      </ReactMarkdown>
    );
  },
);

Markdown.displayName = "Markdown";

Markdown.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Markdown;
