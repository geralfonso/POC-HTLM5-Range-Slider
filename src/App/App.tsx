import * as React from "react";

import "./App.scss";
import RangeSlider from "./RangeSlider";
const App: React.FC = (): React.ReactElement => {
  return (
    <div className="App">
      <div>
        <h3>Range Slider without steps and no default values</h3>
        <div>
          <RangeSlider min={30} max={130} step={0} />
        </div>
      </div>
      <div>
        <h3>Range Slider witho steps and default values</h3>
        <div>
          <RangeSlider
            min={20}
            max={100}
            step={10}
            defaultMin={50}
            defaultMax={80}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
