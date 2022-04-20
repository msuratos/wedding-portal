﻿import React, { useEffect, useRef } from 'react';
import './Background.css';

// this component is copied from https://codepen.io/spite/pen/DgQzLv?editors=1000
const Background = () => {
	const viewport = useRef();
	const world = useRef();

	let layers = [];
	let objects = [];	

	const init = () => {
		let lastTime = 0;
		const vendors = ['ms', 'moz', 'webkit', 'o'];

		for (let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
			window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
			window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
		}

		if (!window.requestAnimationFrame) {
			window.requestAnimationFrame = (callback, element) => {
				const currTime = new Date().getTime();
				const timeToCall = Math.max(0, 16 - (currTime - lastTime));
				const id = window.setTimeout(
					() => { callback(currTime + timeToCall); },
					timeToCall
				);

				lastTime = currTime + timeToCall;
				return id;
			};
		}

		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = (id) => {
				clearTimeout(id);
			};
		}
	}

	const generate = () => {
		objects = [];

		if (world.current.hasChildNodes()) {
			while (world.current.childNodes.length >= 1) {
				world.current.removeChild(world.current.firstChild);
			}
		}

		for (var j = 0; j < 5; j++) {
			objects.push(createCloud());
		}
	}

	const createCloud = () => {
		const div = document.createElement('div');
		div.className = 'cloudBase';

		let x = 256 - (Math.random() * 512);
		let y = 256 - (Math.random() * 512);
		let z = 256 - (Math.random() * 512);
		const t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px )';

		div.style.webkitTransform =
			div.style.MozTransform =
			div.style.msTransform =
			div.style.oTransform =
			div.style.transform = t;

		world.current.appendChild(div);

		for (let j = 0; j < 5 + Math.round(Math.random() * 10); j++) {
			const cloud = document.createElement('div');
			cloud.style.opacity = 0;
			cloud.style.opacity = .8;
			cloud.className = 'cloudLayer';

			let x = 256 - (Math.random() * 512);
			let y = 256 - (Math.random() * 512);
			let z = 100 - (Math.random() * 200);
			let a = Math.random() * 360;
			let s = .25 + Math.random();

			x *= .2; y *= .2;

			cloud.data = {
				x: x,
				y: y,
				z: z,
				a: a,
				s: s,
				speed: .1 * Math.random()
			};

			const t = 'translateX( ' + x + 'px ) translateY( ' + y + 'px ) translateZ( ' + z + 'px ) rotateZ( ' + a + 'deg ) scale( ' + s + ' )';
			cloud.style.webkitTransform =
				cloud.style.MozTransform =
				cloud.style.msTransform =
				cloud.style.oTransform =
				cloud.style.transform = t;

			div.appendChild(cloud);
			layers.push(cloud);
		}

		return div;
	}

	const update = () => {
		let worldXAngle = 0;
		let worldYAngle = 0;

		for (let j = 0; j < layers.length; j++) {
			const layer = layers[j];
			layer.data.a += layer.data.speed;

			const t = 'translateX( ' + layer.data.x + 'px ) translateY( ' + layer.data.y + 'px ) translateZ( ' + layer.data.z + 'px ) rotateY( ' + (- worldYAngle) + 'deg ) rotateX( ' + (- worldXAngle) + 'deg ) rotateZ( ' + layer.data.a + 'deg ) scale( ' + layer.data.s + ')';
			layer.style.webkitTransform =
				layer.style.MozTransform =
				layer.style.msTranform =
				layer.style.oTransform =
				layer.style.transform = t;
		}

		requestAnimationFrame(update);
	}

	useEffect(() => {
		let p = 400;

		viewport.current.style.webkitPerspective = p;
		viewport.current.style.MozPerspective = p;
		viewport.current.style.oPerspective = p;

		init();
		generate();
		update();
  }, [viewport, world]);

	return (
		<div ref={viewport} className="viewport">
			<div ref={world} className="world"></div>
    </div>
  );
};

export default Background;