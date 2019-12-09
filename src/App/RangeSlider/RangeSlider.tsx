import * as React from "react";
import cx from "classnames";

import "./RangeSlider.scss";

const CURRENT_MIN: string = "currentMin";
const CURRENT_MAX: string = "currentMax";
const RANGE_SLIDER_MAX_WIDTH: number = 300;
const HALF_THUMB_SIZE: number = 8;

type onDragArrow = (event: React.ChangeEvent<HTMLInputElement>) => void;

enum RangeSliderDirection {
  Horizontal = "horizontal",
  Vertical = "vertical"
}

interface CustomCssVars extends React.CSSProperties {
  "--start"?: string;
  "--end"?: string;
  "--pos"?: number;
  "--dist"?: string;
  "--left"?: string;
}
interface ITooltip extends React.CSSProperties {
  "--tooltipPos": string;
}

interface IRangeSlider {
  max: number;
  min: number;
  label: string;
  step?: number;
  minValue?: number;
  maxValue?: number;
  width?: number;
  className?: string;
  isOptional?: boolean;
  showTextInput?: boolean;
  direction?: RangeSliderDirection;
  dataUI?: string;
  onChange?(minValue: number, maxValue: number): void;
}

const RangeSlider: React.FC<IRangeSlider> = ({
  min,
  max,
  step,
  minValue,
  maxValue,
  width,
  label,
  className,
  isOptional,
  direction,
  dataUI,
  onChange
}: IRangeSlider): React.ReactElement => {
  const [currentMin, setCurrentMin] = React.useState<number>(minValue || min);
  const [currentMax, setCurrentMax] = React.useState<number>(maxValue || max);

  React.useEffect((): void => {
    const updateValues = (): void => {
      if (onChange) {
        onChange(currentMin, currentMax);
      }
    };
    updateValues();
  }, [currentMin, currentMax]);

  const onDrag: onDragArrow = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    event.persist();

    const {
      target: { name, value }
    } = event;

    if (name === CURRENT_MIN && Number(value) <= currentMax) {
      setCurrentMin(Number(value));
    }
    if (name === CURRENT_MAX && Number(value) >= currentMin) {
      setCurrentMax(Number(value));
    }
  };

  function getPercent(initial: number, end: number): number {
    return Math.round((initial / end) * 100);
  }

  const getProgressBar: () => CustomCssVars = (): CustomCssVars => {
    const start: number = getPercent(currentMin - min, max - min) - 0.2;
    const end: number = getPercent(currentMax - min, max - min) + 0.2;

    return {
      "--start": `${start}%`,
      "--end": `${end}%`
    };
  };

  const getTooltipPosition: (currentPos: number) => CustomCssVars = (
    currentPos: number
  ): CustomCssVars => {
    return {
      "--pos": (currentPos - min) / (max - min),
      "--dist": `${width}px`
    };
  };

  function range(start: number, end: number, stepIncrement: number): number[] {
    if (!stepIncrement) return [start, end];
    if (start === end) return [start];
    if (start > end) return [];
    return [start, ...range(start + stepIncrement, end, stepIncrement)];
  }

  function getStepLeftPosition(
    stepValue: number,
    minAllowed: number,
    maxAllowed: number
  ): number {
    return (
      ((maxAllowed - minAllowed) * (stepValue - min)) / (max - min) + minAllowed
    );
  }

  function renderStepValues(): React.ReactNode[] {
    return range(min, max, Number(step)).map(
      (stepValue: number, index: number): React.ReactNode => {
        // To get the marks exactly in middle of the each thumb
        const left: number = getStepLeftPosition(
          stepValue,
          HALF_THUMB_SIZE,
          Number(width) - HALF_THUMB_SIZE
        );

        return (
          <span
            className="va-range-slider-step-marks"
            key={index}
            style={{ left: `${left.toFixed(2)}px` }}
          >
            {stepValue}
          </span>
        );
      }
    );
  }

  const classList: string = cx("va-range-slider", className);

  const containerClassList: string = cx("va-range-slider-container", {
    "va-range-slider-container--vertical":
      direction === RangeSliderDirection.Vertical,
    "va-range-slider-container--horizontal":
      direction === RangeSliderDirection.Horizontal
  });

  console.log(`currentMin: ${currentMin}, currentMax: ${currentMax}`);
  return (
    <div className={classList}>
      {label && (
        <label className="va-form-label" data-ui={`${dataUI}_label`}>
          {label}
          {isOptional && <div className="u-label--optional">Optional</div>}
        </label>
      )}
      <div className={containerClassList}>
        <div className="va-range-slider-wrapper">
          <div className="va-range-slider-track-wrapper" style={{ width }}>
            <div
              className="va-range-slider-progress-bar"
              style={getProgressBar()}
            />
            <input
              aria-valuemax={max}
              aria-valuemin={min}
              aria-valuenow={currentMin}
              className="va-range-slider-input va-range-slider-thumb--min"
              data-ui={`${dataUI}_thumb--min`}
              max={max}
              min={min}
              name={CURRENT_MIN}
              onChange={onDrag}
              role="slider"
              type="range"
              value={currentMin}
            />
            <output
              className="va-range-slider-tooltip"
              htmlFor={CURRENT_MIN}
              style={getTooltipPosition(currentMin)}
            >
              {currentMin}
            </output>
            <input
              aria-valuemax={max}
              aria-valuemin={min}
              aria-valuenow={currentMax}
              className="va-range-slider-input va-range-slider-thumb--max"
              ddata-ui={`${dataUI}_thumb--max`}
              max={max}
              min={min}
              name={CURRENT_MAX}
              onChange={onDrag}
              onFocus={onDrag}
              role="slider"
              type="range"
              value={currentMax}
            />
            <output
              className="va-range-slider-tooltip"
              htmlFor={CURRENT_MAX}
              style={getTooltipPosition(currentMax)}
            >
              {currentMax}
            </output>
          </div>
          <div className="va-range-slider-values">{renderStepValues()}</div>
        </div>
      </div>
    </div>
  );
};

RangeSlider.displayName = "RangeSlider";

RangeSlider.defaultProps = {
  step: 0,
  width: RANGE_SLIDER_MAX_WIDTH,
  isOptional: false,
  showTextInput: true,
  direction: RangeSliderDirection.Horizontal,
  dataUI: "range-slider"
};

export default RangeSlider;
