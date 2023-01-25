import {
	FunctionComponent,
	MouseEventHandler,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import "./Chart.css";

const LegalEntity: FunctionComponent<{
	x: number;
	y: number;
	color?: string;
	label: string;
}> = ({ x, y, color = "white", label }) => {
	return (
		<>
			<div
				className="le"
				style={{
					backgroundColor: color,
					color: "black",
					top: `${y}px`,
					left: `${x}px`,
				}}
			>
				{label}
			</div>
			<div className="net" style={{ left: `${x}px`, top: `${y + 113}px` }}>
				<div className="line">
					<div className="plus">+</div>
				</div>
			</div>
		</>
	);
};

const OrgComponent: FunctionComponent = () => {
	const wrapperEl = useRef<HTMLDivElement>(null);
	const [mouseDown, setMouseDown] = useState(false);
	const [deltaX, setDeltaX] = useState(0);
	const [deltaY, setDeltaY] = useState(0);
	const [scale, setScale] = useState(0);
	const startX = useRef(0);
	const startY = useRef(0);
	const startDeltaX = useRef(0);
	const startDeltaY = useRef(0);

	const onZoom = (e: WheelEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.ctrlKey) {
			setScale((c) => c - e.deltaY);
		}
	};

	const onMouseMove: MouseEventHandler<HTMLDivElement> = useCallback(
		(e) => {
			if (mouseDown) {
				setDeltaX(startDeltaX.current - (startX.current - e.clientX));
				setDeltaY(startDeltaY.current - (startY.current - e.clientY));
			}
		},
		[mouseDown]
	);

	const startDrag: MouseEventHandler<HTMLDivElement> = useCallback(
		(e) => {
			startDeltaX.current = deltaX;
			startDeltaY.current = deltaY;
			startX.current = e.clientX;
			startY.current = e.clientY;
			setMouseDown(true);
		},
		[deltaX, deltaY]
	);
	const endDrag: MouseEventHandler<HTMLDivElement> = (e) => {
		setMouseDown(false);
	};

	useEffect(() => {
		wrapperEl.current!.onwheel = onZoom;
	}, []);

	return (
		<div
			ref={wrapperEl}
			onMouseMove={onMouseMove}
			onMouseDown={startDrag}
			onMouseUp={endDrag}
			onMouseLeave={endDrag}
			className="orgWrapper"
			style={{ cursor: mouseDown ? "grabbing" : "unset" }}
		>
			<div
				style={{
					transform: `translate(${deltaX}px, ${deltaY}px) scale(${Math.pow(
						Math.E,
						scale / 500
					)})`,
				}}
			>
				<LegalEntity label="TestCo" x={0} y={0} />
			</div>
		</div>
	);
};

export default OrgComponent;
