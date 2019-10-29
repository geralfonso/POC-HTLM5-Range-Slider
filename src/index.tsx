import * as React from "react";
import { render } from "react-dom";

import "./styles.scss";
import RangeSlider from "./RangeSlider";

const rootElement = document.getElementById("root");
render(<RangeSlider />, rootElement);
