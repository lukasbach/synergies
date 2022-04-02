/* eslint-disable react/jsx-key */
import * as React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import styles from "./home.module.css";
import clsx from "clsx";

export const Code: React.VFC<{ code: string }> = props => {
  return (
    <Highlight {...defaultProps} theme={theme} code={props.code} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={clsx(className, styles.codeContainer)} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};
