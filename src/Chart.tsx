import { FunctionComponent, useEffect, useRef, useState } from "react";
import "./Chart.css";

abstract class CanvasObject {
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	x: number;
	y: number;
	render(context: CanvasRenderingContext2D) {}
}

class LegalEntity extends CanvasObject {
	static width = 200;
	static height = 112;
	color: string;
	readonly label: string;
	children: LegalEntity[];
	constructor(x: number, y: number, label: string, color: string) {
		super(x, y);
		this.color = color;
		this.label = label;
		this.children = [];
	}
	render(context: CanvasRenderingContext2D) {
		context.fillStyle = this.color;
		context.strokeStyle = "black";
		context.fillRect(this.x, this.y, LegalEntity.width, LegalEntity.height);
		context.textAlign = "center";
		context.textBaseline = "middle";
		context.fillStyle = "black";
		context.fillText(
			this.label,
			this.x + LegalEntity.width / 2,
			this.y + LegalEntity.height / 2,
			LegalEntity.width
		);

		for (let i = 0; i < this.children.length; i++) {
			const child = this.children[i];
			child.render(context);
		}

		// context.beginPath();
		// context.moveTo(this.x + LegalEntity.width / 2, this.y);
		// context.lineTo(this.x + LegalEntity.width / 2, this.y + LegalEntity.height);
		// context.moveTo(this.x, this.y + LegalEntity.height / 2);
		// context.lineTo(this.x + LegalEntity.width, this.y + LegalEntity.height / 2);
		// context.stroke();
		// context.closePath();
	}
}

const ChartComponent: FunctionComponent = () => {
	const canvasEl = useRef<HTMLCanvasElement>(null);
	const mounted = useRef(true);
	useEffect(() => {
		mounted.current = true;
		const el = canvasEl.current!;
		const fps = document.querySelector("#fps")!;
		const context = el.getContext("2d")!;
		const canvasObjects: CanvasObject[] = [
			new LegalEntity(0, 0, "TestCo", "orange"),
		];
		let lastTime: number;
		const updateFps = (diff: number) => {
			fps.textContent = `${(1000 / diff).toFixed(2)}`;
		};
		el.width = el.clientWidth;
		el.height = el.clientHeight;
		context.font = "14px sans-serif";
		let scale = 1;
		el.onwheel = (e) => {
			e.preventDefault();
			if (e.deltaY > 0) {
				context.scale(101 / 100, 101 / 100);
			} else {
				context.scale(100 / 101, 100 / 101);
			}
		};
		const tick: FrameRequestCallback = (timestamp) => {
			if (!lastTime) lastTime = timestamp;
			const diff = timestamp - lastTime;
			updateFps(diff);
			context.scale(1, 1);
			context.clearRect(0, 0, el.clientWidth, el.clientHeight);
			for (let i = 0; i < canvasObjects.length; i++) {
				const obj = canvasObjects[i];
				obj.render(context);
			}

			lastTime = timestamp;
			if (mounted.current) requestAnimationFrame(tick);
		};

		tick(0);

		return () => {
			mounted.current = false;
		};
	}, []);
	return (
		<div className="chart">
			<div className="debug">
				<div>
					<span id="fps"></span>&nbsp;fps
				</div>
			</div>
			<canvas ref={canvasEl}></canvas>
		</div>
	);
};

export default ChartComponent;
