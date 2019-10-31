import * as React from "react";

import "./RangeSlider.scss";

const CURRENTMIN: string = "currentMin";
const CURRENTMAX: string = "currentMax";

interface ITooltip extends React.CSSProperties {
  "--tooltipPos": string;
}

interface IRangeSlider {
  min: number;
  max: number;
  step: number;
  defaultMin?: number;
  defaultMax?: number;
}

const RangeSlider: React.FC<IRangeSlider> = ({
  min,
  max,
  step,
  defaultMin,
  defaultMax
}: IRangeSlider): React.ReactElement => {
  const [currentMin, setCurrentMin] = React.useState<number>(min);
  const [currentMax, setCurrentMax] = React.useState<number>(max);

  React.useEffect(() => {
    defaultMin !== undefined && setCurrentMin(defaultMin);
    defaultMax !== undefined && setCurrentMax(defaultMax);
  }, []);

  function onDrag(event: React.ChangeEvent<HTMLInputElement>): void {
    event.persist();
    const {
      target: { name, value }
    } = event;

    if (name === CURRENTMIN && Number(value) <= currentMax) {
      setCurrentMin(Number(value));
    }
    if (name === CURRENTMAX && Number(value) >= currentMin) {
      setCurrentMax(Number(value));
    }
  }

  function getPercent(initial: number, end: number): number {
    return Math.round((initial / end) * 100);
  }

  function getProgressStyle(): React.CSSProperties {
    const progressStart = getPercent(currentMin - min, max - min);
    const progressEnd = getPercent(currentMax - min, max - min);

    return {
      left: `${progressStart}%`,
      width: `${progressEnd - progressStart}%`
    };
  }

  function* range(start: number, end: number): Iterable<number> {
    if (step <= 0) {
      yield min;
      yield max;
      return;
    }
    if (min + start * step > max) return;
    yield start;
    if (start >= end) return;
    yield* range(start + 1, end);
  }

  function displayValues(index: number): number {
    if (step <= 0) {
      return index ? max : min;
    }
    return min + index * step;
  }

  function renderStepsOrValues(renderValues?: boolean): React.ReactElement[] {
    const rangeProgress: number = max - min;
    const howManey: number = step ? rangeProgress / step : 1;
    return Array.from(range(0, howManey), (_: number, index: number) => {
      return (
        <span
          key={index}
          style={{
            left: `${(100 / howManey) * index}%`
          }}
        >
          {renderValues && displayValues(index)}
        </span>
      );
    });
  }

  function getTooltipPos(currentPos: number): ITooltip {
    return {
      "--tooltipPos": `${Math.round(100 * ((currentPos - min) / (max - min)))}%`
    };
  }

  console.log(`currentMin: ${currentMin}, currentMax: ${currentMax}`);
  return (
    <div className="va-range-slider">
      <div className="va-range-slider-container">
        <div
          className="va-range-slider--slider-bar"
          style={getProgressStyle()}
        />
        <div className="va-range-slider--step">{renderStepsOrValues()}</div>
        <input
          className="va-range-slider--input va-range-slider--min"
          type="range"
          name={CURRENTMIN}
          value={currentMin}
          onChange={onDrag}
          step={step}
          min={min}
          max={max}
          data-tooltip={currentMin}
          style={getTooltipPos(currentMin)}
        />

        <input
          className="va-range-slider--input va-range-slider--max"
          type="range"
          name={CURRENTMAX}
          value={currentMax}
          onChange={onDrag}
          step={step}
          min={min}
          max={max}
          data-tooltip={currentMax}
          style={getTooltipPos(currentMax)}
        />
      </div>
      <div className="va-range-slider-values">{renderStepsOrValues(true)}</div>
    </div>
  );
};

RangeSlider.defaultProps = {
  min: 10,
  max: 100,
  step: 0
};

export default RangeSlider;
