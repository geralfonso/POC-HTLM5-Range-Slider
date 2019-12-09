import * as React from "react";

import "./App.scss";
import RangeSlider from "./RangeSlider";
const App: React.FC = (): React.ReactElement => {
  function handleOnChange(min: number, max: number): void {
    console.log(`Min: ${min}, Max: ${max}`);
  }
  return (
    <div className="App">
      <div>
        <h3>Range Slider without steps and no default values</h3>
        <div>
          <RangeSlider
            label="This is a label"
            max={50}
            min={0}
            onChange={handleOnChange}
            step={10}
          />
        </div>
      </div>
      <div>
        <h3>Range Slider with steps and default values</h3>
        <div>
          <RangeSlider
            isOptional
            label="Basic Range with text bottom"
            max={1000}
            maxValue={700}
            min={100}
            minValue={400}
            step={100}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
