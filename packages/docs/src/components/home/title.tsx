import * as React from "react";
import styles from "./home.module.css";

export const Title: React.FC<{}> = props => {
  return <div>{props.children}</div>;
};
