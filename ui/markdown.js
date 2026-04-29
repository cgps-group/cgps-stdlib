import PropTypes from "prop-types";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "@mui/material/Link";

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

const markdownComponents = {
  a({ href, children, ...props }) {
    return (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        underline="always"
        {...props}
      >
        {children}
      </Link>
    );
  },
};

const unwrapComponents = {
  ...defaultComponents,
  p: React.Fragment,
};

const plugins = [
  remarkGfm,
];

function Markdown(
  props
) {
  const markdownProps = {};
  if (props.title) {
    markdownProps.allowedElements=[ "em", "strong", "code" ];
    markdownProps.unwrapDisallowed = true;
    markdownProps.skipHtml = true;
    markdownProps.components = unwrapComponents;
    markdownProps.remarkPlugins = [];
  }
  if (props.description) {
    markdownProps.components = markdownComponents;
    markdownProps.remarkPlugins = [];
  }
  return (
    <ReactMarkdown
      // remarkPlugins={props.unwrap ? plugins : undefined}
      remarkPlugins={plugins}
      components={props.unwrap ? unwrapComponents : defaultComponents}
      {...markdownProps}
    >
      { props.children }
    </ReactMarkdown>
  );
}

Markdown.displayName = "Markdown";

Markdown.propTypes = {
  children: PropTypes.node,
  unwrap: PropTypes.bool,
};

export default Markdown;
