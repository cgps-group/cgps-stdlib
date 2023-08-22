import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function LinkRenderer(props) {
  return (
    <a
      href={props.href}
      rel="noreferrer"
      target="_blank"
    >
      {props.children}
    </a>
  );
}

LinkRenderer.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
};

const defaultComponents = {
  a: LinkRenderer,
};

const unwrapComponents = {
  ...defaultComponents,
  p: React.Fragment,
};

const plugins = [remarkGfm];

const Markdown = (
  (props) => {
    return (
      <ReactMarkdown
        // remarkPlugins={props.unwrap ? plugins : undefined}
        remarkPlugins={plugins}
        components={props.unwrap ? unwrapComponents : defaultComponents}
      >
        { props.children }
      </ReactMarkdown>
    );
  }
);

Markdown.displayName = "Markdown";

Markdown.propTypes = {
  children: PropTypes.node,
  unwrap: PropTypes.bool,
};

export default Markdown;
