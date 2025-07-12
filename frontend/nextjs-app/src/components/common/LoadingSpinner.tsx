import { SVGProps } from 'react';

type SpinnerProps = {
  stroke?: string;
  strokeWidth?: number;
  size?: number;
} & Omit<SVGProps<SVGSVGElement>, 'stroke' | 'strokeWidth' | 'width' | 'height'>;

export function LoadingSpinner({
  stroke = 'currentColor',
  strokeWidth = 2,
  size = 24,
  ...props
}: SpinnerProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      stroke={stroke}
      strokeWidth={strokeWidth}
      width={size}
      height={size}
      {...props}
    >
      <circle cx="4" cy="12" r="3">
        <animate
          id="spinner_qFRN"
          begin="0;spinner_OcgL.end+0.25s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="12" cy="12" r="3">
        <animate
          begin="spinner_qFRN.begin+0.1s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
      <circle cx="20" cy="12" r="3">
        <animate
          id="spinner_OcgL"
          begin="spinner_qFRN.begin+0.2s"
          attributeName="cy"
          calcMode="spline"
          dur="0.6s"
          values="12;6;12"
          keySplines=".33,.66,.66,1;.33,0,.66,.33"
        />
      </circle>
    </svg>
  );
}
