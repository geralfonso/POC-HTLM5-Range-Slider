import * as React from "react";

import "./RangeSlider.scss";

interface IHandlers extends React.CSSProperties {
  "--low": string;
  "--high": string;
}

interface ICurrentValues {
  currentMin: React.Dispatch<React.SetStateAction<number>>;
  currentMax: React.Dispatch<React.SetStateAction<number>>;
}

const CURRENTMIN: string = "currentMin";
const CURRENTMAX: string = "currentMax";

const RangeSlider: React.FC = (): React.ReactElement => {
  const [min, setMin] = React.useState<number>(0);
  const [max, setMax] = React.useState<number>(100);
  const [currentMin, setCurrentMin] = React.useState<number>(20);
  const [currentMax, setCurrentMax] = React.useState<number>(60);
  const [step, setStep] = React.useState<number>(5);

  function onDrag(event: React.ChangeEvent<HTMLInputElement>): void {
    event.persist();
    const {
      target: { name, value }
    } = event;
    console.log(name, value);

    if (name === CURRENTMIN && Number(value) <= currentMax) {
      setCurrentMin(Number(value));
    }
    if (name === CURRENTMAX && Number(value) >= currentMin) {
      setCurrentMax(Number(value));
    }
  }
  function getProgressStyle(): React.CSSProperties {
    const progressStart = Math.round(100 * ((currentMin - min) / (max - min)));
    const progressEnd = Math.round(100 * ((currentMax - min) / (max - min)));

    /* return {
      "--progressStart": `${progressStart}%`,
      "--progressEnd": `${progressEnd}%`
    }; */
    return {
      left: `${progressStart}%`,
      width: `${progressEnd - progressStart}%`
    };
  }

  function* range(start: number, end: number): Iterable<number> {
    yield start;
    if (start === end) return;
    yield* range(start + 1, end);
  }

  function getTickStyle(isTooltip?: boolean): React.ReactElement[] {
    const howMany: number = max / step;
    const startIndex: number = 1;
    const endIndex: number = step - 1;
    if (isTooltip) {
      return Array.from(range(0, step), (step: number) => (
        <span key={step} style={{ left: `${min + step * howMany}%` }}>
          {min + step * howMany}
        </span>
      ));
    }
    return Array.from(range(startIndex, endIndex), (step: number) => (
      <span key={step} style={{ left: `${min + step * howMany}%` }} />
    ));
  }
  return (
    <div className="va-range-slider">
      <div className="va-range-slider-container">
        <div
          className="va-range-slider--slider-bar"
          style={getProgressStyle()}
        />
        <div className="va-range-slider--step">{getTickStyle()}</div>

        <input
          className="va-range-slider--input va-range-slider--min"
          type="range"
          name={CURRENTMIN}
          value={currentMin}
          onChange={onDrag}
          step={step}
        />
        <input
          className="va-range-slider--input va-range-slider--max"
          type="range"
          name={CURRENTMAX}
          value={currentMax}
          onChange={onDrag}
          step={step}
        />
      </div>
      <div className="va-range-slider-tooltip">{getTickStyle(true)}</div>
    </div>
  );
};

export default RangeSlider;
